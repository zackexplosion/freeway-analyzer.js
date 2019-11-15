# Freeway-Analyzer.js

請確認安裝 `node.js 13.`, `docker`, `docker-compose(macos的docker會一起安裝）`，並將專案放置在足夠的硬碟空間內（資料庫與專案會在同個目錄）

`node.js`可利用 `nvm` 安裝，請參考 https://noob.tw/nvm/

安裝相依套件
`npm install`


## 啟動資料庫
可以用 https://direnv.net/ 設定 `DB_PATH` 環境變數，或是直接在cli指定，例如
`DB_PATH=/var/url/db docker-compose up -d`

## 計算自由車流
`npm run freeflow [START_DATETIME] [END_DATETIME] [START_GENTRY_ID]`

自動抓取缺少的資料並從高公局下載，但目前檢查是否已匯入的部份還有些小問題，因此結束時間拉長的話資料可能會不準確

| Param       | Example             | Default  |
| ------      | ------------------- | ------------ |
| START_GENTRY_ID  | 03F2899N       | 05F0000S |
| START_DATETIME   | 2017-07-07 00  | 2015-01-01 00 |
| END_DATETIME   | 2017-07-07 23    | 2015-01-01 01(預設為開始時間加一小時） |

![](https://i.imgur.com/e0y8acG.png)


# 更新門架資料

目前還沒連網自動抓最新的，只能從本地的etag.xml更新
`node lib/gentries.js update > lib/_gentries.js`

