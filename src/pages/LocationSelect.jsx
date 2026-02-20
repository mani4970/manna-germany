import { C } from './LandingPage'

export default function LocationSelect({ city, lang, L, onNext, onBack }) {
  const landmarks = city?.landmarks || []
  const stadtteile = city?.stadtteile || []

  const SectionLabel = ({ text }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '20px 0 10px' }}>
      <div style={{ flex: 1, height: '1px', background: C.border }} />
      <span style={{ fontSize: '10px', fontWeight: '600', color: C.goldDim, letterSpacing: '2px', textTransform: 'uppercase' }}>{text}</span>
      <div style={{ flex: 1, height: '1px', background: C.border }} />
    </div>
  )

  const SpotButton = ({ spot }) => (
    <button onClick={() => onNext(spot)} className="no-orange-card"
      style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '3px', padding: '14px 10px', borderRadius: '14px',
        border: `1.5px solid ${C.border}`, background: C.surface,
        cursor: 'pointer', textAlign: 'center',
        transition: 'all 0.18s', width: '100%', minHeight: '72px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}>
      <div style={{ fontWeight: '400', fontSize: '13px', color: C.text }}>
        {lang === 'de' ? spot.name_de : spot.name_en}
      </div>
      <div style={{ fontSize: '10px', color: C.textSub, fontWeight: '300', lineHeight: 1.4 }}>
        {lang === 'de' ? spot.sub_de : spot.sub_en}
      </div>
    </button>
  )

  return (
    <div style={{ padding: '24px', background: C.bg, minHeight: '100vh', fontFamily: "'Outfit', sans-serif", paddingBottom: '40px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600&display=swap" rel="stylesheet" />

      <div style={{ paddingTop: '20px', marginBottom: '8px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '28px' }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ flex: 1, height: '2px', borderRadius: '2px', background: i <= 2 ? C.gold : C.border }} />
          ))}
        </div>
        <button onClick={onBack} className="no-orange-card" style={{
          background: 'none', border: 'none', color: C.textSub,
          fontSize: '14px', cursor: 'pointer', padding: '0 0 16px 0',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>{L.back}</button>
        <p style={{ color: C.gold, fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px' }}>
          {L.step_location}
        </p>
        <h1 style={{ fontSize: '24px', fontWeight: '300', color: C.text, letterSpacing: '-0.3px', lineHeight: 1.3 }}>
          {lang === 'de' ? city?.name_de : city?.name_en}
        </h1>
        <p style={{ color: C.textSub, marginTop: '6px', fontSize: '14px', fontWeight: '300' }}>
          {L.location_sub}
        </p>
      </div>

      {/* 관광지 섹션 */}
      <SectionLabel text={lang === 'de' ? 'Sehenswürdigkeiten' : 'Landmarks'} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {landmarks.map(spot => <SpotButton key={spot.id} spot={spot} />)}
      </div>

      {/* Stadtteile 섹션 */}
      <SectionLabel text={lang === 'de' ? 'Stadtteile' : 'Neighborhoods'} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {stadtteile.map(spot => <SpotButton key={spot.id} spot={spot} />)}
      </div>
    </div>
  )
}
