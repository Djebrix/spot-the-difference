// Mouse and keyboard input. The mouse clicks straight on a panel; the keyboard
// moves a crosshair (arrow keys / WASD) and marks with Enter or Space, so the whole
// game is playable without a mouse. H hints, R restarts, N continues, P pauses.
import {
  CANVAS_HEIGHT, CANVAS_WIDTH, CURSOR_SPEED, PANEL_HEIGHT, PANEL_LEFT_X,
  PANEL_RIGHT_X, PANEL_Y, PANEL_WIDTH,
} from './config.js';

export const ACTION_CONFIRM = 1;
export const ACTION_HINT = 2;
export const ACTION_RESTART = 4;
export const ACTION_NEXT = 8;
export const ACTION_PAUSE = 16;

export function createInput(canvas) {
  // The keyboard cursor starts in the middle of the left panel.
  const cursor = { x: PANEL_LEFT_X + PANEL_WIDTH / 2, y: PANEL_Y + PANEL_HEIGHT / 2 };
  const keys = new Set();
  let actions = 0;
  const clicks = [];
  let moved = false;

  function panelPoint(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    if (y >= PANEL_Y && y < PANEL_Y + PANEL_HEIGHT) {
      if (x >= PANEL_LEFT_X && x < PANEL_LEFT_X + PANEL_WIDTH) {
        return { panel: 'left', x: x - PANEL_LEFT_X, y: y - PANEL_Y };
      }
      if (x >= PANEL_RIGHT_X && x < PANEL_RIGHT_X + PANEL_WIDTH) {
        return { panel: 'right', x: x - PANEL_RIGHT_X, y: y - PANEL_Y };
      }
    }
    return null;
  }

  // A click anywhere on the canvas is delivered, even one outside both panels
  // (null): the title, win and failed screens answer any click, while a play
  // click off the pictures is simply ignored. Without this, "click to start"
  // did nothing for a click in the gap between the panels or on the header.
  canvas.addEventListener('click', (event) => {
    clicks.push(panelPoint(event.clientX, event.clientY));
  });

  canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    cursor.x = (event.clientX - rect.left) * (CANVAS_WIDTH / rect.width);
    cursor.y = (event.clientY - rect.top) * (CANVAS_HEIGHT / rect.height);
    moved = true;
  });

  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
      event.preventDefault();
    }
    if (key === 'enter' || key === ' ') actions |= ACTION_CONFIRM;
    else if (key === 'h') actions |= ACTION_HINT;
    else if (key === 'r') actions |= ACTION_RESTART;
    else if (key === 'n') actions |= ACTION_NEXT;
    else if (key === 'p' || key === 'escape') actions |= ACTION_PAUSE;
    else keys.add(key);
  });
  window.addEventListener('keyup', (event) => keys.delete(event.key.toLowerCase()));

  /** Move the keyboard cursor from the held arrow/WASD keys. */
  function moveCursor(dt) {
    let dx = 0;
    let dy = 0;
    if (keys.has('arrowleft') || keys.has('a')) dx -= 1;
    if (keys.has('arrowright') || keys.has('d')) dx += 1;
    if (keys.has('arrowup') || keys.has('w')) dy -= 1;
    if (keys.has('arrowdown') || keys.has('s')) dy += 1;
    if (dx !== 0 || dy !== 0) {
      const len = Math.hypot(dx, dy);
      cursor.x = Math.min(CANVAS_WIDTH, Math.max(0, cursor.x + (dx / len) * CURSOR_SPEED * dt));
      cursor.y = Math.min(CANVAS_HEIGHT, Math.max(0, cursor.y + (dy / len) * CURSOR_SPEED * dt));
      moved = true;
    }
  }

  /** The panel point under the keyboard cursor, or null when it is off the panels. */
  function cursorPanelPoint() {
    if (cursor.y >= PANEL_Y && cursor.y < PANEL_Y + PANEL_HEIGHT) {
      if (cursor.x >= PANEL_LEFT_X && cursor.x < PANEL_LEFT_X + PANEL_WIDTH) {
        return { panel: 'left', x: cursor.x - PANEL_LEFT_X, y: cursor.y - PANEL_Y };
      }
      if (cursor.x >= PANEL_RIGHT_X && cursor.x < PANEL_RIGHT_X + PANEL_WIDTH) {
        return { panel: 'right', x: cursor.x - PANEL_RIGHT_X, y: cursor.y - PANEL_Y };
      }
    }
    return null;
  }

  /** Every click since the last frame, in order (a fast double-click keeps both). */
  function takeClicks() {
    return clicks.splice(0, clicks.length);
  }

  function takeActions() {
    const taken = actions;
    actions = 0;
    return taken;
  }

  return {
    cursor,
    moveCursor,
    cursorPanelPoint,
    takeClicks,
    takeActions,
    get keyboardUsed() {
      return moved;
    },
  };
}
