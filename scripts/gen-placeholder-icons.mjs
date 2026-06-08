// 플레이스홀더 PWA 아이콘 생성기 (의존성 없음, Node 내장 zlib 사용)
// 브랜드 그린 배경 + 중앙 흰 원. 추후 실제 로고 PNG로 교체할 것.
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "icons");
mkdirSync(OUT_DIR, { recursive: true });

// 브랜드 그린 #2D7A3E
const BG = [0x2d, 0x7a, 0x3e];
const FG = [0xff, 0xff, 0xff];

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function makePng(size, { circle = true } = {}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.3; // 원 반지름 (maskable safe zone 내)
  const r2 = r * r;

  // RGBA 스캔라인 (각 행 앞에 필터 바이트 0)
  const raw = Buffer.alloc((size * 4 + 1) * size);
  let p = 0;
  for (let y = 0; y < size; y++) {
    raw[p++] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      let color = BG;
      if (circle) {
        const dx = x - cx + 0.5;
        const dy = y - cy + 0.5;
        if (dx * dx + dy * dy <= r2) color = FG;
      }
      raw[p++] = color[0];
      raw[p++] = color[1];
      raw[p++] = color[2];
      raw[p++] = 0xff; // alpha
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const targets = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "icon-maskable-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const t of targets) {
  writeFileSync(join(OUT_DIR, t.name), makePng(t.size));
  console.log(`generated public/icons/${t.name} (${t.size}x${t.size})`);
}
