const fs = require('fs')
const fastcsv = require('fast-csv')
const path = require('path')
const moment = require('moment')

const {
  isMainThread, parentPort, workerData, threadId,
  MessageChannel, MessagePort, Worker
} = require('worker_threads')

const log = function(){
  // 1. Convert args to a normal array
  var args = Array.prototype.slice.call(arguments);
  // 2. Prepend log prefix log string
  args.unshift(`${moment().format()}/ tid ${threadId}:`);

  // 3. Pass along arguments to console.log
  console.log.apply(console, args);
}


// start here
module.exports = function workerThread() {
  // console.log(`worker: threadId ${threadId} start with ${__filename}`)
  // console.log(`worker: workerDate ${workerData}`)
  require('../common')(async (err, Models) => {
    if (err) {
      return
    }
    let {
      BASE_PATH,
      startDate,
      endDate
    } = workerData
    let progress = 0
    try {
      let currentDate = moment(startDate),
          YYYYMMDD,
          hour,
          file_path
      while(true) {
        if (currentDate.isSame(endDate)) {
          break;
        }

        YYYYMMDD = currentDate.format('YYYYMMDD')
        hour = currentDate.format('HH')
        file_path = path.join(BASE_PATH, YYYYMMDD, hour, `TDCS_M06A_${YYYYMMDD}_${hour}0000.csv`)

        try {
          if (fs.existsSync(file_path)) {
            // log('reading', file_path)
            let { rows, rowCount } = await parseCSV(file_path)
            // log(`Parsed ${rowCount} rows, writing to db`)
            // await Models.M06A.insertMany(rows)
          } else {
            log('path', file_path, 'not exist')
          }
        } catch(err) {
          console.error(err)
        }

        currentDate = currentDate.add(1, 'hour')
        progress++
        parentPort.postMessage({
          threadId,
          file_path,
          progress
        })
      }

    } catch (error) {
      console.error(error)
    }
  })
}

function parseCSV(file) {
  let rows = []
  return new Promise((resolve, reject) => {
    fastcsv
    .parseFile(file)
    .on('error', error => {
      console.error(error)
      reject(error)
    })
    .on('data', row => {
      // console.log(row)
      rows.push({
        vehicleType: parseInt(row[0]),
        enterTime: moment(row[1]),
        enterGentry: row[2],
        exitTime: moment(row[3]),
        exitGentry: row[4],
        tripLength: parseFloat(row[5]),
        // tripEnd: row[6], // unused column
        tripDetails: row[7].split(';')
      })
    })
    .on('end', rowCount => {
      resolve({
        rows,
        rowCount
      })
    })
  })
}