const moment = require('moment')
const fs = require('fs')
const fastcsv = require('fast-csv')
const path = require('path')
const BASE_PATH = process.argv[2]

if (!BASE_PATH) {
  throw '找不到目標資料夾'
}

// start here
require('./common')(async (err, Models) => {
  if (err) {
    return
  }
  try {
    const startDate = process.argv[3] || '2015-01-01 00:00:00'

    let keepGoing = true,
        currentDate = moment(startDate),
        YYYYMMDD,
        hour,
        file_path,
        rows
    while(keepGoing) {
      if (currentDate.format('YYYY') === '2016') {
        keepGoing = false
        break;
      }

      YYYYMMDD = currentDate.format('YYYYMMDD')
      hour = currentDate.format('HH')
      file_path = path.join(BASE_PATH, YYYYMMDD, hour, `TDCS_M06A_${YYYYMMDD}_${hour}0000.csv`)

      try {
        if (fs.existsSync(file_path)) {
          log('reading', file_path)
          rows = await parseCSV(file_path)
          await Models.M06A.insertMany(rows)
        } else {
          log('path', file_path, 'not exist')
        }
      } catch(err) {
        error(err)
      }

      currentDate = currentDate.add(1, 'hour')
    }

  } catch (error) {
    console.error(error)
  }
})

var log = function(){

  // 1. Convert args to a normal array
  var args = Array.prototype.slice.call(arguments);
  // 2. Prepend log prefix log string
  args.unshift(moment().format());

  // 3. Pass along arguments to console.log
  console.log.apply(console, args);
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
      log(`Parsed ${rowCount} rows, writing to db`)
      resolve(rows)
    })
  })
}