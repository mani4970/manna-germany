import { useState, useEffect } from 'react'
import { C } from '../pages/LandingPage'

function haversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1||!lon1||!lat2||!lon2) return null
  const toRad = x => x*Math.PI/180, R=6371000
  const dLat=toRad(lat2-lat1), dLon=toRad(lon2-lon1)
  const a=Math.sin(dLat/2)**2+Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2
  return Math.round(2*R*Math.asin(Math.sqrt(a)))
}

export function priceLabel(level) {
  if (!level) return null
  return '€'.repeat(level)
}

function getServiceTags(p) {
  const tags = []
  if (p.servesBeer)           tags.push({ icon: '🍺', label: 'Bier' })
  if (p.servesWine)           tags.push({ icon: '🍷', label: 'Wein' })
  if (p.servesBrunch)         tags.push({ icon: '🥂', label: 'Brunch' })
  if (p.servesVegetarianFood) tags.push({ icon: '🌿', label: 'Vegetarisch' })
  if (p.outdoorSeating)       tags.push({ icon: '☀️', label: 'Terrasse' })
  if (p.reservable)           tags.push({ icon: '📅', label: 'Reservierung' })
  if (p.delivery)             tags.push({ icon: '🛵', label: 'Lieferung' })
  if (p.takeout)              tags.push({ icon: '🥡', label: 'Takeaway' })
  if (p.liveMusic)            tags.push({ icon: '🎵', label: 'Live Musik' })
  return tags
}

function getVibeTag(p) {
  if (p.rating >= 4.8 && (p.priceLevel || 0) >= 3) return { label: 'Fine Dining', color: '#C8A0E8' }
  if (p.rating >= 4.7) return { label: 'Top bewertet', color: '#A0C8E8' }
  if ((p.userRatingsTotal || 0) >= 2000) return { label: 'Sehr beliebt', color: '#A0E8C8' }
  if (p.priceLevel === 1) return { label: 'Günstig', color: '#A0E8B0' }
  if (p.priceLevel >= 3) return { label: 'Gehoben', color: '#E8C8A0' }
  if (p.outdoorSeating) return { label: 'Terrasse', color: '#E8E0A0' }
  return null
}

function getTodayHours(p) {
  if (!p.regularOpeningHours?.weekdayDescriptions) return null
  const days = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag']
  const today = days[new Date().getDay()]
  const entry = p.regularOpeningHours.weekdayDescriptions.find(d => d.startsWith(today))
  return entry ? entry.replace(today + ': ', '') : null
}

export function PlacePopup({ place, lang, L, onSelect, onClose }) {
  const [photoIdx, setPhotoIdx] = useState(0)
  const [details, setDetails] = useState(null)
  const photos = place.photos?.length ? place.photos : (place.photoUrl ? [place.photoUrl] : [])
  const vibe = getVibeTag(place)

  useEffect(() => {
    if (place.placeId) {
      fetch(`/api/places/search?action=detail&placeId=${place.placeId}`)
        .then(r => r.json())
        .then(d => setDetails(d.detail || null))
        .catch(() => {})
    }
  }, [place.placeId])

  const merged = details ? { ...place, ...details } : place
  const serviceTags = getServiceTags(merged)
  const todayHours = getTodayHours(merged)
  const priceRange = merged.priceRange
    ? `€${merged.priceRange.startPrice?.units || ''}–€${merged.priceRange.endPrice?.units || ''}`
    : null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(10,8,6,0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { transform:translateY(40px); opacity:0 } to { transform:translateY(0); opacity:1 } }
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Outfit:wght@300;400;500&display=swap');
        .popup-scroll::-webkit-scrollbar { display: none }
        .photo-dot:hover { transform: scale(1.4) }
      `}</style>

      <div
        onClick={e => e.stopPropagation()}
        className="popup-scroll"
        style={{
          background: C.bg,
          borderRadius: '24px 24px 0 0',
          width: '100%', maxWidth: '600px',
          maxHeight: '92vh',
          overflow: 'auto',
          animation: 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: '0 -20px 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* ── 사진 영역 ── */}
        <div style={{ position: 'relative', width: '100%', height: '300px', background: C.surface2, overflow: 'hidden' }}>
          {photos.length > 0 ? (
            <img
              src={photos[photoIdx]} alt={place.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }}
            />
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', color: C.textDim }}>🍽️</div>
          )}

          {/* 그라데이션 오버레이 */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 40%, rgba(0,0,0,0.5) 100%)',
          }} />

          {/* 닫기 버튼 */}
          <button onClick={onClose} className="no-orange-card" style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '50%', width: '36px', height: '36px',
            color: '#fff', fontSize: '14px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>

          {/* vibe 태그 */}
          {vibe && (
            <div style={{
              position: 'absolute', top: '16px', left: '16px',
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '20px', padding: '4px 12px',
              fontSize: '11px', color: '#fff', letterSpacing: '0.5px',
            }}>{vibe.label}</div>
          )}

          {/* 사진 인디케이터 */}
          {photos.length > 1 && (
            <div style={{
              position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: '6px',
            }}>
              {photos.map((_, i) => (
                <button key={i} onClick={() => setPhotoIdx(i)} className="photo-dot no-orange-card"
                  style={{
                    width: i === photoIdx ? '20px' : '6px', height: '6px',
                    borderRadius: '3px',
                    background: i === photoIdx ? '#fff' : 'rgba(255,255,255,0.5)',
                    border: 'none', padding: 0, cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }} />
              ))}
            </div>
          )}

          {/* 이름 오버레이 (사진 하단) */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 20px 20px' }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '24px', fontWeight: '400', color: '#fff',
              letterSpacing: '0.3px', lineHeight: 1.2, margin: 0,
              textShadow: '0 1px 8px rgba(0,0,0,0.4)',
            }}>{place.name}</h2>
          </div>
        </div>

        {/* ── 콘텐츠 영역 ── */}
        <div style={{ padding: '20px' }}>

          {/* 평점 · 가격 · 거리 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {place.rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: C.gold, fontSize: '14px' }}>★</span>
                <span style={{ fontSize: '14px', fontWeight: '400', color: C.text }}>{place.rating}</span>
                <span style={{ fontSize: '12px', color: C.textSub }}>({place.userRatingsTotal?.toLocaleString()})</span>
              </div>
            )}
            {(priceRange || place.priceLevel) && (
              <div style={{
                padding: '2px 10px', borderRadius: '20px',
                background: C.surface2, border: `1px solid ${C.border}`,
                fontSize: '12px', color: C.textSub,
              }}>
                {priceRange || priceLabel(place.priceLevel)}
              </div>
            )}
            {place.distanceMeters && (
              <div style={{ fontSize: '12px', color: C.textSub }}>
                📍 {place.distanceMeters}m · {Math.round(place.distanceMeters / 80)} min {L.walk}
              </div>
            )}
            {todayHours && (
              <div style={{ fontSize: '12px', color: C.textSub }}>
                🕐 {todayHours}
              </div>
            )}
          </div>

          {/* 구분선 */}
          <div style={{ height: '1px', background: C.border, margin: '16px 0' }} />

          {/* 서비스 태그 */}
          {serviceTags.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{
                fontSize: '10px', letterSpacing: '2px', color: C.textDim,
                textTransform: 'uppercase', marginBottom: '10px',
                fontFamily: "'Outfit', sans-serif",
              }}>Angebote</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {serviceTags.map((t, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '5px 12px', borderRadius: '20px',
                    background: C.surface, border: `1px solid ${C.border}`,
                    fontSize: '12px', color: C.text,
                  }}>
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 설명 */}
          {merged.editorialSummary && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{
                fontSize: '10px', letterSpacing: '2px', color: C.textDim,
                textTransform: 'uppercase', marginBottom: '8px',
              }}>Über das Lokal</p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '15px', color: C.text,
                lineHeight: 1.7, fontWeight: '400',
              }}>{merged.editorialSummary}</p>
            </div>
          )}

          {/* 리뷰 */}
          {merged.reviews?.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{
                fontSize: '10px', letterSpacing: '2px', color: C.textDim,
                textTransform: 'uppercase', marginBottom: '10px',
              }}>Gästestimmen</p>
              {merged.reviews.slice(0, 2).map((r, i) => (
                <div key={i} style={{
                  padding: '14px 16px', borderRadius: '14px',
                  background: C.surface, border: `1px solid ${C.border}`,
                  marginBottom: '8px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', color: C.gold }}>{'★'.repeat(r.rating || 5)}</span>
                    <span style={{ fontSize: '11px', color: C.textSub }}>{r.authorAttribution?.displayName || 'Gast'}</span>
                  </div>
                  <p style={{
                    fontSize: '13px', color: C.textSub, lineHeight: 1.6,
                    display: '-webkit-box', WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>{r.text?.text || r.originalText?.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* 주소 */}
          {place.address && (
            <p style={{ fontSize: '12px', color: C.textSub, marginBottom: '20px' }}>📍 {place.address}</p>
          )}

          {/* 버튼 */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} className="no-orange-card" style={{
              flex: 1, padding: '15px', borderRadius: '14px',
              border: `1.5px solid ${C.border}`, background: 'transparent',
              color: C.textSub, fontSize: '14px', cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif",
            }}>{L.close}</button>
            <button onClick={() => onSelect(place)} className="no-orange-card" style={{
              flex: 2.5, padding: '15px', borderRadius: '14px',
              border: 'none', background: C.gold, color: C.bg,
              fontSize: '14px', fontWeight: '500', cursor: 'pointer',
              letterSpacing: '0.3px', fontFamily: "'Outfit', sans-serif",
            }}>{L.select_place} →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
