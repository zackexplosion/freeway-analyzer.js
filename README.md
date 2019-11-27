# Freeway-Analyzer.js

嗯...目前文件不是很完善

計算由高公局提供的自由車流，目前使用的資料為M06A

<http://tisvcloud.freeway.gov.tw>

## 準備工作
請確認安裝 `docker`, `docker-compose`(macos的docker會一起安裝）

可以用 <https://direnv.net> 設定 `DB_PATH` 環境變數，或是直接在cli指定，例如

本專案需要佔用系統 `27017` 與 `4000` 兩個 PORT，請先確認無其他應用程式佔用

### 啟動指令
使用後會跑在背景，第一次會比較久，因為要 build image
`DB_PATH=/var/url/db docker-compose up -d`


## 計算自由車流
`docker-compose exec app npm run freeflow [START_GENTRY_ID] [START_DATETIME] [END_DATETIME] `

自動抓取缺少的資料並從高公局下載，但目前檢查是否已匯入的部份還有些小問題，因此結束時間拉長的話資料可能會不準確

| Param       | Example             | Default  |
| ------      | ------------------- | ------------ |
| START_GENTRY_ID  | 03F2899N       | 05F0000S |
| START_DATETIME   | 2017-07-07 00  | 2015-01-01 00 |
| END_DATETIME   | 2017-07-07 23    | 2015-01-01 01(預設為開始時間加一小時） |

![](https://i.imgur.com/e0y8acG.png)

## 本地 Node.js
如果你使用本機的Node.js開發，請安裝`node.js 13.1`

`node.js`可利用 `nvm` 安裝，請參考 https://noob.tw/nvm/

安裝相依套件
`npm install`

## 更新門架資料

目前還沒連網自動抓最新的，只能從本地的etag.xml更新
`node lib/gentries.js update > lib/_gentries.js`

# freeway-analyzer.js

---

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
