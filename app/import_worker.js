const moment = require('moment')
const fs = require('fs')
const fastcsv = require('fast-csv')
const path = require('path')
const {
  isMainThread, parentPort, workerData, threadId,
  MessageChannel, MessagePort, Worker
} = require('worker_threads')
const worker_count = 8
const log = function(){
  // 1. Convert args to a normal array
  var args = Array.prototype.slice.call(arguments);
  // 2. Prepend log prefix log string
  args.unshift(`${moment().format()}/ tid ${threadId}:`);

  // 3. Pass along arguments to console.log
  console.log.apply(console, args);
}



function mainThread() {
  var BASE_PATH = process.argv[2]
  if (!BASE_PATH) {
    throw '找不到目標資料夾'
  }
  const startDate = moment(process.argv[3] || '2015-01-01 00:00:00')
  const endDate = moment(process.argv[4] || '2016-01-01 00:00:00')
  console.log('startDate', startDate, 'endDate', endDate)
  var duration = moment.duration(endDate.diff(startDate));
  var peroid_length = duration.asHours() / worker_count
  console.log('peroid_length', peroid_length)
  for(let i = 0;i < worker_count; i++) {
    let startIndex = i * peroid_length
    let _workderData = {
      BASE_PATH,
      startDate: moment(startDate).add(startIndex, 'hour').format(),
      endDate: moment(startDate).add(startIndex + peroid_length).format()
    }
    console.log(i, '_workderData', 'startDate', _workderData.startDate, 'endDate', _workderData.endDate)
    const worker = new Worker(__filename, { workerData: _workderData });
    worker.on('exit', code => { console.log(`main: worker stopped with exit code ${code}`); });
    // worker.on('message', msg => {
    //   console.log(`main: receive ${msg}`);
    //   worker.postMessage(msg + 1);
    // })
  }
}

if (isMainThread) {
  mainThread();
} else {
  workerThread();
}


  // start here
function workerThread() {
  // console.log(`worker: threadId ${threadId} start with ${__filename}`);
  // console.log(`worker: workerDate ${workerData}`);

  require('./common')(async (err, Models) => {
    if (err) {
      return
    }
    // const startDate = process.argv[3] || '2015-01-01 00:00:00'
    // log(workerData)
    let {
      BASE_PATH,
      startDate,
      endDate
    } = workerData
    try {
      let currentDate = moment(startDate),
          YYYYMMDD,
          hour,
          file_path,
          rows
      while(true) {
        if (currentDate.isSame(endDate)) {
          break;
        }

        YYYYMMDD = currentDate.format('YYYYMMDD')
        hour = currentDate.format('HH')
        file_path = path.join(BASE_PATH, YYYYMMDD, hour, `TDCS_M06A_${YYYYMMDD}_${hour}0000.csv`)

        try {
          if (fs.existsSync(file_path)) {
            log('reading', file_path)
            let { rows, rowCount } = await parseCSV(file_path)
            log(`Parsed ${rowCount} rows, writing to db`)
            await Models.M06A.insertMany(rows)
          } else {
            log('path', file_path, 'not exist')
          }
        } catch(err) {
          console.error(err)
        }

        currentDate = currentDate.add(1, 'hour')
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