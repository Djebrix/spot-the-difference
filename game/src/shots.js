// The screenshot scenes behind ?shot=cover|market|cabin|win. Each one plays the
// real rules forward from a fresh level and marks real differences through the
// world's own markFoundById, so the frame is what a genuine game looks like and
// the same seed always gives the same frame.
import { SCREEN_PLAY, SCREEN_WIN } from './world.js';

/** Which differences are already found in each staged scene, by scene id. */
const STAGED_FINDS = {
  harbor: ['beam', 'gull', 'flag', 'window'],
  market: ['moon', 'cat', 'apple'],
  cabin: ['smoke', 'owl', 'window', 'flowers', 'telescope'],
};

const STAGED_TIME = {
  harbor: 132,
  market: 96,
  cabin: 71,
};

function stageLevel(world, levelIndex, foundIds, timeLeft) {
  world.startLevel(levelIndex);
  foundIds.forEach((id) => world.markFoundById(id));
  world.state.timeLeft = timeLeft;
  return { screen: SCREEN_PLAY, best: 0 };
}

/**
 * Set `world` to the named scene (cover, market, cabin or win; any other name is
 * cover) and return the screen to draw over it.
 */
export function stageShot(name, world) {
  if (name === 'market') return stageLevel(world, 1, STAGED_FINDS.market, STAGED_TIME.market);
  if (name === 'cabin') return stageLevel(world, 2, STAGED_FINDS.cabin, STAGED_TIME.cabin);
  if (name === 'win') {
    world.startLevel(2);
    const diffs = world.scene().differences;
    // Nine by id, then the last one through the real click path, so the win
    // screen carries the genuine time bonus a real play-through earns.
    diffs.slice(0, -1).forEach((d) => world.markFoundById(d.id));
    const last = diffs[diffs.length - 1];
    world.state.timeLeft = 34;
    world.markAt(last.x, last.y, 'right');
    return { screen: SCREEN_WIN, best: world.state.score };
  }
  return stageLevel(world, 0, STAGED_FINDS.harbor, STAGED_TIME.harbor);
}
