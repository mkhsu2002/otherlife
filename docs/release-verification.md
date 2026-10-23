# Version 2 發布驗證

狀態：2026-10-23 實作完成，等待本輪 GitHub main 與正式部署驗證。不得以本頁取代正式結果。

## 來源與平台
- 唯一開發 repo：mkhsu2002/otherlife；正式分支 main；輸出 dist/。
- 正式網址：https://otherlife.icareu.tw/；Pages project：otherlife。
- 本輪 Cloudflare 官方 API 回讀：source=null、production_branch=main、domains 包含 otherlife.icareu.tw 與 otherlife.pages.dev。原部署為 ad_hoc Direct Upload，並非 Git 自動連動。
- Wrangler OAuth 已刷新並驗證目標帳號有 pages write；沒有複製 OAuth 到 repo、CI 或 runtime，也沒有建立新的秘密。
- 本次維持純靜態，無資料庫、migration、Function、RPC、後端契約或 runtime bindings 變更。

## 已完成驗證
- npm test：24 項通過，涵蓋全目錄、六種先導生命所有路線、嚴格連結解析、相同種子重播、舊資料遷移、100 筆淘汰後保留解鎖、損壞匯入、未完成 pending 重整、重複點擊與分享結果後續玩自己的旅程。
- npm run check：所有新增及既有執行模組語法通過。
- canonical codex-flypig-ai lane：READY；使用本機 preview，不碰帳號設定或發布社群。
- 瀏覽器完整走完英文帝王企鵝四章，統計 67/57/74；相同結果網址讀回一致，不增加圖鑑紀錄。
- 390px 手機版結果與旅程無水平溢出；切語言、同起點、知識 dialog、pending 重整續玩可用。
- 1080×1350 結果卡已肉眼檢視；兩語全 24 情境的一組路線經瀏覽器 Canvas 排版量測，正文不侵入頁尾。
- 原生分享及社群最終送出由玩家執行，未代玩家發文。各 OS 原生分享面板與外部社群實際貼文仍依平台支援，未宣稱完成逐平台發文驗證。

- 已修復獨立審查發現的 paused/run/shared 混用；回歸測試確認自己的起點與選擇仍可恢復。
- 瀏覽器驗證剪貼簿拒絕的手動複製、分享取消無錯誤、損壞備份不覆寫現存資料。

## 待完成
- 對準最終 GitHub main commit 的 Cloudflare production deployment 成功。
- 無憑證公開讀回首頁、全部靜態模組與 OG 圖，核對檔案雜湊。
- 正式結果／挑戰網址在瀏覽器重播與開始遊玩；正式 console 無錯誤。
