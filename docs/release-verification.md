# Version 2 發布驗證

狀態：2026-10-23 已完成 GitHub、Cloudflare API 與正式公開行為交叉驗證。此為本輪證據快照，未承諾外部社群逐平台發文結果。

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

## 正式部署後發現與處理
- 首次部署 production f5f27862 對應 5f814f8，API success、commit_dirty=false。
- 所有 12 個非 HTML 可服務資產逐位元一致；HTML 額外注入既有 Cloudflare traffic beacon。公開隱私說明已補充基本流量統計，將以移除已識別單一 beacon 後的 HTML 及 metadata 比對作為驗證。
- Zone 把靜態資產 max-age 設為 14400 秒，因此入口、樣式與所有模組 import 加上 ?v=2，避免新入口載入舊快取。

## 正式發布驗證結果
- Runtime commit：`1ba7acacd76ebb0435149165cfc080357787dc7f`，已在 GitHub main。
- GitHub Game quality：run `40015282465`，success；本機 24 tests 與所有執行模組語法通過。
- Cloudflare canonical production deployment：`243e4774-0ec8-4bec-8693-2c1e56a81fe5`，success，`commit_dirty=false`，branch main，commit hash 與上列一致。
- Production alias：https://otherlife.icareu.tw/；deployment：https://243e4774.otherlife.pages.dev/。
- 無 Cookie、無 Authorization 的公開 HTTP readback：12 個非 HTML 可服務資產全部 SHA-256 與本機一致。HTML 除既有單一 Cloudflare traffic beacon 與其換行外一致；canonical、OG 圖與版本化入口已核對。沒有更動既有流量統計設定。
- 正式瀏覽器依次載入 app/data/i18n/engine/storage/knowledge/stories/share/ui-copy 的 `?v=2` 模組。
- 正式範例結果：`/#r=2.modern-1.42.0101.zh-Hant`，唯讀重播 67/57/74，首次訪客不寫入圖鑑。
- 正式範例挑戰：`/#c=2.modern-1.42.en`，可直接開始、完成四章並重現 67/57/74；兩語可切換。
- 正式 PNG 實際解碼：1080×1350 與 1080×1920。390px viewport 無水平溢出；正式 console error=0。
- 上述驗證後的文件提交僅更新 docs，不改 dist；依最小觸發原則不再部署或重跑完整 CI。GitHub main 的文件後續 commit 與 runtime commit 不同，但正式輸出保持一致。

## 保留界線
- 其餘 18 種生命仍可玩通用事件，專屬事件與逐物種查核列入 P2；詳見 content-audit.md。
- 共用 OG 預覽圖已部署；個別結果的動態社群 OG 圖未實作，不冒稱已支援。
- 分享連結可手工編輯，不是防作弊成績；今日模式使用裝置時間換算溫哥華日期。
- 系統分享與外部社群送出由玩家操作。已測試取消／不支援／剪貼簿拒絕退路，未替玩家完成外部發文。
