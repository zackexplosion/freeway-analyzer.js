# Freeway-Analyzer.js

確認安裝 `node.js 10.16`, `docker`, `docker-compose(macos的docker會一起安裝）`，並將專案放置在足夠的硬碟空間內（資料庫與專案會在同個目錄）

`node.js`可利用 `nvm` 安裝，請參考 https://noob.tw/nvm/

啟動資料庫
`docker-compose up db -d`

從已下載的資料夾匯入
`npm run import DATE_PATH [startDate]`

| Param       | Example              | Default  |
| ------      | -------------------  | ------------ |
| DATE_PATH   | /var/usr/M06A/       | 無，必填 |
| startDate   | 2017-07-07 00:00:00  | 2015-01-01 00:00:00     |
