import { C } from './LandingPage'

export default function BudgetSelect({ lang, L, onNext, onBack, onHome }) {
  const emojis = ['🪙', '💶', '💎', '🤷']

  return (
    <div style={{ padding: '24px', background: C.bg, minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600&display=swap" rel="stylesheet" />

      <div style={{ paddingTop: '20px', marginBottom: '28px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '28px' }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ flex: 1, height: '2px', borderRadius: '2px', background: i <= 5 ? C.gold : C.border }} />
          ))}
        </div>
        <button onClick={onBack} className="no-orange-card" style={{
          background: 'none', border: 'none', color: C.textSub,
          fontSize: '14px', cursor: 'pointer', padding: '0 0 16px 0',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>{L.back}</button>
        <p style={{ color: C.gold, fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px' }}>
          {L.step_budget}
        </p>
        <h1 style={{ fontSize: '24px', fontWeight: '300', color: C.text, letterSpacing: '-0.3px', lineHeight: 1.3 }}>
          {L.budget_title}
        </h1>
        <p style={{ color: C.textSub, marginTop: '6px', fontSize: '14px', fontWeight: '300' }}>
          {L.budget_sub}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {L.budgets.map((b, i) => (
          <button key={i} onClick={() => onNext(b)} className="no-orange-card"
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '4px', padding: '20px 16px', borderRadius: '16px',
              border: `1.5px solid ${C.border}`, background: C.surface,
              cursor: 'pointer', textAlign: 'center',
              transition: 'all 0.18s', minHeight: '100px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <span style={{ fontSize: '28px', marginBottom: '4px' }}>{emojis[i]}</span>
            <div style={{ fontWeight: '400', fontSize: '14px', color: C.text }}>{b}</div>
            <div style={{ fontSize: '11px', color: C.textSub, fontWeight: '300' }}>{L.budget_descs[i]}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
