// 팜케어 AI PWA 아이콘 생성기
// 디자인: 세이지 그린 타일 + 흰색 라인 잎(Lucide `leaf`).
// SVG 작성 → qlmanage(QuickLook)로 고해상도 렌더 → sips로 각 사이즈 변환 (macOS 도구만 사용).
import { mkdirSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "icons");
mkdirSync(OUT_DIR, { recursive: true });

const BG = "#7D9E78"; // 세이지 그린 타일
const STROKE = "#FFFFFF"; // 흰 잎
const RENDER = 1024; // 렌더 해상도

// Lucide `leaf` (v0.446) — viewBox 0 0 24 24
const LEAF_PATHS = [
  "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",
  "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",
];

// rounded=true → 둥근 모서리(투명 코너) / false → 풀블리드 사각형
function buildSvg({ rounded, leafScale }) {
  const S = RENDER;
  const rx = rounded ? S * 0.23 : 0;
  const f = (S * leafScale) / 24; // 잎 스케일
  const tx = (S - 24 * f) / 2;
  const ty = (S - 24 * f) / 2;
  const sw = 2; // lucide 기본 stroke (24 단위 기준) — scale에 비례
  const paths = LEAF_PATHS.map((d) => `<path d="${d}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <rect width="${S}" height="${S}" rx="${rx}" ry="${rx}" fill="${BG}"/>
  <g transform="translate(${tx} ${ty}) scale(${f})"
     fill="none" stroke="${STROKE}" stroke-width="${sw}"
     stroke-linecap="round" stroke-linejoin="round">
    ${paths}
  </g>
</svg>`;
}

const targets = [
  { name: "icon-192.png", size: 192, rounded: true, leafScale: 0.48 },
  { name: "icon-512.png", size: 512, rounded: true, leafScale: 0.48 },
  { name: "icon-maskable-512.png", size: 512, rounded: false, leafScale: 0.4 },
  { name: "apple-touch-icon.png", size: 180, rounded: false, leafScale: 0.5 },
];

const TMP = tmpdir();
for (const t of targets) {
  const svgPath = join(TMP, `pk-${t.name}.svg`);
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
