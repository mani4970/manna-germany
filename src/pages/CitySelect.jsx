import { C } from './LandingPage'
import { CITIES } from '../cities'

export default function CitySelect({ lang, L, onNext, onBack }) {
  return (
    <div style={{ padding: '24px', background: C.bg, minHeight: '100vh', fontFamily: "'Outfit', 'Noto Sans KR', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600&display=swap" rel="stylesheet" />

      <div style={{ paddingTop: '20px', marginBottom: '28px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '28px' }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ flex: 1, height: '2px', borderRadius: '2px', background: i === 1 ? C.gold : C.border }} />
          ))}
        </div>

        <button onClick={onBack} className="no-orange-card" style={{
          background: 'none', border: 'none', color: C.textSub,
          fontSize: '14px', cursor: 'pointer', padding: '0 0 16px 0',
          display: 'flex', alignItems: 'center', gap: '4px',
          fontFamily: "'Outfit', sans-serif",
        }}>{L.back_home}</button>

        <p style={{ color: C.gold, fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px' }}>
          {L.step_city}
        </p>
        <h1 style={{ fontSize: '24px', fontWeight: '300', color: C.text, letterSpacing: '-0.3px', lineHeight: 1.3 }}>
          {L.city_title}
        </h1>
        <p style={{ color: C.textSub, marginTop: '6px', fontSize: '14px', fontWeight: '300' }}>
          {L.city_sub}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {CITIES.map(city => (
          <button key={city.id} onClick={() => onNext(city)} className="no-orange-card"
            style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '18px 20px', borderRadius: '16px',
              border: `1.5px solid ${C.border}`, background: C.surface,
              cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.18s', width: '100%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <span style={{ fontSize: '28px' }}>{city.emoji}</span>
            <div>
              <div style={{ fontWeight: '400', fontSize: '16px', color: C.text }}>
                {lang === 'de' ? city.name_de : city.name_en}
              </div>
              <div style={{ fontSize: '11px', color: C.textSub, fontWeight: '300', marginTop: '2px' }}>
                {lang === 'de' ? city.sub_de : city.sub_en}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
