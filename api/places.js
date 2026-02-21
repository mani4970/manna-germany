export const config = {
  runtime: 'edge',
}

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY

function haversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null
  const toRad = x => (x * Math.PI) / 180
  const R = 6371000
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2
  return Math.round(2 * R * Math.asin(Math.sqrt(a)))
}

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const lat = parseFloat(searchParams.get('lat'))
    const lng = parseFloat(searchParams.get('lng'))
    const radius = parseInt(searchParams.get('radius')) || 1000
    const query = searchParams.get('query')

    // ── 직접 검색 ──────────────────────────────────────────
    if (query) {
      const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos,places.primaryType',
        },
        body: JSON.stringify({
          textQuery: query,
          languageCode: 'de',
          regionCode: 'DE',
          maxResultCount: 10,
        }),
      })
      const data = await res.json()
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
      }))
      return new Response(JSON.stringify({ places }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // ── lat/lng 없으면 에러 ────────────────────────────────
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      return new Response(JSON.stringify({ places: [], error: 'lat/lng required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      })
    }

    // ── 대중교통역 검색 ────────────────────────────────────
    if (type === 'subway') {
      const res = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.location',
        },
        body: JSON.stringify({
          includedTypes: ['subway_station', 'train_station', 'light_rail_station'],
          locationRestriction: {
            circle: { center: { latitude: lat, longitude: lng }, radius: 2000 },
          },
          maxResultCount: 5,
          rankPreference: 'DISTANCE',
          languageCode: 'de',
          regionCode: 'DE',
        }),
      })
      const data = await res.json()
      const stations = (data.places || []).map(p => ({
        name: p.displayName?.text || '',
        lat: p.location?.latitude,
        lng: p.location?.longitude,
        distanceMeters: haversineDistance(lat, lng, p.location?.latitude, p.location?.longitude),
      }))
      const nearest = stations.sort((a, b) => (a.distanceMeters || 9999) - (b.distanceMeters || 9999))[0] || null
      return new Response(JSON.stringify({ station: nearest }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // ── 장소 검색 (restaurant / cafe / bar) ───────────────
    // cuisine 파라미터로 includedTypes 세분화
    const cuisine = searchParams.get('cuisine')
    const cuisineTypeMap = {
      // Restaurant
      german:        ['restaurant'],
      italian:       ['italian_restaurant'],
      asian:         ['chinese_restaurant', 'japanese_restaurant', 'asian_restaurant', 'ramen_restaurant'],
      turkish:       ['turkish_restaurant'],
      french:        ['french_restaurant'],
      american:      ['american_restaurant', 'hamburger_restaurant'],
      mediterranean: ['mediterranean_restaurant', 'greek_restaurant'],
      steakhouse:    ['steak_house'],
      seafood:       ['seafood_restaurant'],
      vegetarian:    ['vegan_restaurant', 'vegetarian_restaurant'],
      pizza:         ['pizza_restaurant'],
      // Cafe
      specialty:     ['coffee_shop', 'cafe'],
      bakery:        ['bakery'],
      brunch:        ['brunch_restaurant', 'breakfast_restaurant'],
      kuchen:        ['bakery', 'dessert_shop', 'cafe'],
      // Bar
      cocktail:      ['bar', 'cocktail_bar'],
      wine:          ['wine_bar'],
      craft_beer:    ['bar'],
      biergarten:    ['bar'],
      rooftop:       ['bar', 'rooftop_bar'],
    }
    const typeMap = {
      restaurant: ['restaurant'],
      cafe: ['cafe', 'coffee_shop', 'bakery'],
      bar: ['bar', 'night_club'],
    }
    const includedTypes = (cuisine && cuisine !== 'all' && cuisineTypeMap[cuisine])
      ? cuisineTypeMap[cuisine]
      : (typeMap[type] || ['restaurant'])

    const res = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos,places.primaryType,places.priceLevel',
      },
      body: JSON.stringify({
        includedTypes,
        locationRestriction: {
          circle: { center: { latitude: lat, longitude: lng }, radius },
        },
        maxResultCount: 20,
        rankPreference: 'POPULARITY',
        languageCode: 'de',
        regionCode: 'DE',
      }),
    })

    const data = await res.json()
    const places = (data.places || []).map(p => {
      const dist = haversineDistance(lat, lng, p.location?.latitude, p.location?.longitude)
      return {
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
        distanceMeters: dist,
        googleMapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.displayName?.text || '')}&query_place_id=${p.id}`,
      }
    })

    // 반경 밖 결과 완전 제거
    const filtered = places.filter(p => p.distanceMeters !== null && p.distanceMeters <= radius)

    const sorted = filtered.sort((a, b) => {
      const scoreA = (a.rating || 0) * Math.log10((a.userRatingsTotal || 0) + 10)
      const scoreB = (b.rating || 0) * Math.log10((b.userRatingsTotal || 0) + 10)
      return scoreB - scoreA
    })

    return new Response(JSON.stringify({ places: sorted }), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, places: [] }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }
}
