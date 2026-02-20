import { useState } from 'react'
import { C } from './LandingPage'

export default function DirectInput({ lang, L, onNext, onBack, initialPlace }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(initialPlace || null)
  const [loading, setLoading] = useState(false)

  const search = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/places/search?query=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.places || [])
    } catch (e) { setResults([]) }
    setLoading(false)
  }

  const nextTypes = [
    { type: 'cafe', emoji: '☕', label_de: 'Café in der Nähe', label_en: 'Nearby Café' },
    { type: 'restaurant', emoji: '🍽️', label_de: 'Restaurant in der Nähe', label_en: 'Nearby Restaurant' },
    { type: 'bar', emoji: '🍺', label_de: 'Bar in der Nähe', label_en: 'Nearby Bar' },
    { type: 'both', emoji: '✨', label_de: 'Café + Bar', label_en: 'Café + Bar' },
  ]

  return (
    <div style={{ padding: '24px', background: C.bg, minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600&display=swap" rel="stylesheet" />

      <div style={{ paddingTop: '20px', marginBottom: '24px', textAlign: 'center' }}>
        <button onClick={onBack} className="no-orange-card" style={{ background:'none',border:'none',color:C.textSub,fontSize:'14px',cursor:'pointer',padding:'0 0 16px 0',display:'flex',alignItems:'center',gap:'4px' }}>
          {L.back_home}
        </button>
        <h1 style={{ fontSize:'24px',fontWeight:'300',color:C.text,letterSpacing:'-0.3px' }}>{L.direct_title}</h1>
        <p style={{ color:C.textSub,marginTop:'6px',fontSize:'14px',fontWeight:'300' }}>{L.direct_sub}</p>
      </div>

      {!selected ? (
        <>
          <div style={{ display:'flex',gap:'8px',marginBottom:'16px' }}>
            <input
              value={query} onChange={e=>setQuery(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&search()}
              placeholder={lang==='de'?'z.B. Café Einstein, Zur letzten Instanz...':'e.g. Café Einstein, Zur letzten Instanz...'}
              style={{ flex:1,padding:'14px 16px',borderRadius:'12px',border:`1.5px solid ${C.border}`,background:C.surface,fontSize:'15px',fontFamily:"'Outfit',sans-serif",outline:'none',color:C.text }}
            />
            <button onClick={search} className="no-orange-card"
              style={{ padding:'14px 18px',borderRadius:'12px',background:C.gold,color:C.bg,border:'none',fontSize:'14px',fontWeight:'600',cursor:'pointer' }}>
              {L.search_btn}
            </button>
          </div>
          {loading && <p style={{ textAlign:'center',color:C.textSub,padding:'20px 0' }}>Suche...</p>}
          <div style={{ display:'flex',flexDirection:'column',gap:'8px' }}>
            {results.map((p,i)=>(
              <button key={p.placeId||i} onClick={()=>setSelected(p)} className="no-orange-card"
                style={{ display:'flex',alignItems:'center',gap:'12px',padding:'14px',borderRadius:'14px',border:`1.5px solid ${C.border}`,background:C.surface,cursor:'pointer',textAlign:'left',width:'100%' }}>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:'400',fontSize:'14px',color:C.text }}>{p.name}</p>
                  <p style={{ color:C.textSub,fontSize:'12px',marginTop:'2px' }}>{p.address?.split(',').slice(0,2).join(',')}</p>
                  {p.rating&&<p style={{ color:C.goldDim,fontSize:'11px',marginTop:'2px' }}>⭐ {p.rating}</p>}
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div style={{ background:C.surface2,borderRadius:'14px',padding:'16px',border:`1px solid ${C.border}`,marginBottom:'24px' }}>
            <p style={{ fontWeight:'400',fontSize:'15px',color:C.text }}>{selected.name}</p>
            <p style={{ color:C.textSub,fontSize:'12px',marginTop:'4px' }}>{selected.address?.split(',').slice(0,2).join(',')}</p>
          </div>
          <p style={{ color:C.textSub,fontSize:'14px',marginBottom:'12px',textAlign:'center' }}>{L.nearby_find}</p>
          <div style={{ display:'flex',flexDirection:'column',gap:'8px',marginBottom:'16px' }}>
            {nextTypes.map(t=>(
              <button key={t.type} onClick={()=>onNext({ restaurant: selected.primaryType?.includes('restaurant')||selected.primaryType?.includes('food') ? selected : null, cafe: !selected.primaryType?.includes('restaurant') ? selected : null, nextType: t.type })}
                className="no-orange-card"
                style={{ display:'flex',alignItems:'center',gap:'12px',padding:'14px 18px',borderRadius:'14px',border:`1.5px solid ${C.border}`,background:C.surface,cursor:'pointer',textAlign:'left',width:'100%' }}>
                <span style={{ fontSize:'20px' }}>{t.emoji}</span>
                <span style={{ fontSize:'14px',color:C.text }}>{lang==='de'?t.label_de:t.label_en}</span>
              </button>
            ))}
          </div>
          <button onClick={()=>setSelected(null)} className="no-orange-card"
            style={{ background:'none',border:'none',color:C.textSub,fontSize:'13px',cursor:'pointer',display:'flex',alignItems:'center',gap:'4px' }}>
            {L.re_search}
          </button>
        </>
      )}
    </div>
  )
}
