import { useEffect, useRef, useState } from 'react'
import { getTypeLabel } from '../placeTypes'
import { C, MannaDots } from './LandingPage'

export default function FinalCourse({ selections, onRestart, onBack, directInputOrder }) {
  const mapRef = useRef(null)
  const [walkingTimes, setWalkingTimes] = useState([])
  const [nearestStation, setNearestStation] = useState(null)

  useEffect(() => {
    function initMap() {
      const places = [selections.restaurant, selections.cafe, selections.cafe2].filter(Boolean)
      if (places.length === 0 || !mapRef.current) return

      const center = new window.kakao.maps.LatLng(places[0].lat, places[0].lng)
      const map = new window.kakao.maps.Map(mapRef.current, { center, level: 4 })

      const icons = ['🍽️', '☕', '🍺']
      places.forEach((place, idx) => {
        new window.kakao.maps.InfoWindow({
          content: '<div style="padding:6px 10px;font-size:13px;font-weight:700;color:#B89A6A">' + icons[idx] + ' ' + place.name + '</div>'
        }).open(map, new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(place.lat, place.lng), map,
        }))
      })

      const times = []
      for (let i = 0; i < places.length - 1; i++) {
        const p1 = places[i], p2 = places[i + 1]
        if (p1.lat && p1.lng && p2.lat && p2.lng) {
          const toRad = x => (x * Math.PI) / 180
          const R = 6371000
          const dLat = toRad(p2.lat - p1.lat), dLon = toRad(p2.lng - p1.lng)
          const a = Math.sin(dLat/2)**2 + Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) * Math.sin(dLon/2)**2
          const dist = Math.round(2 * R * Math.asin(Math.sqrt(a)))
          times.push({ minutes: Math.ceil(dist / 67), distance: dist < 1000 ? dist + 'm' : (dist / 1000).toFixed(1) + 'km' })
        } else {
          times.push(null)
        }
      }
      setWalkingTimes(times)

      const bounds = new window.kakao.maps.LatLngBounds()
      places.forEach(p => bounds.extend(new window.kakao.maps.LatLng(p.lat, p.lng)))
      map.setBounds(bounds)
    }

    if (window.kakao && window.kakao.maps) window.kakao.maps.load(initMap)

    // 첫 번째 장소 기준 가장 가까운 지하철역 검색
    const firstPlace = [selections.restaurant, selections.cafe, selections.cafe2].filter(Boolean)[0]
    if (firstPlace?.lat && firstPlace?.lng) {
      fetch(`/api/places/search?type=subway&lat=${firstPlace.lat}&lng=${firstPlace.lng}`)
        .then(r => r.json())
        .then(data => { if (data.station) setNearestStation(data.station) })
        .catch(() => {})
    }
  }, [])

  const { restaurant, cafe, cafe2, hotspot, occasion, courseOrder = [] } = selections
  const orderedPlaces = [], orderedIcons = []
  const orderToUse = directInputOrder && directInputOrder.length > 0 ? directInputOrder : courseOrder

  if (orderToUse.length > 0) {
    orderToUse.forEach(type => {
      if (type === 'restaurant' && restaurant && !orderedPlaces.includes(restaurant)) { orderedPlaces.push(restaurant); orderedIcons.push('🍽️') }
      else if (type === 'cafe' && cafe && !orderedPlaces.includes(cafe)) { orderedPlaces.push(cafe); orderedIcons.push('☕') }
      else if (type === 'bar') {
        const barPlace = cafe2 || cafe
        if (barPlace && !orderedPlaces.includes(barPlace)) { orderedPlaces.push(barPlace); orderedIcons.push('🍺') }
      }
    })
  }
  if (orderedPlaces.length === 0) {
    if (restaurant) { orderedPlaces.push(restaurant); orderedIcons.push('🍽️') }
    if (cafe) { orderedPlaces.push(cafe); orderedIcons.push('☕') }
    if (cafe2) { orderedPlaces.push(cafe2); orderedIcons.push('🍺') }
  }

  function handleKakaoShare() {
    if (!window.Kakao) return
    if (!window.Kakao.isInitialized()) window.Kakao.init('2785551c281261a2c8d7d214eaad05e8')
    const shareData = {
      h: hotspot?.name || '',
      r: restaurant ? { n: restaurant.name, x: Number(restaurant.lat.toFixed(4)), y: Number(restaurant.lng.toFixed(4)) } : null,
      c: cafe ? { n: cafe.name, x: Number(cafe.lat.toFixed(4)), y: Number(cafe.lng.toFixed(4)) } : null,
    }
    const shareUrl = 'https://manna-seoul.vercel.app?s=' + btoa(unescape(encodeURIComponent(JSON.stringify(shareData))))
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: (hotspot?.name || '서울') + ' 코스 🗺️',
        description: orderedPlaces.map((p, i) => orderedIcons[i] + ' ' + p.name).join('  →  '),
        imageUrl: 'https://manna-seoul.vercel.app/og-image.png',
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
      buttons: [{ title: '코스 보기 🗺️', link: { mobileWebUrl: shareUrl, webUrl: shareUrl } }],
    })
  }

  return (
    <div style={{ paddingBottom: '40px', background: C.bg, minHeight: '100vh', fontFamily: "'Outfit', 'Noto Sans KR', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600&family=Noto+Sans+KR:wght@300;400;700&display=swap" rel="stylesheet" />
      <div style={{ padding: '24px 24px 16px' }}>
        <div style={{ paddingTop: '20px' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
            {[1,2,3,4,5,6,7].map(i => (
              <div key={i} style={{ flex: 1, height: '2px', borderRadius: '2px', background: C.gold }} />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            {onBack && (
              <button onClick={onBack} style={{
                background: 'none', border: 'none', color: C.textSub,
                fontSize: '14px', cursor: 'pointer', padding: 0,
                fontFamily: "'Outfit', sans-serif",
              }}>← 이전으로</button>
            )}
            <button onClick={onRestart} style={{
              background: C.surface2, border: `1px solid ${C.border}`,
              borderRadius: '8px', padding: '6px 14px',
              fontSize: '13px', color: C.textSub, cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif",
            }}>🏠 처음으로</button>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
              <MannaDots size={8} />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '300', color: C.text, letterSpacing: '-0.3px' }}>
              코스 완성
            </h1>
            <p style={{ color: C.textSub, fontSize: '13px', marginTop: '6px', fontWeight: '300' }}>
              {hotspot?.name && `📍 ${hotspot.name}`}{occasion && ` · ${occasion}`}
            </p>

          </div>
        </div>
      </div>

      <div style={{ padding: '0 24px', marginBottom: '20px' }}>
        <div ref={mapRef} style={{
          width: '100%', height: '260px',
          borderRadius: '14px', border: `1px solid ${C.border}`,
          background: C.surface2,
        }} />
      </div>

      {nearestStation && (
        <div style={{ padding: '0 24px', marginBottom: '12px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '12px', padding: '12px 16px',
          }}>
            <span style={{ fontSize: '20px' }}>🚇</span>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <span style={{ fontSize: '14px', color: C.text, fontWeight: '400' }}>
                {nearestStation.name}
              </span>
              <span style={{ fontSize: '12px', color: C.textSub, marginLeft: '6px', fontWeight: '300' }}>
                에서 내리세요
              </span>
            </div>
            {nearestStation.distanceMeters && (
              <span style={{
                fontSize: '12px', color: C.gold, fontWeight: '600',
                background: C.surface2, borderRadius: '8px', padding: '3px 10px',
                border: `1px solid ${C.border}`, flexShrink: 0,
              }}>
                {nearestStation.distanceMeters < 1000
                  ? nearestStation.distanceMeters + 'm'
                  : (nearestStation.distanceMeters / 1000).toFixed(1) + 'km'}
              </span>
            )}
          </div>
        </div>
      )}

      <div style={{ padding: '0 24px', marginBottom: '24px' }}>
        <div style={{
          background: C.surface, borderRadius: '16px',
          padding: '20px', border: `1px solid ${C.border}`,
        }}>
          {orderedPlaces.map((place, idx) => (
            <div key={idx}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: C.gold, color: C.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: '600', flexShrink: 0,
                }}>{idx + 1}</div>

                <div style={{
                  width: '68px', height: '68px', borderRadius: '10px',
                  overflow: 'hidden', flexShrink: 0,
                  background: C.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {place.photoUrl ? (
                    <img src={place.photoUrl} alt={place.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.style.display = 'none' }} />
                  ) : <span style={{ fontSize: '28px' }}>{orderedIcons[idx]}</span>}
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '400', color: C.text, fontSize: '15px' }}>{place?.name}</p>
                  {getTypeLabel(place?.primaryType) && (
                    <span style={{
                      display: 'inline-block', background: C.surface2,
                      borderRadius: '6px', padding: '2px 8px',
                      fontSize: '11px', color: C.textSub, marginTop: '2px',
                      border: `1px solid ${C.border}`,
                    }}>{getTypeLabel(place?.primaryType)}</span>
                  )}
                  <p style={{ color: C.textSub, fontSize: '12px', marginTop: '4px', fontWeight: '300' }}>
                    {place?.address?.split(' ').slice(0, 3).join(' ')}
                  </p>
                  {place?.rating && (
                    <p style={{ color: C.goldDim, fontSize: '12px', marginTop: '2px' }}>
                      ⭐ {place.rating.toFixed(1)}
                      {place.userRatingsTotal && <span style={{ color: C.textSub }}> ({place.userRatingsTotal.toLocaleString()}개)</span>}
                    </p>
                  )}
                </div>

                {place?.kakaoMapUrl && (
                  <a href={place.kakaoMapUrl} target="_blank" rel="noopener noreferrer"
                    style={{
                      background: '#FEE500', borderRadius: '8px', padding: '6px 10px',
                      fontSize: '12px', fontWeight: '600', color: '#1a1a1a',
                      textDecoration: 'none', flexShrink: 0,
                    }}>지도</a>
                )}
              </div>

              {idx < orderedPlaces.length - 1 && walkingTimes[idx] && (
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                  <span style={{ color: C.textSub, fontSize: '12px', letterSpacing: '0.5px' }}>
                    · · · 🚶 도보
                  </span>
                  <span style={{
                    background: C.surface2, border: `1px solid ${C.border}`,
                    borderRadius: '20px', padding: '4px 12px',
                    fontSize: '12px', color: C.gold, fontWeight: '400', marginLeft: '8px',
                  }}>
                    약 {walkingTimes[idx].minutes}분
                    <span style={{ color: C.textSub, marginLeft: '4px' }}>({walkingTimes[idx].distance})</span>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 24px', marginBottom: '12px' }}>
        <button onClick={handleKakaoShare} style={{
          background: '#FEE500', color: '#1a1a1a', border: 'none',
          padding: '16px', borderRadius: '12px',
          fontSize: '15px', fontWeight: '600', cursor: 'pointer',
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '8px',
          fontFamily: "'Outfit', sans-serif",
          WebkitTapHighlightColor: 'transparent',
        }}>
          💬 카카오톡으로 공유하기
        </button>
      </div>

      <div style={{ padding: '0 24px' }}>
        <button onClick={onRestart} style={{
          background: C.gold, color: C.bg, border: 'none',
          padding: '16px', borderRadius: '12px',
          fontSize: '15px', fontWeight: '600', cursor: 'pointer',
          width: '100%', fontFamily: "'Outfit', sans-serif",
          WebkitTapHighlightColor: 'transparent',
        }}>
          새 코스 만들기 →
        </button>
      </div>
    </div>
  )
}
