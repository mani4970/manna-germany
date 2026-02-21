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
    const occasion = searchParams.get('occasion') || 'all'
    const budget = searchParams.get('budget') || 'all'
    const offset = parseInt(searchParams.get('offset')) || 0
    const seed = parseInt(searchParams.get('seed')) || 0

    // ── 장소 상세 정보 ────────────────────────────────────
    const action = searchParams.get('action')
    if (action === 'detail') {
      const placeId = searchParams.get('placeId')
      if (!placeId) return new Response(JSON.stringify({ error: 'placeId required' }), { status: 400 })
      const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
        headers: {
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'X-Goog-FieldMask': 'servesBeer,servesWine,servesBrunch,servesBreakfast,servesLunch,servesDinner,servesVegetarianFood,outdoorSeating,reservable,delivery,takeout,liveMusic,editorialSummary,reviews,regularOpeningHours,priceRange,photos',
          'X-Goog-LanguageCode': 'de',
        }
      })
      const data = await res.json()
      const detail = {
        servesBeer: data.servesBeer || false,
        servesWine: data.servesWine || false,
        servesBrunch: data.servesBrunch || false,
        servesBreakfast: data.servesBreakfast || false,
        servesLunch: data.servesLunch || false,
        servesDinner: data.servesDinner || false,
        servesVegetarianFood: data.servesVegetarianFood || false,
        outdoorSeating: data.outdoorSeating || false,
        reservable: data.reservable || false,
        delivery: data.delivery || false,
        takeout: data.takeout || false,
        liveMusic: data.liveMusic || false,
        editorialSummary: data.editorialSummary?.text || null,
        reviews: (data.reviews || []).slice(0, 2),
        regularOpeningHours: data.regularOpeningHours || null,
        priceRange: data.priceRange || null,
        photos: (() => {
          const allPhotos = data.photos || []
          const sorted = [
            ...allPhotos.filter((_, i) => i % 3 === 1),
            ...allPhotos.filter((_, i) => i % 3 === 2),
            ...allPhotos.filter((_, i) => i % 3 === 0),
          ]
          return sorted.slice(0, 6).map(ph =>
            `https://places.googleapis.com/v1/${ph.name}/media?key=${GOOGLE_API_KEY}&maxHeightPx=800&maxWidthPx=1200`
          )
        })(),
      }
      return new Response(JSON.stringify({ detail }), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate' },
      })
    }

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
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate' },
      })
    }

    // ── lat/lng 없으면 에러 ────────────────────────────────
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      return new Response(JSON.stringify({ places: [], error: 'lat/lng required' }), {
        status: 400, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate' },
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
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate' },
      })
    }

    // ── 장소 검색 (restaurant / cafe / bar) ───────────────
    // cuisine 파라미터로 includedTypes 세분화
    const cuisine = searchParams.get('cuisine')
    const cuisineTypeMap = {
      // Restaurant
      german:        ['restaurant'],
      italian:       ['italian_restaurant'],
      asian:         ['japanese_restaurant', 'korean_restaurant', 'chinese_restaurant', 'thai_restaurant', 'vietnamese_restaurant', 'ramen_restaurant', 'sushi_restaurant', 'asian_restaurant'],
      indian:        ['indian_restaurant'],
      turkish:       ['turkish_restaurant'],
      french:        ['french_restaurant'],
      american:      ['american_restaurant', 'hamburger_restaurant'],
      mediterranean: ['mediterranean_restaurant', 'greek_restaurant'],
      steakhouse:    ['steak_house'],
      seafood:       ['seafood_restaurant'],
      vegetarian:    ['vegan_restaurant', 'vegetarian_restaurant'],
      // Cafe — 공식 Table A 타입만
      specialty:     ['coffee_shop', 'cafe'],
      dessert:       ['dessert_shop', 'dessert_restaurant', 'ice_cream_shop', 'confectionery', 'bakery'],
      brunch:        ['brunch_restaurant', 'breakfast_restaurant'],
      // Bar — cocktail_bar는 공식 타입 아님, bar만 사용
      cocktail:      ['bar'],
      wine:          ['wine_bar'],
      craft_beer:    ['bar'],
    }
    const typeMap = {
      restaurant: ['restaurant'],
      cafe: ['cafe', 'coffee_shop', 'bakery', 'dessert_shop', 'dessert_restaurant'],
      bar: ['bar', 'wine_bar', 'pub', 'night_club'],
    }

    // 각 타입별로 명확히 제외할 타입들
    const excludeMap = {
      restaurant: ['cafe', 'coffee_shop', 'bakery', 'bar', 'night_club', 'lodging', 'hotel'],
      cafe: ['bar', 'night_club', 'restaurant', 'lodging', 'hotel', 'liquor_store'],
      bar: ['cafe', 'coffee_shop', 'bakery', 'restaurant', 'lodging', 'hotel', 'school', 'university'],
    }

    const includedTypes = (cuisine && cuisine !== 'all' && cuisineTypeMap[cuisine])
      ? cuisineTypeMap[cuisine]
      : (typeMap[type] || ['restaurant'])

    // cuisine 선택 시에는 excludedTypes 최소화 (includedTypes와 충돌 방지)
    // cuisine='all'일 때만 전체 excludeMap 적용
    const excludedTypes = (cuisine && cuisine !== 'all')
      ? ['lodging', 'hotel']
      : (excludeMap[type] || [])

    // seed > 0 이면 좌표를 ±400m 랜덤 이동해서 다른 결과 풀 가져오기
    const jitterLat = seed > 0 ? lat + (((seed * 127) % 800) - 400) / 111320 : lat
    const jitterLng = seed > 0 ? lng + (((seed * 311) % 800) - 400) / (111320 * Math.cos(lat * Math.PI / 180)) : lng

    const res = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos,places.primaryType,places.priceLevel',
      },
      body: JSON.stringify({
        includedTypes,
        excludedTypes,
        locationRestriction: {
          circle: { center: { latitude: jitterLat, longitude: jitterLng }, radius },
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
        photos: (() => {
          const allPhotos = p.photos || []
          // 사진을 섞어서 다양한 사진 제공 (음식/실내/외관 골고루)
          const sorted = [
            ...allPhotos.filter((_, i) => i % 3 === 1), // 2,5,8번 (주로 실내/음식)
            ...allPhotos.filter((_, i) => i % 3 === 2), // 3,6,9번
            ...allPhotos.filter((_, i) => i % 3 === 0), // 1,4,7번 (주로 외관)
          ]
          return sorted.slice(0, 5).map(ph =>
            `https://places.googleapis.com/v1/${ph.name}/media?key=${GOOGLE_API_KEY}&maxHeightPx=800&maxWidthPx=1200`
          )
        })(),
        primaryType: p.primaryType,
        types: p.types || [],
        editorialSummary: p.editorialSummary?.text || null,
        priceLevel: p.priceLevel,
        distanceMeters: dist,
        googleMapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.displayName?.text || '')}&query_place_id=${p.id}`,
      }
    })

    // 반경 밖 결과 완전 제거
    let filtered = places.filter(p => p.distanceMeters !== null && p.distanceMeters <= radius)

    // Budget 필터 (priceLevel: 1=저렴, 2=보통, 3=비쌈, 4=매우비쌈)
    const priceLevelMap = {
      'Günstig':    [1],
      'Budget':     [1],
      'Mittel':     [1, 2],
      'Moderate':   [1, 2],
      'Besonders':  [3, 4],
      'Special':    [3, 4],
    }
    const allowedPriceLevels = priceLevelMap[budget]
    if (allowedPriceLevels) {
      const budgetFiltered = filtered.filter(p =>
        !p.priceLevel || allowedPriceLevels.includes(p.priceLevel)
      )
      // 필터 결과가 너무 적으면 필터 완화
      if (budgetFiltered.length >= 3) filtered = budgetFiltered
    }

    // Occasion + Budget 기반 정렬 가중치
    const sorted = filtered.sort((a, b) => {
      const ratingA = a.rating || 0
      const ratingB = b.rating || 0
      const reviewsA = Math.log10((a.userRatingsTotal || 0) + 10)
      const reviewsB = Math.log10((b.userRatingsTotal || 0) + 10)
      const priceA = a.priceLevel || 2
      const priceB = b.priceLevel || 2

      let scoreA = ratingA * reviewsA
      let scoreB = ratingB * reviewsB

      // Date: 평점 높고 조용한 분위기 (리뷰 많은 것보다 평점 우선)
      if (occasion === 'Date') {
        scoreA = ratingA * 2 + reviewsA * 0.5
        scoreB = ratingB * 2 + reviewsB * 0.5
      }
      // Freunde: 리뷰 많고 활기찬 곳 우선
      if (occasion === 'Freunde' || occasion === 'Friends') {
        scoreA = ratingA * reviewsA * 1.2
        scoreB = ratingB * reviewsB * 1.2
      }
      // Business: 평점 높고 가격대 있는 곳 우선
      if (occasion === 'Business') {
        scoreA = ratingA * 2 + priceA * 0.5
        scoreB = ratingB * 2 + priceB * 0.5
      }
      // Familie: 리뷰 많고 평점 좋은 곳
      if (occasion === 'Familie' || occasion === 'Family') {
        scoreA = ratingA * reviewsA
        scoreB = ratingB * reviewsB
      }

      // Besonders/Special: 가격대 높은 것 추가 가중치
      if (budget === 'Besonders' || budget === 'Special') {
        scoreA += priceA * 0.5
        scoreB += priceB * 0.5
      }
      // Günstig/Budget: 가격대 낮은 것 추가 가중치
      if (budget === 'Günstig' || budget === 'Budget') {
        scoreA += (5 - priceA) * 0.3
        scoreB += (5 - priceB) * 0.3
      }

      return scoreB - scoreA
    })

    const total = sorted.length
    const paginated = sorted.slice(0, 20)
    const hasMore = total > 20
    return new Response(JSON.stringify({ places: paginated, total, hasMore }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, places: [] }), {
      status: 500, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    })
  }
}
