import { useState } from 'react'

export const C = {
  bg: '#FAF7F2',
  surface: '#FFFFFF',
  surface2: '#F3EFE8',
  border: '#E8E0D4',
  gold: '#B89A6A',
  goldDim: '#C8AE88',
  text: '#1A1714',
  textSub: '#8A8070',
  textDim: '#C4B8A8',
}

export function MannaDots({ size = 8 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.5 }}>
      <div style={{ width: size, height: size, borderRadius: '50%', background: C.gold }} />
      <div style={{ width: size * 0.7, height: size * 0.7, borderRadius: '50%', background: C.gold, opacity: 0.55 }} />
      <div style={{ width: size * 0.4, height: size * 0.4, borderRadius: '50%', background: C.gold, opacity: 0.25 }} />
    </div>
  )
}

function MannaLogo({ fontSize = 28 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <MannaDots size={fontSize * 0.28} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: fontSize * 0.4 }}>
        <span style={{
          fontFamily: "'Outfit', sans-serif", fontWeight: 300, fontSize,
          letterSpacing: fontSize * 0.28, textTransform: 'uppercase', color: C.text, lineHeight: 1,
        }}>Manna</span>
        <span style={{
          fontFamily: "'Outfit', sans-serif", fontWeight: 700,
          fontSize: fontSize * 0.48, color: C.goldDim, letterSpacing: '2px', lineHeight: 1,
        }}>DE</span>
      </div>
    </div>
  )
}

const features = [
  { icon: '📍', title_de: '26 deutsche Städte', title_en: '26 German cities', desc_de: 'Berlin, München, Hamburg & mehr', desc_en: 'Berlin, Munich, Hamburg & more' },
  { icon: '⭐', title_de: 'Google-Bewertungen', title_en: 'Google Ratings', desc_de: 'Echte Bewertungen von tausenden Nutzern', desc_en: 'Real ratings from thousands of users' },
  { icon: '🗺️', title_de: 'Google Maps', title_en: 'Google Maps', desc_de: 'Route & Navigation direkt in der App', desc_en: 'Route & navigation directly in the app' },
  { icon: '💬', title_de: 'WhatsApp teilen', title_en: 'Share via WhatsApp', desc_de: 'Kurs mit Freunden teilen', desc_en: 'Share your tour with friends' },
]

const stepsGuided_de = [
  { num: '01', label: 'Stadt wählen', desc: 'Berlin, München...' },
  { num: '02', label: 'Viertel wählen', desc: 'Mitte, Kreuzberg...' },
  { num: '03', label: 'Anlass', desc: 'Date, Freunde, Familie' },
  { num: '04', label: 'Tour & Budget', desc: 'Restaurant, Café, Bar' },
]
const stepsGuided_en = [
  { num: '01', label: 'Choose city', desc: 'Berlin, Munich...' },
  { num: '02', label: 'Choose area', desc: 'Mitte, Kreuzberg...' },
  { num: '03', label: 'Occasion', desc: 'Date, friends, family' },
  { num: '04', label: 'Tour & Budget', desc: 'Restaurant, café, bar' },
]
const stepsDirect_de = [
  { num: '01', label: 'Ort suchen', desc: 'Schon einen Ort kennen' },
  { num: '02', label: 'Umgebung erkunden', desc: 'Cafés · Bars in der Nähe' },
  { num: '03', label: 'Tour fertig', desc: 'Karte + WhatsApp teilen' },
]
const stepsDirect_en = [
  { num: '01', label: 'Search place', desc: 'Already know a spot' },
  { num: '02', label: 'Explore nearby', desc: 'Cafés · Bars around' },
  { num: '03', label: 'Tour complete', desc: 'Map + WhatsApp share' },
]

export default function LandingPage({ lang, setLang, L, onStartGuided, onStartDirect }) {
  const fadeUp = (delay = 0) => ({ animation: `fadeUp 0.6s ease ${delay}s both` })
  const stepsGuided = lang === 'de' ? stepsGuided_de : stepsGuided_en
  const stepsDirect = lang === 'de' ? stepsDirect_de : stepsDirect_en

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600&display=swap" rel="stylesheet" />

      {/* Hero */}
      <div style={{ padding: '56px 24px 40px', textAlign: 'center', ...fadeUp(0) }}>
        {/* Lang toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <div style={{ display: 'flex', background: C.surface2, borderRadius: '20px', padding: '3px', border: `1px solid ${C.border}` }}>
            {['de', 'en'].map(l => (
              <button key={l} onClick={() => setLang(l)} className="no-orange-card"
                style={{
                  padding: '5px 14px', borderRadius: '16px', border: 'none', cursor: 'pointer',
                  background: lang === l ? C.gold : 'transparent',
                  color: lang === l ? C.bg : C.textSub,
                  fontSize: '12px', fontWeight: lang === l ? '600' : '400',
                  transition: 'all 0.18s', fontFamily: "'Outfit', sans-serif",
                }}>
                {l === 'de' ? '🇩🇪 DE' : '🇬🇧 EN'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <MannaLogo fontSize={28} />
        </div>
        <p style={{ color: C.textSub, fontSize: '13px', letterSpacing: '1px', marginBottom: '6px', textAlign: 'center' }}>
          {L.tagline}
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '36px' }}>
          <button onClick={onStartGuided} className="no-orange-card"
            style={{
              background: C.gold, color: C.bg, border: 'none',
              borderRadius: '14px', padding: '16px 24px',
              fontSize: '15px', fontWeight: '600', cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif",
            }}>
            {L.btn_guided}
          </button>
          <button onClick={onStartDirect} className="no-orange-card"
            style={{
              background: C.surface, color: C.text,
              border: `1.5px solid ${C.border}`,
              borderRadius: '14px', padding: '16px 24px',
              fontSize: '15px', fontWeight: '400', cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif",
            }}>
            {L.btn_direct}
          </button>
        </div>
        <p style={{ color: C.textDim, fontSize: '12px', marginTop: '16px', letterSpacing: '0.5px' }}>
          {L.no_signup}
        </p>
      </div>

      <div style={{ margin: '0 24px', height: '1px', background: C.border }} />

      {/* Preview */}
      <div style={{ padding: '40px 24px', ...fadeUp(0.15) }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', color: C.goldDim, textTransform: 'uppercase', marginBottom: '20px', textAlign: 'center' }}>
          Preview
        </p>
        <div style={{ background: C.surface, borderRadius: '20px', padding: '20px', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <span style={{ fontSize: '13px', fontWeight: '400', color: C.text }}>{L.preview_label}</span>
            <span style={{ fontSize: '10px', color: C.goldDim, letterSpacing: '1px', border: `1px solid ${C.border}`, borderRadius: '8px', padding: '3px 8px' }}>
              Mitte · Date
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { icon: '🍽️', name: 'Lutter & Wegner', sub: '⭐ 4.6 · Deutsch · 180m' },
              { icon: '☕', name: 'Roamers', sub: '⭐ 4.7 · Café · 420m' },
            ].map((p, i) => (
              <div key={i}>
                <div style={{
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px',
                  background: C.surface2, borderRadius: '12px', padding: '12px',
                  border: `1px solid ${C.border}`,
                }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: C.border, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px', flexShrink: 0,
                  }}>{p.icon}</div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontWeight: '400', fontSize: '14px', color: C.text }}>{p.name}</p>
                    <p style={{ color: C.goldDim, fontSize: '11px', marginTop: '2px' }}>{p.sub}</p>
                  </div>
                </div>
                {i === 0 && (
                  <p style={{ textAlign: 'center', color: C.textDim, fontSize: '11px', padding: '8px 0', letterSpacing: '1px' }}>
                    · · · {lang === 'de' ? 'zu Fuß 8 min' : 'walk 8 min'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ margin: '0 24px', height: '1px', background: C.border }} />

      {/* Features */}
      <div style={{ padding: '40px 24px', ...fadeUp(0.2) }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', color: C.goldDim, textTransform: 'uppercase', marginBottom: '6px', textAlign: 'center' }}>
          Features
        </p>
        <h2 style={{ fontSize: '20px', fontWeight: '300', color: C.text, marginBottom: '24px', letterSpacing: '-0.3px', textAlign: 'center' }}>
          {L.features_title}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: C.surface, borderRadius: '16px', padding: '18px 14px',
              border: `1px solid ${C.border}`, textAlign: 'center',
            }}>
              <div style={{ fontSize: '18px', color: C.goldDim, marginBottom: '10px' }}>{f.icon}</div>
              <p style={{ fontWeight: '400', fontSize: '13px', color: C.text, marginBottom: '4px' }}>
                {lang === 'de' ? f.title_de : f.title_en}
              </p>
              <p style={{ color: C.textSub, fontSize: '11px', lineHeight: '1.6', fontWeight: '300' }}>
                {lang === 'de' ? f.desc_de : f.desc_en}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ margin: '0 24px', height: '1px', background: C.border }} />

      {/* How it works */}
      <div style={{ padding: '40px 24px', ...fadeUp(0.25) }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', color: C.goldDim, textTransform: 'uppercase', marginBottom: '6px', textAlign: 'center' }}>
          How it works
        </p>
        <h2 style={{ fontSize: '20px', fontWeight: '300', color: C.text, marginBottom: '28px', letterSpacing: '-0.3px', textAlign: 'center' }}>
          {L.howto_title}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { steps: stepsGuided, label: L.howto_guided, color: C.gold },
            { steps: stepsDirect, label: L.howto_direct, color: C.goldDim },
          ].map(({ steps, label, color }, gi) => (
            <div key={gi} style={{ background: C.surface2, borderRadius: '16px', padding: '20px 16px', border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '16px' }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: color }} />
                <p style={{ fontSize: '11px', fontWeight: '600', color, letterSpacing: '0.5px' }}>{label}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {steps.map((s, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2px' }}>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 200, fontSize: '10px', color: i === steps.length - 1 ? color : C.textDim, letterSpacing: '1px' }}>{s.num}</span>
                    <p style={{ fontWeight: '400', fontSize: '13px', color: C.text, lineHeight: 1.3 }}>{s.label}</p>
                    <p style={{ color: C.textSub, fontSize: '11px', fontWeight: '300', lineHeight: 1.4 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: '0 24px 60px', ...fadeUp(0.3) }}>
        <div style={{ background: C.surface, borderRadius: '20px', padding: '32px 24px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <MannaLogo fontSize={22} />
          </div>
          <p style={{ color: C.textSub, fontSize: '13px', marginBottom: '24px', lineHeight: '1.6', fontWeight: '300' }}>
            {lang === 'de' ? 'Plane deinen perfekten Abend in Deutschland' : 'Plan your perfect evening in Germany'}
          </p>
          <button onClick={onStartGuided} className="no-orange-card"
            style={{
              background: C.gold, color: C.bg, border: 'none',
              borderRadius: '14px', padding: '15px 32px',
              fontSize: '15px', fontWeight: '600', cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif",
            }}>
            {L.btn_guided}
          </button>
        </div>
      </div>
    </div>
  )
}
