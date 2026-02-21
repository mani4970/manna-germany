import { useState, useEffect, useRef } from 'react'
import { C, MannaDots } from './LandingPage'

function haversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null
  const toRad = x => (x * Math.PI) / 180
  const R = 6371000
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2
  return Math.round(2 * R * Math.asin(Math.sqrt(a)))
}

function getPlaceEmoji(type) {
  if (!type) return '🍽️'
  if (type.includes('cafe') || type.includes('bakery') || type.includes('coffee')) return '☕'
  if (type.includes('bar') || type.includes('night_club')) return '🍺'
  return '🍽️'
}

export default function FinalCourse({ selections, lang, L, onRestart, onBack, courseOrder = [], selectedPlaces = [] }) {
  const mapRef = useRef(null)
  const [walkingTimes, setWalkingTimes] = useState([])
  const [nearestStation, setNearestStation] = useState(null)
  const [linkCopied, setLinkCopied] = useState(false)

  const { hotspot, city } = selections

  // selectedPlaces 배열이 courseOrder 순서와 1:1 대응
  const orderedPlaces = selectedPlaces.filter(Boolean)

  useEffect(() => {
    if (orderedPlaces.length === 0) return

    // 장소 간 도보 시간 계산
    const times = []
    for (let i = 0; i < orderedPlaces.length - 1; i++) {
      const a = orderedPlaces[i], b = orderedPlaces[i+1]
      if (a?.lat && b?.lat) {
        const dist = haversineDistance(a.lat, a.lng, b.lat, b.lng)
        times.push(dist ? { dist, mins: Math.round(dist / 80) } : null)
      } else times.push(null)
    }
    setWalkingTimes(times)

    // Google Maps
    const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!mapsKey) return

    const initMap = () => {
      if (!mapRef.current || !window.google?.maps) return
      const places = orderedPlaces.filter(p => p?.lat)
      if (!places.length) return
      const center = { lat: places[0].lat, lng: places[0].lng }
      const map = new window.google.maps.Map(mapRef.current, {
        center, zoom: 14,
        mapTypeControl: false, streetViewControl: false,
        styles: [{ featureType: 'poi', stylers: [{ visibility: 'off' }] }]
      })
      places.forEach((p, i) => {
        // 커스텀 SVG 마커 (Marker deprecated 경고 없음)
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="14" fill="${C.gold}" stroke="white" stroke-width="2"/>
          <text x="16" y="21" text-anchor="middle" fill="white" font-size="13" font-weight="bold" font-family="sans-serif">${i+1}</text>
        </svg>`
        new window.google.maps.Marker({
          position: { lat: p.lat, lng: p.lng },
          map,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 16),
          }
        })
      })
    }

    if (window.google?.maps) {
      initMap()
    } else {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${mapsKey}`
      script.async = true
      script.defer = true
      script.onload = initMap
      document.head.appendChild(script)
    }

    // 가장 가까운 역 (첫 번째 장소 기준)
    const firstPlace = orderedPlaces[0]
    if (firstPlace?.lat && firstPlace?.lng) {
      fetch(`/api/places/search?type=subway&lat=${firstPlace.lat}&lng=${firstPlace.lng}`)
        .then(r => r.json())
        .then(data => { if (data.station) setNearestStation(data.station) })
        .catch(() => {})
    }
  }, [])

  const shareWhatsApp = () => {
    const names = orderedPlaces.map((p, i) => `${i+1}. ${p.name}`).join('\n')
    const cityName = lang === 'de' ? city?.name_de : city?.name_en
    const spotName = lang === 'de' ? hotspot?.name_de : hotspot?.name_en
    const text = `🍽️ Manna Tour\n${cityName ? cityName + ' · ' : ''}${spotName || ''}\n\n${names}\n\n${window.location.href}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2500)
    })
  }

  const spotName = lang === 'de' ? hotspot?.name_de : hotspot?.name_en
  const cityName = lang === 'de' ? city?.name_de : city?.name_en
  const walkLabel = lang === 'de' ? 'zu Fuß' : 'walk'
  const subwayHint = lang === 'de' ? 'Hier aussteigen' : 'Get off here'

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: "'Outfit', sans-serif", paddingBottom: '40px' }}>

      {/* 헤더 */}
      <div style={{ padding: '0 24px', paddingTop: '48px', paddingBottom: '28px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <MannaDots size={8} />
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: '300', color: C.text, letterSpacing: '-0.3px' }}>
          {L.course_done}
        </h1>
        <p style={{ color: C.textSub, fontSize: '13px', marginTop: '6px', fontWeight: '300' }}>
          {cityName && `📍 ${cityName}`}{spotName && ` · ${spotName}`}
        </p>
      </div>

      {/* 지도 */}
      <div style={{ padding: '0 24px', marginBottom: '12px' }}>
        <div ref={mapRef} style={{
          width: '100%', height: '220px', borderRadius: '14px',
          border: `1px solid ${C.border}`, background: C.surface2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: C.textDim, fontSize: '13px',
        }}>
          Loading map...
        </div>
      </div>

      {/* 가장 가까운 역 */}
      {nearestStation && (
        <div style={{ padding: '0 24px', marginBottom: '12px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', background:C.surface, border:`1px solid ${C.border}`, borderRadius:'12px', padding:'12px 16px' }}>
            <span style={{ fontSize:'20px' }}>🚇</span>
            <div style={{ flex:1 }}>
              <span style={{ fontSize:'14px', color:C.text, fontWeight:'400' }}>{nearestStation.name}</span>
              <span style={{ fontSize:'12px', color:C.textSub, marginLeft:'6px' }}>{subwayHint}</span>
            </div>
            {nearestStation.distanceMeters && (
              <span style={{ fontSize:'12px', color:C.gold, fontWeight:'600', background:C.surface2, borderRadius:'8px', padding:'3px 10px', border:`1px solid ${C.border}` }}>
                {nearestStation.distanceMeters < 1000
                  ? nearestStation.distanceMeters + 'm'
                  : (nearestStation.distanceMeters / 1000).toFixed(1) + 'km'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 장소 리스트 */}
      <div style={{ padding: '0 24px', marginBottom: '24px' }}>
        <div style={{ background: C.surface, borderRadius: '16px', padding: '20px', border: `1px solid ${C.border}` }}>
          {orderedPlaces.map((place, idx) => (
            <div key={idx}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                {/* 번호 */}
                <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:C.gold, color:C.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'600', flexShrink:0 }}>
                  {idx + 1}
                </div>
                {/* 사진 */}
                <div style={{ width:'68px', height:'68px', borderRadius:'10px', overflow:'hidden', flexShrink:0, background:C.surface2, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {place.photoUrl
                    ? <img src={place.photoUrl} alt={place.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    : <span style={{ fontSize:'28px' }}>{getPlaceEmoji(place.primaryType)}</span>
                  }
                </div>
                {/* 정보 */}
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:'400', color:C.text, fontSize:'15px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{place.name}</p>
                  <p style={{ color:C.textSub, fontSize:'12px', marginTop:'2px', fontWeight:'300', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                    {place.address?.split(',').slice(0, 2).join(',')}
                  </p>
                  {place.rating && (
                    <p style={{ color:C.goldDim, fontSize:'12px', marginTop:'2px' }}>
                      ⭐ {place.rating} ({place.userRatingsTotal?.toLocaleString()})
                    </p>
                  )}
                </div>
                {/* 지도 버튼 */}
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.placeId}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ background:'#4285F4', color:'white', borderRadius:'8px', padding:'6px 10px', fontSize:'11px', fontWeight:'600', textDecoration:'none', flexShrink:0 }}>
                  {lang === 'de' ? 'Karte' : 'Map'}
                </a>
              </div>

              {/* 장소 간 도보 */}
              {idx < orderedPlaces.length - 1 && (
                <div style={{ textAlign:'center', color:C.textDim, fontSize:'11px', padding:'12px 0', letterSpacing:'0.5px' }}>
                  {walkingTimes[idx]
                    ? `· · · ${walkLabel} ${walkingTimes[idx].mins}min (${walkingTimes[idx].dist}m)`
                    : <div style={{ height:'1px', background:C.border, margin:'4px 0' }} />
                  }
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 공유 버튼 */}
      <div style={{ padding:'0 24px', display:'flex', flexDirection:'column', gap:'10px', marginBottom:'16px' }}>
        <button onClick={shareWhatsApp} className="no-orange-card"
          style={{ background:'#25D366', color:'white', border:'none', borderRadius:'14px', padding:'15px', fontSize:'15px', fontWeight:'600', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
          <span style={{ fontSize:'18px' }}>💬</span>
          {L.share_whatsapp}
        </button>
        <button onClick={copyLink} className="no-orange-card"
          style={{ background: linkCopied ? C.surface2 : C.surface, color: linkCopied ? C.gold : C.text, border:`1.5px solid ${linkCopied ? C.gold : C.border}`, borderRadius:'14px', padding:'15px', fontSize:'15px', fontWeight:'400', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', transition:'all 0.2s' }}>
          <span style={{ fontSize:'18px' }}>{linkCopied ? '✓' : '🔗'}</span>
          {linkCopied ? L.link_copied : L.copy_link}
        </button>
      </div>

      {/* 새 투어 */}
      <div style={{ padding:'0 24px' }}>
        <button onClick={onRestart} className="no-orange-card"
          style={{ width:'100%', background:C.gold, color:C.bg, border:'none', borderRadius:'14px', padding:'16px', fontSize:'15px', fontWeight:'600', cursor:'pointer' }}>
          {L.new_course}
        </button>
      </div>
    </div>
  )
}
