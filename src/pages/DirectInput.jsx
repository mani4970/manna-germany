import { useEffect, useState } from 'react'
import { C } from './LandingPage'

export default function DirectInput({ onNext, onBack, initialPlace = null }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState(null)

  useEffect(() => {
    if (initialPlace) setSelectedPlace(initialPlace)
  }, [initialPlace])

  function handleSearch() {
    if (!searchQuery.trim()) { setSearchResults([]); return }
    setLoading(true)
    fetch(`/api/places/search?lat=37.5665&lng=126.9780&radius=15000&query=${encodeURIComponent(searchQuery)}`)
      .then(r => r.json())
      .then(data => setSearchResults(data.places || []))
      .catch(err => { console.error(err); setSearchResults([]) })
      .finally(() => setLoading(false))
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') handleSearch()
  }

  function handleSelectPlace(place) {
    setSelectedPlace(place)
    setSearchResults([])
    setSearchQuery('')
  }

  function handleNextStepSelect(type) {
    const placeWithHotspot = {
      ...selectedPlace,
      hotspot: {
        name: selectedPlace.address?.split(' ')[1] || '서울',
        lat: selectedPlace.lat,
        lng: selectedPlace.lng
      }
    }
    if (type === 'restaurant') onNext({ cafe: placeWithHotspot, nextType: 'restaurant' })
    else if (type === 'cafe') onNext({ restaurant: placeWithHotspot, nextType: 'cafe' })
    else if (type === 'bar') onNext({ restaurant: placeWithHotspot, nextType: 'bar' })
    else if (type === 'both') onNext({ restaurant: placeWithHotspot, nextType: 'both' })
  }

  const font = { fontFamily: "'Outfit', 'Noto Sans KR', sans-serif" }

  if (selectedPlace) {
    return (
      <div style={{ padding: '24px', paddingBottom: '40px', background: C.bg, minHeight: '100vh', ...font }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600&family=Noto+Sans+KR:wght@300;400;700&display=swap" rel="stylesheet" />
        <button onClick={() => setSelectedPlace(null)} className="no-orange-card" style={{
          background: 'none', border: 'none', color: C.textSub,
          fontSize: '14px', cursor: 'pointer', padding: '0 0 16px 0',
          display: 'flex', alignItems: 'center', gap: '4px', ...font,
        }}>← 다시 검색하기</button>

        <h1 style={{ fontSize: '24px', fontWeight: '300', color: C.text, marginBottom: '6px', letterSpacing: '-0.3px' }}>
          선택 완료
        </h1>
        <p style={{ color: C.textSub, fontSize: '14px', marginBottom: '20px', fontWeight: '300' }}>
          주변에서 무엇을 더 찾을까요?
        </p>

        <div style={{
          background: C.surface2, borderRadius: '14px',
          padding: '16px', marginBottom: '24px',
          border: `1px solid ${C.border}`,
        }}>
          <p style={{ color: C.textSub, fontSize: '11px', marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>선택한 장소</p>
          <p style={{ fontWeight: '400', fontSize: '16px', color: C.gold, marginBottom: '4px' }}>{selectedPlace.name}</p>
          <p style={{ color: C.textSub, fontSize: '13px', fontWeight: '300' }}>{selectedPlace.address?.split(' ').slice(0, 4).join(' ')}</p>
          {selectedPlace.rating && (
            <p style={{ color: C.goldDim, fontSize: '13px', marginTop: '6px' }}>
              ⭐ {selectedPlace.rating.toFixed(1)}
              {selectedPlace.userRatingsTotal && (
                <span style={{ color: C.textSub }}> ({selectedPlace.userRatingsTotal.toLocaleString()}개)</span>
              )}
            </p>
          )}
        </div>

        <p style={{ fontWeight: '400', fontSize: '15px', color: C.text, marginBottom: '12px' }}>이 주변에서 무엇을 찾을까요?</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { type: 'restaurant', emoji: '🍽️', label: '레스토랑', desc: '주변 맛집 찾기' },
            { type: 'cafe', emoji: '☕', label: '카페', desc: '주변 카페 찾기' },
            { type: 'bar', emoji: '🍺', label: '바/술집', desc: '주변 바 찾기' },
            { type: 'both', emoji: '✨', label: '카페 + 바 둘 다', desc: '카페와 바 모두 추천받기' },
          ].map(opt => (
            <button
              key={opt.type}
              onClick={() => handleNextStepSelect(opt.type)}
              className="no-orange-card"
              style={{
                padding: '16px', borderRadius: '14px',
                border: `1.5px solid ${C.border}`,
                background: C.surface, cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.18s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>{opt.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '400', fontSize: '15px', color: C.text }}>{opt.label}</p>
                  <p style={{ color: C.textSub, fontSize: '13px', fontWeight: '300' }}>{opt.desc}</p>
                </div>
                <span style={{ color: C.textDim, fontSize: '18px' }}>›</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', paddingBottom: '40px', background: C.bg, minHeight: '100vh', ...font }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600&family=Noto+Sans+KR:wght@300;400;700&display=swap" rel="stylesheet" />
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <button onClick={onBack} className="no-orange-card" style={{
          background: 'none', border: 'none', color: C.textSub,
          fontSize: '14px', cursor: 'pointer', padding: '0 0 16px 0',
          display: 'flex', alignItems: 'center', gap: '4px', ...font,
        }}>← 처음으로</button>

        <h1 style={{ fontSize: '24px', fontWeight: '300', color: C.text, marginBottom: '6px', letterSpacing: '-0.3px' }}>
          가려는 곳을 검색하세요
        </h1>
        <p style={{ color: C.textSub, fontSize: '14px', fontWeight: '300', textAlign: 'center' }}>
          레스토랑, 카페, 바 이름을 입력하세요
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="예: 스시 오마카세, 성수 카페, 강남 와인바"
            style={{
              width: '100%', padding: '16px', paddingRight: '80px',
              borderRadius: '12px', border: `1.5px solid ${C.border}`,
              fontSize: '15px', outline: 'none', boxSizing: 'border-box',
              background: C.surface, color: C.text,
              fontFamily: "'Outfit', 'Noto Sans KR', sans-serif",
            }}
          />
          <button
            onClick={handleSearch}
            disabled={!searchQuery.trim()}
            className="no-orange-card"
            style={{
              position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
              background: searchQuery.trim() ? C.gold : C.border,
              color: searchQuery.trim() ? C.bg : C.textSub,
              border: 'none', borderRadius: '8px', padding: '8px 16px',
              fontSize: '13px', fontWeight: '600',
              cursor: searchQuery.trim() ? 'pointer' : 'not-allowed',
              fontFamily: "'Outfit', sans-serif",
            }}
          >검색</button>
        </div>
        <p style={{ color: C.textDim, fontSize: '12px', marginTop: '8px', letterSpacing: '0.3px' }}>
          입력 후 Enter 키를 누르세요
        </p>
      </div>

      <div>
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: C.textSub }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔍</div>
            <p style={{ fontSize: '14px', fontWeight: '300' }}>검색 중...</p>
          </div>
        )}

        {!loading && searchQuery && searchResults.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: C.textSub }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🤔</div>
            <p style={{ fontWeight: '300' }}>검색 결과가 없어요</p>
            <p style={{ fontSize: '13px', marginTop: '8px', color: C.textDim, fontWeight: '300' }}>다른 키워드로 검색해보세요</p>
          </div>
        )}

        {!loading && searchResults.length > 0 && (
          <>
            <p style={{ color: C.textSub, fontSize: '12px', marginBottom: '12px', letterSpacing: '0.5px' }}>
              검색 결과 {searchResults.length}개
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {searchResults.map((place) => (
                <button
                  key={place.placeId}
                  onClick={() => handleSelectPlace(place)}
                  className="no-orange-card"
                  style={{
                    textAlign: 'left', padding: '14px', borderRadius: '14px',
                    border: `1.5px solid ${C.border}`, background: C.surface,
                    cursor: 'pointer', width: '100%', transition: 'all 0.18s',
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    {place.photoUrl && (
                      <div style={{
                        width: '56px', height: '56px', borderRadius: '10px',
                        overflow: 'hidden', flexShrink: 0, background: C.surface2,
                      }}>
                        <img src={place.photoUrl} alt={place.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={e => { e.target.style.display = 'none' }} />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: '400', fontSize: '15px', color: C.text, marginBottom: '4px' }}>{place.name}</p>
                      <p style={{ color: C.textSub, fontSize: '12px', marginBottom: '4px', fontWeight: '300' }}>
                        {place.address?.split(' ').slice(0, 4).join(' ')}
                      </p>
                      {place.rating && (
                        <p style={{ color: C.goldDim, fontSize: '12px' }}>
                          ⭐ {place.rating.toFixed(1)}
                          {place.userRatingsTotal && (
                            <span style={{ color: C.textSub }}> ({place.userRatingsTotal.toLocaleString()}개)</span>
                          )}
                        </p>
                      )}
                    </div>
                    <span style={{ color: C.textDim, fontSize: '18px', flexShrink: 0 }}>›</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
