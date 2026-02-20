import { useState } from 'react'
import { C } from './LandingPage'

export default function CourseSelect({ selections, onNext, onBack, onHome }) {
  const [selectedOrder, setSelectedOrder] = useState([])

  const options = [
    { id: 'restaurant', label: '레스토랑', emoji: '🍽️', desc: '맛집 식사' },
    { id: 'cafe', label: '카페', emoji: '☕', desc: '카페 & 디저트' },
    { id: 'bar', label: '바/술집', emoji: '🍺', desc: '술 한잔' },
  ]

  function handleToggle(id) {
    if (selectedOrder.includes(id)) {
      setSelectedOrder(prev => prev.filter(item => item !== id))
    } else {
      setSelectedOrder(prev => [...prev, id])
    }
  }

  function handleContinue() {
    if (selectedOrder.length === 0) return
    onNext({ courseOrder: selectedOrder })
  }

  function getOrderNumber(id) {
    const index = selectedOrder.indexOf(id)
    return index >= 0 ? index + 1 : null
  }

  return (
    <div style={{ paddingBottom: '40px', background: C.bg, minHeight: '100vh', fontFamily: "'Outfit', 'Noto Sans KR', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600&family=Noto+Sans+KR:wght@300;400;700&display=swap" rel="stylesheet" />
      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ paddingTop: '20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '28px' }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{
                flex: 1, height: '2px', borderRadius: '2px',
                background: i <= 3 ? C.gold : C.border
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
            STEP 3 / 5
          </p>

          <h1 style={{ fontSize: '24px', fontWeight: '300', color: C.text, letterSpacing: '-0.3px', textAlign: 'center' }}>
            어디를 갈까요?
          </h1>
          <p style={{ color: C.textSub, marginTop: '6px', fontSize: '14px', fontWeight: '300', textAlign: 'center' }}>
            가고 싶은 곳을 순서대로 선택해주세요
          </p>

          {selectedOrder.length > 0 && (
            <div style={{
              background: C.surface2, borderRadius: '12px',
              padding: '12px 16px', marginTop: '16px',
              border: `1px solid ${C.border}`,
            }}>
              <p style={{ color: C.textSub, fontSize: '11px', marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                선택한 순서
              </p>
              <p style={{ color: C.gold, fontWeight: '400', fontSize: '14px' }}>
                {selectedOrder.map((id, idx) => {
                  const opt = options.find(o => o.id === id)
                  return (
                    <span key={id}>
                      {idx > 0 && <span style={{ color: C.textDim }}> → </span>}
                      {opt?.emoji} {opt?.label}
                    </span>
                  )
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {options.map(opt => {
            const orderNum = getOrderNumber(opt.id)
            const isSelected = orderNum !== null

            return (
              <button
                key={opt.id}
                onClick={() => handleToggle(opt.id)}
                className="no-orange-card"
                style={{
                  position: 'relative',
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '18px',
                  borderRadius: '16px',
                  border: isSelected ? `1.5px solid ${C.gold}` : `1.5px solid ${C.border}`,
                  background: isSelected ? C.surface2 : C.surface,
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                {isSelected && (
                  <div style={{
                    position: 'absolute', top: '12px', left: '12px',
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: C.gold, color: C.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: '600',
                  }}>
                    {orderNum}
                  </div>
                )}

                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: isSelected ? C.border : C.surface2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px', flexShrink: 0,
                  marginLeft: isSelected ? '24px' : '0',
                  transition: 'all 0.18s',
                }}>
                  {opt.emoji}
                </div>

                <div style={{ flex: 1, textAlign: 'left' }}>
                  <p style={{
                    fontWeight: '400', fontSize: '16px',
                    color: isSelected ? C.gold : C.text,
                    marginBottom: '2px',
                  }}>
                    {opt.label}
                  </p>
                  <p style={{ color: C.textSub, fontSize: '13px', fontWeight: '300' }}>
                    {opt.desc}
                  </p>
                </div>

                {isSelected && (
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: C.gold,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: C.bg, fontSize: '11px', fontWeight: '600',
                  }}>✓</div>
                )}
              </button>
            )
          })}
        </div>

        <p style={{ color: C.textDim, fontSize: '11px', textAlign: 'center', marginTop: '16px', letterSpacing: '0.5px', width: '100%' }}>
          선택한 순서대로 코스를 추천해드려요
        </p>
      </div>

      <div style={{ padding: '24px', position: 'sticky', bottom: 0, background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <button
          onClick={handleContinue}
          disabled={selectedOrder.length === 0}
          className="no-orange-card"
          style={{
            background: selectedOrder.length > 0 ? C.gold : C.border,
            color: selectedOrder.length > 0 ? C.bg : C.textSub,
            border: 'none', padding: '16px', borderRadius: '12px',
            fontSize: '15px', fontWeight: '600',
            cursor: selectedOrder.length > 0 ? 'pointer' : 'not-allowed',
            width: '100%', fontFamily: "'Outfit', sans-serif",
            letterSpacing: '0.3px',
          }}
        >
          {selectedOrder.length > 0 ? `${selectedOrder.length}곳 코스 만들기 →` : '하나 이상 선택하세요'}
        </button>
      </div>
    </div>
  )
}
