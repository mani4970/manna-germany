import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import CitySelect from './pages/CitySelect'
import LocationSelect from './pages/LocationSelect'
import CourseSelect from './pages/CourseSelect'
import CuisineSelect from './pages/CuisineSelect'
import RestaurantList from './pages/RestaurantList'
import CafeList from './pages/CafeList'
import FinalCourse from './pages/FinalCourse'
import { LANG } from './lang'
import './App.css'

function App() {
  const [lang, setLang] = useState('de')
  const L = LANG[lang]

  const [flowType, setFlowType] = useState(null)
  const [step, setStep] = useState(0)
  const [courseOrder, setCourseOrder] = useState([])
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0)
  const [selectedPlaces, setSelectedPlaces] = useState([]) // ← 핵심: 순서대로 배열로 저장
  const [gpsError, setGpsError] = useState(null)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [selections, setSelections] = useState({
    city: null, hotspot: null,
    courseOrder: [],
    restaurantCuisine: 'all', cafeCuisine: 'all', barCuisine: 'all',
  })

  const update = (key, value) => setSelections(prev => ({ ...prev, [key]: value }))
  const next = () => setStep(prev => prev + 1)
  const back = (keysToReset = []) => {
    if (keysToReset.length > 0) {
      setSelections(prev => {
        const updated = { ...prev }
        keysToReset.forEach(k => { updated[k] = Array.isArray(prev[k]) ? [] : null })
        return updated
      })
    }
    setStep(prev => prev - 1)
  }

  const restart = () => {
    setStep(0); setFlowType(null)
    setCourseOrder([]); setCurrentOrderIndex(0); setSelectedPlaces([])
    setGpsError(null); setGpsLoading(false)
    setSelections({ city: null, hotspot: null, courseOrder: [], restaurantCuisine: 'all', cafeCuisine: 'all', barCuisine: 'all' })
  }

  const handleStartLocation = () => {
    setGpsLoading(true)
    setGpsError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const hotspot = {
          lat: latitude, lng: longitude,
          name: lang === 'de' ? 'Aktueller Standort' : 'Current Location',
          name_de: 'Aktueller Standort',
          name_en: 'Current Location',
        }
        setSelections(prev => ({ ...prev, hotspot }))
        setFlowType('location')
        setGpsLoading(false)
        setStep(3)
      },
      () => {
        setGpsLoading(false)
        setGpsError(lang === 'de'
          ? 'Standort konnte nicht ermittelt werden. Bitte Berechtigung erteilen.'
          : 'Could not get location. Please allow location access.')
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  function handleCourseOrderSelect(data) {
    setCourseOrder(data.courseOrder)
    setSelections(prev => ({ ...prev, courseOrder: data.courseOrder }))
    setCurrentOrderIndex(0)
    setSelectedPlaces([])
    next()
  }

  function handlePlaceSelect(place) {
    // 항상 배열에 순서대로 push
    const newPlaces = [...selectedPlaces, place]
    setSelectedPlaces(newPlaces)

    if (currentOrderIndex < courseOrder.length - 1) {
      setCurrentOrderIndex(prev => prev + 1)
      next()
    } else {
      setStep(100)
    }
  }

  function getReferencePoint() {
    if (currentOrderIndex === 0) return selections.hotspot
    return selectedPlaces[currentOrderIndex - 1]
  }

  return (
    <div className="app">
      {step === 0 && (
        <LandingPage lang={lang} setLang={setLang} L={L}
          onStartGuided={() => { setFlowType('guided'); setStep(1) }}
          onStartLocation={handleStartLocation}
        />
      )}

      {gpsLoading && (
        <div style={{ position:'fixed', inset:0, background:'rgba(250,247,242,0.97)', zIndex:999, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px', fontFamily:"'Outfit',sans-serif" }}>
          <div style={{ fontSize:'36px' }}>📍</div>
          <p style={{ color:'#8A8070', fontSize:'14px' }}>{lang === 'de' ? 'Standort wird ermittelt...' : 'Getting your location...'}</p>
        </div>
      )}
      {gpsError && (
        <div style={{ position:'fixed', inset:0, background:'rgba(250,247,242,0.97)', zIndex:999, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px', padding:'32px', fontFamily:"'Outfit',sans-serif", textAlign:'center' }}>
          <div style={{ fontSize:'36px' }}>⚠️</div>
          <p style={{ color:'#1A1714', fontSize:'15px' }}>{gpsError}</p>
          <button onClick={() => setGpsError(null)} style={{ background:'#B89A6A', color:'#FAF7F2', border:'none', borderRadius:'12px', padding:'12px 24px', fontSize:'14px', cursor:'pointer' }}>
            {lang === 'de' ? 'Zurück' : 'Back'}
          </button>
        </div>
      )}

      {flowType === 'guided' && step === 1 && (
        <CitySelect lang={lang} L={L}
          onNext={value => { update('city', value); next() }}
          onBack={() => { setStep(0); setFlowType(null) }}
        />
      )}
      {flowType === 'guided' && step === 2 && (
        <LocationSelect lang={lang} L={L} city={selections.city}
          onNext={value => { update('hotspot', value); next() }}
          onBack={() => back(['city'])}
        />
      )}

      {(flowType === 'guided' || flowType === 'location') && step === 3 && (
        <CourseSelect lang={lang} L={L} selections={selections}
          onNext={handleCourseOrderSelect}
          onBack={() => {
            if (flowType === 'location') restart()
            else back(['hotspot'])
          }}
          onHome={restart}
        />
      )}

      {(flowType === 'guided' || flowType === 'location') && step === 4 && (
        <CuisineSelect lang={lang} L={L} selections={selections}
          onNext={value => { setSelections(value); next() }}
          onBack={() => { setCourseOrder([]); setCurrentOrderIndex(0); setSelectedPlaces([]); back(['courseOrder']) }}
          onHome={restart}
        />
      )}

      {(flowType === 'guided' || flowType === 'location') && step >= 5 && step < 100 && (
        <>
          {courseOrder[currentOrderIndex] === 'restaurant' && (
            <RestaurantList lang={lang} L={L} selections={selections} referencePoint={getReferencePoint()}
              onNext={handlePlaceSelect}
              onBack={() => {
                if (currentOrderIndex === 0) back(['restaurantCuisine', 'cafeCuisine', 'barCuisine'])
                else { setCurrentOrderIndex(prev => prev - 1); setSelectedPlaces(prev => prev.slice(0, -1)); back() }
              }}
            />
          )}
          {(courseOrder[currentOrderIndex] === 'cafe' || courseOrder[currentOrderIndex] === 'bar') && (
            <CafeList lang={lang} L={L} selections={selections} type={courseOrder[currentOrderIndex]} referencePoint={getReferencePoint()}
              onNext={handlePlaceSelect}
              onBack={() => {
                if (currentOrderIndex === 0) back(['restaurantCuisine', 'cafeCuisine', 'barCuisine'])
                else { setCurrentOrderIndex(prev => prev - 1); setSelectedPlaces(prev => prev.slice(0, -1)); back() }
              }}
            />
          )}
        </>
      )}

      {step === 100 && (
        <FinalCourse
          lang={lang} L={L}
          selections={selections}
          courseOrder={courseOrder}
          selectedPlaces={selectedPlaces}  // ← 순서 그대로 전달
          onRestart={restart}
          onBack={() => {
            const lastType = courseOrder[courseOrder.length - 1]
            setCurrentOrderIndex(courseOrder.length - 1)
            setSelectedPlaces(prev => prev.slice(0, -1))
            setStep(4 + courseOrder.length)
          }}
        />
      )}
    </div>
  )
}

export default App
