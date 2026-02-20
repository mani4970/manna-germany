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

function getTypeLabel(type) {
  const map = {
    restaurant: '🍽️', cafe: '☕', bar: '🍺', bakery: '🥐',
    food: '🍴', meal_takeaway: '🥡', night_club: '🎵',
  }
  return map[type] || ''
}

export default function FinalCourse({ selections, lang, L, onRestart, onBack, directInputOrder }) {
  const mapRef = useRef(null)
  const [walkingTimes, setWalkingTimes] = useState([])
  const [nearestStation, setNearestStation] = useState(null)
  const [linkCopied, setLinkCopied] = useState(false)

  const { restaurant, cafe, cafe2, hotspot, city, occasion, courseOrder = [] } = selections

  const orderedPlaces = directInputOrder
    ? directInputOrder.map(t => {
        if (t === 'restaurant') return restaurant
        if (t === 'cafe') return cafe
        if (t === 'bar') return cafe2
        return null
      }).filter(Boolean)
    : courseOrder.map(t => {
        if (t === 'restaurant') return restaurant
        if (t === 'cafe') return cafe
        if (t === 'bar') return cafe2
        return null
      }).filter(Boolean)

  const orderedIcons = orderedPlaces.map(p => {
    const t = p?.primaryType || ''
    if (t.includes('cafe') || t.includes('bakery')) return '☕'
    if (t.includes('bar') || t.includes('night')) return '🍺'
    return '🍽️'
  })

  useEffect(() => {
    // Walking times between places
    const times = []
    for (let i = 0; i < orderedPlaces.length - 1; i++) {
      const a = orderedPlaces[i], b = orderedPlaces[i+1]
      if (a?.lat && b?.lat) {
        const dist = haversineDistance(a.lat, a.lng, b.lat, b.lng)
        if (dist) times.push({ dist, mins: Math.round(dist / 80) })
        else times.push(null)
      } else times.push(null)
    }
    setWalkingTimes(times)

    // Google Maps (no Kakao)
    const initMap = () => {
      if (!mapRef.current || !window.google) return
      const places = orderedPlaces.filter(p => p?.lat)
      if (!places.length) return
      const center = { lat: places[0].lat, lng: places[0].lng }
      const map = new window.google.maps.Map(mapRef.current, {
        center, zoom: 14,
        mapTypeControl: false, streetViewControl: false,
        styles: [{ featureType: 'poi', stylers: [{ visibility: 'off' }] }]
      })
      places.forEach((p, i) => {
        new window.google.maps.Marker({
          position: { lat: p.lat, lng: p.lng },
          map,
          label: { text: String(i+1), color: '#fff', fontWeight: 'bold' },
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 14,
            fillColor: C.gold,
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 2,
          }
        })
      })
    }
    const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (window.google?.maps) {
      initMap()
    } else if (mapsKey) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${mapsKey}`
      script.onload = initMap
      document.head.appendChild(script)
    }

    // Nearest transit station
    const firstPlace = orderedPlaces[0]
    if (firstPlace?.lat && firstPlace?.lng) {
      fetch(`/api/places/search?type=subway&lat=${firstPlace.lat}&lng=${firstPlace.lng}`)
        .then(r => r.json())
        .then(data => { if (data.station) setNearestStation(data.station) })
        .catch(() => {})
    }
  }, [])

  // Share functions
  const shareUrl = window.location.href

  const shareWhatsApp = () => {
    const names = orderedPlaces.map((p, i) => `${i+1}. ${p.name}`).join('\n')
    const cityName = lang === 'de' ? city?.name_de : city?.name_en
    const text = `🍽️ Manna ${cityName} Tour\n${hotspot ? (lang === 'de' ? hotspot.name_de : hotspot.name_en) || hotspot.name : ''}\n\n${names}\n\n${shareUrl}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2500)
    })
  }

  const spotName = lang === 'de' ? hotspot?.name_de : hotspot?.name_en
  const cityName = lang === 'de' ? city?.name_de : city?.name_en

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: "'Outfit', sans-serif", paddingBottom: '40px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ padding: '0 24px', paddingTop: '48px', paddingBottom: '28px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <MannaDots size={8} />
        </div>
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '20px' }}>
          {[1,2,3,4,5,6,7].map(i => (
            <div key={i} style={{ flex: 1, maxWidth: '32px', height: '2px', borderRadius: '2px', background: C.gold }} />
          ))}
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: '300', color: C.text, letterSpacing: '-0.3px' }}>
          {L.course_done}
        </h1>
        <p style={{ color: C.textSub, fontSize: '13px', marginTop: '6px', fontWeight: '300' }}>
          {cityName && `📍 ${cityName}`}{spotName && ` · ${spotName}`}{occasion && ` · ${occasion}`}
        </p>
      </div>

      {/* Map */}
      <div style={{ padding: '0 24px', marginBottom: '12px' }}>
        <div ref={mapRef} style={{
          width: '100%', height: '240px', borderRadius: '14px',
          border: `1px solid ${C.border}`, background: C.surface2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: C.textDim, fontSize: '13px',
        }}>
          Loading map...
        </div>
      </div>

      {/* Nearest Station */}
      {nearestStation && (
        <div style={{ padding: '0 24px', marginBottom: '12px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '12px', padding: '12px 16px',
          }}>
            <span style={{ fontSize: '20px' }}>🚇</span>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '14px', color: C.text, fontWeight: '400' }}>{nearestStation.name}</span>
              <span style={{ fontSize: '12px', color: C.textSub, marginLeft: '6px', fontWeight: '300' }}>{L.subway_hint}</span>
            </div>
            {nearestStation.distanceMeters && (
              <span style={{
                fontSize: '12px', color: C.gold, fontWeight: '600',
                background: C.surface2, borderRadius: '8px', padding: '3px 10px',
                border: `1px solid ${C.border}`,
              }}>
                {nearestStation.distanceMeters < 1000
                  ? nearestStation.distanceMeters + 'm'
                  : (nearestStation.distanceMeters / 1000).toFixed(1) + 'km'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Places */}
      <div style={{ padding: '0 24px', marginBottom: '24px' }}>
        <div style={{ background: C.surface, borderRadius: '16px', padding: '20px', border: `1px solid ${C.border}` }}>
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
                  {place.photoUrl
                    ? <img src={place.photoUrl} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '28px' }}>{orderedIcons[idx]}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '400', color: C.text, fontSize: '15px' }}>{place.name}</p>
                  {getTypeLabel(place.primaryType) && (
                    <span style={{
                      display: 'inline-block', background: C.surface2,
                      borderRadius: '6px', padding: '2px 8px',
                      fontSize: '11px', color: C.textSub, marginTop: '2px',
                      border: `1px solid ${C.border}`,
                    }}>{getTypeLabel(place.primaryType)}</span>
                  )}
                  <p style={{ color: C.textSub, fontSize: '12px', marginTop: '4px', fontWeight: '300' }}>
                    {place.address?.split(',').slice(0, 2).join(',')}
                  </p>
                  {place.rating && (
                    <p style={{ color: C.goldDim, fontSize: '12px', marginTop: '2px' }}>
                      ⭐ {place.rating} ({place.userRatingsTotal?.toLocaleString()})
                    </p>
                  )}
                </div>
                {/* Google Maps link */}
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.placeId}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    background: '#4285F4', color: 'white',
                    borderRadius: '8px', padding: '6px 10px',
                    fontSize: '11px', fontWeight: '600',
                    textDecoration: 'none', flexShrink: 0,
                  }}>
                  {L.map_btn}
                </a>
              </div>
              {idx < orderedPlaces.length - 1 && walkingTimes[idx] && (
                <div style={{ textAlign: 'center', color: C.textDim, fontSize: '11px', padding: '12px 0', letterSpacing: '0.5px' }}>
                  · · · {L.walk} {walkingTimes[idx].mins}min ({walkingTimes[idx].dist}m)
                </div>
              )}
              {idx < orderedPlaces.length - 1 && !walkingTimes[idx] && (
                <div style={{ height: '1px', background: C.border, margin: '16px 0' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Share buttons */}
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        <button onClick={shareWhatsApp} className="no-orange-card"
          style={{
            background: '#25D366', color: 'white',
            border: 'none', borderRadius: '14px', padding: '15px',
            fontSize: '15px', fontWeight: '600', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
          <span style={{ fontSize: '18px' }}>💬</span>
          {L.share_whatsapp}
        </button>
        <button onClick={copyLink} className="no-orange-card"
          style={{
            background: linkCopied ? C.surface2 : C.surface,
            color: linkCopied ? C.gold : C.text,
            border: `1.5px solid ${linkCopied ? C.gold : C.border}`,
            borderRadius: '14px', padding: '15px',
            fontSize: '15px', fontWeight: '400', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'all 0.2s',
          }}>
          <span style={{ fontSize: '18px' }}>{linkCopied ? '✓' : '🔗'}</span>
          {linkCopied ? L.link_copied : L.copy_link}
        </button>
      </div>

      {/* New course */}
      <div style={{ padding: '0 24px' }}>
        <button onClick={onRestart} className="no-orange-card"
          style={{
            width: '100%', background: C.gold, color: C.bg,
            border: 'none', borderRadius: '14px', padding: '16px',
            fontSize: '15px', fontWeight: '600', cursor: 'pointer',
          }}>
          {L.new_course}
        </button>
      </div>
    </div>
  )
}
