// Agriguard PWA 아이콘 생성기
// 소스: scripts/assets/agriguard-logo.png (방패 + 새싹, 투명 배경).
// 로고를 흰 배경 위에 중앙 합성한 SVG를 만들고 → qlmanage(QuickLook)로 고해상도 렌더
// → sips로 각 사이즈 변환 (macOS 도구만 사용).
import {
  mkdirSync,
  writeFileSync,
  copyFileSync,
  rmSync,
  readFileSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "icons");
const SRC = join(__dirname, "assets", "agriguard-logo.png");
mkdirSync(OUT_DIR, { recursive: true });

const BG = "#FFFFFF"; // 아이콘 배경 (불투명 — apple-touch/maskable 검정 변환 방지)
const RENDER = 1024; // 렌더 해상도

// 소스 로고의 원본 비율 (width / height).
const LOGO_W = 361;
const LOGO_H = 401;
const ASPECT = LOGO_W / LOGO_H;

// 로고를 data URI로 임베드해 SVG <image>로 그린다 (투명 코너가 흰 배경 위에 평탄화됨).
const LOGO_DATA_URI = `data:image/png;base64,${readFileSync(SRC).toString("base64")}`;

// rounded=true → 둥근 모서리 / false → 풀블리드(마스커블·apple-touch는 OS가 마스킹)
// contentScale: 캔버스 대비 로고가 차지하는 비율 (긴 변 기준)
function buildSvg({ rounded, contentScale }) {
  const S = RENDER;
  const rx = rounded ? S * 0.23 : 0;
  const h = S * contentScale; // 로고 높이(긴 변)
  const w = h * ASPECT; // 비율 유지한 너비
  const tx = (S - w) / 2;
  const ty = (S - h) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <rect width="${S}" height="${S}" rx="${rx}" ry="${rx}" fill="${BG}"/>
  <image href="${LOGO_DATA_URI}" x="${tx}" y="${ty}" width="${w}" height="${h}"/>
</svg>`;
}

const targets = [
  { name: "icon-192.png", size: 192, rounded: true, contentScale: 0.78 },
  { name: "icon-512.png", size: 512, rounded: true, contentScale: 0.78 },
  // 마스커블: OS가 다양한 모양으로 크롭 → 안전영역(중앙 80%) 안에 들도록 여백 확보
  {
    name: "icon-maskable-512.png",
    size: 512,
    rounded: false,
    contentScale: 0.62,
  },
  // apple-touch: iOS가 자체 라운딩/마스킹, 불투명 필요
  {
    name: "apple-touch-icon.png",
    size: 180,
    rounded: false,
    contentScale: 0.82,
  },
];

const TMP = tmpdir();
for (const t of targets) {
  const svgPath = join(TMP, `ag-${t.name}.svg`);
  writeFileSync(svgPath, buildSvg(t));
  // qlmanage: <svg>.png 생성 (최대변 RENDER)
  execFileSync("qlmanage", ["-t", "-s", String(RENDER), "-o", TMP, svgPath], {
    stdio: "ignore",
  });
  const rendered = `${svgPath}.png`;
  const out = join(OUT_DIR, t.name);
  // sips로 정확한 타깃 사이즈로 리사이즈하며 저장
  copyFileSync(rendered, out);
  execFileSync("sips", ["-z", String(t.size), String(t.size), out], {
    stdio: "ignore",
  });
  rmSync(svgPath, { force: true });
  rmSync(rendered, { force: true });
  console.log(`generated public/icons/${t.name} (${t.size}x${t.size})`);
}
