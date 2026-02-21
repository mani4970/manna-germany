import { useState, useEffect } from 'react'
import { C } from './LandingPage'
import { PlacePopup, priceLabel } from '../components/PlacePopup'


const TYPE_TAG_MAP = {
  japanese_restaurant:    { label: '🇯🇵 Japanisch', labelEn: '🇯🇵 Japanese' },
  ramen_restaurant:       { label: '🍜 Ramen',      labelEn: '🍜 Ramen' },
  sushi_restaurant:       { label: '🍣 Sushi',      labelEn: '🍣 Sushi' },
  korean_restaurant:      { label: '🇰🇷 Koreanisch', labelEn: '🇰🇷 Korean' },
  chinese_restaurant:     { label: '🇨🇳 Chinesisch', labelEn: '🇨🇳 Chinese' },
  thai_restaurant:        { label: '🇹🇭 Thailändisch', labelEn: '🇹🇭 Thai' },
  vietnamese_restaurant:  { label: '🇻🇳 Vietnamesisch', labelEn: '🇻🇳 Vietnamese' },
  indian_restaurant:      { label: '🇮🇳 Indisch',   labelEn: '🇮🇳 Indian' },
  italian_restaurant:     { label: '🇮🇹 Italienisch', labelEn: '🇮🇹 Italian' },
  french_restaurant:      { label: '🇫🇷 Französisch', labelEn: '🇫🇷 French' },
  turkish_restaurant:     { label: '🇹🇷 Türkisch',  labelEn: '🇹🇷 Turkish' },
  greek_restaurant:       { label: '🇬🇷 Griechisch', labelEn: '🇬🇷 Greek' },
  mediterranean_restaurant: { label: '🫒 Mediterran', labelEn: '🫒 Mediterranean' },
  american_restaurant:    { label: '🍔 Amerikanisch', labelEn: '🍔 American' },
  hamburger_restaurant:   { label: '🍔 Burger',     labelEn: '🍔 Burger' },
  steak_house:            { label: '🥩 Steakhouse', labelEn: '🥩 Steakhouse' },
  seafood_restaurant:     { label: '🦞 Meeresfrüchte', labelEn: '🦞 Seafood' },
  vegan_restaurant:       { label: '🌱 Vegan',      labelEn: '🌱 Vegan' },
  vegetarian_restaurant:  { label: '🥗 Vegetarisch', labelEn: '🥗 Vegetarian' },
  bakery:                 { label: '🥐 Bäckerei',   labelEn: '🥐 Bakery' },
  coffee_shop:            { label: '☕ Coffee',      labelEn: '☕ Coffee' },
  wine_bar:               { label: '🍷 Weinbar',    labelEn: '🍷 Wine Bar' },
  cocktail_bar:           { label: '🍸 Cocktailbar', labelEn: '🍸 Cocktail Bar' },
  night_club:             { label: '🎵 Club',        labelEn: '🎵 Club' },
}

function getTypeTag(p, lang) {
  const type = p.primaryType
  if (!type) return null
  const tag = TYPE_TAG_MAP[type]
  if (!tag) return null
  return lang === 'de' ? tag.label : tag.labelEn
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1||!lon1||!lat2||!lon2) return null
  const toRad = x => x*Math.PI/180, R=6371000
  const dLat=toRad(lat2-lat1), dLon=toRad(lon2-lon1)
  const a=Math.sin(dLat/2)**2+Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2
  return Math.round(2*R*Math.asin(Math.sqrt(a)))
}




export default function RestaurantList({ lang, L, selections, referencePoint, onNext, onBack }) {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedPopup, setSelectedPopup] = useState(null)
  const [popupStation, setPopupStation] = useState(null)
  const [sortBy, setSortBy] = useState('rating')
  const ref = referencePoint || selections.hotspot

  const fetchPlaces = async (seed = 0) => {
    if (!ref?.lat) return
    const cuisine = selections.restaurantCuisine || 'all'
    const base = `/api/places/search?type=restaurant&lat=${ref.lat}&lng=${ref.lng}&radius=1000&seed=${seed}`
    const url = cuisine && cuisine !== 'all' ? `${base}&cuisine=${cuisine}` : base
    const res = await fetch(url)
    const data = await res.json()
    setPlaces((data.places || []).map(p => ({
      ...p, distanceMeters: haversineDistance(ref.lat, ref.lng, p.lat, p.lng)
    })))
  }

  useEffect(() => { fetchPlaces(0).finally(() => setLoading(false)) }, [])

  const refresh = async () => {
    setRefreshing(true)
    await fetchPlaces(Math.floor(Math.random() * 9999) + 1)
    setRefreshing(false)
  }

  const sorted = [...places].sort((a,b)=>{
    if(sortBy==='rating') return ((b.rating||0)*Math.log10((b.userRatingsTotal||0)+10))-((a.rating||0)*Math.log10((a.userRatingsTotal||0)+10))
    if(sortBy==='reviews') return (b.userRatingsTotal||0)-(a.userRatingsTotal||0)
    return (a.distanceMeters||9999)-(b.distanceMeters||9999)
  })

  const spotName = lang==='de' ? ref?.name_de : ref?.name_en
  const displayName = spotName || ref?.name || ''

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: "'Outfit', sans-serif", paddingBottom: '40px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600&display=swap" rel="stylesheet" />
      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ paddingTop: '20px' }}>
          <button onClick={onBack} className="no-orange-card" style={{ background:'none',border:'none',color:C.textSub,fontSize:'14px',cursor:'pointer',padding:'0 0 16px 0',display:'flex',alignItems:'center',gap:'4px' }}>{L.back}</button>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:'12px' }}>
            <h1 style={{ fontSize:'22px',fontWeight:'300',color:C.text,letterSpacing:'-0.3px' }}>🍽️ Restaurant</h1>
            <button onClick={refresh} className="no-orange-card" disabled={refreshing}
              style={{ background:'none',border:`1px solid ${C.border}`,borderRadius:'20px',padding:'5px 12px',fontSize:'12px',color:C.textSub,cursor:'pointer' }}>
              <span style={{ display:'inline-block',transform:refreshing?'rotate(180deg)':'none',transition:'transform 0.4s' }}>↻</span> {lang==='de'?'Neu laden':'Refresh'}
            </button>
          </div>
          <p style={{ color:C.textSub,marginTop:'4px',fontSize:'13px',fontWeight:'300',textAlign:'center' }}>{displayName} · 1km</p>
        </div>
      </div>
      <div style={{ display:'flex',gap:'8px',padding:'16px 24px',overflowX:'auto',scrollbarWidth:'none' }}>
        {([
          ['rating',  lang==='de' ? 'Bewertung'  : 'Rating'],
          ['reviews', lang==='de' ? 'Rezensionen': 'Reviews'],
          ['distance',lang==='de' ? 'Entfernung' : 'Distance'],
        ]).map(([k,label])=>(
          <button key={k} onClick={()=>setSortBy(k)} className="no-orange-card"
            style={{ padding:'7px 14px',borderRadius:'20px',border:`1px solid ${sortBy===k?C.gold:C.border}`,background:sortBy===k?C.surface2:C.surface,color:sortBy===k?C.gold:C.textSub,fontSize:'12px',cursor:'pointer',whiteSpace:'nowrap',flexShrink:0 }}>
            {label}
          </button>
        ))}
      </div>
      <div style={{ padding:'0 24px',display:'flex',flexDirection:'column',gap:'10px' }}>
        {loading ? (
          <div style={{ textAlign:'center',padding:'60px 0',color:C.textSub }}>{L.loading_restaurant}</div>
        ) : sorted.length === 0 ? (
          <div style={{ textAlign:'center',padding:'60px 0',color:C.textSub }}>{L.no_results}</div>
        ) : sorted.map((p,i)=>(
          <button key={p.placeId||i} onClick={async ()=>{
              setSelectedPopup(p)
              setPopupStation(null)
              if (p.lat && p.lng) {
                const res = await fetch(`/api/places/search?type=subway&lat=${p.lat}&lng=${p.lng}`)
                const data = await res.json()
                if (data.station) setPopupStation(data.station)
              }
            }} className="no-orange-card"
            style={{ display:'flex',alignItems:'center',gap:'12px',padding:'14px',borderRadius:'16px',border:`1.5px solid ${C.border}`,background:C.surface,cursor:'pointer',textAlign:'left',width:'100%',boxShadow:'0 2px 8px rgba(0,0,0,0.03)',opacity:refreshing?0.5:1,transition:'opacity 0.2s' }}>
            <div style={{ width:'24px',height:'24px',borderRadius:'50%',background:i<3?C.gold:C.surface2,color:i<3?C.bg:C.textSub,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:'600',flexShrink:0 }}>{i+1}</div>
            <div style={{ width:'64px',height:'64px',borderRadius:'10px',overflow:'hidden',flexShrink:0,background:C.surface2,display:'flex',alignItems:'center',justifyContent:'center' }}>
              {p.photoUrl?<img src={p.photoUrl} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>e.target.style.display='none'}/>:<span style={{fontSize:'24px'}}>🍽️</span>}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontWeight:'400',fontSize:'14px',color:C.text,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{p.name}</p>
              <div style={{ display:'flex',alignItems:'center',gap:'6px',marginTop:'3px',flexWrap:'wrap' }}>
                {getTypeTag(p, lang) && (
                  <span style={{ fontSize:'11px',color:C.textSub,background:C.surface2,padding:'1px 7px',borderRadius:'10px',flexShrink:0 }}>{getTypeTag(p, lang)}</span>
                )}
                {p.rating&&<span style={{ color:C.goldDim,fontSize:'12px' }}>★ {p.rating}</span>}
                {p.priceLevel&&<span style={{ color:C.textSub,fontSize:'12px' }}>{priceLabel(p.priceLevel)}</span>}
              </div>
              {p.distanceMeters&&<p style={{ color:C.textSub,fontSize:'11px',marginTop:'2px' }}>{p.distanceMeters}m · {Math.round(p.distanceMeters/80)} min {L.walk}</p>}
            </div>
          </button>
        ))}
      </div>

      {selectedPopup && (
        <PlacePopup
          place={selectedPopup} lang={lang} L={L}
          nearestStation={popupStation}
          onSelect={(place) => { setSelectedPopup(null); setPopupStation(null); onNext(place) }}
          onClose={() => { setSelectedPopup(null); setPopupStation(null) }}
        />
      )}
    </div>
  )
}
