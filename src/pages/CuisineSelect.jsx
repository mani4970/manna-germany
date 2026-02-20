import { useState } from 'react'
import { C } from './LandingPage'

export default function CuisineSelect({ selections, onNext, onBack, onHome }) {
  const [tempSelections, setTempSelections] = useState({
    restaurantCuisine: selections.restaurantCuisine || 'all',
    cafeCuisine: selections.cafeCuisine || 'all',
    barCuisine: selections.barCuisine || 'all',
  })

  const courseOrder = selections.courseOrder || []

  const restaurantOptions = [
    { id: 'all', label: '전체', emoji: '🍽️' },
    { id: 'korean', label: '한식', emoji: '🍚' },
    { id: 'japanese', label: '일식', emoji: '🍱' },
    { id: 'chinese', label: '중식', emoji: '🥢' },
    { id: 'western', label: '양식', emoji: '🍝' },
    { id: 'meat', label: '고기/스테이크', emoji: '🥩' },
    { id: 'seafood', label: '해산물', emoji: '🦞' },
  ]

  const cafeOptions = [
    { id: 'all', label: '전체', emoji: '☕' },
    { id: 'cafe', label: '카페/커피', emoji: '☕' },
    { id: 'dessert', label: '디저트', emoji: '🍰' },
    { id: 'bakery', label: '베이커리', emoji: '🥐' },
  ]

  const barOptions = [
    { id: 'all', label: '전체', emoji: '🍻' },
    { id: 'bar', label: '바', emoji: '🍸' },
    { id: 'wine_bar', label: '와인바', emoji: '🍷' },
    { id: 'cocktail_bar', label: '칵테일바', emoji: '🍹' },
    { id: 'pub', label: '펍', emoji: '🍺' },
  ]

  function handleSelect(key, value) {
    setTempSelections(prev => ({ ...prev, [key]: value }))
  }

  function handleContinue() {
    onNext({ ...selections, ...tempSelections })
  }

  const selKey = { restaurant: 'restaurantCuisine', cafe: 'cafeCuisine', bar: 'barCuisine' }
  const optMap = { restaurant: restaurantOptions, cafe: cafeOptions, bar: barOptions }
  const typeLabel = { restaurant: '🍽️ 레스토랑', cafe: '☕ 카페', bar: '🍺 바/술집' }

  return (
    <div style={{ paddingBottom: '100px', background: C.bg, minHeight: '100vh', fontFamily: "'Outfit', 'Noto Sans KR', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600&family=Noto+Sans+KR:wght@300;400;700&display=swap" rel="stylesheet" />
      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ paddingTop: '20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '28px' }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{ flex: 1, height: '2px', borderRadius: '2px', background: C.gold }} />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <button onClick={onBack} style={{
              background: 'none', border: 'none', color: C.textSub,
              fontSize: '14px', cursor: 'pointer', padding: 0,
              fontFamily: "'Outfit', sans-serif",
            }}>← 이전으로</button>
            {onHome && (
              <button onClick={onHome} style={{
                background: C.surface2, border: `1px solid ${C.border}`,
                borderRadius: '8px', padding: '6px 12px',
                fontSize: '13px', color: C.textSub, cursor: 'pointer',
                fontFamily: "'Outfit', sans-serif",
              }}>🏠</button>
            )}
          </div>

          <p style={{ color: C.gold, fontWeight: '400', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center' }}>
            STEP 5 / 5
          </p>

          <h1 style={{ fontSize: '24px', fontWeight: '300', color: C.text, letterSpacing: '-0.3px', textAlign: 'center' }}>
            어떤 종류 원하세요?
          </h1>
          <p style={{ color: C.textSub, marginTop: '6px', fontSize: '14px', fontWeight: '300', textAlign: 'center' }}>
            더 정확한 추천을 위해 선택해주세요
          </p>
        </div>
      </div>

      {courseOrder.map((type, orderIdx) => (
        <div key={type} style={{ padding: '24px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{
              width: '22px', height: '22px', borderRadius: '50%',
              background: C.gold, color: C.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: '600',
            }}>
              {orderIdx + 1}
            </div>
            <p style={{ fontWeight: '400', color: C.text, fontSize: '15px' }}>
              {typeLabel[type]}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {optMap[type].map(opt => {
              const isSelected = tempSelections[selKey[type]] === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(selKey[type], opt.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    padding: '14px 12px',
                    borderRadius: '12px',
                    border: isSelected ? `1.5px solid ${C.gold}` : `1.5px solid ${C.border}`,
                    background: isSelected ? C.surface2 : C.surface,
                    cursor: 'pointer', textAlign: 'center',
                    transition: 'all 0.18s',
                  }}
                >
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{opt.emoji}</span>
                  <span style={{
                    fontWeight: '400', fontSize: '13px',
                    color: isSelected ? C.gold : C.text,
                  }}>
                    {opt.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <div style={{ padding: '24px', position: 'sticky', bottom: 0, background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <button
          onClick={handleContinue}
          style={{
            background: C.gold, color: C.bg, border: 'none',
            padding: '16px', borderRadius: '12px',
            fontSize: '15px', fontWeight: '600', cursor: 'pointer',
            width: '100%', fontFamily: "'Outfit', sans-serif",
            letterSpacing: '0.3px',
          }}
        >
          다음 단계로 →
        </button>
      </div>
    </div>
  )
}
