const path = require('path')
const fs = require('fs')
// const cliProgress = require('cli-progress')
const getVehicleType = require('../../lib/vehicleTypes')
const getGentry = require('../../lib/gentries')
const parseCSV = require('./parseCSV')
const moment = require('moment')
const ObjectId = require('mongoose').Types.ObjectId

function calculateSpeed(d1, d2, length) {
  // let duration = (d2 - d1) / 1000
  let duration = moment.duration(new Date(d2) - new Date(d1))
  let speed = (length / duration.asHours())
  speed = Math.round(Math.abs(speed))
  return speed
}

function readFiles(baseDir, startHour, endHour) {
  if (startHour > 23 || startHour < 0 ) startHour = 0
  if (endHour > 23 || endtHour < 0 ) endHour = 23
  let files = []
  for (let i =0;i < 24; i++){
    let hour = i
    if (hour < 10) {
      hour = '0' + i
    }
    // console.log('baseDir', path.dirname(baseDir))
    let YYYYMMDD = baseDir.split(path.sep).pop()
    let file_path = path.join(baseDir, hour.toString(), `TDCS_M06A_${YYYYMMDD}_${hour}0000.csv`)
    try {
      if (fs.existsSync(file_path)) {
        // await cb(file_path)
        files.push(file_path)
      } else {
        console.log(file_path, 'not exist')
      }
    } catch(err) {
      console.error(err)
    }
  }
  return files
}

function handleRow(index, row) {
  let i = 0
  let details = row['tripDetails']
  // let vehicleId =
  //   row['vehicleType'] +
  //   row['enterTime'] +
  //   row['enterGentry'] +
  //   row['exitTime'] +
  //   row['exitGentry']

  let vehicleId = ObjectId()
  let tripStartDateTime = row['enterTime']
  let result = []

  // console.log('row', details)
  do {
    try {
      // console.log('--')
      // console.log(details[i])
      let nextIndex = (details.length > 1) ? i + 1 : 0
      let [startDateTime, startGentryId] = details[i].trim().split('+')
      let [endDateTime, endGentryId] = details[nextIndex].trim().split('+')
      let vehicleType = getVehicleType(row.vehicleType)
      let startGentry = getGentry(startGentryId)
      let endGentry = getGentry(endGentryId)
      let tripLength = 0
      let speed = 0

      // prevent duplicate records
      let key =
              i.toString() + index.toString() +
              row['vehicleType'] +
              startGentryId +
              endGentryId +
              startDateTime +
              endDateTime

      // console.log('gentry', startGentryId, startGentry.locationMile, endGentry.locationMile)
      if (startGentry && endGentry && startGentryId != endGentryId) {
        tripLength = Math.abs(
          getGentry(endGentryId).locationMile -
          getGentry(startGentryId).locationMile
        ).toFixed(1)

        tripLength = parseFloat(tripLength)
        speed = calculateSpeed(startDateTime, endDateTime, tripLength)
      }

      // console.log('tripLength', tripLength)
      // console.log('speed', speed)
      let row_to_insert = {
        vehicleId,
        key,
        tripStartDateTime,
        vehicleType,
        startDateTime,
        endDateTime,
        startGentryId,
        endGentryId,
        startGentry,
        endGentry,
        tripLength,
        speed
      }

      result.push(row_to_insert)
      i++
    } catch (error) {
      console.log(error)
    }
  } while(i < details.length - 1)
  return result
}

module.exports = function(baseDir, db) {
  // console.log('db', db.models['Freeflow'])
  // console.log('db', db.models.Freeflow.create)
  // console.log(Object.keys(db.models))
  return new Promise(async (resolve, reject) => {
    let files = readFiles(baseDir)
    while(file = files.shift()) {
      console.log('Importing', file)
      // let rows = []
      let errors = 0
      let success = 0
      let rowsCount = await parseCSV(file, (index, row) => {
        let result = handleRow(index, row)
        db.models.Freeflow.insertMany(result, (err, d) => {
          let msg = `Processing line #${index}, success ${success}, errors ${errors}`
          if (err) {
            errors++
            // console.log(err)
          } else {
            success++
          }
          process.stdout.clearLine()  // clear current text
          process.stdout.cursorTo(0)
          process.stdout.write(msg)
          // console.log(d)
        })
      })
      // await db.models.Freeflow.insertMany(rows)
      process.stdout.clearLine()  // clear current text
      process.stdout.cursorTo(0)
      process.stdout.write(`${rowsCount} line readed and inserted`)
      console.log(' ')
    }

    resolve('import complete')
  })
}