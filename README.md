# 地球轉生所 / OTHER LIFE

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

## 目前遊戲

- 正式網站：https://otherlife.icareu.tw/
- 唯一開發來源：https://github.com/mkhsu2002/otherlife ，正式分支 `main`。
- 8個年代、72種生命，每代9種；每種4章、8個可達事件、3個分支結局，共576事件與216個結局標題。
- 自由抽籤、指定年代、今日共同起點、結果回顧、生命圖鑑與同籤挑戰。
- 遊戲機率與三項數值屬敘事設計，不是實際出生、存活或生命價值評分。
- 完整繁體中文／英文；語言切換保留當前旅程。揭曉、四章旅程、結局有階段標示；選擇後顯示後果並聚焦明確的下一章按鈕，最後一章前往結局。
- 新增48種生命的選項各有數值取捨，不提供每項數值都更好的單一選項。自由抽籤每種約1/72，指定年代約1/9；是遊戲設計而非自然機率。
- 結果分享例：https://otherlife.icareu.tw/#r=carboniferous-1.42.0101.zh-Hant
- 同籤挑戰例：https://otherlife.icareu.tw/#c=carboniferous-1.42.zh-Hant
- 分享結果唯讀，不會自動加入朋友的圖鑑；對方可從同一起點遊玩。分享參數只含生命ID、種子、選擇與語言，沒有個人資料或整本圖鑑。
- 系統分享、LINE／Facebook／X入口與PNG貼文／限動卡；Instagram／Threads可使用下載圖片或系統分享。玩家自行最終送出，不自動發文。貼文／限動卡包含地球插畫與連往該次結果的QR code；共用OG圖包含首頁QR，不宣稱每個結果有不同社群預覽。

## 輕音樂

原創環境旋律以柔和延音和弦、稀疏五聲音階旋律及輕回聲構成。瀏覽器本機合成，沒有外部音樂授權、付費API或第三方音樂請求。音樂與程式均適用本repo的MIT授權。

每次開啟預設關閉，由玩家點擊啟動；可停播、調音量。只記住音量偏好，切換頁籤時暫停，回到遊戲時僅在玩家先前已啟用的情況下恢復。語言／頁面切換不增加播放器。裝置無法播放時顯示簡短訊息，遊戲仍可正常操作。

## 資料與內容查核

- 無帳號、後端、資料庫或雲端存檔。`earthlife-save`保存本機圖鑑、最近100段旅程與未完成進度；已解鎖生命獨立保留。`earthlife-language`與`earthlife-music-volume`保存偏好。
- 提供JSON備份匯入／匯出與清除資料；匯入上限250KB且驗證資料格式。匯入會取代當前圖鑑，想保留兩份時先匯出。
- 目前為正式宣傳前的單一乾淨模型，沒有舊規則分流、舊連結相容或歷史存檔遷移。
- 日期與地點依各生命的來源情境呈現；年代篩選顯示情境範圍，不宣稱同一紀的所有生命同時存在。
- [內容與來源索引](docs/content-audit.md)涵蓋全部72種；原24種與新增48種的實際查核範圍分別見`docs/research-*.md`及`docs/research-expansion-*.md`。故事細節是有證據界線的想像，不是完整生物／歷史重建。
- 主機平台有基本Cloudflare流量統計，公開隱私文案有說明。遊戲不要求姓名／電子郵件、不上傳圖鑑，也沒有自己的分析後端。

## 專案結構

- `dist/data.js`：年代／基本目錄、抽選與數值純函式。
- `dist/stories.js`、`stories-early.js`、`stories-middle.js`、`stories-recent.js`：原24種雙語故事。
- `dist/expansion-early.js`、`expansion-middle.js`、`expansion-recent.js`：新增48種雙語故事、目錄與來源。
- `dist/story-kit.js`：共用故事結構與雙語驗證；`stories-all.js`整合故事與情境資料。
- `dist/engine.js`：唯一遊戲規則、種子、分支、結果重播與分享參數驗證。
- `dist/knowledge.js`：來源與證據範圍。
- `dist/storage.js`：本機資料、備份驗證與永久解鎖。
- `dist/share-qr.js`、`dist/vendor/qrcode.mjs`：本機產生可掃描QR，無第三方QR服務；`npm run vendor:qr`由鎖定套件重建供應檔。
- `dist/share.js`：分享入口、可複製文字、1080×1350／1080×1920圖片。
- `dist/music.js`：原創曲譜、聲音生命週期與無障礙音樂控制。
- `dist/app.js`、`i18n.js`、`ui-copy.js`、`style.css`、`index.html`：介面與語系。

## 開發、驗證與部署

正式網站不需建置或外部服務。開發測試先執行`npm ci`安裝QR解碼測試依賴；瀏覽器使用已納入版本控制的本機QR模組。`npm run dev`開啟本機預覽；`npm test`驗證所有生命、分享參數、儲存、雙語與音樂；`npm run check`檢查執行模組語法。

Cloudflare Pages專案`otherlife`，正式分支`main`，輸出`dist/`，帳號ID `82af99e90d342a30d2386efaa8ef4966`。平台是Direct Upload，GitHub推送不會自動部署；所有開發先同步repo，再從乾淨的main提交發布：

```sh
CLOUDFLARE_ACCOUNT_ID=82af99e90d342a30d2386efaa8ef4966 npx wrangler pages deploy dist --project-name otherlife --branch main
```

使用安全儲存中的Wrangler授權，沒有repo／runtime secret。完成須核對GitHub、Cloudflare部署commit、公開資產及遊戲／分享／音樂行為。[發布驗證](docs/release-verification.md)記錄本次結果。主機對資產有快取，入口與模組的`?rev=otherlife72`只用於部署快取識別，不是多套遊戲規則。

GitHub品質檢查只在遊戲來源、測試、套件／部署設定或workflow變更時觸發；docs-only不啟動完整CI或部署，沒有排程空跑。

## License

Copyright © 2026 M.K. 本repo原創程式、圖像與音樂採[MIT License](LICENSE)。作者：[M.K. Bio](https://mkhsu.icareu.tw/)。參考作品的致謝不代表取得其程式、美術或資料授權；外部資源保有各自權利。

第三方QR產生器qrcode-generator 2.0.4採MIT，授權見`dist/vendor/LICENSE.qrcode.txt`；jsQR 1.4.0採Apache-2.0，僅用於開發測試，不送至玩家瀏覽器。分享插畫是概念性地球意象，非特定年代的地理重建。

共用社群預覽可由`scripts/social-cover.mjs`重建：以靜態HTTP服務repo根目錄，在瀏覽器呼叫`socialCover()`並以1200×630儲存Canvas；底圖與QR皆使用repo本機資產。
