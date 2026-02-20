import { useState } from 'react'
import { Sparkles, ShoppingBag, Castle, Crown } from 'lucide-react'
import { C } from './LandingPage'

const CATEGORIES = [
  { id: 'trendy', label: '트렌디', Icon: Sparkles, spots: ['seongsu','yeonnam','mangwon','euljiro','songridan','hapjeong_sangsu','seoul_forest','yongsan_itaewon'] },
  { id: 'busy', label: '번화가', Icon: ShoppingBag, spots: ['gangnam_station','myeongdong','hongdae','garosugil','konkuk','yeouido','jamsil_tower'] },
  { id: 'historic', label: '역사/고궁', Icon: Castle, spots: ['gyeongbokgung','jongno_ikseon','bukchon','gwanghwamun'] },
  { id: 'luxury', label: '럭셔리', Icon: Crown, spots: ['cheongdam','hannam','apgujeong_rodeo','itaewon','banpo'] },
]

const HOTSPOT_LIST = [
  { id: 'seongsu', name: '성수', sub: '힙한 카페 · 갤러리', lat: 37.5446, lng: 127.0567 },
  { id: 'yeonnam', name: '연남동', sub: '감성 골목 · 브런치', lat: 37.5637, lng: 126.9268 },
  { id: 'mangwon', name: '망원동', sub: '로컬 감성 · 주민 맛집', lat: 37.5556, lng: 126.9026 },
  { id: 'euljiro', name: '을지로', sub: '힙한 바 · 레트로', lat: 37.5660, lng: 126.9906 },
  { id: 'songridan', name: '송리단길', sub: '카페 · 이색 맛집', lat: 37.5055, lng: 127.1040 },
  { id: 'hapjeong_sangsu', name: '합정/상수', sub: '인디 · 감성 카페', lat: 37.5496, lng: 126.9139 },
  { id: 'seoul_forest', name: '서울숲', sub: '공원 산책 · 카페', lat: 37.5442, lng: 127.0377 },
  { id: 'yongsan_itaewon', name: '용리단길', sub: '트렌디 레스토랑', lat: 37.5340, lng: 126.9650 },
  { id: 'gangnam_station', name: '강남역', sub: '쇼핑 · 맛집 밀집', lat: 37.4979, lng: 127.0276 },
  { id: 'myeongdong', name: '명동', sub: '쇼핑 · 길거리 음식', lat: 37.5636, lng: 126.9823 },
  { id: 'hongdae', name: '홍대입구', sub: '클럽 · 개성 맛집', lat: 37.5572, lng: 126.9245 },
  { id: 'garosugil', name: '신사 가로수길', sub: '패션 · 브런치 카페', lat: 37.5209, lng: 127.0227 },
  { id: 'konkuk', name: '건대입구', sub: '먹자골목 · 활기찬', lat: 37.5404, lng: 127.0693 },
  { id: 'yeouido', name: '여의도', sub: '한강뷰 · 현대백화점', lat: 37.5219, lng: 126.9246 },
  { id: 'jamsil_tower', name: '잠실/롯데타워', sub: '타워뷰 · 쇼핑몰', lat: 37.5131, lng: 127.1025 },
  { id: 'gyeongbokgung', name: '경복궁/인사동', sub: '전통 찻집 · 공예', lat: 37.5796, lng: 126.9770 },
  { id: 'jongno_ikseon', name: '종로/익선동', sub: '한옥 카페 · 레트로', lat: 37.5724, lng: 126.9904 },
  { id: 'bukchon', name: '북촌', sub: '한옥마을 · 고즈넉', lat: 37.5826, lng: 126.9830 },
  { id: 'gwanghwamun', name: '광화문', sub: '역사 명소 · 광장', lat: 37.5759, lng: 126.9769 },
  { id: 'cheongdam', name: '청담', sub: '파인다이닝 · 럭셔리', lat: 37.5248, lng: 127.0493 },
  { id: 'hannam', name: '한남동', sub: '갤러리 · 프리미엄', lat: 37.5349, lng: 127.0001 },
  { id: 'apgujeong_rodeo', name: '압구정로데오', sub: '명품 · 고급 레스토랑', lat: 37.5270, lng: 127.0403 },
  { id: 'itaewon', name: '이태원', sub: '월드푸드 · 루프탑바', lat: 37.5345, lng: 126.9946 },
  { id: 'banpo', name: '반포/서래마을', sub: '한강뷰 · 프렌치 감성', lat: 37.5040, lng: 126.9944 },
]

export default function LocationSelect({ onNext, onBack }) {
  const [activeCategory, setActiveCategory] = useState('trendy')
  const currentSpots = (CATEGORIES.find(c => c.id === activeCategory)?.spots || [])
    .map(id => HOTSPOT_LIST.find(h => h.id === id)).filter(Boolean)

  return (
    <div style={{ padding: '24px', background: C.bg, minHeight: '100vh', fontFamily: "'Outfit', 'Noto Sans KR', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600&family=Noto+Sans+KR:wght@300;400;700&display=swap" rel="stylesheet" />

      <div style={{ paddingTop: '20px', marginBottom: '28px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '28px' }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{
              flex: 1, height: '2px', borderRadius: '2px',
              background: i === 1 ? C.gold : C.border
            }} />
          ))}
        </div>

        {onBack && (
          <button onClick={onBack} className="no-orange-card" style={{
            background: 'none', border: 'none', color: C.textSub,
            fontSize: '14px', cursor: 'pointer', padding: '0 0 16px 0',
            display: 'flex', alignItems: 'center', gap: '4px',
            fontFamily: "'Outfit', sans-serif",
          }}>← 처음으로</button>
        )}

        <p style={{ color: C.gold, fontWeight: '400', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center' }}>
          STEP 1 / 5
        </p>
        <h1 style={{ fontSize: '24px', fontWeight: '300', color: C.text, letterSpacing: '-0.3px', textAlign: 'center', lineHeight: 1.3, textAlign: 'center' }}>
          어디서 만날까요?
        </h1>
        <p style={{ color: C.textSub, marginTop: '6px', fontSize: '14px', fontWeight: '300', textAlign: 'center' }}>
          분위기에 맞는 동네를 골라보세요
        </p>
      </div>

      {/* 카테고리 탭 */}
      <div style={{
        display: 'flex', gap: '8px',
        overflowX: 'auto', paddingBottom: '2px',
        marginBottom: '20px',
        scrollbarWidth: 'none', msOverflowStyle: 'none',
      }}>
        {CATEGORIES.map(({ id, label, Icon }) => {
          const isActive = activeCategory === id
          return (
            <button key={id} onClick={() => setActiveCategory(id)} className="no-orange-card"
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '8px 14px', borderRadius: '12px', border: 'none',
                background: isActive ? C.text : C.surface2,
                color: isActive ? C.bg : C.textSub,
                fontWeight: isActive ? '600' : '400', fontSize: '13px',
                cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'all 0.18s', flexShrink: 0,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              <Icon size={12} strokeWidth={2} />
              {label}
            </button>
          )
        })}
      </div>

      {/* 장소 그리드 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {currentSpots.map(loc => (
          <button key={loc.id} onClick={() => onNext(loc)} className="no-orange-card"
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '4px', padding: '16px',
              borderRadius: '16px',
              border: `1.5px solid ${C.border}`,
              background: C.surface,
              cursor: 'pointer', textAlign: 'center',
              transition: 'all 0.18s', width: '100%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              minHeight: '80px',
            }}
          >
            <div style={{ fontWeight: '400', fontSize: '15px', color: C.text, textAlign: 'center' }}>{loc.name}</div>
            <div style={{ fontSize: '11px', color: C.textSub, fontWeight: '300', textAlign: 'center' }}>{loc.sub}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
