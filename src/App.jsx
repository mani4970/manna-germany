import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import DirectInput from './pages/DirectInput'
import LocationSelect from './pages/LocationSelect'
import OccasionSelect from './pages/OccasionSelect'
import CourseSelect from './pages/CourseSelect'
import BudgetSelect from './pages/BudgetSelect'
import CuisineSelect from './pages/CuisineSelect'
import RestaurantList from './pages/RestaurantList'
import CafeList from './pages/CafeList'
import FinalCourse from './pages/FinalCourse'
import './App.css'

const HOTSPOTS = [
  { id: "gangnam_station", name: "강남역", emoji: "🏙️", lat: 37.4979, lng: 127.0276 },
  { id: "sinnonhyeon", name: "신논현/논현", emoji: "🍽️", lat: 37.5045, lng: 127.0249 },
  { id: "apgujeong_rodeo", name: "압구정로데오", emoji: "✨", lat: 37.5270, lng: 127.0403 },
  { id: "cheongdam", name: "청담", emoji: "🥂", lat: 37.5248, lng: 127.0493 },
  { id: "garosugil", name: "신사 가로수길", emoji: "🛍️", lat: 37.5209, lng: 127.0227 },
  { id: "banpo", name: "반포/서래마을", emoji: "🥐", lat: 37.5040, lng: 126.9944 },
  { id: "jamsil_tower", name: "잠실(롯데타워)", emoji: "🎡", lat: 37.5131, lng: 127.1025 },
  { id: "songridan", name: "송리단길", emoji: "☕", lat: 37.5055, lng: 127.1040 },
  { id: "konkuk", name: "건대입구", emoji: "🎯", lat: 37.5404, lng: 127.0693 },
  { id: "seongsu", name: "성수", emoji: "🧁", lat: 37.5446, lng: 127.0567 },
  { id: "hongdae", name: "홍대입구", emoji: "🎶", lat: 37.5572, lng: 126.9245 },
  { id: "yeonnam", name: "연남동", emoji: "🌿", lat: 37.5637, lng: 126.9268 },
  { id: "hapjeong_sangsu", name: "합정/상수", emoji: "🍻", lat: 37.5496, lng: 126.9139 },
  { id: "mangwon", name: "망원동", emoji: "🎨", lat: 37.5556, lng: 126.9026 },
  { id: "itaewon", name: "이태원", emoji: "🌎", lat: 37.5345, lng: 126.9946 },
  { id: "hannam", name: "한남동", emoji: "🪄", lat: 37.5349, lng: 127.0001 },
  { id: "yongsan_station", name: "용산", emoji: "🧭", lat: 37.5299, lng: 126.9647 },
  { id: "jongno_ikseon", name: "종로/익선동", emoji: "🏮", lat: 37.5724, lng: 126.9904 },
  { id: "gwanghwamun", name: "광화문", emoji: "🏛️", lat: 37.5759, lng: 126.9769 },
  { id: "yeouido", name: "여의도", emoji: "🌆", lat: 37.5219, lng: 126.9246 },
  { id: "wangsimni", name: "왕십리", emoji: "🚇", lat: 37.5615, lng: 127.0371 },
  { id: "seoul_forest", name: "서울숲", emoji: "🌳", lat: 37.5442, lng: 127.0377 },
  { id: "oksu", name: "옥수/금호", emoji: "🌉", lat: 37.5397, lng: 127.0186 },
  { id: "mullae", name: "문래동", emoji: "🏭", lat: 37.5176, lng: 126.8952 },
  { id: "ttukseom", name: "뚝섬/자양", emoji: "🎪", lat: 37.5479, lng: 127.0676 },
]

function App() {
  const [flowType, setFlowType] = useState(null)
  const [step, setStep] = useState(0)
  const [isSharedCourse, setIsSharedCourse] = useState(false)
  const [directInputNextType, setDirectInputNextType] = useState(null)
  const [directInputOrder, setDirectInputOrder] = useState([])
  const [courseOrder, setCourseOrder] = useState([])
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0)
  const [selectedPlaces, setSelectedPlaces] = useState([])
  const [selections, setSelections] = useState({
    hotspot: null,
    occasion: null,
    courseOrder: [],
    budget: null,
    restaurantCuisine: 'all',
    cafeCuisine: 'all',
    barCuisine: 'all',
    restaurant: null,
    cafe: null,
    cafe2: null,
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const shareParam = params.get('s') || params.get('share')
    
    if (shareParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(shareParam))))
        
        setSelections({
          hotspot: { name: decoded.h || '서울' },
          occasion: '',
          courseOrder: [],
          budget: null,
          restaurantCuisine: 'all',
          cafeCuisine: 'all',
          barCuisine: 'all',
          restaurant: decoded.r ? {
            name: decoded.r.n,
            lat: decoded.r.x,
            lng: decoded.r.y,
            kakaoMapUrl: 'https://map.kakao.com/link/search/' + encodeURIComponent(decoded.r.n),
          } : null,
          cafe: decoded.c ? {
            name: decoded.c.n,
            lat: decoded.c.x,
            lng: decoded.c.y,
            kakaoMapUrl: 'https://map.kakao.com/link/search/' + encodeURIComponent(decoded.c.n),
          } : null,
          cafe2: null,
        })
        
        setIsSharedCourse(true)
        setFlowType('guided')
        setStep(100)
        window.history.replaceState({}, '', window.location.pathname)
      } catch (e) {
        console.error('Invalid share link', e)
      }
    }
  }, [])

  const update = (key, value) => setSelections(prev => ({ ...prev, [key]: value }))
  const next = () => setStep(prev => prev + 1)
  const back = (keysToReset = []) => {
    if (keysToReset.length > 0) {
      setSelections(prev => {
        const updated = { ...prev }
        keysToReset.forEach(k => {
          updated[k] = Array.isArray(prev[k]) ? [] : null
        })
        return updated
      })
    }
    setStep(prev => prev - 1)
  }

  const restart = () => {
    setStep(0)
    setFlowType(null)
    setIsSharedCourse(false)
    setDirectInputNextType(null)
    setCourseOrder([])
    setCurrentOrderIndex(0)
    setSelectedPlaces([])
    setSelections({
      hotspot: null, occasion: null, courseOrder: [], budget: null,
      restaurantCuisine: 'all', cafeCuisine: 'all', barCuisine: 'all',
      restaurant: null, cafe: null, cafe2: null,
    })
  }

  function handleDirectInputSelect(data) {
    setDirectInputNextType(data.nextType)

    if (data.restaurant) {
      setSelections(prev => ({
        ...prev,
        restaurant: data.restaurant,
        hotspot: data.restaurant.hotspot || { name: '서울' },
      }))

      if (data.nextType === 'cafe') {
        setDirectInputOrder(['restaurant', 'cafe'])
        setStep(200)
      } else if (data.nextType === 'bar') {
        setDirectInputOrder(['restaurant', 'bar'])
        setStep(202)
      } else if (data.nextType === 'both') {
        setDirectInputOrder(['restaurant', 'cafe', 'bar'])
        setStep(200)
      } else if (data.nextType === 'restaurant') {
        setDirectInputOrder(['cafe', 'restaurant'])
        setStep(201)
      }
    } else if (data.cafe) {
      setSelections(prev => ({
        ...prev,
        cafe: data.cafe,
        hotspot: data.cafe.hotspot || { name: '서울' },
      }))
      setDirectInputOrder(['cafe', 'restaurant'])
      setStep(201)
    }
  }

  function handleCourseOrderSelect(data) {
    setCourseOrder(data.courseOrder)
    setSelections(prev => ({ ...prev, courseOrder: data.courseOrder }))
    setCurrentOrderIndex(0)
    setSelectedPlaces([])
    next()
  }

  function handlePlaceSelect(place) {
    const newSelectedPlaces = [...selectedPlaces, place]
    setSelectedPlaces(newSelectedPlaces)
    
    const placeType = courseOrder[currentOrderIndex]
    
    if (placeType === 'restaurant') {
      update('restaurant', place)
    } else if (placeType === 'cafe' || placeType === 'bar') {
      const cafeOrBarCount = selectedPlaces.filter(p => {
        const idx = selectedPlaces.indexOf(p)
        return courseOrder[idx] === 'cafe' || courseOrder[idx] === 'bar'
      }).length
      
      if (cafeOrBarCount === 0) {
        update('cafe', place)
      } else {
        update('cafe2', place)
      }
    }

    if (currentOrderIndex < courseOrder.length - 1) {
      setCurrentOrderIndex(prev => prev + 1)
      next()
    } else {
      setStep(100)
    }
  }

  function getReferencePoint() {
    if (currentOrderIndex === 0) {
      return selections.hotspot
    }
    return selectedPlaces[currentOrderIndex - 1]
  }

  if (isSharedCourse && step === 100) {
    return (
      <div className="app">
        <FinalCourse 
          selections={selections} 
          onRestart={restart}
          onBack={null}
        />
      </div>
    )
  }

  return (
    <div className="app">
      {step === 0 && !flowType && (
        <LandingPage
          onStartGuided={() => { setFlowType('guided'); setStep(1) }}
          onStartDirect={() => { setFlowType('direct'); setStep(50) }}
        />
      )}

      {flowType === 'direct' && step === 50 && (
        <DirectInput
          onNext={handleDirectInputSelect}
          onBack={() => { setStep(0); setFlowType(null) }}
          // Keep the previously selected place when navigating back from lists/final screen
          initialPlace={selections.restaurant || selections.cafe}
        />
      )}
      {flowType === 'direct' && step === 200 && (
        <CafeList
          selections={selections}
          type="cafe"
          referencePoint={selections.restaurant}
          onNext={value => { 
            update('cafe', value)
            if (directInputNextType === 'both') {
              setStep(202)
            } else {
              setStep(100)
            }
          }}
          onBack={() => {
            update('cafe', null)
            setStep(50)
          }}
        />
      )}
      {flowType === 'direct' && step === 201 && (
        <RestaurantList
          selections={selections}
          referencePoint={selections.cafe}
          onNext={value => { update('restaurant', value); setStep(100) }}
          onBack={() => {
            update('restaurant', null)
            setStep(50)
          }}
        />
      )}
      {flowType === 'direct' && step === 202 && (
        <CafeList
          selections={selections}
          type="bar"
          referencePoint={selections.cafe}
          onNext={value => {
            setSelections(prev => ({ ...prev, cafe2: value }))
            setStep(100)
          }}
          onBack={() => {
            update('cafe2', null)
            if (directInputNextType === 'both') {
              setStep(200)
            } else {
              setStep(50)
            }
          }}
        />
      )}

      {flowType === 'guided' && step === 1 && (
        <LocationSelect
          onNext={value => { update('hotspot', value); next() }}
          onBack={() => { setStep(0); setFlowType(null) }}
        />
      )}
      {flowType === 'guided' && step === 2 && (
        <OccasionSelect
          location={selections.hotspot?.name}
          onNext={value => { update('occasion', value); next() }}
          onBack={() => back(['hotspot'])}
        />
      )}
      {flowType === 'guided' && step === 3 && (
        <CourseSelect
          selections={selections}
          onNext={handleCourseOrderSelect}
          onBack={() => back(['occasion'])}
          onHome={restart}
        />
      )}
      {flowType === 'guided' && step === 4 && (
        <BudgetSelect
          selections={selections}
          onNext={value => { update('budget', value); next() }}
          onBack={() => {
            setCourseOrder([])
            setCurrentOrderIndex(0)
            setSelectedPlaces([])
            back(['courseOrder'])
          }}
          onHome={restart}
        />
      )}
      {flowType === 'guided' && step === 5 && (
        <CuisineSelect
          selections={selections}
          onNext={value => { setSelections(value); next() }}
          onBack={() => back(['budget'])}
          onHome={restart}
        />
      )}
      {flowType === 'guided' && step >= 6 && step < 100 && (
        <>
          {courseOrder[currentOrderIndex] === 'restaurant' && (
            <RestaurantList
              selections={selections}
              referencePoint={getReferencePoint()}
              onNext={handlePlaceSelect}
              onBack={() => {
                update('restaurant', null)
                if (currentOrderIndex === 0) {
                  back(['restaurantCuisine', 'cafeCuisine', 'barCuisine'])
                } else {
                  setCurrentOrderIndex(prev => prev - 1)
                  setSelectedPlaces(prev => prev.slice(0, -1))
                  back()
                }
              }}
            />
          )}
          {(courseOrder[currentOrderIndex] === 'cafe' || courseOrder[currentOrderIndex] === 'bar') && (
            <CafeList
              selections={selections}
              type={courseOrder[currentOrderIndex]}
              referencePoint={getReferencePoint()}
              onNext={handlePlaceSelect}
              onBack={() => {
                const placeType = courseOrder[currentOrderIndex]
                if (currentOrderIndex === 0) {
                  if (placeType === 'cafe') update('cafe', null)
                  else update('cafe2', null)
                  back(['restaurantCuisine', 'cafeCuisine', 'barCuisine'])
                } else {
                  if (placeType === 'cafe') update('cafe', null)
                  else update('cafe2', null)
                  setCurrentOrderIndex(prev => prev - 1)
                  setSelectedPlaces(prev => prev.slice(0, -1))
                  back()
                }
              }}
            />
          )}
        </>
      )}
      
      {((flowType === 'guided' && step === 100) || (flowType === 'direct' && step === 100)) && (
        <FinalCourse
          selections={selections}
          onRestart={restart}
          directInputOrder={flowType === 'direct' ? directInputOrder : null}
          onBack={() => {
            if (flowType === 'direct') {
              // 마지막으로 거친 step으로 돌아가기
              if (directInputNextType === 'both' && selections.cafe2) {
                // 레스토랑 → 카페 → 술집 순서였으면 술집 리스트(202)로
                update('cafe2', null)
                setStep(202)
              } else if (directInputNextType === 'both' && selections.cafe) {
                // 레스토랑 → 카페까지만 했으면 카페 리스트(200)로
                update('cafe', null)
                setStep(200)
              } else if (directInputNextType === 'bar') {
                update('cafe2', null)
                setStep(202)
              } else if (directInputNextType === 'cafe') {
                update('cafe', null)
                setStep(200)
              } else if (directInputNextType === 'restaurant') {
                update('restaurant', null)
                setStep(201)
              } else {
                // 그 외엔 직접입력 화면으로
                setSelections(prev => ({ ...prev, cafe: null, cafe2: null, restaurant: null }))
                setStep(50)
              }
            } else {
              const lastType = courseOrder[courseOrder.length - 1]
              if (lastType === 'restaurant') update('restaurant', null)
              else if (lastType === 'cafe') update('cafe', null)
              else if (lastType === 'bar') update('cafe2', null)
              setCurrentOrderIndex(courseOrder.length - 1)
              setSelectedPlaces(prev => prev.slice(0, -1))
              setStep(5 + courseOrder.length)
            }
          }}
        />
      )}
    </div>
  )
}

export default App
