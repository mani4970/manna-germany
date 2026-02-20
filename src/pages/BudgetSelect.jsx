import { C } from './LandingPage'

export default function BudgetSelect({ selections, onNext, onBack, onHome }) {
  const budgets = [
    { id: 'low', label: '가성비', emoji: '💰', desc: '1–3만원대' },
    { id: 'medium', label: '적당히', emoji: '💳', desc: '3–5만원대' },
    { id: 'high', label: '특별한 날', emoji: '💎', desc: '5만원 이상' },
    { id: 'any', label: '상관없어요', emoji: '✨', desc: '모든 가격대' },
  ]

  return (
    <div style={{ padding: '24px', background: C.bg, minHeight: '100vh', fontFamily: "'Outfit', 'Noto Sans KR', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600&family=Noto+Sans+KR:wght@300;400;700&display=swap" rel="stylesheet" />
      <div style={{ paddingTop: '20px', marginBottom: '28px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '28px' }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{
              flex: 1, height: '2px', borderRadius: '2px',
              background: i <= 4 ? C.gold : C.border
            }} />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <button onClick={onBack} className="no-orange-card" style={{
            background: 'none', border: 'none', color: C.textSub,
            fontSize: '14px', cursor: 'pointer', padding: 0,
            fontFamily: "'Outfit', sans-serif",
          }}>← 이전으로</button>
          {onHome && (
            <button onClick={onHome} className="no-orange-card" style={{
              background: C.surface2, border: `1px solid ${C.border}`,
              borderRadius: '8px', padding: '6px 12px',
              fontSize: '13px', color: C.textSub, cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif",
            }}>🏠</button>
          )}
        </div>

        <p style={{ color: C.gold, fontWeight: '400', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center' }}>
          STEP 4 / 5
        </p>

        <h1 style={{ fontSize: '24px', fontWeight: '300', color: C.text, letterSpacing: '-0.3px', textAlign: 'center' }}>
          예산은 어느 정도?
        </h1>
        <p style={{ color: C.textSub, marginTop: '6px', fontSize: '14px', fontWeight: '300', textAlign: 'center' }}>
          1인당 예상 가격대를 선택해주세요
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {budgets.map(budget => (
          <button
            key={budget.id}
            onClick={() => onNext(budget.label)}
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
            <span style={{ fontSize: '28px', marginBottom: '4px' }}>{budget.emoji}</span>
            <div style={{ fontWeight: '400', fontSize: '15px', color: C.text }}>{budget.label}</div>
            <div style={{ fontSize: '11px', color: C.textSub, fontWeight: '300' }}>{budget.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
