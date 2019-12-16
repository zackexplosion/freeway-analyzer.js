const parseCSV = require('./parseCSV')
const handleRawRow = require('./handleRawRow')
const moment = require('moment')

module.exports = function (file) {
  return new Promise((resolve, reject) => {
    var speedByGentrys = {}
    var startTime = moment()
    parseCSV(file, (index, row) => {
    // console.log(row)
      let result = handleRawRow(index, row)
      result.forEach(r => {
        let dateTimeKey = moment(r['startDateTime']).startOf('hour').format('YYYY-MM-DD HH:SS')
        let key = `${r['startGentryId']},${r['endGentryId']},${dateTimeKey}`
        if (!speedByGentrys[key]) {
          speedByGentrys[key] = {}
        }

        let vType = r['vehicleType']
        if (!speedByGentrys[key][vType]) {
          speedByGentrys[key][vType] = {
            speeds: {},
            validCount: 0,
            invalidCount: 0,
            _85th: ''
          }
        }
        let speed = r['speed']

        if (!speedByGentrys[key][vType]['speeds'][speed]) {
          speedByGentrys[key][vType]['speeds'][speed] = 0
        }

        if (speed === 0) {
          speedByGentrys[key][vType]['invalidCount']++
        } else {
          speedByGentrys[key][vType]['validCount']++
        }

        speedByGentrys[key][vType]['speeds'][speed] = speedByGentrys[key][vType]['speeds'][speed] + 1
      })
    })
      .then(rowCount => {
        var endTime = moment()
        let duration = moment.duration(endTime - startTime)
        console.log(rowCount, 'processed took', duration.asSeconds())

        // console.log(speedByGentrys)
        resolve(speedByGentrys)
      })
  })
}
