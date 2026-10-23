# 地球轉生所 / Earthlife Atlas

An original, buildless Traditional Chinese / English browser game. Open the deployed Site, or serve `dist/` with any static HTTP server (`python -m http.server --directory dist 8765`). No build step, backend, paid API, or user account inside the game.

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
- Life reveal → 4 chapters × 2 choices → branching narrative outcome → share/replay/collection. Six pilot lives have eight reachable events each and three endings per life; the other 18 retain the general event routes.
- Three narrative stats (0–100), visible base effects plus seeded integer ±4 variation. Rule version 2 freezes replay behavior for shared links.
- Completed journeys are stored locally (latest 100), separately from permanent discoveries. Unfinished journeys survive reloads. No backend analytics or invented social proof.
- The About page explains play, limitations, sharing and local data. Production design analysis stays in repository documentation.

## Reference analysis
The observed 1in8b.life/zh experience uses a weighted birth draw, birth-certificate reveal, continuous age-based simulation, age-gated events, four stats, speed/pause controls and a history/summary loop. The new game retains only the abstract draw/choice/reflect/replay loop. It replaces birth-country probability sampling with curated era–habitat–organism pairs, a continuous timer with deliberate short chapters, and paper/passport styling with a bright ecological visual identity. No source code, artwork, text or data copied.

## Files
- `dist/data.js`: era catalog, event sets and pure random/stat functions.
- `dist/i18n.js`: complete English display translations; language changes preserve the current game and canonical saved data.
- `dist/app.js`: rendering, navigation, chapter state, outcomes and local persistence.
- `dist/style.css`: responsive styling and reduced-motion support.
- `dist/index.html`, `dist/icon.svg`: entry point and original icon.
- `wrangler.jsonc`: Cloudflare Pages deployment configuration.
- `package.json`: dependency-free local commands (the source ZIP did not include a package manifest).

## Limitations
This catalog covers a curated catalog, not every species, place or historical era. Locations are representative and ancient localities use modern geographic references. Scenarios, decisions and numerical effects are fictionalized; outcomes do not estimate lifespan or extinction. Life symbols use device emoji or abstract marks, explicitly described as symbolic rather than reconstructions; the Earth is custom SVG. Google Fonts is optional; system fonts work when unavailable.

## Checks
Run `node --test tests.mjs` for catalog, sampling and stat-boundary coverage. `node --check dist/app.js` checks application syntax.

## Cloudflare deployment
- Public source repository: https://github.com/mkhsu2002/otherlife
- Production URL: https://otherlife.icareu.tw/
- Cloudflare Pages project: `otherlife`, production branch: `main`, static output: `dist/`.
- Deploy to the verified account by setting `CLOUDFLARE_ACCOUNT_ID=82af99e90d342a30d2386efaa8ef4966` for the deployment command; no global account defaults are changed.
- Uses Direct Upload with the existing authorized Wrangler login. Install Wrangler from the official npm registry if needed, then run `npm run deploy`. No build step or runtime secrets are required. Cloudflare API readback on 2026-10-23 confirmed `source: null` and an ad-hoc Direct Upload deployment: pushing GitHub does not automatically redeploy. Keep all development in this GitHub repository; deploy the exact clean `main` commit and verify the live files afterward. Do not deploy the obsolete Sites copy. Direct Upload projects cannot be converted in place to native Git integration; automatic deployment would require a separately configured CI upload or a deliberate project migration.
- Validate with `npm test` and `npm run check`. Preview using `npm run dev`.
- Original source: `earthlife-source.zip` (source commit `ffeed6d06f8730b4849f9418e5dd4c3adc203bad`). The obsolete Sites hosting metadata was removed; game content and mechanics were preserved.
- The result screen includes optional invitations to explore further. These open HTTPS URLs in a new tab, without redirects or additional tracking.

## Language and local storage
The header switches between 繁體中文 and English. Traditional Chinese is the default. The choice is remembered in localStorage as `earthlife-language` when storage is available. Switching languages preserves the current life, chapter, stats, pending choice, paused journey, era filters and completed collection; it does not reroll or reset a life.

Version 2 uses `earthlife-v2`: records (latest 100), permanent unlocked keys, and an active versioned run. Existing valid `earthlife-v1` records are migrated on read; prior already-evicted records cannot be recovered. Import/export supports validated JSON up to 250 KB. Imports replace this browser’s game save; export first if retaining both collections matters. Language remains under `earthlife-language`. Saves from the old Sites origin are not automatically transferred to this domain. There are no accounts or server-side saves.

## License
Copyright © 2026 M.K. This repository’s original code and assets are released under the [MIT License](LICENSE), allowing free use, modification and redistribution under its terms. Author: [M.K. Bio](https://mkhsu.icareu.tw/).

This license applies to this repository only. The acknowledgement of [1in8b.life](https://1in8b.life/zh/) describes creative inspiration; it does not claim that the reference website is open source or grant permission to use its code, artwork, text or data. External resources and fonts retain their respective licenses.


## Version 2 — shared journeys (2026-10-23)
- Production and sharing origin: https://otherlife.icareu.tw/
- Result example: https://otherlife.icareu.tw/#r=2.modern-1.42.0101.zh-Hant
- Same-beginning challenge: https://otherlife.icareu.tw/#c=2.modern-1.42.zh-Hant
- Result links open read-only and never add the sender’s journey to the recipient’s collection. Starting from that result creates a new journey. A shared result must not overwrite an existing unfinished local save.
- The URL carries only a rule version, catalog key, 32-bit positive seed, four binary choices (result only), and language. Unknown versions, invalid keys and malformed inputs are rejected. This is an editable game token, not a verified score.
- The daily start uses the America/Vancouver calendar date and a deterministic pilot selection. It is browser-local and not a clock-enforced competition.
- PNG exports: 1080×1350 post and 1080×1920 story. System sharing uses a prepared PNG when file sharing is supported, otherwise text/link. Clipboard denial exposes selectable text. Cancelled sharing is silent. Social links only open composition pages; the player submits them.
- Social crawlers receive a common 1200×630 `social.png`, not a per-result preview. Fragment data is resolved by the visitor’s browser. `social.png` is a static Canvas composition using system typography and geometric shapes; it contains no player data.
- Instagram/Threads use downloaded cards or the operating-system share sheet; no direct-post integration is claimed.
- New modules: `engine.js` (replay and link contract), `stories.js` (six bilingual pilot stories), `knowledge.js` (source scope), `storage.js` (migration/backup), `share.js` (image/share helpers), `ui-copy.js` (new UI translations).
- Content boundaries and all 24 audit statuses: [content audit](docs/content-audit.md). The remaining 18 dedicated story expansions and per-result server-rendered OG pages belong to P2.
- Run `npm test` (catalog, deterministic links, all pilot branches, local saves and bilingual UI) and `npm run check` before deployment. Verify visitor access without credentials, exact assets and share replay against the deployed commit. See [release verification](docs/release-verification.md).

GitHub `Game quality` checks run only for game source, tests, package/deploy configuration or the workflow itself. Documentation-only changes do not trigger full checks or production deployment. There is no polling or scheduled build.
