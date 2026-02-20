import { useState, useEffect } from 'react'
import { C } from './LandingPage'

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
  const [sortBy, setSortBy] = useState('rating')
  const ref = referencePoint || selections.hotspot
  const isCafe = type === 'cafe'
  const emoji = isCafe ? '☕' : '🍺'
  const title = isCafe ? 'Café' : 'Bar'
  const loadingText = isCafe ? L.loading_cafe : L.loading_bar

  useEffect(() => {
    if (!ref?.lat) return
    fetch(`/api/places/search?type=${type}&lat=${ref.lat}&lng=${ref.lng}&radius=1000`)
      .then(r=>r.json()).then(data=>{
        setPlaces((data.places||[]).map(p=>({...p, distanceMeters: haversineDistance(ref.lat,ref.lng,p.lat,p.lng)})))
        setLoading(false)
      }).catch(()=>setLoading(false))
  }, [])

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
      <div style={{ padding: '24px 24px 0', textAlign: 'center' }}>
        <div style={{ paddingTop: '20px' }}>
          <button onClick={onBack} className="no-orange-card" style={{ background:'none',border:'none',color:C.textSub,fontSize:'14px',cursor:'pointer',padding:'0 0 16px 0',display:'flex',alignItems:'center',gap:'4px' }}>{L.back}</button>
          <h1 style={{ fontSize:'22px',fontWeight:'300',color:C.text,letterSpacing:'-0.3px' }}>{emoji} {title}</h1>
          <p style={{ color:C.textSub,marginTop:'4px',fontSize:'13px',fontWeight:'300' }}>{displayName} · {L.nearby}</p>
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
          <div style={{ textAlign:'center',padding:'60px 0',color:C.textSub }}>{loadingText}</div>
        ) : sorted.length === 0 ? (
          <div style={{ textAlign:'center',padding:'60px 0',color:C.textSub }}>{L.no_results}</div>
        ) : sorted.map((p,i)=>(
          <button key={p.placeId||i} onClick={()=>onNext(p)} className="no-orange-card"
            style={{ display:'flex',alignItems:'center',gap:'12px',padding:'14px',borderRadius:'16px',border:`1.5px solid ${C.border}`,background:C.surface,cursor:'pointer',textAlign:'left',width:'100%',boxShadow:'0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ width:'24px',height:'24px',borderRadius:'50%',background:i<3?C.gold:C.surface2,color:i<3?C.bg:C.textSub,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:'600',flexShrink:0 }}>{i+1}</div>
            <div style={{ width:'64px',height:'64px',borderRadius:'10px',overflow:'hidden',flexShrink:0,background:C.surface2,display:'flex',alignItems:'center',justifyContent:'center' }}>
              {p.photoUrl?<img src={p.photoUrl} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>e.target.style.display='none'}/>:<span style={{fontSize:'24px'}}>{emoji}</span>}
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:'400',fontSize:'14px',color:C.text }}>{p.name}</p>
              {p.rating&&<p style={{ color:C.goldDim,fontSize:'12px',marginTop:'2px' }}>⭐ {p.rating} ({p.userRatingsTotal?.toLocaleString()})</p>}
              {p.distanceMeters&&<p style={{ color:C.textSub,fontSize:'11px',marginTop:'2px' }}>{p.distanceMeters}m · {Math.round(p.distanceMeters/80)} min {L.walk}</p>}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
