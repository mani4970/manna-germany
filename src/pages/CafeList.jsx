import { useState, useEffect } from 'react'
import { getTypeLabel } from '../placeTypes'
import { C } from './LandingPage'

function StarRating({ rating }) {
  if (!rating) return <span style={{ color: C.textDim, fontSize: '12px' }}>평점 없음</span>
  return (
    <span style={{ fontSize: '12px', color: C.goldDim }}>
      ⭐ <span style={{ fontWeight: '600' }}>{rating.toFixed(1)}</span>
    </span>
  )
}

function PriceLevel({ level }) {
  if (!level) return null
  return (
    <span style={{ fontSize: '12px' }}>
      <span style={{ color: C.gold, fontWeight: '600' }}>{'₩'.repeat(level)}</span>
      <span style={{ color: C.border }}>{'₩'.repeat(4 - level)}</span>
    </span>
  )
}

function haversineMeters(lat1, lon1, lat2, lon2) {
  const toRad = x => (x * Math.PI) / 180
  const R = 6371000
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2
  return 2 * R * Math.asin(Math.sqrt(a))
}

export default function CafeList({ selections, onNext, onBack, type = 'cafe', referencePoint }) {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('rating')
  const basePoint = referencePoint || selections.hotspot

  useEffect(() => {
    if (!basePoint) return
    setLoading(true); setError(null)
    const cuisineParam = type === 'cafe'
      ? (selections.cafeCuisine && selections.cafeCuisine !== 'all' ? '&cuisine=' + selections.cafeCuisine : '')
      : (selections.barCuisine && selections.barCuisine !== 'all' ? '&cuisine=' + selections.barCuisine : '')
    fetch('/api/places/search?type=' + type + '&lat=' + basePoint.lat + '&lng=' + basePoint.lng + '&radius=1000' + cuisineParam)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setPlaces((data.places || []).map(p => ({
          ...p,
          distanceMeters: (p.lat && p.lng) ? Math.round(haversineMeters(basePoint.lat, basePoint.lng, p.lat, p.lng)) : p.distanceMeters
        })))
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [basePoint, type])

  const sortedPlaces = [...places].sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
    if (sortBy === 'reviews') return (b.userRatingsTotal || 0) - (a.userRatingsTotal || 0)
    if (sortBy === 'distance') return (a.distanceMeters || 9999) - (b.distanceMeters || 9999)
    return 0
  })

  const typeLabel = type === 'bar' ? '바/술집' : '카페'
  const typeEmoji = type === 'bar' ? '🍺' : '☕'
  const sortBtns = [['rating', '별점순'], ['reviews', '리뷰순'], ['distance', '거리순']]

  return (
    <div style={{ paddingBottom: '40px', background: C.bg, minHeight: '100vh', fontFamily: "'Outfit', 'Noto Sans KR', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600&family=Noto+Sans+KR:wght@300;400;700&display=swap" rel="stylesheet" />
      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ paddingTop: '20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ flex: 1, height: '2px', borderRadius: '2px', background: C.gold }} />
            ))}
          </div>

          <button onClick={onBack} style={{
            background: 'none', border: 'none', color: C.textSub,
            fontSize: '14px', cursor: 'pointer', padding: '0 0 14px 0',
            display: 'flex', alignItems: 'center', gap: '4px',
            fontFamily: "'Outfit', sans-serif",
          }}>← 이전으로</button>

          <h1 style={{ fontSize: '22px', fontWeight: '300', color: C.text, letterSpacing: '-0.3px' }}>
            {typeEmoji} {typeLabel} 선택
          </h1>

          <div style={{
            background: C.surface2, borderRadius: '12px',
            padding: '12px 16px', marginTop: '12px', border: `1px solid ${C.border}`,
          }}>
            <p style={{ color: C.textSub, fontSize: '11px', marginBottom: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {referencePoint ? '선택한 장소' : '선택한 지역'}
            </p>
            <p style={{ color: C.gold, fontWeight: '400', fontSize: '15px' }}>
              {referencePoint ? referencePoint.name : basePoint?.name}
            </p>
            <p style={{ color: C.textSub, fontSize: '12px', marginTop: '4px', fontWeight: '300' }}>
              📍 근처 1km 이내 {typeLabel} 추천
            </p>
          </div>

          {!loading && places.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', borderBottom: `1px solid ${C.border}`, paddingBottom: '12px' }}>
              {sortBtns.map(([val, label]) => (
                <button key={val} onClick={() => setSortBy(val)} className="no-orange-card" style={{
                  background: sortBy === val ? C.surface2 : 'transparent',
                  color: sortBy === val ? C.gold : C.textSub,
                  border: sortBy === val ? `1px solid ${C.border}` : '1px solid transparent',
                  borderRadius: '8px', padding: '6px 12px',
                  fontSize: '12px', fontWeight: sortBy === val ? '600' : '400',
                  cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
                }}>{label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '16px 24px 0' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: C.textSub }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{typeEmoji}</div>
            <p style={{ fontWeight: '300' }}>근처 {typeLabel} 찾는 중...</p>
          </div>
        )}
        {error && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: C.textSub }}>
            <p style={{ fontWeight: '300' }}>장소를 불러오지 못했어요</p>
          </div>
        )}
        {!loading && !error && places.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: C.textSub }}>
            <p style={{ fontWeight: '300' }}>근처에 {typeLabel}가 없어요</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sortedPlaces.map((place, idx) => (
            <button key={place.placeId} onClick={() => onNext(place)} className="no-orange-card"
              style={{
                textAlign: 'left', padding: '14px', borderRadius: '14px',
                border: `1.5px solid ${C.border}`, background: C.surface,
                cursor: 'pointer', width: '100%', transition: 'all 0.18s',
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '68px', height: '68px', borderRadius: '10px',
                  overflow: 'hidden', flexShrink: 0,
                  background: C.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {place.photoUrl ? (
                    <img src={place.photoUrl} alt={place.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.style.display = 'none' }} />
                  ) : <span style={{ fontSize: '26px' }}>{typeEmoji}</span>}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{
                      background: idx < 3 ? C.gold : C.surface2,
                      color: idx < 3 ? C.bg : C.textSub,
                      borderRadius: '6px', padding: '1px 6px',
                      fontSize: '10px', fontWeight: '600', flexShrink: 0,
                    }}>{idx + 1}위</span>
                    <span style={{
                      fontWeight: '400', fontSize: '15px', color: C.text,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{place.name}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <StarRating rating={place.rating} />
                    {place.userRatingsTotal && (
                      <span style={{ color: C.textSub, fontSize: '11px' }}>({place.userRatingsTotal.toLocaleString()})</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    {getTypeLabel(place.primaryType) && (
                      <span style={{ background: C.surface2, borderRadius: '6px', padding: '2px 6px', fontSize: '11px', color: C.textSub, border: `1px solid ${C.border}` }}>
                        {getTypeLabel(place.primaryType)}
                      </span>
                    )}
                    <PriceLevel level={place.priceLevel} />
                    {place.distanceMeters && (
                      <span style={{ background: C.surface2, borderRadius: '6px', padding: '2px 6px', fontSize: '11px', color: C.textSub, border: `1px solid ${C.border}` }}>
                        🚶 {place.distanceMeters < 1000 ? place.distanceMeters + 'm' : (place.distanceMeters/1000).toFixed(1) + 'km'}
                      </span>
                    )}
                  </div>
                </div>
                <span style={{ color: C.textDim, fontSize: '18px', flexShrink: 0 }}>›</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
