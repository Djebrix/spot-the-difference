// The renderer: paints the header (timer, score, remaining counter), both panels
// with their markers, the footer, and the title / level / win / fail overlays.
import {
  CANVAS_HEIGHT, CANVAS_WIDTH, PANEL_HEIGHT, PANEL_LEFT_X, PANEL_RIGHT_X,
  PANEL_WIDTH, PANEL_Y,
} from './config.js';
import { SCENES } from './scenes.js';
import {
  SCREEN_FAILED, SCREEN_LEVEL_DONE, SCREEN_PAUSED, SCREEN_PLAY,
  SCREEN_TITLE, SCREEN_WIN,
} from './world.js';

function drawFoundMarker(ctx, x, y, r, time) {
  const pulse = 1 + Math.sin(time * 6) * 0.04;
  // A thin white halo first, so the green ring reads on any background —
  // dark sky, dark sea, brown dock alike.
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, (r + 3) * pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#37d67a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, r * pulse, 0, Math.PI * 2);
  ctx.stroke();
  // The check is drawn twice — white underlay, then green — so it stays
  // legible even where the scene behind it is green.
  ctx.lineCap = 'round';
  [[6, 'rgba(255, 255, 255, 0.9)'], [4, '#37d67a']].forEach(([width, color]) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x - r * 0.45, y);
    ctx.lineTo(x - r * 0.12, y + r * 0.32);
    ctx.lineTo(x + r * 0.5, y - r * 0.34);
    ctx.stroke();
  });
}

function drawOverlay(ctx, title, lines, accent, dim = 0.78) {
  ctx.fillStyle = `rgba(10, 12, 26, ${dim})`;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = accent;
  ctx.font = 'bold 54px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, CANVAS_WIDTH / 2, 250);
  ctx.fillStyle = '#f5efe0';
  ctx.font = '22px Georgia, serif';
  lines.forEach((line, i) => {
    ctx.fillText(line, CANVAS_WIDTH / 2, 320 + i * 36);
  });
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');

  function drawHeader(state, scene, remaining) {
    ctx.fillStyle = '#141828';
    ctx.fillRect(0, 0, CANVAS_WIDTH, 84);
    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 30px Georgia, serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('THREE POSTCARDS', 24, 30);
    ctx.fillStyle = '#c9c2b4';
    ctx.font = '16px Georgia, serif';
    ctx.fillText('a spot-the-difference hunt', 24, 58);
    // Level name.
    ctx.fillStyle = '#f5efe0';
    ctx.font = 'bold 20px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Level ${state.levelIndex + 1} of ${SCENES.length} — ${scene.name}`, CANVAS_WIDTH / 2, 30);
    ctx.fillStyle = '#c9c2b4';
    ctx.font = '15px Georgia, serif';
    ctx.fillText(scene.subtitle, CANVAS_WIDTH / 2, 58);
    // Timer.
    const seconds = Math.max(0, Math.ceil(state.timeLeft));
    const ratio = Math.max(0, state.timeLeft / scene.timeLimit);
    ctx.fillStyle = seconds <= 30 ? '#ff5a5a' : '#f5efe0';
    ctx.font = 'bold 26px Georgia, serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`, 1256, 28);
    ctx.fillStyle = '#2a2f45';
    ctx.fillRect(1010, 48, 246, 10);
    ctx.fillStyle = seconds <= 30 ? '#ff5a5a' : '#37d67a';
    ctx.fillRect(1010, 48, 246 * ratio, 10);
    // Score and remaining counter.
    ctx.fillStyle = '#f5efe0';
    ctx.font = 'bold 22px Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Score ${state.score}`, 1010, 28);
    ctx.fillStyle = remaining === 0 ? '#37d67a' : '#ffd166';
    ctx.font = 'bold 30px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${remaining} LEFT`, 880, 30);
    ctx.fillStyle = '#c9c2b4';
    ctx.font = '15px Georgia, serif';
    ctx.fillText(`Hints: ${state.hintsLeft}  (H)`, 880, 58);
  }

  function drawPanels(state, scene, time) {
    const panels = [
      { x: PANEL_LEFT_X, variant: 'A', label: 'A · ORIGINAL' },
      { x: PANEL_RIGHT_X, variant: 'B', label: 'B · FIND THE CHANGES' },
    ];
    panels.forEach((panel) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(panel.x, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT);
      ctx.clip();
      ctx.translate(panel.x, PANEL_Y);
      scene.draw(ctx, PANEL_WIDTH, PANEL_HEIGHT, panel.variant);
      ctx.restore();
      ctx.strokeStyle = '#f5efe0';
      ctx.lineWidth = 3;
      ctx.strokeRect(panel.x, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT);
      ctx.fillStyle = '#f5efe0';
      ctx.font = 'bold 15px Georgia, serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(panel.label, panel.x + 4, PANEL_Y - 8);
      // Markers on found differences, on both panels.
      scene.differences.forEach((diff) => {
        if (state.found.has(diff.id)) {
          drawFoundMarker(ctx, panel.x + diff.x, PANEL_Y + diff.y, diff.r + 6, time);
        }
      });
      // Hint ring on the right panel.
      if (state.hint) {
        const diff = scene.differences.find((d) => d.id === state.hint.id);
        if (diff && panel.variant === 'B') {
          const pulse = 1 + Math.sin(time * 8) * 0.15;
          ctx.strokeStyle = '#ffd166';
          ctx.lineWidth = 4;
          ctx.setLineDash([10, 8]);
          ctx.beginPath();
          ctx.arc(panel.x + diff.x, PANEL_Y + diff.y, (diff.r + 10) * pulse, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    });
    // Wrong-click flash.
    if (state.wrongFlash) {
      const flash = state.wrongFlash;
      const panelX = flash.panel === 'left' ? PANEL_LEFT_X : PANEL_RIGHT_X;
      ctx.strokeStyle = '#ff5a5a';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      const x = panelX + flash.x;
      const y = PANEL_Y + flash.y;
      ctx.beginPath();
      ctx.moveTo(x - 12, y - 12);
      ctx.lineTo(x + 12, y + 12);
      ctx.moveTo(x + 12, y - 12);
      ctx.lineTo(x - 12, y + 12);
      ctx.stroke();
    }
  }

  function drawFooter(state, cursor, screen) {
    ctx.fillStyle = '#141828';
    ctx.fillRect(0, 612, CANVAS_WIDTH, CANVAS_HEIGHT - 612);
    ctx.fillStyle = '#c9c2b4';
    ctx.font = '16px Georgia, serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Click a difference on either picture  ·  Arrow keys / WASD move the crosshair, Enter marks  ·  H hint  ·  P pause  ·  R restart', 24, 640);
    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 20px Georgia, serif';
    ctx.textAlign = 'center';
    if (state.message) ctx.fillText(state.message, CANVAS_WIDTH / 2, 682);
    if (screen === SCREEN_PLAY && cursor) {
      ctx.strokeStyle = 'rgba(255, 209, 102, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cursor.x, cursor.y, 12, 0, Math.PI * 2);
      ctx.moveTo(cursor.x - 18, cursor.y);
      ctx.lineTo(cursor.x + 18, cursor.y);
      ctx.moveTo(cursor.x, cursor.y - 18);
      ctx.lineTo(cursor.x, cursor.y + 18);
      ctx.stroke();
    }
  }

  function draw(state, screen, time, cursor, best) {
    const scene = SCENES[state.levelIndex];
    const remaining = scene.differences.length - state.found.size;
    ctx.fillStyle = '#0e1120';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawHeader(state, scene, remaining);
    drawPanels(state, scene, time);
    drawFooter(state, cursor, screen);
    if (screen === SCREEN_TITLE) {
      drawOverlay(ctx, 'THREE POSTCARDS', [
        'Three original pictures, two copies each — and something changed.',
        'Click every difference on either picture before the clock runs out.',
        `Level 1: ${SCENES[0].name} — ${SCENES[0].differences.length} differences, 3 minutes.`,
        'A wrong click costs 5 seconds. H gives a hint (3 per level).',
        'Press Space or click to start.',
        best > 0 ? `Best score so far: ${best}` : 'Find them all to see the next postcard.',
      ], '#ffd166');
    } else if (screen === SCREEN_LEVEL_DONE) {
      drawOverlay(ctx, 'POSTCARD SOLVED!', [
        `${scene.name} — all ${scene.differences.length} differences found.`,
        `Level score: ${state.levelScore}   ·   Total: ${state.score}`,
        `Next: ${SCENES[state.levelIndex + 1].name} — ${SCENES[state.levelIndex + 1].differences.length} differences.`,
        'Press N or click to continue.',
      ], '#37d67a', 0.66);
    } else if (screen === SCREEN_WIN) {
      drawOverlay(ctx, 'YOU FOUND THEM ALL!', [
        `All three postcards solved — ${SCENES.reduce((n, s) => n + s.differences.length, 0)} differences in total.`,
        `Final score: ${state.score}   ·   Wrong clicks: ${state.mistakes}`,
        'Press R to play again, or Space to start over.',
      ], '#ffd166', 0.6);
    } else if (screen === SCREEN_FAILED) {
      drawOverlay(ctx, 'OUT OF TIME', [
        `${scene.name} — ${remaining} difference${remaining === 1 ? '' : 's'} still hiding.`,
        `Score so far: ${state.score}`,
        'Press R to retry this postcard.',
      ], '#ff5a5a');
    } else if (screen === SCREEN_PAUSED) {
      drawOverlay(ctx, 'PAUSED', [
        'Take a breath. The pictures are not going anywhere.',
        'Press P or Space to keep hunting.',
      ], '#f5efe0');
    }
  }

  return { draw };
}
