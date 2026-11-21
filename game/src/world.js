// The game state and rules: levels, finds, wrong clicks, hints, timer and score.
// Nothing here draws; render.js paints whatever this state says.
import { SCENES } from './scenes.js';
import {
  FIND_POINTS, HINTS_PER_LEVEL, HINT_SECONDS, TIME_BONUS_PER_SECOND,
  WRONG_PENALTY_SECONDS, WRONG_POINTS,
} from './config.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_LEVEL_DONE = 'level-done';
export const SCREEN_WIN = 'win';
export const SCREEN_FAILED = 'failed';
export const SCREEN_PAUSED = 'paused';

export function createWorld() {
  const state = {
    screen: SCREEN_TITLE,
    levelIndex: 0,
    found: new Set(),
    foundOrder: [],
    mistakes: 0,
    score: 0,
    levelScore: 0,
    timeLeft: SCENES[0].timeLimit,
    hintsLeft: HINTS_PER_LEVEL,
    hint: null,
    wrongFlash: null,
    message: '',
    messageUntil: 0,
    now: 0,
    best: 0,
  };

  function scene() {
    return SCENES[state.levelIndex];
  }

  function remaining() {
    return scene().differences.length - state.found.size;
  }

  function setMessage(text, seconds = 2.5) {
    state.message = text;
    state.messageUntil = state.now + seconds;
  }

  function startLevel(index) {
    state.levelIndex = index;
    state.found = new Set();
    state.foundOrder = [];
    state.levelScore = 0;
    state.timeLeft = scene().timeLimit;
    state.hintsLeft = HINTS_PER_LEVEL;
    state.hint = null;
    state.wrongFlash = null;
    state.screen = SCREEN_PLAY;
    setMessage(`${scene().name}: find ${scene().differences.length} differences!`, 3);
  }

  function startGame() {
    state.score = 0;
    state.mistakes = 0;
    startLevel(0);
  }

  /** Mark a difference by its id through the real find path (used by the shot stager). */
  function markFoundById(id) {
    const diff = scene().differences.find((d) => d.id === id);
    if (!diff || state.found.has(id)) return false;
    state.found.add(id);
    state.foundOrder.push(id);
    state.score += FIND_POINTS;
    state.levelScore += FIND_POINTS;
    return true;
  }

  /**
   * Try to mark the point (x, y) in panel coordinates. Either panel counts: the
   * difference is the same spot in both pictures. Returns 'found', 'already',
   * 'wrong' or 'none' (a click outside any panel is 'none').
   */
  function markAt(x, y, panel) {
    if (state.screen !== SCREEN_PLAY) return 'none';
    const diff = scene().differences.find((d) => {
      const dx = x - d.x;
      const dy = y - d.y;
      return dx * dx + dy * dy <= d.r * d.r;
    });
    if (!diff) {
      state.mistakes += 1;
      state.score = Math.max(0, state.score - WRONG_POINTS);
      state.timeLeft = Math.max(0, state.timeLeft - WRONG_PENALTY_SECONDS);
      state.wrongFlash = { x, y, panel: panel ?? 'right', until: state.now + 0.6 };
      setMessage(`Not there — ${WRONG_PENALTY_SECONDS}s penalty!`);
      return 'wrong';
    }
    if (state.found.has(diff.id)) {
      setMessage(`Already found: ${diff.name}.`);
      return 'already';
    }
    markFoundById(diff.id);
    setMessage(`Found it! ${diff.name}.`);
    if (remaining() === 0) {
      const bonus = Math.round(state.timeLeft) * TIME_BONUS_PER_SECOND;
      state.score += bonus;
      state.levelScore += bonus;
      if (state.levelIndex + 1 >= SCENES.length) {
        state.screen = SCREEN_WIN;
        if (state.score > state.best) state.best = state.score;
        setMessage(`All postcards solved! Time bonus +${bonus}.`, 5);
      } else {
        state.screen = SCREEN_LEVEL_DONE;
        setMessage(`Level clear! Time bonus +${bonus}.`, 5);
      }
    }
    return 'found';
  }

  /** Highlight one unfound difference for a few seconds. */
  function useHint() {
    if (state.screen !== SCREEN_PLAY) return null;
    if (state.hintsLeft <= 0) {
      setMessage('No hints left on this level.');
      return null;
    }
    const unfound = scene().differences.filter((d) => !state.found.has(d.id));
    if (unfound.length === 0) return null;
    state.hintsLeft -= 1;
    const diff = unfound[Math.floor(Math.random() * unfound.length)];
    state.hint = { id: diff.id, until: state.now + HINT_SECONDS };
    setMessage(`Hint: look near "${diff.name}"…`);
    return diff;
  }

  function nextLevel() {
    if (state.screen === SCREEN_LEVEL_DONE) startLevel(state.levelIndex + 1);
  }

  function step(dt) {
    state.now += dt;
    if (state.screen === SCREEN_PLAY) {
      state.timeLeft -= dt;
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        state.screen = SCREEN_FAILED;
        setMessage('Out of time!', 5);
      }
    }
    if (state.hint && state.now > state.hint.until) state.hint = null;
    if (state.wrongFlash && state.now > state.wrongFlash.until) state.wrongFlash = null;
    if (state.message && state.now > state.messageUntil) state.message = '';
  }

  return {
    state,
    scene,
    remaining,
    startGame,
    startLevel,
    markAt,
    markFoundById,
    useHint,
    nextLevel,
    step,
  };
}
