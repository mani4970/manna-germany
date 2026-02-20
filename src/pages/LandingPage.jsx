import { useEffect, useState } from 'react'

const C = {
  bg:       '#FAF7F2',
  surface:  '#FFFFFF',
  surface2: '#F3EFE8',
  border:   '#E8E0D4',
  gold:     '#B89A6A',
  goldDim:  '#C8AE88',
  text:     '#1A1714',
  textSub:  '#8A8070',
  textDim:  '#C4B8A8',
}

function MannaDots({ size = 8 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.5 }}>
      <div style={{ width: size, height: size, borderRadius: '50%', background: C.gold }} />
      <div style={{ width: size * 0.7, height: size * 0.7, borderRadius: '50%', background: C.gold, opacity: 0.55 }} />
      <div style={{ width: size * 0.45, height: size * 0.45, borderRadius: '50%', background: C.gold, opacity: 0.25 }} />
    </div>
  )
}

function MannaLogo({ size = 'md' }) {
  const fontSize = size === 'lg' ? 32 : size === 'sm' ? 18 : 24
  const dotSize = size === 'lg' ? 7 : size === 'sm' ? 4 : 5.5
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <MannaDots size={dotSize} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: fontSize * 0.4 }}>
        <span style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 300,
          fontSize: fontSize,
          letterSpacing: fontSize * 0.28,
          textTransform: 'uppercase',
          color: C.text,
          lineHeight: 1,
        }}>Manna</span>
        <span style={{
          fontFamily: "'Noto Sans KR', sans-serif",
          fontWeight: 700,
          fontSize: fontSize * 0.48,
          color: C.goldDim,
          letterSpacing: '2px',
          lineHeight: 1,
        }}>만나</span>
      </div>
    </div>
  )
}

export default function LandingPage({ onStartGuided, onStartDirect }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  const fadeUp = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  })

  const features = [
    { icon: '◎', title: '24개 서울 핫스팟', desc: '성수, 한남, 을지로 등 감각적인 동네' },
    { icon: '◈', title: '구글 평점 기반', desc: '수천 개의 리뷰에서 걸러낸 진짜 맛집' },
    { icon: '◉', title: '카카오맵 연동', desc: '완성된 동선을 지도로 바로 확인' },
    { icon: '◌', title: '카카오톡 공유', desc: '코스를 한 번에 공유' },
  ]

  const stepsGuided = [
    { num: '01', label: '지역 선택', desc: '가고 싶은 동네 고르기' },
    { num: '02', label: '모임 종류', desc: '데이트, 친구, 가족' },
    { num: '03', label: '코스 & 예산', desc: '식사, 카페, 1인당 예산 설정' },
    { num: '04', label: '코스 완성', desc: '지도 + 카카오톡 공유' },
  ]

  const stepsDirect = [
    { num: '01', label: '장소 검색', desc: '이미 정한 곳 검색' },
    { num: '02', label: '주변 탐색', desc: '카페·바·레스토랑 추가' },
    { num: '03', label: '코스 완성', desc: '지도 + 카카오톡 공유' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      fontFamily: "'Outfit', 'Noto Sans KR', sans-serif",
      overflowX: 'hidden',
      color: C.text,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600&family=Noto+Sans+KR:wght@300;400;700&display=swap" rel="stylesheet" />

      {/* 배경 글로우 */}
      <div style={{
        position: 'fixed', top: '-120px', right: '-120px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184,154,106,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-80px', left: '-80px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184,154,106,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* 헤더 */}
      <div style={{
        padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(250,247,242,0.92)',
        backdropFilter: 'blur(16px)',
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <MannaLogo size="sm" />
      </div>

      <div style={{ position: 'relative' }}>

        {/* 히어로 */}
        <div style={{ padding: '64px 24px 48px', textAlign: 'center', ...fadeUp(0) }}>

          {/* 배지 */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            border: `1px solid ${C.border}`,
            borderRadius: '20px', padding: '6px 16px',
            fontSize: '11px', color: C.goldDim,
            fontWeight: '400', marginBottom: '32px',
            letterSpacing: '2px', textTransform: 'uppercase',
          }}>
            <MannaDots size={4} />
            <span>서울 코스 추천</span>
          </div>

          {/* 로고 대형 */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <MannaLogo size="lg" />
          </div>

          {/* 슬로건 */}
          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 300,
            fontSize: '15px',
            color: C.textSub,
            letterSpacing: '1px',
            marginBottom: '6px',
          }}>
            좋은 음식, 좋은 사람, 좋은 만남
          </p>
          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 200,
            fontSize: '12px',
            color: C.textDim,
            letterSpacing: '0.5px',
            marginBottom: '48px',
            textAlign: 'center',
          }}>
            Your daily blessing for the perfect meetup
          </p>

          {/* CTA 버튼들 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={onStartGuided}
              style={{
                background: C.gold,
                color: C.bg,
                border: 'none',
                padding: '18px 24px',
                borderRadius: '14px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                letterSpacing: '0.5px',
                transition: 'all 0.2s',
                fontFamily: "'Outfit', sans-serif",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              추천받기
            </button>
            <button
              onClick={onStartDirect}
              style={{
                background: 'transparent',
                color: C.text,
                border: `1px solid ${C.border}`,
                padding: '17px 24px',
                borderRadius: '14px',
                fontSize: '15px',
                fontWeight: '300',
                cursor: 'pointer',
                width: '100%',
                letterSpacing: '0.5px',
                transition: 'all 0.2s',
                fontFamily: "'Outfit', sans-serif",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.goldDim; e.currentTarget.style.color = C.gold }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text }}
            >
              장소 직접 검색
            </button>
          </div>

          <p style={{ color: C.textDim, fontSize: '11px', marginTop: '16px', letterSpacing: '0.5px' }}>
            회원가입 없이 바로 시작 · 완전 무료
          </p>
        </div>

        {/* 구분선 */}
        <div style={{ margin: '0 24px', height: '1px', background: C.border, ...fadeUp(0.1) }} />

        {/* 코스 미리보기 */}
        <div style={{ padding: '40px 24px', ...fadeUp(0.15) }}>
          <p style={{ fontSize: '11px', letterSpacing: '3px', color: C.goldDim, textTransform: 'uppercase', marginBottom: '20px', textAlign: 'center' }}>
            Preview
          </p>
          <div style={{
            background: C.surface,
            borderRadius: '20px',
            padding: '20px',
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <span style={{ fontSize: '13px', fontWeight: '400', color: C.text }}>추천 코스 예시</span>
              <span style={{
                fontSize: '10px', color: C.goldDim, letterSpacing: '1px',
                border: `1px solid ${C.border}`, borderRadius: '8px', padding: '3px 8px',
              }}>한남동 · 데이트</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { icon: '🍽️', name: '모수 서울', sub: '⭐ 4.9 · 파인다이닝 · 280m' },
                { icon: '☕', name: '테라로사 한남', sub: '⭐ 4.7 · 스페셜티 카페 · 420m' },
              ].map((p, i) => (
                <div key={i}>
                  <div style={{
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px',
                    background: C.surface2, borderRadius: '12px', padding: '12px',
                    border: `1px solid ${C.border}`,
                  }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: C.border, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '20px', flexShrink: 0,
                    }}>{p.icon}</div>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ fontWeight: '400', fontSize: '14px', color: C.text }}>{p.name}</p>
                      <p style={{ color: C.goldDim, fontSize: '11px', marginTop: '2px' }}>{p.sub}</p>
                    </div>
                  </div>
                  {i === 0 && (
                    <p style={{ textAlign: 'center', color: C.textDim, fontSize: '11px', padding: '8px 0', letterSpacing: '1px' }}>
                      · · · 도보 6분
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div style={{ margin: '0 24px', height: '1px', background: C.border }} />

        {/* 기능 소개 */}
        <div style={{ padding: '40px 24px', ...fadeUp(0.2) }}>
          <p style={{ fontSize: '11px', letterSpacing: '3px', color: C.goldDim, textTransform: 'uppercase', marginBottom: '6px', textAlign: 'center' }}>
            Features
          </p>
          <h2 style={{ fontSize: '20px', fontWeight: '300', color: C.text, marginBottom: '24px', letterSpacing: '-0.3px', textAlign: 'center' }}>
            왜 Manna인가요?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: C.surface, borderRadius: '16px',
                padding: '18px 14px',
                border: `1px solid ${C.border}`,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '18px', color: C.goldDim, marginBottom: '10px', fontWeight: '200' }}>{f.icon}</div>
                <p style={{ fontWeight: '400', fontSize: '13px', color: C.text, marginBottom: '4px' }}>{f.title}</p>
                <p style={{ color: C.textSub, fontSize: '11px', lineHeight: '1.6', fontWeight: '300' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 구분선 */}
        <div style={{ margin: '0 24px', height: '1px', background: C.border }} />

        {/* 사용 방법 */}
        <div style={{ padding: '40px 24px', ...fadeUp(0.25) }}>
          <p style={{ fontSize: '11px', letterSpacing: '3px', color: C.goldDim, textTransform: 'uppercase', marginBottom: '6px', textAlign: 'center' }}>
            How it works
          </p>
          <h2 style={{ fontSize: '20px', fontWeight: '300', color: C.text, marginBottom: '28px', letterSpacing: '-0.3px', textAlign: 'center' }}>
            두 가지 방법으로 시작해요
          </h2>

          {/* 좌우 2열 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

            {/* 추천받기 */}
            <div style={{
              background: C.surface2, borderRadius: '16px', padding: '20px 16px',
              border: `1px solid ${C.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '16px' }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: C.gold, flexShrink: 0 }} />
                <p style={{ fontSize: '11px', fontWeight: '600', color: C.gold, letterSpacing: '0.5px' }}>추천받기</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {stepsGuided.map((s, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2px' }}>
                    <span style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 200, fontSize: '10px',
                      color: i === stepsGuided.length - 1 ? C.gold : C.textDim,
                      letterSpacing: '1px',
                    }}>{s.num}</span>
                    <p style={{ fontWeight: '400', fontSize: '13px', color: C.text, lineHeight: 1.3 }}>{s.label}</p>
                    <p style={{ color: C.textSub, fontSize: '11px', fontWeight: '300', lineHeight: 1.4 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 장소 직접 검색 */}
            <div style={{
              background: C.surface2, borderRadius: '16px', padding: '20px 16px',
              border: `1px solid ${C.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '16px' }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: C.goldDim, flexShrink: 0 }} />
                <p style={{ fontSize: '11px', fontWeight: '600', color: C.goldDim, letterSpacing: '0.5px' }}>직접 검색</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {stepsDirect.map((s, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2px' }}>
                    <span style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 200, fontSize: '10px',
                      color: i === stepsDirect.length - 1 ? C.goldDim : C.textDim,
                      letterSpacing: '1px',
                    }}>{s.num}</span>
                    <p style={{ fontWeight: '400', fontSize: '13px', color: C.text, lineHeight: 1.3 }}>{s.label}</p>
                    <p style={{ color: C.textSub, fontSize: '11px', fontWeight: '300', lineHeight: 1.4 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 하단 CTA */}
        <div style={{ padding: '0 24px 60px', ...fadeUp(0.3) }}>
          <div style={{
            background: C.surface,
            borderRadius: '20px', padding: '32px 24px',
            textAlign: 'center',
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <MannaDots size={7} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '300', color: C.text, marginBottom: '8px', letterSpacing: '-0.3px' }}>
              좋은 음식, 좋은 사람, 좋은 만남
            </h3>
            <p style={{ color: C.textSub, fontSize: '12px', marginBottom: '28px', fontWeight: '300', letterSpacing: '0.3px' }}>
              Your daily blessing for the perfect meetup
            </p>
            <button
              onClick={onStartGuided}
              style={{
                background: C.gold,
                color: C.bg, border: 'none',
                padding: '16px', borderRadius: '12px',
                fontSize: '15px', fontWeight: '600',
                cursor: 'pointer', width: '100%',
                fontFamily: "'Outfit', sans-serif",
                letterSpacing: '0.5px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              시작하기
            </button>
          </div>
        </div>

        {/* 푸터 */}
        <div style={{
          padding: '24px 24px 48px',
          borderTop: `1px solid ${C.border}`,
          textAlign: 'center',
        }}>
          <MannaLogo size="sm" />
          <p style={{ color: C.textDim, fontSize: '11px', marginTop: '14px', letterSpacing: '0.5px' }}>
            © 2026 Manna · 서울 코스 추천
          </p>
        </div>

      </div>
    </div>
  )
}

export { MannaLogo, MannaDots, C }
