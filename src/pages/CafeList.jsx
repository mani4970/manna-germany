import { useState, useEffect, useRef } from 'react'
import { C } from './LandingPage'
import { PlacePopup, priceLabel } from '../components/PlacePopup'

const TYPE_TAG_MAP = {
  bakery:                   { de: '🥐 Bäckerei',        en: '🥐 Bakery' },
  coffee_shop:              { de: '☕ Coffee',           en: '☕ Coffee' },
  cafe:                     { de: '☕ Café',             en: '☕ Café' },
  wine_bar:                 { de: '🍷 Weinbar',         en: '🍷 Wine Bar' },
  cocktail_bar:             { de: '🍸 Cocktailbar',     en: '🍸 Cocktail Bar' },
  bar:                      { de: '🍺 Bar',             en: '🍺 Bar' },
  night_club:               { de: '🎵 Club',            en: '🎵 Club' },
}

function getTypeTag(p, lang) {
  const tag = TYPE_TAG_MAP[p.primaryType]
  if (!tag) return null
  return lang === 'de' ? tag.de : tag.en
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1||!lon1||!lat2||!lon2) return null
  const toRad = x => x*Math.PI/180, R=6371000
  const dLat=toRad(lat2-lat1), dLon=toRad(lon2-lon1)
  const a=Math.sin(dLat/2)**2+Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2
  return Math.round(2*R*Math.asin(Math.sqrt(a)))
}

export default function CafeList({ lang, L, selections, type='cafe', referencePoint, onNext, onBack }) {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPopup, setSelectedPopup] = useState(null)
  const [popupStation, setPopupStation] = useState(null)
  const [sortBy, setSortBy] = useState('rating')
  const [radius, setRadius] = useState(1000)

  // type과 radius를 ref로도 추적해서 레이스 컨디션 방지
  const currentType = useRef(type)
  const currentRadius = useRef(1000)

  const ref = referencePoint || selections.hotspot
  const isBar      = type === 'bar'
  const emoji      = isBar ? '🍺' : '☕'
  const title      = isBar ? 'Bar' : 'Café'
  const walkLabel  = lang === 'de' ? 'zu Fuß' : 'walk'
  const sortLabels = lang === 'de'
    ? { rating: 'Bewertung', reviews: 'Rezensionen', distance: 'Entfernung' }
    : { rating: 'Rating', reviews: 'Reviews', distance: 'Distance' }

  // 단일 fetch 함수 — type과 radius를 직접 인자로 받음
  const doFetch = async (fetchType, fetchRadius) => {
    if (!ref?.lat) return
    const cuisine = fetchType === 'cafe'
      ? (selections.cafeCuisine || 'all')
      : (selections.barCuisine || 'all')
    const cuisineParam = cuisine && cuisine !== 'all' ? `&cuisine=${cuisine}` : ''
    const url = `/api/places/search?type=${fetchType}&lat=${ref.lat}&lng=${ref.lng}&radius=${fetchRadius}${cuisineParam}`
    console.log(`[CafeList] fetch: type=${fetchType} radius=${fetchRadius} url=${url}`)
    const res = await fetch(url)
    const data = await res.json()
    return (data.places || []).map(p => ({
      ...p, distanceMeters: haversineDistance(ref.lat, ref.lng, p.lat, p.lng)
    }))
  }

  // type 또는 radius 바뀔 때 항상 새로 fetch
  useEffect(() => {
    currentType.current = type
    currentRadius.current = radius
    setLoading(true)
    setPlaces([])
    doFetch(type, radius).then(results => {
      // 응답이 왔을 때 type/radius가 여전히 현재 값인지 확인 (레이스 컨디션 방지)
      if (currentType.current === type && currentRadius.current === radius) {
        setPlaces(results || [])
        setLoading(false)
      }
    }).catch(() => setLoading(false))
  }, [type, radius]) // type이나 radius 중 하나라도 바뀌면 무조건 새로 fetch

  const sorted = [...places].sort((a, b) => {
    if (sortBy === 'rating')  return ((b.rating||0)*Math.log10((b.userRatingsTotal||0)+10)) - ((a.rating||0)*Math.log10((a.userRatingsTotal||0)+10))
    if (sortBy === 'reviews') return (b.userRatingsTotal||0) - (a.userRatingsTotal||0)
    return (a.distanceMeters||9999) - (b.distanceMeters||9999)
  })

  const spotName    = lang === 'de' ? ref?.name_de : ref?.name_en
  const displayName = spotName || ref?.name || ''
  const loadingText = isBar
    ? (lang === 'de' ? 'Suche Bars...' : 'Finding bars...')
    : (lang === 'de' ? 'Suche Cafés...' : 'Finding cafés...')

  return (
    <div style={{ background:C.bg, minHeight:'100vh', fontFamily:"'Outfit',sans-serif", paddingBottom:'40px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600&display=swap" rel="stylesheet" />

      {/* 헤더 */}
      <div style={{ padding:'44px 20px 0' }}>
        <button onClick={onBack} className="no-orange-card"
          style={{ background:'none', border:'none', color:C.textSub, fontSize:'14px', cursor:'pointer', padding:'0 0 12px 0', display:'flex', alignItems:'center', gap:'4px' }}>
          {L.back}
        </button>
        <h1 style={{ fontSize:'22px', fontWeight:'300', color:C.text, textAlign:'center', margin:'0 0 4px' }}>{emoji} {title}</h1>
        <p style={{ color:C.textSub, fontSize:'13px', fontWeight:'300', textAlign:'center', margin:'0 0 16px' }}>{displayName}</p>
      </div>

      {/* 탭 */}
      <div style={{ padding:'0 20px 8px' }}>
        <div style={{ display:'flex', gap:'6px', overflowX:'scroll', WebkitOverflowScrolling:'touch', scrollbarWidth:'none', msOverflowStyle:'none' }}>
          {[['rating', sortLabels.rating], ['reviews', sortLabels.reviews], ['distance', sortLabels.distance]].map(([k, label]) => (
            <button key={k} onClick={() => setSortBy(k)} className="no-orange-card"
              style={{ padding:'7px 14px', borderRadius:'20px', border:`1px solid ${sortBy===k ? C.gold : C.border}`, background:sortBy===k ? C.surface2 : C.surface, color:sortBy===k ? C.gold : C.textSub, fontSize:'12px', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
              {label}
            </button>
          ))}
          <div style={{ width:'1px', background:C.border, margin:'2px 4px', flexShrink:0 }} />
          {[[1000,'1km'],[3000,'3km'],[5000,'5km']].map(([r, label]) => (
            <button key={r} onClick={() => setRadius(r)} className="no-orange-card"
              style={{ padding:'7px 14px', borderRadius:'20px', border:`1px solid ${radius===r ? C.gold : C.border}`, background:radius===r ? C.gold : C.surface, color:radius===r ? C.bg : C.textSub, fontSize:'12px', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0, fontWeight:radius===r ? '600' : '400' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 리스트 */}
      <div style={{ padding:'0 20px', display:'flex', flexDirection:'column', gap:'10px' }}>
        {loading ? (
          <div style={{ textAlign:'center', padding:'60px 0', color:C.textSub }}>{loadingText}</div>
        ) : sorted.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 0', color:C.textSub }}>
            {lang === 'de' ? 'Keine Ergebnisse gefunden' : 'No results found'}
          </div>
        ) : sorted.map((p, i) => (
          <button key={p.placeId||i}
            onClick={async () => {
              setSelectedPopup(p)
              setPopupStation(null)
              if (p.lat && p.lng) {
                const res = await fetch(`/api/places/search?type=subway&lat=${p.lat}&lng=${p.lng}`)
                const data = await res.json()
                if (data.station) setPopupStation(data.station)
              }
            }}
            className="no-orange-card"
            style={{ display:'flex', alignItems:'center', gap:'12px', padding:'14px', borderRadius:'16px', border:`1.5px solid ${C.border}`, background:C.surface, cursor:'pointer', textAlign:'left', width:'100%', boxShadow:'0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ width:'24px', height:'24px', borderRadius:'50%', background:i<3?C.gold:C.surface2, color:i<3?C.bg:C.textSub, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'600', flexShrink:0 }}>{i+1}</div>
            <div style={{ width:'64px', height:'64px', borderRadius:'10px', overflow:'hidden', flexShrink:0, background:C.surface2, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {p.photoUrl
                ? <img src={p.photoUrl} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.style.display='none'} />
                : <span style={{ fontSize:'24px' }}>{emoji}</span>}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontWeight:'400', fontSize:'14px', color:C.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', margin:0 }}>{p.name}</p>
              <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'3px', flexWrap:'wrap' }}>
                {getTypeTag(p,lang) && <span style={{ fontSize:'11px', color:C.textSub, background:C.surface2, padding:'1px 7px', borderRadius:'10px', flexShrink:0 }}>{getTypeTag(p,lang)}</span>}
                {p.rating && <span style={{ color:C.goldDim, fontSize:'12px' }}>★ {p.rating} <span style={{ color:C.textDim }}>({p.userRatingsTotal?.toLocaleString()})</span></span>}
                {p.priceLevel && <span style={{ color:C.textSub, fontSize:'12px' }}>{priceLabel(p.priceLevel)}</span>}
              </div>
              {p.distanceMeters && <p style={{ color:C.textSub, fontSize:'11px', margin:'2px 0 0' }}>{p.distanceMeters}m · {Math.round(p.distanceMeters/80)} min {walkLabel}</p>}
            </div>
          </button>
        ))}
      </div>

      {selectedPopup && (
        <PlacePopup place={selectedPopup} lang={lang} L={L} nearestStation={popupStation}
          onSelect={place => { setSelectedPopup(null); setPopupStation(null); onNext(place) }}
          onClose={() => { setSelectedPopup(null); setPopupStation(null) }}
        />
      )}
    </div>
  )
}
