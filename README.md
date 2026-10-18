# 地球轉生所 / Earthlife Atlas

An original, buildless Traditional Chinese browser game. Open the deployed Site, or serve `dist/` with any static HTTP server (`python -m http.server --directory dist 8765`). No build step, backend, paid API, or user account inside the game.

## 致謝與靈感

感謝 Jin’s Earth 製作的 [《80 億分之一》](https://1in8b.life/zh/)。看見這個作品後，我請 Agent Dorami 一起做一款自己的遊戲，於是有了《地球轉生所》。

原作讓我開始想：如果重新抽一次生命，能遇見什麼樣的世界？我想把這個問題帶得更遠，走進史前與不同時代，也走進不同物種的生命。

這裡致謝的是原作網站與它帶來的靈感。本專案沒有複製原作的程式碼、美術、文字或資料，也不是原作的 fork。

## 創作理念

AI 大幅降低了把想法做出來的門檻。但能做出來之後，更重要的問題是：自己想做什麼？希望玩家經歷什麼？

我想做的是把自己的想法放進遊戲，讓靈感繼續長出新的可能。從人類的一生，擴展到不同年代、棲地與物種，試著換一個生命的角度看地球。

**一生不一定是人生。**

所以這裡的轉生，可能發生在史前，也可能成為動物、植物，或其他平常不會留意的生命。遊戲裡的選擇與結果，是邀請玩家想像另一種處境，不是科學上的出生機率或命運預測。

還有一些想傳達的東西，留在遊戲裡，等你自己發現。

## Design
- Cream, sage and ocean-blue palette; original illustrated SVG Earth; responsive desktop/mobile layout.
- 8 curated eras, 3 life scenarios per era (24 total), including extinct animals, living animals, plants, marine sessile organisms and human roles.
- Uniform era draw followed by uniform scenario draw. These are explicitly game weights, not scientific birth probabilities.
- Birth reveal → 4 chapters × 2 consequential choices → narrative outcome → replay/collection.
- Three narrative stats (0–100), visible base effects plus independent integer ±4 randomness.
- Completed journeys are stored locally (latest 100). No backend analytics or invented social proof. Unfinished journeys are session-only.
- The About page contains source-site analysis, mechanics, limitations, privacy and educational context.

## Reference analysis
The observed 1in8b.life/zh experience uses a weighted birth draw, birth-certificate reveal, continuous age-based simulation, age-gated events, four stats, speed/pause controls and a history/summary loop. The new game retains only the abstract draw/choice/reflect/replay loop. It replaces birth-country probability sampling with curated era–habitat–organism pairs, a continuous timer with deliberate short chapters, and paper/passport styling with a bright ecological visual identity. No source code, artwork, text or data copied.

## Files
- `dist/data.js`: era catalog, event sets and pure random/stat functions.
- `dist/app.js`: rendering, navigation, chapter state, outcomes and local persistence.
- `dist/style.css`: responsive styling and reduced-motion support.
- `dist/index.html`, `dist/icon.svg`: entry point and original icon.
- `wrangler.jsonc`: Cloudflare Pages deployment configuration.
- `package.json`: dependency-free local commands (the source ZIP did not include a package manifest).

## Limitations
This first version covers a curated catalog, not every species, place or historical era. Locations are representative and ancient localities use modern geographic references. Scenarios, decisions and numerical effects are fictionalized; outcomes do not estimate lifespan or extinction. Species drawings use device emoji; the Earth is custom SVG. Google Fonts is optional; system fonts work when unavailable.

## Checks
Run `node --test tests.mjs` for catalog, sampling and stat-boundary coverage. `node --check dist/app.js` checks application syntax.

## Cloudflare deployment
- Private source repository: https://github.com/mkhsu2002/otherlife
- Production URL: https://otherlife.icareu.tw/
- Cloudflare Pages project: `otherlife`, production branch: `main`, static output: `dist/`.
- Deploy to the verified account by setting `CLOUDFLARE_ACCOUNT_ID=82af99e90d342a30d2386efaa8ef4966` for the deployment command; no global account defaults are changed.
- Uses Direct Upload with the existing authorized Wrangler login. Install Wrangler from the official npm registry if needed, then run `npm run deploy`. No build step or runtime secrets are required. This is a manual deployment; pushing GitHub does not automatically redeploy.
- Validate with `npm test` and `npm run check`. Preview using `npm run dev`.
- Original source: `earthlife-source.zip` (source commit `ffeed6d06f8730b4849f9418e5dd4c3adc203bad`). The obsolete Sites hosting metadata was removed; game content and mechanics were preserved.
- The result screen includes optional invitations to explore further. These open HTTPS URLs in a new tab, without redirects or additional tracking.
