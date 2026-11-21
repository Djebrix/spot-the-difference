// Small canvas drawing helpers shared by the three scenes: sky, sea, stars, birds,
// boats, trees, lanterns and the other bits of scenery the postcards are made of.
export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function skyGradient(ctx, w, h, top, middle, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, top);
  g.addColorStop(0.55, middle);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

export function drawStar(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 8; i += 1) {
    const angle = (i * Math.PI) / 4;
    const radius = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

export function drawCloud(ctx, x, y, scale, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, 34 * scale, 16 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 22 * scale, y + 5 * scale, 22 * scale, 12 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 24 * scale, y + 5 * scale, 24 * scale, 13 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function drawGull(ctx, x, y, scale, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 11 * scale, y);
  ctx.quadraticCurveTo(x - 4 * scale, y - 8 * scale, x, y);
  ctx.quadraticCurveTo(x + 4 * scale, y - 8 * scale, x + 11 * scale, y);
  ctx.stroke();
}

export function drawPine(ctx, x, y, height, trunkColor, leafColor) {
  ctx.fillStyle = trunkColor;
  ctx.fillRect(x - 4, y - 8, 8, 10);
  ctx.fillStyle = leafColor;
  const tiers = 3;
  for (let i = 0; i < tiers; i += 1) {
    const tierH = height / tiers;
    const topY = y - 8 - height + i * tierH;
    const halfW = 12 + (tiers - i) * 11;
    ctx.beginPath();
    ctx.moveTo(x, topY);
    ctx.lineTo(x - halfW, topY + tierH + 8);
    ctx.lineTo(x + halfW, topY + tierH + 8);
    ctx.closePath();
    ctx.fill();
  }
}

export function drawSailboat(ctx, x, y, scale, hullColor, sailColor, flagColor) {
  // Hull.
  ctx.fillStyle = hullColor;
  ctx.beginPath();
  ctx.moveTo(x - 46 * scale, y);
  ctx.lineTo(x + 46 * scale, y);
  ctx.lineTo(x + 34 * scale, y + 18 * scale);
  ctx.lineTo(x - 34 * scale, y + 18 * scale);
  ctx.closePath();
  ctx.fill();
  // Mast and sail.
  ctx.strokeStyle = '#5a3d24';
  ctx.lineWidth = 3 * scale;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 62 * scale);
  ctx.stroke();
  ctx.fillStyle = sailColor;
  ctx.beginPath();
  ctx.moveTo(x + 3 * scale, y - 58 * scale);
  ctx.lineTo(x + 3 * scale, y - 4 * scale);
  ctx.lineTo(x + 38 * scale, y - 4 * scale);
  ctx.closePath();
  ctx.fill();
  // Pennant flag on the mast.
  ctx.fillStyle = flagColor;
  ctx.beginPath();
  ctx.moveTo(x, y - 62 * scale);
  ctx.lineTo(x + 20 * scale, y - 56 * scale);
  ctx.lineTo(x, y - 50 * scale);
  ctx.closePath();
  ctx.fill();
}

export function drawRowboat(ctx, x, y, scale, hullColor) {
  ctx.fillStyle = hullColor;
  ctx.beginPath();
  ctx.moveTo(x - 34 * scale, y);
  ctx.lineTo(x + 34 * scale, y);
  ctx.lineTo(x + 24 * scale, y + 13 * scale);
  ctx.lineTo(x - 24 * scale, y + 13 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#7a5a34';
  ctx.lineWidth = 2.5 * scale;
  ctx.beginPath();
  ctx.moveTo(x - 10 * scale, y - 2 * scale);
  ctx.lineTo(x + 10 * scale, y - 2 * scale);
  ctx.stroke();
}

export function drawCrate(ctx, x, y, size, color, bandColor) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
  ctx.strokeStyle = bandColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, size - 2, size - 2);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + size, y + size);
  ctx.moveTo(x + size, y);
  ctx.lineTo(x, y + size);
  ctx.stroke();
}

export function drawLantern(ctx, x, y, radius, lit, glowColor) {
  if (lit) {
    const glow = ctx.createRadialGradient(x, y, 2, x, y, radius * 2.2);
    glow.addColorStop(0, glowColor);
    glow.addColorStop(1, 'rgba(255, 190, 80, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, radius * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = lit ? '#ffb84d' : '#8a7a5a';
  ctx.beginPath();
  ctx.ellipse(x, y, radius * 0.72, radius, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#5a3d24';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - radius);
  ctx.lineTo(x, y - radius - 8);
  ctx.stroke();
  ctx.fillStyle = '#3a2c18';
  ctx.fillRect(x - 5, y - radius - 12, 10, 5);
}

export function drawFlower(ctx, x, y, petalColor, centerColor) {
  ctx.strokeStyle = '#2f7a3d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 12);
  ctx.stroke();
  ctx.fillStyle = petalColor;
  for (let i = 0; i < 5; i += 1) {
    const angle = (i * Math.PI * 2) / 5;
    ctx.beginPath();
    ctx.arc(x + Math.cos(angle) * 5, y + Math.sin(angle) * 5, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = centerColor;
  ctx.beginPath();
  ctx.arc(x, y, 3.5, 0, Math.PI * 2);
  ctx.fill();
}

export function drawMountain(ctx, x, baseY, width, height, color, snowColor) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - width / 2, baseY);
  ctx.lineTo(x, baseY - height);
  ctx.lineTo(x + width / 2, baseY);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = snowColor;
  ctx.beginPath();
  ctx.moveTo(x - width * 0.16, baseY - height * 0.68);
  ctx.lineTo(x, baseY - height);
  ctx.lineTo(x + width * 0.16, baseY - height * 0.68);
  ctx.lineTo(x + width * 0.07, baseY - height * 0.55);
  ctx.lineTo(x, baseY - height * 0.62);
  ctx.lineTo(x - width * 0.07, baseY - height * 0.55);
  ctx.closePath();
  ctx.fill();
}
