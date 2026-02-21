import { useState, useEffect } from 'react'
import { C } from './LandingPage'

function haversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1||!lon1||!lat2||!lon2) return null
  const toRad = x => x*Math.PI/180, R=6371000
  const dLat=toRad(lat2-lat1), dLon=toRad(lon2-lon1)
  const a=Math.sin(dLat/2)**2+Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2
  return Math.round(2*R*Math.asin(Math.sqrt(a)))
}

function priceLabel(level) {
  if (!level) return null
  return '€'.repeat(level)
}

function getTags(p, L) {
  const tags = []
  if (p.rating >= 4.7) tags.push({ label: L.tag_romantic, color: '#E8A0A0' })
  if ((p.userRatingsTotal || 0) >= 1000) tags.push({ label: L.tag_popular, color: '#A0C8E8' })
  if (p.priceLevel === 1) tags.push({ label: L.tag_budget, color: '#A0E8B0' })
  if (p.priceLevel >= 3) tags.push({ label: L.tag_upscale, color: '#C8A0E8' })
  if (p.types?.includes('night_club') || p.types?.includes('bar')) tags.push({ label: L.tag_nightlife, color: '#E8C8A0' })
  return tags.slice(0, 2)
}

function PlacePopup({ place, lang, L, onSelect, onClose }) {
  const [photoIdx, setPhotoIdx] = useState(0)
  const photos = place.photos?.length ? place.photos : (place.photoUrl ? [place.photoUrl] : [])
  const tags = getTags(place, L)

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.bg, borderRadius: '20px 20px 0 0',
        width: '100%', maxWidth: '600px', maxHeight: '85vh',
        overflow: 'auto', paddingBottom: '32px',
      }}>
        {/* 사진 */}
        <div style={{ position: 'relative', width: '100%', height: '220px', background: C.surface2 }}>
          {photos.length > 0 ? (
            <img src={photos[photoIdx]} alt={place.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '40px' }}>🍽️</div>
          )}
          {photos.length > 1 && (
            <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
              {photos.map((_, i) => (
                <button key={i} onClick={() => setPhotoIdx(i)} className="no-orange-card"
                  style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === photoIdx ? '#fff' : 'rgba(255,255,255,0.5)', border: 'none', padding: 0, cursor: 'pointer' }} />
              ))}
            </div>
          )}
          <button onClick={onClose} className="no-orange-card"
            style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: '#fff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* 정보 */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '400', color: C.text, flex: 1, marginRight: '8px' }}>{place.name}</h2>
            {place.priceLevel && (
              <span style={{ fontSize: '14px', color: C.textSub, flexShrink: 0 }}>{priceLabel(place.priceLevel)}</span>
            )}
          </div>

          {place.rating && (
            <p style={{ color: C.goldDim, fontSize: '13px', marginTop: '4px' }}>
              ⭐ {place.rating} ({place.userRatingsTotal?.toLocaleString()})
            </p>
          )}

          {place.distanceMeters && (
            <p style={{ color: C.textSub, fontSize: '12px', marginTop: '4px' }}>
              {place.distanceMeters}m · {Math.round(place.distanceMeters / 80)} min {L.walk}
            </p>
          )}

          {/* 태그 */}
          {tags.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
              {tags.map((t, i) => (
                <span key={i} style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', background: t.color + '30', color: t.color, fontWeight: '400' }}>{t.label}</span>
              ))}
            </div>
          )}

          {/* 설명 */}
          {place.editorialSummary && (
            <p style={{ color: C.textSub, fontSize: '13px', marginTop: '12px', lineHeight: 1.6 }}>{place.editorialSummary}</p>
          )}

          {place.address && (
            <p style={{ color: C.textSub, fontSize: '12px', marginTop: '8px' }}>📍 {place.address}</p>
          )}
        </div>

        {/* 버튼 */}
        <div style={{ display: 'flex', gap: '10px', padding: '20px 20px 0' }}>
          <button onClick={onClose} className="no-orange-card"
            style={{ flex: 1, padding: '14px', borderRadius: '14px', border: `1.5px solid ${C.border}`, background: C.surface, color: C.textSub, fontSize: '14px', cursor: 'pointer' }}>
            {L.close}
          </button>
          <button onClick={() => onSelect(place)} className="no-orange-card"
            style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', background: C.gold, color: C.bg, fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            {L.select_place} →
          </button>
        </div>
      </div>
    </div>
  )
}

export default function RestaurantList({ lang, L, selections, referencePoint, onNext, onBack }) {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedPopup, setSelectedPopup] = useState(null)
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
        {[['rating',L.sort_rating],['reviews',L.sort_reviews],['distance',L.sort_distance]].map(([k,label])=>(
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
          <button key={p.placeId||i} onClick={()=>setSelectedPopup(p)} className="no-orange-card"
            style={{ display:'flex',alignItems:'center',gap:'12px',padding:'14px',borderRadius:'16px',border:`1.5px solid ${C.border}`,background:C.surface,cursor:'pointer',textAlign:'left',width:'100%',boxShadow:'0 2px 8px rgba(0,0,0,0.03)',opacity:refreshing?0.5:1,transition:'opacity 0.2s' }}>
            <div style={{ width:'24px',height:'24px',borderRadius:'50%',background:i<3?C.gold:C.surface2,color:i<3?C.bg:C.textSub,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:'600',flexShrink:0 }}>{i+1}</div>
            <div style={{ width:'64px',height:'64px',borderRadius:'10px',overflow:'hidden',flexShrink:0,background:C.surface2,display:'flex',alignItems:'center',justifyContent:'center' }}>
              {p.photoUrl?<img src={p.photoUrl} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>e.target.style.display='none'}/>:<span style={{fontSize:'24px'}}>🍽️</span>}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontWeight:'400',fontSize:'14px',color:C.text,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{p.name}</p>
              <div style={{ display:'flex',alignItems:'center',gap:'8px',marginTop:'2px' }}>
                {p.rating&&<span style={{ color:C.goldDim,fontSize:'12px' }}>⭐ {p.rating}</span>}
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
          onSelect={(place) => { setSelectedPopup(null); onNext(place) }}
          onClose={() => setSelectedPopup(null)}
        />
      )}
    </div>
  )
}
