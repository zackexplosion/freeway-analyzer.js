const path = require('path')
const fs = require('fs')
const handleRawRow = require('./handleRawRow')
const parseCSV = require('./parseCSV')
const moment = require('moment')
function readFiles(baseDir, startDateTime, endDateTime) {
  const startHour = moment(startDateTime).hour()
  const endHour = moment(endDateTime).hour()

  let files = []
  console.log('import files from', startDateTime, 'to', endDateTime)
  for (let i =startHour;i <= endHour; i++){
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


module.exports = function(baseDir, db, startHour, endHour) {
  return new Promise(async (resolve, reject) => {
    let files = readFiles(baseDir, startHour, endHour)
    while(file = files.shift()) {
      console.log('Importing', file)
      // let rows = []
      let errors = 0
      let success = 0
      let rowsCount = await parseCSV(file, (index, row) => {
        let result = handleRawRow(index, row)
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