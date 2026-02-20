import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import CitySelect from './pages/CitySelect'
import LocationSelect from './pages/LocationSelect'
import OccasionSelect from './pages/OccasionSelect'
import CourseSelect from './pages/CourseSelect'
import BudgetSelect from './pages/BudgetSelect'
import CuisineSelect from './pages/CuisineSelect'
import RestaurantList from './pages/RestaurantList'
import CafeList from './pages/CafeList'
import FinalCourse from './pages/FinalCourse'
import DirectInput from './pages/DirectInput'
import { LANG } from './lang'
import './App.css'

function App() {
  const [lang, setLang] = useState('de')
  const L = LANG[lang]

  const [flowType, setFlowType] = useState(null)
  const [step, setStep] = useState(0)
  const [directInputNextType, setDirectInputNextType] = useState(null)
  const [directInputOrder, setDirectInputOrder] = useState([])
  const [courseOrder, setCourseOrder] = useState([])
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0)
  const [selectedPlaces, setSelectedPlaces] = useState([])
  const [selections, setSelections] = useState({
    city: null, hotspot: null, occasion: null,
    courseOrder: [], budget: null,
    restaurantCuisine: 'all', cafeCuisine: 'all', barCuisine: 'all',
    restaurant: null, cafe: null, cafe2: null,
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
    setDirectInputNextType(null); setCourseOrder([])
    setCurrentOrderIndex(0); setSelectedPlaces([])
    setSelections({ city: null, hotspot: null, occasion: null, courseOrder: [], budget: null, restaurantCuisine: 'all', cafeCuisine: 'all', barCuisine: 'all', restaurant: null, cafe: null, cafe2: null })
  }

  function handleDirectInputSelect(data) {
    setDirectInputNextType(data.nextType)
    if (data.restaurant) {
      setSelections(prev => ({ ...prev, restaurant: data.restaurant, hotspot: data.restaurant.hotspot || { name: 'Germany' } }))
      if (data.nextType === 'cafe') { setDirectInputOrder(['restaurant', 'cafe']); setStep(200) }
      else if (data.nextType === 'bar') { setDirectInputOrder(['restaurant', 'bar']); setStep(202) }
      else if (data.nextType === 'both') { setDirectInputOrder(['restaurant', 'cafe', 'bar']); setStep(200) }
      else if (data.nextType === 'restaurant') { setDirectInputOrder(['cafe', 'restaurant']); setStep(201) }
    } else if (data.cafe) {
      setSelections(prev => ({ ...prev, cafe: data.cafe, hotspot: data.cafe.hotspot || { name: 'Germany' } }))
      setDirectInputOrder(['cafe', 'restaurant']); setStep(201)
    }
  }

  function handleCourseOrderSelect(data) {
    setCourseOrder(data.courseOrder)
    setSelections(prev => ({ ...prev, courseOrder: data.courseOrder }))
    setCurrentOrderIndex(0); setSelectedPlaces([]); next()
  }

  function handlePlaceSelect(place) {
    const newSelectedPlaces = [...selectedPlaces, place]
    setSelectedPlaces(newSelectedPlaces)
    const placeType = courseOrder[currentOrderIndex]
    if (placeType === 'restaurant') update('restaurant', place)
    else if (placeType === 'cafe' || placeType === 'bar') {
      const count = selectedPlaces.filter((p, idx) => courseOrder[idx] === 'cafe' || courseOrder[idx] === 'bar').length
      if (count === 0) update('cafe', place)
      else update('cafe2', place)
    }
    if (currentOrderIndex < courseOrder.length - 1) {
      setCurrentOrderIndex(prev => prev + 1); next()
    } else { setStep(100) }
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
          onStartDirect={() => { setFlowType('direct'); setStep(50) }}
        />
      )}

      {/* Direct flow */}
      {flowType === 'direct' && step === 50 && (
        <DirectInput lang={lang} L={L}
          onNext={handleDirectInputSelect}
          onBack={() => { setStep(0); setFlowType(null) }}
          initialPlace={selections.restaurant || selections.cafe}
        />
      )}
      {flowType === 'direct' && step === 200 && (
        <CafeList lang={lang} L={L} selections={selections} type="cafe" referencePoint={selections.restaurant}
          onNext={value => { update('cafe', value); directInputNextType === 'both' ? setStep(202) : setStep(100) }}
          onBack={() => { update('cafe', null); setStep(50) }}
        />
      )}
      {flowType === 'direct' && step === 201 && (
        <RestaurantList lang={lang} L={L} selections={selections} referencePoint={selections.cafe}
          onNext={value => { update('restaurant', value); setStep(100) }}
          onBack={() => { update('restaurant', null); setStep(50) }}
        />
      )}
      {flowType === 'direct' && step === 202 && (
        <CafeList lang={lang} L={L} selections={selections} type="bar" referencePoint={selections.cafe}
          onNext={value => { setSelections(prev => ({ ...prev, cafe2: value })); setStep(100) }}
          onBack={() => { update('cafe2', null); directInputNextType === 'both' ? setStep(200) : setStep(50) }}
        />
      )}

      {/* Guided flow */}
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
      {flowType === 'guided' && step === 3 && (
        <OccasionSelect lang={lang} L={L} city={selections.city} spot={selections.hotspot}
          onNext={value => { update('occasion', value); next() }}
          onBack={() => back(['hotspot'])}
        />
      )}
      {flowType === 'guided' && step === 4 && (
        <CourseSelect lang={lang} L={L} selections={selections}
          onNext={handleCourseOrderSelect}
          onBack={() => back(['occasion'])}
          onHome={restart}
        />
      )}
      {flowType === 'guided' && step === 5 && (
        <BudgetSelect lang={lang} L={L}
          onNext={value => { update('budget', value); next() }}
          onBack={() => { setCourseOrder([]); setCurrentOrderIndex(0); setSelectedPlaces([]); back(['courseOrder']) }}
          onHome={restart}
        />
      )}
      {flowType === 'guided' && step === 6 && (
        <CuisineSelect lang={lang} L={L} selections={selections}
          onNext={value => { setSelections(value); next() }}
          onBack={() => back(['budget'])}
          onHome={restart}
        />
      )}
      {flowType === 'guided' && step >= 7 && step < 100 && (
        <>
          {courseOrder[currentOrderIndex] === 'restaurant' && (
            <RestaurantList lang={lang} L={L} selections={selections} referencePoint={getReferencePoint()}
              onNext={handlePlaceSelect}
              onBack={() => {
                update('restaurant', null)
                if (currentOrderIndex === 0) back(['restaurantCuisine', 'cafeCuisine', 'barCuisine'])
                else { setCurrentOrderIndex(prev => prev - 1); setSelectedPlaces(prev => prev.slice(0, -1)); back() }
              }}
            />
          )}
          {(courseOrder[currentOrderIndex] === 'cafe' || courseOrder[currentOrderIndex] === 'bar') && (
            <CafeList lang={lang} L={L} selections={selections} type={courseOrder[currentOrderIndex]} referencePoint={getReferencePoint()}
              onNext={handlePlaceSelect}
              onBack={() => {
                const placeType = courseOrder[currentOrderIndex]
                if (currentOrderIndex === 0) {
                  if (placeType === 'cafe') update('cafe', null); else update('cafe2', null)
                  back(['restaurantCuisine', 'cafeCuisine', 'barCuisine'])
                } else {
                  if (placeType === 'cafe') update('cafe', null); else update('cafe2', null)
                  setCurrentOrderIndex(prev => prev - 1); setSelectedPlaces(prev => prev.slice(0, -1)); back()
                }
              }}
            />
          )}
        </>
      )}

      {step === 100 && (
        <FinalCourse lang={lang} L={L} selections={selections} onRestart={restart}
          directInputOrder={flowType === 'direct' ? directInputOrder : null}
          onBack={() => {
            if (flowType === 'direct') {
              if (directInputNextType === 'both' && selections.cafe2) { update('cafe2', null); setStep(202) }
              else if (directInputNextType === 'both' && selections.cafe) { update('cafe', null); setStep(200) }
              else if (directInputNextType === 'bar') { update('cafe2', null); setStep(202) }
              else if (directInputNextType === 'cafe') { update('cafe', null); setStep(200) }
              else if (directInputNextType === 'restaurant') { update('restaurant', null); setStep(201) }
              else { setSelections(prev => ({ ...prev, cafe: null, cafe2: null, restaurant: null })); setStep(50) }
            } else {
              const lastType = courseOrder[courseOrder.length - 1]
              if (lastType === 'restaurant') update('restaurant', null)
              else if (lastType === 'cafe') update('cafe', null)
              else if (lastType === 'bar') update('cafe2', null)
              setCurrentOrderIndex(courseOrder.length - 1)
              setSelectedPlaces(prev => prev.slice(0, -1))
              setStep(6 + courseOrder.length)
            }
          }}
        />
      )}
    </div>
  )
}

export default App
