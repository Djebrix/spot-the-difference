// Boot and the one loop: input is read every frame, the world advances in real
// time, and the renderer paints what is there. The game moves between five screens:
// title, play, paused, level-done, win and failed.
//
// ?seed=N fixes the random seed. ?shot=cover|market|cabin|win (with &seed=N)
// stages that scene instead of running the loop, paints it twice and sets
// window.__shotReady for a screenshot.
import { BEST_KEY } from './config.js';
import { createRandom } from './random.js';
import { createWorld, SCREEN_FAILED, SCREEN_LEVEL_DONE, SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './world.js';
import { ACTION_CONFIRM, ACTION_HINT, ACTION_NEXT, ACTION_PAUSE, ACTION_RESTART, createInput } from './input.js';
import { createRenderer } from './render.js';
import { createAudio } from './audio.js';
import { stageShot } from './shots.js';

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : Math.floor(Math.random() * 4294967296);

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld(createRandom(seed));
const renderer = createRenderer(canvas);
const audio = createAudio();

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best score then lasts this visit only.
  }
}

// A debug handle for local play-testing: the page's own state, nothing more.
window.__spot = { world, seed };

function runShot(name) {
  const scene = stageShot(name, world);
  let painted = 0;
  function paint() {
    renderer.draw(world.state, scene.screen, world.state.now, null, scene.best);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas);
  let screen = SCREEN_TITLE;
  let best = readBest();
  let last = performance.now();

  function announce(message) {
    status.textContent = message;
  }

  function startGame() {
    world.startGame();
    screen = SCREEN_PLAY;
    audio.unlock();
    announce(`Playing. ${world.scene().name}, find ${world.scene().differences.length} differences.`);
  }

  function handleClick(point) {
    // A click outside the pictures still starts or continues the game from a
    // menu screen; only during play does it mean nothing.
    if (!point) {
      if (screen === SCREEN_TITLE || screen === SCREEN_WIN || screen === SCREEN_FAILED) {
        startGame();
      } else if (screen === SCREEN_LEVEL_DONE) {
        world.nextLevel();
        screen = SCREEN_PLAY;
      } else if (screen === SCREEN_PAUSED) {
        screen = SCREEN_PLAY;
        announce('Playing.');
      }
      return;
    }
    if (screen === SCREEN_TITLE || screen === SCREEN_WIN || screen === SCREEN_FAILED) {
      startGame();
      return;
    }
    if (screen === SCREEN_LEVEL_DONE) {
      world.nextLevel();
      screen = SCREEN_PLAY;
      return;
    }
    if (screen !== SCREEN_PLAY) return;
    audio.unlock();
    const result = world.markAt(point.x, point.y, point.panel);
    if (result === 'found') {
      audio.found();
      if (world.state.screen === SCREEN_WIN) {
        screen = SCREEN_WIN;
        audio.win();
        if (world.state.score > best) {
          best = world.state.score;
          saveBest(best);
        }
      } else if (world.state.screen === SCREEN_LEVEL_DONE) {
        screen = SCREEN_LEVEL_DONE;
        audio.win();
      }
      announce(world.state.message);
    } else if (result === 'wrong') {
      audio.wrong();
      announce(world.state.message);
    } else if (result === 'already') {
      announce(world.state.message);
    }
  }

  function handleActions(dt) {
    input.moveCursor(dt);
    const actions = input.takeActions();
    if (actions & ACTION_CONFIRM) {
      if (screen === SCREEN_TITLE || screen === SCREEN_WIN || screen === SCREEN_FAILED) startGame();
      else if (screen === SCREEN_LEVEL_DONE) {
        world.nextLevel();
        screen = SCREEN_PLAY;
      } else if (screen === SCREEN_PAUSED) {
        screen = SCREEN_PLAY;
        announce('Playing.');
      } else if (screen === SCREEN_PLAY) {
        const point = input.cursorPanelPoint();
        if (point) handleClick(point);
      }
    }
    if (actions & ACTION_HINT && screen === SCREEN_PLAY) {
      const hint = world.useHint();
      if (hint) audio.hint();
      announce(world.state.message);
    }
    if (actions & ACTION_RESTART && screen !== SCREEN_TITLE) {
      if (screen === SCREEN_FAILED) world.startLevel(world.state.levelIndex);
      else world.startGame();
      screen = SCREEN_PLAY;
      announce('Restarted.');
    }
    if (actions & ACTION_NEXT && screen === SCREEN_LEVEL_DONE) {
      world.nextLevel();
      screen = SCREEN_PLAY;
    }
    if (actions & ACTION_PAUSE) {
      if (screen === SCREEN_PLAY) {
        screen = SCREEN_PAUSED;
        announce('Paused.');
      } else if (screen === SCREEN_PAUSED) {
        screen = SCREEN_PLAY;
        announce('Playing.');
      }
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.25);
    last = now;
    handleActions(dt);
    const clicks = input.takeClicks();
    clicks.forEach((click) => handleClick(click));
    if (screen === SCREEN_PLAY) {
      world.step(dt);
      if (world.state.screen === SCREEN_FAILED) screen = SCREEN_FAILED;
    }
    const showCursor = screen === SCREEN_PLAY ? input.cursor : null;
    renderer.draw(world.state, screen, world.state.now, showCursor, best);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && screen === SCREEN_PLAY) {
      screen = SCREEN_PAUSED;
      announce('Paused.');
    }
  });

  announce('Three Postcards. Press Space or click to start.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
