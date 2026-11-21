// The three postcards: each scene draws its own original picture twice (variant 'A'
// and variant 'B'), and lists the differences between them with their hit circles.
// The draw code and the difference list share the same layout constants, so a marker
// always lands on the thing that actually changed.
import {
  drawCloud, drawCrate, drawFlower, drawGull, drawLantern, drawMountain,
  drawPine, drawRowboat, drawSailboat, drawStar, roundRect, skyGradient,
} from './art.js';

// ---------------------------------------------------------------------------
// Scene 1 — Harbor at Dusk
// ---------------------------------------------------------------------------
const HARBOR = {
  sun: { x: 470, y: 90, r: 34 },
  gulls: [{ x: 180, y: 110 }, { x: 300, y: 80 }, { x: 420, y: 130 }],
  beam: { x: 70, y: 150 },
  sailboat: { x: 380, y: 300 },
  rowboat: { x: 180, y: 330 },
  buoy: { x: 520, y: 350 },
  crates: [{ x: 140, y: 440, s: 34 }, { x: 178, y: 444, s: 30 }],
  extraCrate: { x: 226, y: 440, s: 32 },
  rope: { x: 480, y: 468 },
  window: { x: 372, y: 304 },
};

function drawHarbor(ctx, W, H, variant) {
  const B = variant === 'B';
  skyGradient(ctx, W, H, '#1f2a52', '#b85c7a', '#f2a35e');
  drawStar(ctx, 60, 46, 4, '#ffe9a8');
  drawStar(ctx, 150, 30, 3, '#fff3c4');
  drawStar(ctx, 250, 60, 3.5, '#ffe9a8');
  drawStar(ctx, 560, 40, 3, '#fff3c4');
  drawStar(ctx, 350, 26, 2.5, '#ffe9a8');
  // Sun, with rays only in A.
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.arc(HARBOR.sun.x, HARBOR.sun.y, HARBOR.sun.r, 0, Math.PI * 2);
  ctx.fill();
  if (!B) {
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    for (let i = 0; i < 8; i += 1) {
      const a = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(HARBOR.sun.x + Math.cos(a) * 42, HARBOR.sun.y + Math.sin(a) * 42);
      ctx.lineTo(HARBOR.sun.x + Math.cos(a) * 54, HARBOR.sun.y + Math.sin(a) * 54);
      ctx.stroke();
    }
  }
  drawCloud(ctx, 120, 70, 1, 'rgba(255, 220, 200, 0.85)');
  drawCloud(ctx, 330, 48, 0.8, 'rgba(255, 210, 190, 0.8)');
  drawCloud(ctx, 520, 120, 0.7, 'rgba(255, 200, 180, 0.75)');
  // Gulls: the middle one is missing in B.
  HARBOR.gulls.forEach((g, i) => {
    if (B && i === 1) return;
    drawGull(ctx, g.x, g.y, 1, '#2b2b3a');
  });
  // Sea.
  const sea = ctx.createLinearGradient(0, 260, 0, 420);
  sea.addColorStop(0, '#3a6b8a');
  sea.addColorStop(1, '#1c3648');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 260, W, 160);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 2;
  [285, 315, 350, 385].forEach((y, i) => {
    ctx.beginPath();
    for (let x = 20 + i * 30; x < W - 20; x += 60) {
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 15, y - 5, x + 30, y);
    }
    ctx.stroke();
  });
  // Distant ship on the horizon, and the sun's reflection on the water.
  ctx.fillStyle = '#2c3a55';
  ctx.beginPath();
  ctx.moveTo(286, 262);
  ctx.lineTo(318, 262);
  ctx.lineTo(310, 252);
  ctx.lineTo(294, 252);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(300, 238, 2, 14);
  ctx.fillStyle = 'rgba(255, 209, 102, 0.5)';
  for (let i = 0; i < 5; i += 1) {
    const y = 268 + i * 18;
    ctx.fillRect(HARBOR.sun.x - 26 + i * 6, y, 52 - i * 12, 3);
  }
  // A second, smaller ship far to the right, and a fish breaking the surface.
  ctx.fillStyle = '#24344e';
  ctx.beginPath();
  ctx.moveTo(528, 262);
  ctx.lineTo(556, 262);
  ctx.lineTo(550, 254);
  ctx.lineTo(534, 254);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(540, 242, 2, 12);
  ctx.strokeStyle = '#dfe9f2';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(348, 392, 9, Math.PI, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(348, 383);
  ctx.lineTo(348, 374);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  [336, 348, 360].forEach((sx) => {
    ctx.beginPath();
    ctx.arc(sx, 402, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });
  // Lighthouse on the cliff, left.
  ctx.fillStyle = '#4a3f35';
  ctx.beginPath();
  ctx.moveTo(0, 260);
  ctx.lineTo(0, 210);
  ctx.lineTo(40, 190);
  ctx.lineTo(110, 205);
  ctx.lineTo(130, 260);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f5efe0';
  ctx.fillRect(52, 150, 36, 110);
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(52, 178, 36, 16);
  ctx.fillRect(52, 214, 36, 16);
  ctx.fillStyle = '#2b2b3a';
  ctx.fillRect(48, 132, 44, 20);
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.arc(70, 142, 9, 0, Math.PI * 2);
  ctx.fill();
  // The beam shines only in A.
  if (!B) {
    ctx.fillStyle = 'rgba(255, 209, 102, 0.35)';
    ctx.beginPath();
    ctx.moveTo(70, 138);
    ctx.lineTo(330, 96);
    ctx.lineTo(330, 168);
    ctx.closePath();
    ctx.fill();
  }
  // Boats.
  drawSailboat(ctx, HARBOR.sailboat.x, HARBOR.sailboat.y, 1, '#7a3b2e', '#f5efe0', B ? '#3a7bd5' : '#c0392b');
  ctx.fillStyle = B ? '#2b2b3a' : '#ffd166';
  ctx.fillRect(HARBOR.window.x, HARBOR.window.y, 14, 10);
  drawRowboat(ctx, HARBOR.rowboat.x, HARBOR.rowboat.y, 1, '#8a5a2e');
  // Buoy: striped in A, plain yellow in B.
  ctx.fillStyle = B ? '#f2c230' : '#c0392b';
  ctx.beginPath();
  ctx.arc(HARBOR.buoy.x, HARBOR.buoy.y, 16, 0, Math.PI * 2);
  ctx.fill();
  if (!B) {
    ctx.fillStyle = '#f5efe0';
    ctx.fillRect(HARBOR.buoy.x - 16, HARBOR.buoy.y - 5, 32, 10);
  }
  ctx.strokeStyle = '#5a3d24';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(HARBOR.buoy.x, HARBOR.buoy.y - 16);
  ctx.lineTo(HARBOR.buoy.x, HARBOR.buoy.y - 30);
  ctx.stroke();
  // Dock.
  ctx.fillStyle = '#6b4a2b';
  ctx.fillRect(0, 420, W, 80);
  ctx.strokeStyle = '#54371f';
  ctx.lineWidth = 2;
  for (let x = 0; x < W; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 420);
    ctx.lineTo(x, 500);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(0, 460);
  ctx.lineTo(W, 460);
  ctx.stroke();
  HARBOR.crates.forEach((c) => drawCrate(ctx, c.x, c.y, c.s, '#a8763e', '#6b4a2b'));
  if (B) drawCrate(ctx, HARBOR.extraCrate.x, HARBOR.extraCrate.y, HARBOR.extraCrate.s, '#a8763e', '#6b4a2b');
  // Dock furniture, the same in both pictures: posts along the water's edge,
  // a barrel by the crates and a lamp at the far end.
  ctx.fillStyle = '#54371f';
  [64, 320].forEach((px) => ctx.fillRect(px - 4, 412, 8, 16));
  ctx.fillStyle = '#8a5a2e';
  ctx.beginPath();
  ctx.ellipse(58, 468, 15, 19, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#5a3d24';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(44, 458);
  ctx.lineTo(72, 458);
  ctx.moveTo(44, 478);
  ctx.lineTo(72, 478);
  ctx.stroke();
  ctx.fillStyle = '#3a2c18';
  ctx.fillRect(563, 420, 6, 60);
  drawLantern(ctx, 566, 412, 11, true, 'rgba(255, 190, 80, 0.5)');
  // Rope coil: only in A.
  if (!B) {
    ctx.strokeStyle = '#c9a86a';
    ctx.lineWidth = 4;
    [18, 12, 6].forEach((r) => {
      ctx.beginPath();
      ctx.arc(HARBOR.rope.x, HARBOR.rope.y, r, 0, Math.PI * 2);
      ctx.stroke();
    });
  }
}

const HARBOR_DIFFERENCES = [
  { id: 'beam', name: 'Lighthouse beam', x: 210, y: 132, r: 44 },
  { id: 'gull', name: 'A gull in the sky', x: 300, y: 80, r: 26 },
  { id: 'flag', name: 'Sailboat flag colour', x: 392, y: 242, r: 20 },
  { id: 'crate', name: 'An extra crate', x: 242, y: 456, r: 26 },
  { id: 'buoy', name: 'Buoy stripes', x: 520, y: 350, r: 22 },
  { id: 'sunrays', name: 'Sun rays', x: 470, y: 90, r: 48 },
  { id: 'window', name: 'Cabin window light', x: 379, y: 309, r: 16 },
  { id: 'rope', name: 'Rope coil on the dock', x: 480, y: 468, r: 22 },
];

// ---------------------------------------------------------------------------
// Scene 2 — Night Market
// ---------------------------------------------------------------------------
const MARKET = {
  moon: { x: 500, y: 70, r: 28 },
  brightStar: { x: 440, y: 55 },
  lanterns: [{ x: 270, y: 232 }, { x: 305, y: 232 }, { x: 340, y: 232 }],
  cat: { x: 305, y: 138 },
  apples: [{ x: 90, y: 292 }, { x: 112, y: 292 }, { x: 134, y: 292 }, { x: 101, y: 276 }, { x: 123, y: 276 }],
  bunting: { x: 300, y: 118 },
  pot: { x: 490, y: 262 },
  teaSign: { x: 480, y: 200 },
  extraJar: { x: 540, y: 310 },
};

function drawStall(ctx, x, w, awningA, awningB, roofY) {
  ctx.fillStyle = '#3a2c18';
  ctx.fillRect(x, roofY, w, 8);
  for (let i = 0; i < 6; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? awningA : awningB;
    ctx.beginPath();
    ctx.moveTo(x + (i * w) / 6, roofY + 8);
    ctx.lineTo(x + ((i + 1) * w) / 6, roofY + 8);
    ctx.lineTo(x + ((i + 1) * w) / 6 - 4, roofY + 34);
    ctx.lineTo(x + (i * w) / 6 + 4, roofY + 34);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#5a3d24';
  ctx.fillRect(x, roofY + 34, w, 130);
  ctx.fillStyle = '#7a5a34';
  ctx.fillRect(x - 6, roofY + 150, w + 12, 14);
}

function drawMarket(ctx, W, H, variant) {
  const B = variant === 'B';
  skyGradient(ctx, W, H, '#0e1330', '#1c2a52', '#2c3a6b');
  drawStar(ctx, 60, 50, 3, '#fff3c4');
  drawStar(ctx, 150, 36, 4, '#ffe9a8');
  drawStar(ctx, 250, 70, 2.5, '#fff3c4');
  drawStar(ctx, 330, 40, 3, '#ffe9a8');
  drawStar(ctx, 90, 110, 2.5, '#fff3c4');
  if (!B) drawStar(ctx, MARKET.brightStar.x, MARKET.brightStar.y, 6, '#ffe9a8');
  // Moon: crescent in A, full in B.
  ctx.fillStyle = '#f5ead0';
  ctx.beginPath();
  ctx.arc(MARKET.moon.x, MARKET.moon.y, MARKET.moon.r, 0, Math.PI * 2);
  ctx.fill();
  if (!B) {
    ctx.fillStyle = '#1c2a52';
    ctx.beginPath();
    ctx.arc(MARKET.moon.x + 12, MARKET.moon.y - 6, MARKET.moon.r - 3, 0, Math.PI * 2);
    ctx.fill();
  }
  // String lights across the top.
  ctx.strokeStyle = '#0a0a12';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 96);
  ctx.quadraticCurveTo(W / 2, 130, W, 96);
  ctx.stroke();
  for (let i = 0; i < 12; i += 1) {
    const x = 24 + i * 48;
    const y = 96 + Math.sin((i / 11) * Math.PI) * 26;
    ctx.fillStyle = ['#ff5a5a', '#ffd166', '#7bd88a', '#6ab8ff'][i % 4];
    ctx.beginPath();
    ctx.arc(x, y + 8, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  // Bunting flags (one missing in B).
  for (let i = 0; i < 9; i += 1) {
    if (B && i === 4) continue;
    const x = 60 + i * 60;
    ctx.fillStyle = ['#ff5a5a', '#ffd166', '#7bd88a', '#6ab8ff'][i % 4];
    ctx.beginPath();
    ctx.moveTo(x - 12, 118);
    ctx.lineTo(x + 12, 118);
    ctx.lineTo(x, 140);
    ctx.closePath();
    ctx.fill();
  }
  // Stalls.
  drawStall(ctx, 40, 170, B ? '#2f9e44' : '#c0392b', '#f5efe0', 150);
  drawStall(ctx, 230, 170, '#8a5a2e', '#f5efe0', 150);
  drawStall(ctx, 420, 160, '#3a7bd5', '#f5efe0', 150);
  // Stall 1: apples on a shelf (one fewer in B), jars on the counter.
  ctx.fillStyle = '#4a2c18';
  ctx.fillRect(56, 300, 140, 6);
  ctx.fillStyle = '#7bd88a';
  roundRect(ctx, 160, 276, 18, 24, 4);
  ctx.fill();
  ctx.fillStyle = '#f2a35e';
  roundRect(ctx, 184, 278, 16, 22, 4);
  ctx.fill();
  MARKET.apples.forEach((a, i) => {
    if (B && i === 4) return;
    ctx.fillStyle = '#d23b2e';
    ctx.beginPath();
    ctx.arc(a.x, a.y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2f7a3d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y - 9);
    ctx.lineTo(a.x + 3, a.y - 14);
    ctx.stroke();
  });
  // Stall 2: hanging lanterns (one fewer in B).
  MARKET.lanterns.forEach((l, i) => {
    if (B && i === 2) return;
    drawLantern(ctx, l.x, l.y, 13, true, 'rgba(255, 190, 80, 0.5)');
  });
  // A basket of bread on stall 2's counter, and paper lanterns at both edges.
  ctx.fillStyle = '#8a5a2e';
  ctx.beginPath();
  ctx.ellipse(258, 300, 22, 10, 0, 0, Math.PI);
  ctx.fill();
  ctx.fillStyle = '#e8c98a';
  ctx.beginPath();
  ctx.arc(250, 296, 7, 0, Math.PI * 2);
  ctx.arc(264, 296, 7, 0, Math.PI * 2);
  ctx.fill();
  [[20, 210], [580, 210]].forEach(([lx, ly]) => {
    drawLantern(ctx, lx, ly, 15, true, 'rgba(255, 190, 80, 0.4)');
  });
  // The cat on stall 2's roof: only in A. A ginger cat against the dark blue
  // sky, with yellow eyes, so the difference is fair to find, not invisible.
  if (!B) {
    ctx.fillStyle = '#e8a35c';
    ctx.beginPath();
    ctx.ellipse(MARKET.cat.x, MARKET.cat.y, 22, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(MARKET.cat.x + 18, MARKET.cat.y - 9, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(MARKET.cat.x + 11, MARKET.cat.y - 15);
    ctx.lineTo(MARKET.cat.x + 14, MARKET.cat.y - 24);
    ctx.lineTo(MARKET.cat.x + 18, MARKET.cat.y - 15);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(MARKET.cat.x + 19, MARKET.cat.y - 15);
    ctx.lineTo(MARKET.cat.x + 22, MARKET.cat.y - 24);
    ctx.lineTo(MARKET.cat.x + 26, MARKET.cat.y - 15);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#e8a35c';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(MARKET.cat.x - 22, MARKET.cat.y - 2);
    ctx.quadraticCurveTo(MARKET.cat.x - 38, MARKET.cat.y - 18, MARKET.cat.x - 28, MARKET.cat.y - 24);
    ctx.stroke();
    ctx.strokeStyle = '#b87a3a';
    ctx.lineWidth = 3;
    [-8, 0, 8].forEach((dx) => {
      ctx.beginPath();
      ctx.moveTo(MARKET.cat.x + dx, MARKET.cat.y - 10);
      ctx.lineTo(MARKET.cat.x + dx, MARKET.cat.y - 2);
      ctx.stroke();
    });
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(MARKET.cat.x + 21, MARKET.cat.y - 10, 2, 0, Math.PI * 2);
    ctx.arc(MARKET.cat.x + 24, MARKET.cat.y - 10, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  // Stall 3: tea pot with steam (only in A), lit TEA sign (only in A), extra jar in B.
  ctx.fillStyle = '#4a4a55';
  ctx.beginPath();
  ctx.ellipse(MARKET.pot.x, MARKET.pot.y, 22, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(MARKET.pot.x - 22, MARKET.pot.y - 8, 44, 8);
  if (!B) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(MARKET.pot.x - 6, MARKET.pot.y - 12);
    ctx.quadraticCurveTo(MARKET.pot.x - 12, MARKET.pot.y - 30, MARKET.pot.x - 4, MARKET.pot.y - 44);
    ctx.moveTo(MARKET.pot.x + 8, MARKET.pot.y - 12);
    ctx.quadraticCurveTo(MARKET.pot.x + 14, MARKET.pot.y - 30, MARKET.pot.x + 6, MARKET.pot.y - 44);
    ctx.stroke();
  }
  ctx.fillStyle = B ? '#3a3a44' : '#ffd166';
  roundRect(ctx, MARKET.teaSign.x - 34, MARKET.teaSign.y - 16, 68, 32, 6);
  ctx.fill();
  ctx.fillStyle = B ? '#6a6a72' : '#3a2c18';
  ctx.font = 'bold 18px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TEA', MARKET.teaSign.x, MARKET.teaSign.y + 1);
  if (B) {
    ctx.fillStyle = '#7bd88a';
    roundRect(ctx, MARKET.extraJar.x - 10, MARKET.extraJar.y - 14, 20, 28, 4);
    ctx.fill();
    ctx.fillStyle = '#3a2c18';
    ctx.fillRect(MARKET.extraJar.x - 10, MARKET.extraJar.y - 18, 20, 6);
  }
  // Cobblestone ground.
  ctx.fillStyle = '#2a2438';
  ctx.fillRect(0, 340, W, 160);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  for (let y = 360; y < 500; y += 34) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  for (let x = 20; x < W; x += 52) {
    ctx.beginPath();
    ctx.moveTo(x, 340);
    ctx.lineTo(x - 12, 500);
    ctx.stroke();
  }
  // Warm lantern glow pooling on the ground.
  const glow = ctx.createRadialGradient(300, 360, 10, 300, 360, 260);
  glow.addColorStop(0, 'rgba(255, 190, 80, 0.28)');
  glow.addColorStop(1, 'rgba(255, 190, 80, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 340, W, 160);
  // Foreground goods fill the ground the stalls leave bare: a patterned rug
  // down the middle, baskets of bread and fruit, sacks and crates at the
  // edges, and puddles catching the lantern light. Identical in both pictures.
  ctx.fillStyle = '#7a2e2e';
  ctx.beginPath();
  ctx.moveTo(230, 360);
  ctx.lineTo(370, 360);
  ctx.lineTo(390, 480);
  ctx.lineTo(210, 480);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c0392b';
  ctx.beginPath();
  ctx.moveTo(248, 372);
  ctx.lineTo(352, 372);
  ctx.lineTo(366, 468);
  ctx.lineTo(234, 468);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(260, 384);
  ctx.lineTo(340, 384);
  ctx.lineTo(350, 456);
  ctx.lineTo(250, 456);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 190, 80, 0.25)';
  ctx.beginPath();
  ctx.ellipse(120, 400, 46, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(500, 430, 54, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  // Basket of bread, crate of oranges, sacks, and a crate stack at the edge.
  ctx.fillStyle = '#8a5a2e';
  ctx.beginPath();
  ctx.ellipse(96, 446, 30, 12, 0, 0, Math.PI);
  ctx.fill();
  ctx.fillStyle = '#e8c98a';
  [[82, 440], [96, 436], [110, 440]].forEach(([bx, by]) => {
    ctx.beginPath();
    ctx.arc(bx, by, 8, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = '#a8763e';
  ctx.fillRect(492, 396, 44, 34);
  ctx.strokeStyle = '#6b4a2b';
  ctx.lineWidth = 2;
  ctx.strokeRect(493, 397, 42, 32);
  ctx.fillStyle = '#f2a35e';
  [[502, 392], [518, 390], [532, 392], [510, 400], [526, 400]].forEach(([ox, oy]) => {
    ctx.beginPath();
    ctx.arc(ox, oy, 7, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = '#b89a6a';
  ctx.beginPath();
  ctx.ellipse(168, 462, 18, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(436, 462, 18, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  drawCrate(ctx, 18, 372, 30, '#a8763e', '#6b4a2b');
  drawCrate(ctx, 26, 340, 26, '#a8763e', '#6b4a2b');
  // A few coins dropped by the rug.
  ctx.fillStyle = '#ffd166';
  [[296, 486], [312, 490], [288, 492]].forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

const MARKET_DIFFERENCES = [
  { id: 'moon', name: 'The moon', x: 500, y: 70, r: 32 },
  { id: 'brightstar', name: 'A bright star', x: 440, y: 55, r: 18 },
  { id: 'lantern', name: 'A hanging lantern', x: 340, y: 232, r: 22 },
  { id: 'cat', name: 'The cat on the roof', x: 305, y: 138, r: 24 },
  { id: 'apple', name: 'An apple on the stall', x: 123, y: 276, r: 18 },
  { id: 'bunting', name: 'A bunting flag', x: 300, y: 118, r: 18 },
  { id: 'steam', name: 'Steam from the pot', x: 490, y: 240, r: 26 },
  { id: 'teasign', name: 'The TEA sign light', x: 480, y: 200, r: 26 },
  { id: 'jar', name: 'An extra jar', x: 540, y: 310, r: 20 },
  { id: 'awning', name: 'Awning stripe colour', x: 125, y: 170, r: 30 },
];

// ---------------------------------------------------------------------------
// Scene 3 — Mountain Cabin
// ---------------------------------------------------------------------------
const CABIN = {
  owl: { x: 480, y: 180 },
  shootingStar: { x: 470, y: 80 },
  cabin: { x: 220, y: 280, w: 160, h: 120 },
  window: { x: 280, y: 330 },
  doorLantern: { x: 366, y: 356 },
  smoke: { x: 330, y: 230 },
  pines: [
    { x: 90, y: 380, h: 90 },
    { x: 150, y: 400, h: 70 },
    { x: 440, y: 400, h: 80 },
    { x: 520, y: 390, h: 100 },
    { x: 560, y: 410, h: 64 },
  ],
  telescope: { x: 440, y: 300 },
  flowers: [{ x: 140, y: 440 }, { x: 160, y: 448 }, { x: 120, y: 448 }],
  stones: [{ x: 270, y: 440 }, { x: 300, y: 462 }, { x: 330, y: 440 }],
  extraStone: { x: 300, y: 422 },
  fencePost: { x: 200, y: 420 },
};

function drawCabinScene(ctx, W, H, variant) {
  const B = variant === 'B';
  skyGradient(ctx, W, H, '#0b1030', '#1b2a52', '#3a4a7a');
  drawStar(ctx, 60, 50, 3, '#fff3c4');
  drawStar(ctx, 140, 34, 4, '#ffe9a8');
  drawStar(ctx, 240, 60, 2.5, '#fff3c4');
  drawStar(ctx, 340, 30, 3, '#ffe9a8');
  drawStar(ctx, 540, 44, 3.5, '#ffe9a8');
  drawStar(ctx, 90, 110, 2.5, '#fff3c4');
  // Moon and fireflies over the valley.
  ctx.fillStyle = '#f5ead0';
  ctx.beginPath();
  ctx.arc(520, 62, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#d8cfae';
  ctx.beginPath();
  ctx.arc(514, 56, 4, 0, Math.PI * 2);
  ctx.arc(526, 68, 3, 0, Math.PI * 2);
  ctx.fill();
  [[80, 330], [130, 360], [470, 350], [540, 330], [200, 380]].forEach(([fx, fy]) => {
    ctx.fillStyle = '#d8f79a';
    ctx.beginPath();
    ctx.arc(fx, fy, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });
  if (!B) {
    ctx.strokeStyle = '#ffe9a8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(CABIN.shootingStar.x - 40, CABIN.shootingStar.y + 14);
    ctx.lineTo(CABIN.shootingStar.x + 10, CABIN.shootingStar.y - 6);
    ctx.stroke();
    drawStar(ctx, CABIN.shootingStar.x + 14, CABIN.shootingStar.y - 8, 5, '#ffe9a8');
  }
  drawMountain(ctx, 130, 300, 260, 170, '#2c3a5e', '#e8ecf5');
  drawMountain(ctx, 470, 300, 300, 210, '#24304e', '#dfe6f2');
  // Ground.
  ctx.fillStyle = '#1e3a2a';
  ctx.fillRect(0, 300, W, 200);
  ctx.fillStyle = '#26452f';
  ctx.beginPath();
  ctx.ellipse(300, 480, 320, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  // Pines: one is missing in B.
  CABIN.pines.forEach((p, i) => {
    if (B && i === 0) return;
    drawPine(ctx, p.x, p.y, p.h, '#5a3d24', '#1f5c33');
  });
  // Cabin.
  const c = CABIN.cabin;
  ctx.fillStyle = '#7a4a2b';
  ctx.fillRect(c.x, c.y, c.w, c.h);
  ctx.fillStyle = '#5a3418';
  ctx.beginPath();
  ctx.moveTo(c.x - 14, c.y);
  ctx.lineTo(c.x + c.w / 2, c.y - 46);
  ctx.lineTo(c.x + c.w + 14, c.y);
  ctx.closePath();
  ctx.fill();
  // Snow band along the roof's peak.
  ctx.fillStyle = '#e8ecf5';
  ctx.beginPath();
  ctx.moveTo(c.x + c.w / 2 - 42, c.y - 32);
  ctx.lineTo(c.x + c.w / 2, c.y - 46);
  ctx.lineTo(c.x + c.w / 2 + 42, c.y - 32);
  ctx.lineTo(c.x + c.w / 2 + 26, c.y - 20);
  ctx.lineTo(c.x + c.w / 2 - 26, c.y - 20);
  ctx.closePath();
  ctx.fill();
  // Chimney and smoke (only in A).
  ctx.fillStyle = '#6b4a3a';
  ctx.fillRect(318, 226, 22, 54);
  if (!B) {
    ctx.fillStyle = 'rgba(230, 230, 240, 0.75)';
    ctx.beginPath();
    ctx.arc(330, 210, 10, 0, Math.PI * 2);
    ctx.arc(338, 192, 13, 0, Math.PI * 2);
    ctx.arc(330, 172, 16, 0, Math.PI * 2);
    ctx.fill();
  }
  // Window: lit in A, dark in B.
  ctx.fillStyle = B ? '#1a2030' : '#ffd166';
  ctx.fillRect(CABIN.window.x - 16, CABIN.window.y - 14, 32, 28);
  ctx.strokeStyle = '#3a2c18';
  ctx.lineWidth = 3;
  ctx.strokeRect(CABIN.window.x - 16, CABIN.window.y - 14, 32, 28);
  ctx.beginPath();
  ctx.moveTo(CABIN.window.x, CABIN.window.y - 14);
  ctx.lineTo(CABIN.window.x, CABIN.window.y + 14);
  ctx.stroke();
  // Door.
  ctx.fillStyle = '#4a2c18';
  ctx.fillRect(336, 340, 34, 60);
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.arc(364, 372, 3, 0, Math.PI * 2);
  ctx.fill();
  // Lantern by the door: lit in A, unlit in B.
  drawLantern(ctx, CABIN.doorLantern.x, CABIN.doorLantern.y, 11, !B, 'rgba(255, 190, 80, 0.5)');
  // Owl on the branch: only in A.
  ctx.strokeStyle = '#5a3d24';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(440, 196);
  ctx.lineTo(540, 186);
  ctx.stroke();
  if (!B) {
    ctx.fillStyle = '#6b5a44';
    ctx.beginPath();
    ctx.ellipse(CABIN.owl.x, CABIN.owl.y, 14, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(CABIN.owl.x, CABIN.owl.y - 16, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(CABIN.owl.x - 4, CABIN.owl.y - 17, 2.5, 0, Math.PI * 2);
    ctx.arc(CABIN.owl.x + 4, CABIN.owl.y - 17, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f2a35e';
    ctx.beginPath();
    ctx.moveTo(CABIN.owl.x - 3, CABIN.owl.y - 12);
    ctx.lineTo(CABIN.owl.x + 3, CABIN.owl.y - 12);
    ctx.lineTo(CABIN.owl.x, CABIN.owl.y - 7);
    ctx.closePath();
    ctx.fill();
  }
  // Telescope: points up-left in A, up-right in B.
  ctx.strokeStyle = '#3a3a44';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(CABIN.telescope.x - 12, CABIN.telescope.y + 44);
  ctx.lineTo(CABIN.telescope.x, CABIN.telescope.y + 10);
  ctx.lineTo(CABIN.telescope.x + 12, CABIN.telescope.y + 44);
  ctx.stroke();
  ctx.save();
  ctx.translate(CABIN.telescope.x, CABIN.telescope.y + 6);
  ctx.rotate(B ? Math.PI / 5 : -Math.PI / 5);
  ctx.fillStyle = '#8a7a5a';
  roundRect(ctx, -6, -34, 12, 44, 4);
  ctx.fill();
  ctx.fillStyle = '#3a7bd5';
  ctx.beginPath();
  ctx.arc(0, -36, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // Path stones (one extra in B) and the fence (one post missing in B).
  ctx.fillStyle = '#9a938a';
  CABIN.stones.forEach((s) => {
    ctx.beginPath();
    ctx.ellipse(s.x, s.y, 16, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  if (B) {
    ctx.beginPath();
    ctx.ellipse(CABIN.extraStone.x, CABIN.extraStone.y, 15, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = '#6b4a2b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(60, 428);
  ctx.lineTo(190, 428);
  ctx.moveTo(210, 428);
  ctx.lineTo(300, 428);
  ctx.stroke();
  ctx.fillStyle = '#6b4a2b';
  [70, 130, 250].forEach((x) => ctx.fillRect(x - 3, 404, 6, 40));
  if (!B) ctx.fillRect(CABIN.fencePost.x - 3, 404, 6, 40);
  // Flowers: red in A, yellow in B.
  CABIN.flowers.forEach((f) => drawFlower(ctx, f.x, f.y, B ? '#ffd166' : '#d23b2e', '#fff3c4'));
  // A mushroom cluster and grass tufts root the foreground, and a small pond
  // catches the moonlight at the right. Identical in both pictures.
  [[96, 470], [112, 474]].forEach(([mx, my]) => {
    ctx.fillStyle = '#d23b2e';
    ctx.beginPath();
    ctx.arc(mx, my, 9, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#f5efe0';
    ctx.fillRect(mx - 2, my, 4, 8);
    ctx.beginPath();
    ctx.arc(mx - 3, my - 5, 1.6, 0, Math.PI * 2);
    ctx.arc(mx + 3, my - 4, 1.6, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.strokeStyle = '#3a7a4a';
  ctx.lineWidth = 2;
  [[180, 482], [420, 482], [250, 492]].forEach(([gx, gy]) => {
    [-6, 0, 6].forEach((dx) => {
      ctx.beginPath();
      ctx.moveTo(gx + dx, gy);
      ctx.lineTo(gx + dx * 1.4, gy - 10);
      ctx.stroke();
    });
  });
  ctx.fillStyle = '#2c4a6b';
  ctx.beginPath();
  ctx.ellipse(510, 468, 44, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(245, 234, 208, 0.6)';
  ctx.fillRect(496, 466, 28, 3);
  ctx.fillRect(506, 471, 18, 2);
}

const CABIN_DIFFERENCES = [
  { id: 'smoke', name: 'Chimney smoke', x: 330, y: 192, r: 30 },
  { id: 'owl', name: 'The owl', x: 480, y: 180, r: 24 },
  { id: 'window', name: 'Cabin window light', x: 280, y: 330, r: 22 },
  { id: 'pine', name: 'A pine tree', x: 90, y: 356, r: 30 },
  { id: 'flowers', name: 'Flower colour', x: 140, y: 444, r: 22 },
  { id: 'telescope', name: 'Telescope direction', x: 440, y: 296, r: 26 },
  { id: 'stone', name: 'An extra path stone', x: 300, y: 422, r: 18 },
  { id: 'shootingstar', name: 'A shooting star', x: 480, y: 78, r: 26 },
  { id: 'fence', name: 'A fence post', x: 200, y: 420, r: 18 },
  { id: 'lantern', name: 'Door lantern light', x: 366, y: 356, r: 20 },
];

export const SCENES = [
  {
    id: 'harbor',
    name: 'Harbor at Dusk',
    subtitle: 'The keeper swears the two pictures are the same.',
    timeLimit: 180,
    draw: drawHarbor,
    differences: HARBOR_DIFFERENCES,
  },
  {
    id: 'market',
    name: 'Night Market',
    subtitle: 'Lanterns, tea and a cat that may not be there.',
    timeLimit: 150,
    draw: drawMarket,
    differences: MARKET_DIFFERENCES,
  },
  {
    id: 'cabin',
    name: 'Mountain Cabin',
    subtitle: 'High above the valley, something moved.',
    timeLimit: 120,
    draw: drawCabinScene,
    differences: CABIN_DIFFERENCES,
  },
];
