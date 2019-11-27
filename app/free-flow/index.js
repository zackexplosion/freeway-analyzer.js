// packages
const sprintf = require('sprintf-js').sprintf
const moment = require('moment')
const os = require('os')
const fs = require('fs')
const path = require('path')

// constants
const BASE_URL = 'http://tisvcloud.freeway.gov.tw/history/TDCS/M06A/'
const FORMATTER_WITH_HOUR = 'YYYY-MM-DD HH'
const FILENAME = 'M06A_%1$s.tar.gz'

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

var db

function buildRawFilePath (baseDir, targetDateTime) {
  let hour = moment(targetDateTime).format('HH')
  let YYYYMMDD = moment(targetDateTime).format('YYYYMMDD')
  let filePath = path.join(baseDir, hour, `TDCS_M06A_${YYYYMMDD}_${hour}0000.csv`)

  if (fs.existsSync(filePath)) {
    return filePath
  } else {
    return false
  }
}
async function main () {
  var hrstart = process.hrtime()
  try {
    // set db as global variable
    db = await require('../common')
    global.db = db

    // find missing raw data in database
    let missingRawDataByRange = await getMissingRawDataByRange()

    // TODO
    // Make it multithread?
    let missingDateTime
    while ((missingDateTime = missingRawDataByRange.shift())) {
      // if the raw data are missing, check the source file
      // if source file not exist, download it
      let importBaseDir = await checkSourceFile(missingDateTime)

      // import missing data by missingDatetime
      let filePath = buildRawFilePath(importBaseDir, missingDateTime)

      // if the file path build success, import to database
      if (filePath) {
        let msg = await importToDB(filePath)
        console.log(msg)
      }
    }

    // count the free flow by startGentryId
    let r = await getSection(startGentryId, startDateTime, endDateTime)

    // print data with babar cli-chart
    printData(r)
  } catch (error) {
    console.log(error)
  }

  var hrend = process.hrtime(hrstart)
  console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
  process.exit()
}

async function getMissingRawDataByRange () {
  console.log('Checking if raw data imported')
  let hoursBetweenQuery = moment.duration(endDateTime - startDateTime).asHours()
  let currentIndexDateTime = moment(startDateTime)
  let missingRawDataByRange = []
  for (let i = 0; i <= hoursBetweenQuery; i++) {
    let query = {
      // 車子有可能是從其他時段經過的，所以多這個欄位特地給第一次檢查看看資料有沒有匯入
      tripStartDateTime: {
        $gte: currentIndexDateTime.toISOString(),
        $lte: moment(currentIndexDateTime).add(1, 'hour').toISOString()
      }
    }
    // console.log(query, endDateTime.format(FORMATTER_WITH_HOUR), startDateTime.format(FORMATTER_WITH_HOUR))
    let records = await db.models.Freeflow.findOne(query)
    if (!records) {
      missingRawDataByRange.push(currentIndexDateTime.format(FORMATTER_WITH_HOUR))
    }

    currentIndexDateTime.add(1, 'hour')
  }
  return missingRawDataByRange
}

async function checkSourceFile (targetDateTime) {
  targetDateTime = moment(targetDateTime).format('YYYYMMDD')
  let targetDir = path.join(os.tmpdir(), 'M06A/', targetDateTime)
  let dirExist = fs.existsSync(targetDir)
  const filename = sprintf(FILENAME, targetDateTime)
  const fileUrl = BASE_URL + filename
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
