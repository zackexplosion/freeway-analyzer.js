// packages
const sprintf = require('sprintf-js').sprintf
const moment = require('moment')
const os = require('os')
const fs = require('fs')
const path = require('path')


// constants
const BASE_URL = 'http://tisvcloud.freeway.gov.tw/history/TDCS/M06A/'
const FORMATTER_WITH_HOUR = 'YYYY-MM-DD HH'

// arguments
const startGentryId = process.argv[2] || '05F0000S'
const startDateTime = moment(process.argv[3] || '2015-01-01 00', [FORMATTER_WITH_HOUR])
const endDateTime = moment(process.argv[4] || moment(startDateTime).add(1, 'hour'), FORMATTER_WITH_HOUR) // wrap moment again to copy object

// local imports
const download = require('./download')
const extract = require('./extract')
const importToDB = require('./importToDB')
const printData = require('./printData')
const getSection = require('./getSection')

// TODO
// improve checkfiles
const FILENAME = 'M06A_%1$s.tar.gz'
const filename = sprintf(FILENAME, startDateTime.format('YYYYMMDD'))

// let hoursBetweenQuery = moment.duration(endDateTime - startDateTime)
// let currentIndexDateTime = Object.assign({}, moment(startDateTime))
// let requiredDataByHours = []

// console.log(currentIndexDateTime)
// console.log(endDateTime)
// console.log(currentIndexDateTime.isSame(endDateTime))

// while(!moment(endDateTime).isSame(currentIndexDateTime)) {
//   requiredDataByHours.push(currentIndexDateTime.format(FORMATTER_WITH_HOUR))
//   currentIndexDateTime = moment(currentIndexDateTime).add(1, 'hour')
// }

// console.log(requiredDataByHours)

// console.log('hoursBetweenQuery', hoursBetweenQuery)
// process.exit()
async function main() {
  var hrstart = process.hrtime()
  try {
    let db = await require('../common')

    let query = {
      // 車子有可能是從其他時段經過的，所以多這個欄位特地給第一次檢查看看資料有沒有匯入
      tripStartDateTime: {
        $gte: startDateTime.toISOString(),
        $lte: endDateTime.toISOString()
      }
    }
    console.log('Checking if raw data imported')
    console.log(query)
    let records = await db.models.Freeflow.find(query)
    if (records.length <= 0) {
      console.log('records not found')
      let importBaseDir = await checkSourceFile(filename)
      let r = await importToDB(importBaseDir, db, startDateTime, endDateTime)
      console.info(r)
    }

    let r = await getSection(db, startGentryId, startDateTime, endDateTime)
    printData(r)
  } catch (error) {
    console.log(error)
  }
  var hrend = process.hrtime(hrstart)
  console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
  process.exit()
}

async function checkSourceFile () {
  let targetDir = path.join(os.tmpdir(), 'M06A/', startDateTime.format('YYYYMMDD'))
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