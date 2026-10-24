# 三個熟悉動物故事：來源與分支核對

> 整合狀態：本文件為本輪實際研究紀錄；內容已移入dist/lives-*.js對應世界，原作者factory檔已移除。發布狀態見release-verification.md。

實際查核日期：2026-10-23。僅對應 `dist/stories-companions.js`；替換古典稻農、前工業織工、當代城市居民的故事與species資料，整合由主代理處理。未修改其他故事或共用資料檔。

## ancient-0 小狗

科學身分：家犬 Canis lupus familiaris，年輕但已斷奶，不指定現代品種。地點採約西元200年、今日義大利地中海沿岸的虛構聚落院落。

- 實際開啟：https://www.metmuseum.org/art/collection/search/255121 — 羅馬犬青銅小像，2至3世紀，館方解說人犬相伴及犬在羅馬藝術中的角色。足以支持時代背景，不證明某種現代犬種或文中某家庭存在。
- 實際開啟：https://healthtopics.vetmed.ucdavis.edu/health-topics/canine/barking-dog — 吠叫有遊戲、社交等多種動機；正文只寫玩耍情境中的短吠，不把每次吠叫解讀為攻擊或固定情緒。
- 實際開啟：https://healthtopics.vetmed.ucdavis.edu/health-topics/canine/urine-marking-dogs — 狗透過氣味與環境互動，提供一般嗅聞／氣味社交的背景；正文沒有教兒童處理排泄物。
- 搜尋工具取得研究摘要：https://iris.unito.it/retrieve/eb42be0e-ec53-41d7-b5d2-e88ddbbd5218/Maglieri%20et%20al.%202022b.pdf — Pisa與Turin大學的遊戲鞠躬研究支持前身壓低出現在遊戲互動；直接PDF開啟回403，因此只採搜尋回傳的摘要，不聲稱讀過全文。研究品種不是羅馬時期家犬，不推論所有狗每次姿勢都有完全相同功能。
- 補充查閱：https://www.britishmuseum.org/collection/object/G_1756-0101-1126 — 搜尋工具取得館方條目，羅馬Margarita犬碑記、1至2世紀；直接開啟被403阻擋，因此未作唯一證據，改以可開啟的Met文物為主要歷史來源。

敘事界線：院落、草編籃、人與狗互動均為歷史想像；不宣稱精確考古復原。無現代車道、塑膠玩具、寵物店、現代品種或科技裝備。小狗只在院落探索，沒有追車、啃木棍、吞食碎物或血腥獵捕。

## preindustrial-0 小馬

科學身分：家馬 Equus caballus；「小馬」指體型較小的成年馬，不是尚不能獨立吃草的新生幼駒。情境為約1500年的歐洲中部聚落草地，不指定現代品種。

- 實際開啟：https://ask.ifas.ufl.edu/publication/VM270/pdf — 佛羅里達大學IFAS馬行為資料，支持社交需求、草食、互相理毛、姿態及群體互動。只採一般行為，不採當代訓練器材。
- 實際開啟：https://horses.extension.org/group-feeding-of-horses/ — 大學推廣聯盟的群體取食與個體間距，支持群居並不等於每匹馬同時擠在同一點吃草。
- 實際開啟：https://horses.extension.org/understanding-horse-behavior/ — 家馬一般行為與觀察背景。
- 實際開啟：https://www.metmuseum.org/exhibitions/listings/2005/armored-horse/photo-gallery — 歐洲1480–1620年馬與裝備的歷史館藏背景；只用以確認家馬時代可行性。正文沒有把軍馬盔甲、戰爭角色或特定階級加在草地小馬身上。

敘事界線：草地、鼻息、理毛與短暫小跑為虛構個體片段，沒有精確牧場復原宣稱。無現代車道、電圍欄、塑膠裝備、競賽／騎乘操作指引。沒有跨越障礙或危險狂奔，亦沒有把家馬寫成反芻動物。

## modern-0 小貓

科學身分：家貓 Felis catus，年輕個體、有人照顧、室內生活。臺北家庭是虛構開場，不描述所有家庭的養育方式。

- 實際開啟：https://www.vet.cornell.edu/sites/default/files/WhatToExpect_Updated_2022.pdf — Cornell Feline Health Center資料，支持家貓遊戲、與人相處的個體差異、抓撓與伸展。
- 實際開啟：https://www.vet.cornell.edu/sites/default/files/Destructive%20Behavior%202021%20Accessible.pdf — 抓撓是自然行為、可提供穩固適當抓板；探索與玩耍並非報復。本文沒有採來源裡較舊的威嚇／懲罰建議。
- 補充查閱：https://blogs.cornell.edu/cornellsheltermedicine/2018/05/30/keeping-kitty-content-tips-and-tricks-for-identifying-and-minimizing-stress-in-your-cat-population/ — 搜尋工具取得紙箱與藏身處相關內容，但直接開啟回502，因此不作唯一可讀來源。

敘事界線：2026年臺北家中一天，沒有即時家庭／氣象觀測。軟球明定大顆、紙箱明定乾淨空箱、平台低矮、抓板穩固。沒有玩線繩、吞小物、玩電線、陽台冒險或任意咬室內植物。人停手等貓自行接近；不強迫抱抱，也不把任何單一聲音當必然快樂的證明。

## 先測試、再實作

先於 `/tmp/otherlife-companions-test.mjs` 建立獨立測試，模組不存在時得到預期的 `ERR_MODULE_NOT_FOUND`；之後才新增故事模組。完成後通過：

- 三個指定key、3個profiles、3筆來源及日期。
- 24個事件、9個中性結局；所有故事與species欄位（emoji除外）均登錄繁英文字。
- 48組明寫effects；每事件A與B均至少有一項高於對方，無單方全面勝出。
- 每故事16條選項路線 × seed兩種首章起點，合計96條路線／起點組合均能取到4章後果。

人工承接核對（每種起點皆遵守同一結構）：

| 生命 | 首章A／B導向第2章 | 第2章A／B導向第3章 | 第3章A／B導向第4章 |
| --- | --- | --- | --- |
| 小狗 | 熟悉腳邊／院內嗅聞 | 與熟悉的人靠近／自行探索 | 停下歇息／繼續活動 |
| 小馬 | 靠近同伴／吃草較慢 | 靠近或互理毛／安靜停留或沿草吃 | 慢下來吃草／短暫小跑 |
| 小貓 | 軟球遊戲／紙箱探索 | 喝水／低平台觀察 | 理毛／接近家人 |

每列兩種事件的A與B都保證導向上述對應狀態，再讀下一章文字，未讓未喝水的貓「喝過水」、未小跑的馬「跑過之後」，或未休息的狗「已停下歇息」。引擎按B次數分成0–1／2／3–4三種結局；標題不宣稱最好、最差或科學適存度。程式路線測試只證明資料可達，文字承接另經上述人工核對。
