const sprintf = require('sprintf-js').sprintf
const download = require('./download')
const extract = require('./extract')
const importToDB = require('./importToDB')
const moment = require('moment')
const os = require('os')
const fs = require('fs')
const path = require('path')
const startDateTime = process.argv[2] || '2015-01-01 00'
const endDateTime = process.argv[3] || '2015-01-01 00'
const DATE_FORMAT = 'YYYY-MM-DD HH'
const BASE_URL = 'http://tisvcloud.freeway.gov.tw/history/TDCS/M06A/'
const FILENAME = 'M06A_%1$s.tar.gz'
const filename = sprintf(FILENAME, moment(startDateTime).format('YYYYMMDD'))
// console.log(startDateTime, endDateTime)
async function main() {
  let db
  try {
    db = await require('../common')
    // console.log(db.connections)
    const Freeflow = db.models.Freeflow

    let query = {
      // 車子有可能是從其他時段經過的，所以多這個欄位特地給第一次檢查看看資料有沒有匯入
      tripStartDateTime: {
        $gte: moment(startDateTime).toISOString()
      },
      endDateTime: {
        $lte: moment(endDateTime).toISOString()
      }
    }
    console.log(query)
    db.models.Freeflow.find(query, (err, d) => {
      console.log('err', err)
      console.log('d', d)
    })
    // let records = await db.models.Freeflow.find(query)
    // console.log(records)
    // let importBaseDir = await checkSourceFile(filename)
    // await importToDB(importBaseDir, db, startDateTime, endDateTime)
  } catch (error) {
    console.log(error)
  }

  // process.exit()
}


async function checkSourceFile () {
  let targetDir = path.join(os.tmpdir(), 'M06A/', moment(startDateTime).format('YYYYMMDD'))
  let dirExist = fs.existsSync(targetDir)
  let fileUrl = BASE_URL + filename
  // let rawFilePath = path.join(os.tmpdir(), filename)
  // let rawFileExists = fs.existsSync(rawFilePath)
  if (!dirExist) {
    try {
      let rawFilePath = await download(fileUrl)
      if (fs.existsSync(targetDir)) {
        fs.unlinkSync(targetDir)
      }

      console.log('Extracting', rawFilePath)
      await extract(rawFilePath)
      return targetDir
    } catch (error) {
      console.log(error)
    }
  }

  return targetDir
}

main()