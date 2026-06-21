// 현재 위치(GPS) → 행정구역명 해석.
// - 좌표는 브라우저 Geolocation API로 얻는다.
// - 좌표 → 지명 변환은 서버 프록시(/geocode, Kakao)로 위임한다.
// 이 모듈은 동일 출처 `/geocode`를 직접 호출한다(백엔드 `/api/*`가 아니므로 apiFetch를 쓰지 않음).

/** 좌표 → 행정구역명("경기도 이천시"). 실패 시 null. */
export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<string | null> {
  try {
    const res = await fetch(`/geocode?lat=${lat}&lng=${lng}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { location?: string };
    return data.location?.trim() || null;
  } catch {
    return null;
  }
}

/** 브라우저 GPS 좌표. 권한 거부·미지원·타임아웃 시 null. */
function getCurrentPosition(
  timeoutMs = 8000,
): Promise<GeolocationPosition | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 600000 },
    );
  });
}

/**
 * 현재 위치를 행정구역명으로 해석한다.
 * GPS 권한 거부·역지오코딩 실패·키 미설정 등 어떤 단계가 실패해도 `fallback`을 반환해
 * 진단 흐름이 위치 때문에 막히지 않도록 한다.
 */
export async function resolveCurrentLocation(
  fallback: string,
): Promise<string> {
  const pos = await getCurrentPosition();
  if (!pos) return fallback;
  const name = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
  return name ?? fallback;
}
