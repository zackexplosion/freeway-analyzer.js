# Freeway-Analyzer.js

確認安裝 `node.js 13.`, `docker`, `docker-compose(macos的docker會一起安裝）`，並將專案放置在足夠的硬碟空間內（資料庫與專案會在同個目錄）

`node.js`可利用 `nvm` 安裝，請參考 https://noob.tw/nvm/

安裝相依套件
`npm install`


## 啟動資料庫
可以用 https://direnv.net/ 設定 `DB_PATH` 環境變數，或是直接在cli指定，例如
`DB_PATH=/var/url/db docker-compose up db`

## 從已下載的資料夾匯入

`[THREADS=2] npm run import DATE_PATH [startDateTime] [endDateTime]`

可以用環境變數設定執行緒

| Param       | Example              | Default  |
| ------      | -------------------  | ------------ |
| THREADS     | THREADS=4       | THREADS=2 |
| DATE_PATH   | /var/usr/M06A/       | 無，必填 |
| startDateTime   | 2017-07-07 00:00:00  | 2015-01-01 00:00:00     |
| endDateTime    | 2017-07-07 12:00:00  | 2016-01-01 00:00:00     |

## 計算單筆資料

`node app/details.js OBJECT_ID`

| Param       | Example              | Default  |
| ------      | -------------------  | ------------ |
| OBJECT_ID   | 5dcb31e3bae71011669b8f6e       | 無，必填 |

# 更新門架資料

目前還沒連網自動抓最新的，只能從本地的etag.xml更新
`node lib/gentries.js update > lib/_gentries.js`

