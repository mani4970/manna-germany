import { useState } from 'react'
import { C } from './LandingPage'

const OPTIONS = [
  { id: 'restaurant', emoji: '🍽️', label_de: 'Restaurant', label_en: 'Restaurant' },
  { id: 'cafe', emoji: '☕', label_de: 'Café', label_en: 'Café' },
  { id: 'bar', emoji: '🍺', label_de: 'Bar', label_en: 'Bar' },
]

export default function CourseSelect({ lang, L, selections, onNext, onBack, onHome }) {
  const [selected, setSelected] = useState([])

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600&display=swap" rel="stylesheet" />

      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ paddingTop: '20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '28px' }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ flex: 1, height: '2px', borderRadius: '2px', background: i <= 4 ? C.gold : C.border }} />
            ))}
          </div>
          <button onClick={onBack} className="no-orange-card" style={{
            background: 'none', border: 'none', color: C.textSub, fontSize: '14px',
            cursor: 'pointer', padding: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '4px',
          }}>{L.back}</button>
          <p style={{ color: C.gold, fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px' }}>
            {L.step_course}
          </p>
          <h1 style={{ fontSize: '24px', fontWeight: '300', color: C.text, letterSpacing: '-0.3px', lineHeight: 1.3 }}>
            {L.course_title}
          </h1>
          <p style={{ color: C.textSub, marginTop: '6px', fontSize: '14px', fontWeight: '300' }}>
            {L.course_sub}
          </p>
        </div>
      </div>

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {OPTIONS.map((opt, i) => {
          const idx = selected.indexOf(opt.id)
          const isSelected = idx !== -1
          return (
            <button key={opt.id} onClick={() => toggle(opt.id)} className="no-orange-card"
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '18px 20px', borderRadius: '16px',
                border: `1.5px solid ${isSelected ? C.gold : C.border}`,
                background: isSelected ? C.surface2 : C.surface,
                cursor: 'pointer', textAlign: 'left', width: '100%',
                transition: 'all 0.18s',
              }}
            >
              {isSelected ? (
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: C.gold, color: C.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: '600', flexShrink: 0,
                }}>{idx + 1}</div>
              ) : (
                <span style={{ fontSize: '24px', width: '28px', textAlign: 'center' }}>{opt.emoji}</span>
              )}
              <span style={{ fontWeight: '400', fontSize: '16px', color: C.text }}>
                {lang === 'de' ? opt.label_de : opt.label_en}
              </span>
            </button>
          )
        })}
      </div>

      {selected.length > 0 && (
        <div style={{ padding: '0 24px 32px' }}>
          <p style={{ color: C.textDim, fontSize: '11px', textAlign: 'center', marginBottom: '16px', letterSpacing: '0.5px' }}>
            {L.course_hint}
          </p>
          <button onClick={() => onNext({ courseOrder: selected })} className="no-orange-card"
            style={{
              width: '100%', background: C.gold, color: C.bg,
              border: 'none', borderRadius: '14px', padding: '16px',
              fontSize: '15px', fontWeight: '600', cursor: 'pointer',
            }}>
            {L.course_btn(selected.length)}
          </button>
        </div>
      )}
    </div>
  )
}
