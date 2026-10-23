# OTHER LIFE Implementation Plan

狀態：2026-10-23使用者核准設計後已完成實作、驗證與正式發布；證據見../../release-verification.md。

**Goal:** OTHER LIFE品牌、72生命與清楚的下一步，完整驗證後正式發布。
**Architecture:** 靜態ES modules；新增3個年代內容模組，各自輸出stories/translations/sources/profiles/additions，data.js合併目錄，stories-all.js合併故事。無後端與migration。
**Tech Stack:** JavaScript、Canvas、Node test、Cloudflare Pages。

## 工作與驗證

- [x] 三組獨立內容：expansion-early.js(18)、expansion-middle.js(18)、expansion-recent.js(12)。查核官方來源，逐項記錄docs/research-expansion-*.md；每個生命8事件3結局，雙語且兩選項明確效果。
- [x] 先將目錄測試改為72／每代9，觀察24 !== 72失敗，再整合additions與stories、翻譯和來源；QR/存檔/重播同用原資料契約。
- [x] UI狀態測試先要求第1章與明確前進提示；renderLife與showAftermath加入階段和下一章編號，後果按鈕聚焦與捲動，語系切換和重複操作保持原狀態。
- [x] 公開品牌文字統一OTHER LIFE，包括Canvas與共用OG圖；以可重建腳本更新OG並肉眼確認QR。
- [x] 首頁與About數量、抽選機率、解鎖進度從資料推導，更新README／來源索引／發布記錄，歷史設計標記完成狀態。
- [x] 全目錄所有16路線及兩首章種子可重播、8可達事件、3結局、全英文無漢字；跨72生命雙語QR解碼、備份與存檔回歸。
- [x] 內容規格審查後程式品質審查，修復阻擋問題；本機手機／桌面操作、英文與分享圖檢查。
- [x] GitHub main品質成功後部署Cloudflare，讀回部署commit、正式資產、72目錄與新故事完整旅程、實際分享圖與QR。

新增模組獨立寫入，主代理負責共用檔整合以避免衝突。測試指令：npm test、npm run check、git diff --check。CI只觸發正式來源與測試，docs-only不觸發完整CI。
