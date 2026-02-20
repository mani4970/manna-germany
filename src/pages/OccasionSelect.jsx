import { C } from './LandingPage'

export default function OccasionSelect({ location, onNext, onBack }) {
  const occasions = [
    { id: 'date', label: '데이트', emoji: '💑', desc: '연인과 함께' },
    { id: 'friend', label: '친구', emoji: '👥', desc: '친구들과 함께' },
    { id: 'family', label: '가족', emoji: '👨‍👩‍👧‍👦', desc: '가족 모임' },
    { id: 'business', label: '비즈니스', emoji: '💼', desc: '업무 미팅' },
  ]

  return (
    <div style={{ padding: '24px', background: C.bg, minHeight: '100vh', fontFamily: "'Outfit', 'Noto Sans KR', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600&family=Noto+Sans+KR:wght@300;400;700&display=swap" rel="stylesheet" />
      <div style={{ paddingTop: '20px', marginBottom: '28px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '28px' }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{
              flex: 1, height: '2px', borderRadius: '2px',
              background: i <= 2 ? C.gold : C.border
            }} />
          ))}
        </div>

        <button onClick={onBack} className="no-orange-card" style={{
          background: 'none', border: 'none', color: C.textSub,
          fontSize: '14px', cursor: 'pointer', padding: '0 0 16px 0',
          display: 'flex', alignItems: 'center', gap: '4px',
          fontFamily: "'Outfit', sans-serif", letterSpacing: '0.2px',
        }}>← 이전으로</button>

        <p style={{ color: C.gold, fontWeight: '400', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center' }}>
          STEP 2 / 5
        </p>

        <h1 style={{ fontSize: '24px', fontWeight: '300', color: C.text, letterSpacing: '-0.3px', textAlign: 'center', lineHeight: 1.3, textAlign: 'center' }}>
          누구랑 가나요?
        </h1>
        <p style={{ color: C.textSub, marginTop: '6px', fontSize: '14px', fontWeight: '300', textAlign: 'center' }}>
          {location}에서의 모임
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {occasions.map(occ => (
          <button
            key={occ.id}
            onClick={() => onNext(occ.label)}
            className="no-orange-card"
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '4px', padding: '20px 16px',
              borderRadius: '16px',
              border: `1.5px solid ${C.border}`,
              background: C.surface,
              cursor: 'pointer', textAlign: 'center',
              transition: 'all 0.18s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              minHeight: '100px',
            }}
          >
            <span style={{ fontSize: '28px', marginBottom: '4px' }}>{occ.emoji}</span>
            <div style={{ fontWeight: '400', fontSize: '15px', color: C.text }}>{occ.label}</div>
            <div style={{ fontSize: '11px', color: C.textSub, fontWeight: '300' }}>{occ.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
