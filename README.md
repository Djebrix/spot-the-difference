# Three Postcards — Spot the Difference

[![make.fun bounty](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![make.fun rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Djebrix/spot-the-difference/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![make.fun reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Djebrix/spot-the-difference/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

A complete spot-the-difference game that plays offline in a desktop browser from its own files. Three original postcards, two near-identical pictures each — find every change before the clock runs out.

Entry for the [make.fun bounty "Make the best spot the difference game"](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451).

## How to play

Open `game/index.html` in desktop Chrome (or serve `game/` with any static server). No network request, no build step — all art is drawn in code.

- **Click** a difference on either picture to mark it. Found differences get a green circle and check on both panels.
- **Arrow keys / WASD** move the crosshair, **Enter** marks the spot under it.
- **H** hints at one unfound difference (3 per level). **P** pauses. **R** restarts.
- A wrong click costs 5 seconds and 25 points. Finding a difference scores 100 points, plus a time bonus when the level is cleared.

## The three postcards

1. **Harbor at Dusk** — 8 differences, 3 minutes. Lighthouse beam, gulls, a sailboat flag, crates on the dock.
2. **Night Market** — 10 differences, 2½ minutes. Lanterns, a cat on a roof, the TEA sign, steam from the pot.
3. **Mountain Cabin** — 10 differences, 2 minutes. Chimney smoke, an owl, a telescope, a shooting star.

28 differences in all. Clear all three postcards to win.

## Layout

- `main.ts` — the hand-in program (Node 22): copies `game/` and `screenshots/` to `/output` and writes `dossier.json`.
- `game/index.html` — the page; `game/src/` holds the game, one file per job:
  - `main.js` — boot and the game loop
  - `world.js` — state and rules (levels, finds, hints, timer, score)
  - `scenes.js` — the three postcards and their differences
  - `art.js` — the drawing helpers the scenes share
  - `render.js` — paints the header, panels, markers and overlays
  - `input.js` — mouse and keyboard
  - `audio.js` — synthesized chimes (Web Audio, no sound files)
  - `shots.js` — staged screenshot scenes, played through the real rules
  - `config.js`, `random.js` — constants and the seeded RNG
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged.
- `screenshots/` — real renders of the game's own code in a browser.

## Screenshots

Take them with the staged scenes (`?shot=cover|market|cabin|win&seed=1`), e.g. serve `game/` on port 8080 and capture each scene at 1280×720 in headless Chrome.

## License

MIT — see [LICENSE](LICENSE).
