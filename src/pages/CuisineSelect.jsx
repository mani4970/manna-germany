import { useState } from 'react'
import { C } from './LandingPage'

const CUISINE_OPTIONS = {
  restaurant: [
    { id: 'all',           emoji: '🍴', label_de: 'Alles',          label_en: 'All' },
    { id: 'german',        emoji: '🥨', label_de: 'Deutsch',         label_en: 'German' },
    { id: 'italian',       emoji: '🍝', label_de: 'Italienisch',     label_en: 'Italian' },
    { id: 'asian',         emoji: '🍜', label_de: 'Asiatisch',        label_en: 'Asian' },
    { id: 'indian',         emoji: '🫔', label_de: 'Indisch',           label_en: 'Indian' },
    { id: 'turkish',       emoji: '🥙', label_de: 'Türkisch',        label_en: 'Turkish' },
    { id: 'french',        emoji: '🥐', label_de: 'Französisch',     label_en: 'French' },
    { id: 'american',      emoji: '🍔', label_de: 'Amerikanisch',    label_en: 'American' },
    { id: 'mediterranean', emoji: '🫒', label_de: 'Mediterran',      label_en: 'Mediterranean' },
    { id: 'steakhouse',    emoji: '🥩', label_de: 'Steakhouse',      label_en: 'Steakhouse' },
    { id: 'seafood',       emoji: '🦞', label_de: 'Meeresfrüchte',   label_en: 'Seafood' },
    { id: 'vegetarian',    emoji: '🥗', label_de: 'Vegetarisch',     label_en: 'Vegetarian' },
  ],
  cafe: [
    { id: 'all',           emoji: '☕', label_de: 'Alles',           label_en: 'All' },
    { id: 'specialty',     emoji: '🫘', label_de: 'Specialty Coffee', label_en: 'Specialty Coffee' },
    { id: 'dessert',       emoji: '🍰', label_de: 'Dessert & Kuchen', label_en: 'Dessert & Cake' },
    { id: 'brunch',        emoji: '🍳', label_de: 'Brunch',          label_en: 'Brunch' },
  ],
  bar: [
    { id: 'all',           emoji: '🍺', label_de: 'Alles',           label_en: 'All' },
    { id: 'cocktail',      emoji: '🍸', label_de: 'Cocktailbar',     label_en: 'Cocktail Bar' },
    { id: 'wine',          emoji: '🍷', label_de: 'Weinbar',         label_en: 'Wine Bar' },
    { id: 'craft_beer',    emoji: '🍻', label_de: 'Craft Beer',      label_en: 'Craft Beer' },
  ],
}

export default function CuisineSelect({ lang, L, selections, onNext, onBack, onHome }) {
  const courseOrder = selections.courseOrder || []
  const [cuisines, setCuisines] = useState({
    restaurantCuisine: 'all', cafeCuisine: 'all', barCuisine: 'all',
  })

  const sectionLabel = (type) => {
    if (lang === 'de') return type === 'restaurant' ? 'Restaurant' : type === 'cafe' ? 'Café' : 'Bar'
    return type === 'restaurant' ? 'Restaurant' : type === 'cafe' ? 'Café' : 'Bar'
  }

  const sectionKey = (type) =>
    type === 'restaurant' ? 'restaurantCuisine' : type === 'cafe' ? 'cafeCuisine' : 'barCuisine'

  const uniqueTypes = [...new Set(courseOrder)]

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: "'Outfit', sans-serif", paddingBottom: '120px' }}>

      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ paddingTop: '20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '28px' }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ flex: 1, height: '2px', borderRadius: '2px', background: C.gold }} />
            ))}
          </div>
          <button onClick={onBack} className="no-orange-card" style={{
            background: 'none', border: 'none', color: C.textSub, fontSize: '14px',
            cursor: 'pointer', padding: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '4px',
          }}>{L.back}</button>
          <p style={{ color: C.gold, fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px' }}>
            {L.step_cuisine}
          </p>
          <h1 style={{ fontSize: '24px', fontWeight: '300', color: C.text, letterSpacing: '-0.3px', lineHeight: 1.3 }}>
            {L.cuisine_title}
          </h1>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {uniqueTypes.map((type) => {
          const options = CUISINE_OPTIONS[type] || []
          const key = sectionKey(type)
          const orderNums = courseOrder.reduce((acc, t, i) => { if (t === type) acc.push(i + 1); return acc }, [])
          return (
            <div key={type} style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                {orderNums.map(n => (
                  <div key={n} style={{
                    width: '20px', height: '20px', borderRadius: '50%', background: C.gold,
                    color: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', fontWeight: '600',
                  }}>{n}</div>
                ))}
                <span style={{ fontSize: '13px', fontWeight: '400', color: C.text }}>{sectionLabel(type)}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {options.map(opt => {
                  const isSelected = cuisines[key] === opt.id
                  return (
                    <button key={opt.id} onClick={() => setCuisines(prev => ({ ...prev, [key]: opt.id }))}
                      className="no-orange-card"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        padding: '12px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center',
                        border: isSelected ? `1.5px solid ${C.gold}` : `1.5px solid ${C.border}`,
                        background: isSelected ? C.surface2 : C.surface, transition: 'all 0.18s',
                      }}>
                      <span style={{ fontSize: '16px' }}>{opt.emoji}</span>
                      <span style={{ fontSize: '13px', color: C.text, fontWeight: isSelected ? '400' : '300' }}>
                        {lang === 'de' ? opt.label_de : opt.label_en}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '600px', padding: '16px 24px', background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <button onClick={() => onNext({ ...selections, ...cuisines })} className="no-orange-card"
          style={{
            width: '100%', background: C.gold, color: C.bg,
            border: 'none', borderRadius: '14px', padding: '16px',
            fontSize: '15px', fontWeight: '600', cursor: 'pointer',
          }}>
          {lang === 'de' ? 'Weiter →' : 'Next →'}
        </button>
      </div>
    </div>
  )
}
