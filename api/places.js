export const config = {
  runtime: 'edge',
}

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY

const CUISINE_TEXT = {
  german: 'deutsches Restaurant',
  italian: 'italienisches Restaurant',
  asian: 'asiatisches Restaurant',
  turkish: 'türkisches Restaurant',
  french: 'französisches Restaurant',
  american: 'amerikanisches Restaurant',
  mediterranean: 'mediterranes Restaurant',
}

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const lat = parseFloat(searchParams.get('lat'))
    const lng = parseFloat(searchParams.get('lng'))
    const radius = parseInt(searchParams.get('radius')) || 1000
    const query = searchParams.get('query')
    const cuisine = searchParams.get('cuisine')

    // 직접 검색
    if (query) {
      const searchQuery = query + ' 서울'
      
      const googleRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos,places.primaryType,places.priceLevel'
        },
        body: JSON.stringify({
          textQuery: searchQuery,
          languageCode: 'de',
          regionCode: 'DE',
          maxResultCount: 20,
        })
      })

      const data = await googleRes.json()
      const places = (data.places || []).map(p => ({
        placeId: p.id,
        name: p.displayName?.text || '',
        address: p.formattedAddress || '',
        lat: p.location?.latitude,
        lng: p.location?.longitude,
        rating: p.rating,
        userRatingsTotal: p.userRatingCount,
        photoUrl: p.photos?.[0] 
          ? `https://places.googleapis.com/v1/${p.photos[0].name}/media?key=${GOOGLE_API_KEY}&maxHeightPx=400`
          : null,
        primaryType: p.primaryType,
        priceLevel: p.priceLevel,
        googleMapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.displayName?.text || '')}&query_place_id=${p.id}`
      }))

      return new Response(JSON.stringify({ places }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 음식 카테고리가 있으면 searchText 사용
    if (type === 'restaurant' && cuisine && cuisine !== 'all' && CUISINE_TEXT[cuisine]) {
      const textQuery = CUISINE_TEXT[cuisine]
      
      const googleRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos,places.primaryType,places.priceLevel'
        },
        body: JSON.stringify({
          textQuery: textQuery,
          languageCode: 'de',
          regionCode: 'DE',
          maxResultCount: 20,
          locationBias: {
            circle: {
              center: { latitude: lat, longitude: lng },
              radius: radius
            }
          }
        })
      })

      const data = await googleRes.json()
      let places = (data.places || []).map(p => ({
        placeId: p.id,
        name: p.displayName?.text || '',
        address: p.formattedAddress || '',
        lat: p.location?.latitude,
        lng: p.location?.longitude,
        rating: p.rating,
        userRatingsTotal: p.userRatingCount,
        photoUrl: p.photos?.[0] 
          ? `https://places.googleapis.com/v1/${p.photos[0].name}/media?key=${GOOGLE_API_KEY}&maxHeightPx=400`
          : null,
        primaryType: p.primaryType,
        priceLevel: p.priceLevel,
        distanceMeters: haversineDistance(lat, lng, p.location?.latitude, p.location?.longitude),
        googleMapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.displayName?.text || '')}&query_place_id=${p.id}`
      }))

      // 반경 내만 필터
      places = places.filter(p => p.distanceMeters && p.distanceMeters <= radius)

      const sorted = places.sort((a, b) => {
        const aScore = (a.rating || 0) * Math.log10((a.userRatingsTotal || 0) + 10)
        const bScore = (b.rating || 0) * Math.log10((b.userRatingsTotal || 0) + 10)
        return bScore - aScore
      })

      return new Response(JSON.stringify({ places: sorted }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 지하철역 검색
    if (type === 'subway') {
      const googleRes = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.location'
        },
        body: JSON.stringify({
          includedTypes: ['subway_station'],
          locationRestriction: {
            circle: {
              center: { latitude: lat, longitude: lng },
              radius: 2000
            }
          },
          maxResultCount: 5,
          rankPreference: 'DISTANCE',
          languageCode: 'de',
          regionCode: 'DE'
        })
      })
      const data = await googleRes.json()
      const stations = (data.places || []).map(p => ({
        name: p.displayName?.text || '',
        lat: p.location?.latitude,
        lng: p.location?.longitude,
        distanceMeters: haversineDistance(lat, lng, p.location?.latitude, p.location?.longitude),
      }))
      const nearest = stations.sort((a, b) => (a.distanceMeters || 9999) - (b.distanceMeters || 9999))[0] || null
      return new Response(JSON.stringify({ station: nearest }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 카페/바 또는 전체 레스토랑 - searchNearby 사용
    const includedType = type === 'restaurant' ? 'restaurant' : (type === 'cafe' ? 'cafe' : 'bar')

    const googleRes = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos,places.primaryType,places.priceLevel'
      },
      body: JSON.stringify({
        includedTypes: [includedType],
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: radius
          }
        },
        maxResultCount: 20,
        rankPreference: 'POPULARITY',
        languageCode: 'de',
        regionCode: 'DE'
      })
    })

    const data = await googleRes.json()
    
    const places = (data.places || []).map(p => ({
      placeId: p.id,
      name: p.displayName?.text || '',
      address: p.formattedAddress || '',
      lat: p.location?.latitude,
      lng: p.location?.longitude,
      rating: p.rating,
      userRatingsTotal: p.userRatingCount,
      photoUrl: p.photos?.[0] 
        ? `https://places.googleapis.com/v1/${p.photos[0].name}/media?key=${GOOGLE_API_KEY}&maxHeightPx=400`
        : null,
      primaryType: p.primaryType,
      priceLevel: p.priceLevel,
      distanceMeters: haversineDistance(lat, lng, p.location?.latitude, p.location?.longitude),
      googleMapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.displayName?.text || '')}&query_place_id=${p.id}`
    }))

    const sorted = places.sort((a, b) => {
      const aScore = (a.rating || 0) * Math.log10((a.userRatingsTotal || 0) + 10)
      const bScore = (b.rating || 0) * Math.log10((b.userRatingsTotal || 0) + 10)
      return bScore - aScore
    })

    return new Response(JSON.stringify({ places: sorted }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Search error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null
  const toRad = x => (x * Math.PI) / 180
  const R = 6371000
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2
  return Math.round(2 * R * Math.asin(Math.sqrt(a)))
}
