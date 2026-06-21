import { NextResponse } from "next/server";

// GPS 좌표 → 행정구역명 역지오코딩 프록시.
// Kakao REST 키를 브라우저에 노출하지 않기 위해(동일 출처 원칙) 서버에서만 호출한다.
// 키(KAKAO_REST_KEY)는 서버 전용 env — NEXT_PUBLIC_ 접두사를 쓰지 않는다.
//
// 요청: GET /geocode?lat=<위도>&lng=<경도>
// 응답: { location: "경기도 이천시" }  (실패 시 4xx/5xx + { error })

const KAKAO_ENDPOINT =
  "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json";

interface KakaoRegionDoc {
  region_type: "B" | "H"; // B: 법정동, H: 행정동
  region_1depth_name: string; // 시/도 (예: 경기도)
  region_2depth_name: string; // 시/군/구 (예: 이천시)
  region_3depth_name: string; // 읍/면/동
}

export async function GET(request: Request) {
  const restKey = process.env.KAKAO_REST_KEY;
  if (!restKey) {
    // 키 미설정은 운영자 설정 누락 — 클라이언트는 폴백(DEFAULT_LOCATION)으로 동작한다.
    return NextResponse.json(
      { error: "KAKAO_REST_KEY가 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  if (!lat || !lng || Number.isNaN(Number(lat)) || Number.isNaN(Number(lng))) {
    return NextResponse.json(
      { error: "lat/lng 쿼리 파라미터가 필요합니다." },
      { status: 400 },
    );
  }

  try {
    // Kakao는 x=경도, y=위도 순서를 받는다.
    const url = `${KAKAO_ENDPOINT}?x=${encodeURIComponent(lng)}&y=${encodeURIComponent(lat)}`;
    const res = await fetch(url, {
      headers: { Authorization: `KakaoAK ${restKey}` },
      // 좌표→지역은 자주 안 바뀌므로 짧게 캐시
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      // Kakao 원문은 서버 로그로만 남기고 클라이언트에는 노출하지 않는다(업스트림 정보 누출 방지).
      // 단, 비운영 환경에서는 진단 편의를 위해 detail을 함께 반환한다(403=카카오맵 미활성화/키 오류 등).
      const detail = await res.text().catch(() => "");
      console.error(`[geocode] Kakao 응답 오류 (${res.status}):`, detail);
      const isProd = process.env.NEXT_PUBLIC_APP_ENV === "production";
      return NextResponse.json(
        {
          error: `Kakao 응답 오류 (${res.status})`,
          ...(isProd ? {} : { detail }),
        },
        { status: 502 },
      );
    }
    const data = (await res.json()) as { documents?: KakaoRegionDoc[] };
    // 행정동(H) 우선, 없으면 첫 문서 사용.
    const doc =
      data.documents?.find((d) => d.region_type === "H") ?? data.documents?.[0];
    if (!doc) {
      return NextResponse.json(
        { error: "해당 좌표의 행정구역을 찾지 못했습니다." },
        { status: 404 },
      );
    }
    const location = [doc.region_1depth_name, doc.region_2depth_name]
      .filter(Boolean)
      .join(" ");
    return NextResponse.json({ location });
  } catch {
    return NextResponse.json(
      { error: "역지오코딩 요청에 실패했습니다." },
      { status: 502 },
    );
  }
}
