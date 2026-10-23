# 正式宣傳前發布驗證

狀態：2026-10-23完成正式發布與公開回讀。

## 範圍

- 24種生命專屬故事：192事件、72結局；新增18種的來源見research文件。
- 無後端、migration、Function或runtime secret變更。
- 已移除舊引擎、舊規則分流、通用事件後備、歷史存檔遷移；目前僅一套遊戲／分享格式。
- 可關閉的原創Web Audio輕音樂、音量、背景暫停與雙語狀態。

## 本機證據

- npm test：36項全數通過；npm run check及git diff --check通過。
- 最終音訊72秒，預設音量峰值0.111、最大音量推算峰值0.445（未削波），末端接近零。
- 獨立程式審查發現並修復揭曉階段不合法pending備份；回歸測試通過。

- 全故事所有16條選擇組合、2種首章種子可達；每種8事件及3結局，分享解析／重播一致。
- 24種完整英文與來源索引通過；獨立內容審查未見需阻擋的科學／歷史矛盾。
- 音樂生命週期測試：預設關、單一context與scheduler、背景暫停／恢復、音量限制、無音訊支援退路。
- canonical codex-flypig-ai lane READY；本機390px版面、完整節胸蟲四章、英文切換與音樂操作通過；切換實際瀏覽器分頁讀到paused再恢復。
- 前版分享卡已完成全目錄文字量測；本輪重新設計貼文／限動版面，繁中貼文與長名稱英文限動已肉眼檢查。
- 新分享卡包含地球插畫、結果QR與邀請文字；48個生命／語言QR逐一獨立解碼，最終貼文、限動與OG整張圖片於原尺寸及50%尺寸均成功解碼至預期網址。
- 分享圖支援本機插畫載入失敗時的Canvas地球後備圖；不依賴外部QR服務。
- 音訊離線渲染為72秒非靜音且無削波，沒有第三方媒體請求；未把數值測試當成人耳主觀音質保證。

## 正式回讀

- GitHub main程式提交：`2ba19c69d43e38381d5777bad97bf383085bbf01`，Game quality run `40034466086` success。
- 2026-10-23使用Keychain既有憑證完成production發布，未新增或輪換金鑰。
- Cloudflare部署：`dc1d42f4-098c-4a96-a6a1-53a9a0d3c646`；部署API讀回production、success、main、上述commit，commit_dirty=false。
- 正式網址：https://otherlife.icareu.tw/ ；部署網址：https://dc1d42f4.otherlife.pages.dev 。
- 正式網域app、share、share-qr、stories-all、music、vendor QR、WebP插畫與social.png內容與本機逐位元一致。
- `/index.html`受平台直接存取限制；瀏覽器從公開根路徑取得200並確認sharecard資產版本與OG圖片網址，未以直接路徑403誤判發布失敗。
- canonical codex-flypig-ai瀏覽器開啟實際結果連結，讀到紅樹、正確四章選擇、67/57/74數值與潮間的綠蔭結局；目錄24種。
- 正式網站成功載入插畫並產生1080×1350 PNG（1,242,305 bytes）；點擊「用相同起點遊玩」正確進入紅樹起點，可繼續遊玩。
- 分享圖片原尺寸與50%尺寸的獨立QR解碼證據見本機證據；未代替玩家送出任何社群貼文。
