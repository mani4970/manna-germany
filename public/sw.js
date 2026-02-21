// Service Worker - 캐시 없이 항상 네트워크에서 최신 버전 로드
// Safari 캐시 문제 방지

self.addEventListener('install', e => {
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  // 기존 캐시 전부 삭제
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  const url = e.request.url

  // chrome-extension 등 non-http 무시
  if (!url.startsWith('http')) return

  // 모든 요청을 항상 네트워크에서 가져옴 (캐시 사용 안 함)
  e.respondWith(fetch(e.request))
})
