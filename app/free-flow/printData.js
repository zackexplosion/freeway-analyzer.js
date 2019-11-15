const babar = require('babar')
const moment = require('moment')

function printData(sectionData) {

  let _formatter = 'YYYY/MM/DD HH'
  try {
    let {
      startDateTime,
      endDateTime,
      speeds,
      startGentry,
      endGentry,
      count,
      invalidCount,
      direction,
      _85th
    } = sectionData

    if (speeds.length == 0) {
      console.log('查無資料')
      process.exit()
    }

    console.log('')
    console.log('時間範圍:', moment(startDateTime).format(_formatter), 'to', moment(endDateTime).format(_formatter))
    console.log('車輛總計:', count, '無效:', invalidCount)
    console.log('方向:', direction)
    console.log('85th:', _85th, 'KM/h')
    console.log('起點:', `${startGentry.sectionStart} ${startGentry.locationMileRaw}`)
    console.log('終點:', `${endGentry.sectionStart} ${endGentry.locationMileRaw}`)
    console.log('')
    let babarData = []
    // let maxY = 0
    // console.log(speeds)
    Object.keys(speeds).forEach(k => {
      babarData.push([k, speeds[k]])
    })

    console.log(babar(babarData, {
      width: 150,
      height: 20,
      // maxY: 10,
      yFractions: 1
    }))
  } catch (error) {
    console.log(error)
  }
}
module.exports = printData