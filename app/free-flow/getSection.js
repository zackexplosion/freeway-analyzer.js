const moment = require('moment')
const babar = require('babar')
const getGentry = require('../../lib/gentries')

const startGentryId = process.argv[2] || '01F3676S'
// const endGentryId = process.argv[3] || '01F3686S'
const startDateTime = moment(process.argv[3] || '2015-01-01 00')
let endDateTime = moment(process.argv[4] || moment(startDateTime).add(1, 'hour'))
const startGentry = getGentry(startGentryId)

// console.log('startGentry', startGentry)

async function main() {
  var hrstart = process.hrtime()
  let _formatter = 'YYYY/MM/DD HH'
  try {
    let {
      speeds,
      endGentry,
      count,
      invalidCount,
      direction,
      _85th
    } = await getSection(startGentryId, startDateTime, endDateTime)

    if(speeds.length == 0) {
      console.log('查無資料')
      process.exit()
    }

    console.log('')
    console.log('時間範圍:', startDateTime.format(_formatter), 'to', endDateTime.format(_formatter))
    console.log('車輛總計:', count, '無效:', invalidCount)
    console.log('方向:', direction)
    console.log('85th:', _85th, 'KM/h')
    console.log('起點:',`${startGentry.sectionStart} ${startGentry.locationMileRaw}`)
    console.log('終點:',`${endGentry.sectionStart} ${endGentry.locationMileRaw}`)
    let babarData = []
    // let maxY = 0
    // console.log(speeds)
    Object.keys(speeds).forEach(k => {
      babarData.push([k, speeds[k]])
    })

    console.log(babar(babarData ,{
      width: 150,
      height: 20,
      // maxY: 10,
      yFractions: 1
    }))
  } catch (error) {
    console.log(error)
  }

  var hrend = process.hrtime(hrstart)
  console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
  process.exit(1)
}

main()

async function getSection(startGentryId, startDateTime, endDateTime) {
  db = await require('../common')
  let query = {
    startGentryId: startGentryId,
    startDateTime: {
      $gte: startDateTime.toISOString()
    },
    endDateTime: {
      $lte: moment(endDateTime).toISOString()
    }
  }
  // console.log('querying....')
  process.stdout.write('querying....')
  console.log(query)

  let rows = await db.models.Freeflow.find(query).sort({speed: 1})
  process.stdout.clearLine()
  // process.stdout.moveCursor(0)
  // console.log('rows', rows.length)
  let speeds = {}
  let invalidCount = 0
  let endGentry = ''
  let direction
  // rows.
  var _85th = 0
  var validSpeeds = []
  rows.forEach(r => {
    if ( typeof speeds[r.speed] === 'undefined') {
      speeds[r.speed] = 0
    }

    if(!endGentry && r.endGentryId != r.startGentryId) {
      endGentry = getGentry(r.endGentryId)
      direction = r.endGentryId[r.endGentryId.length -1]
    }

    if(r.speed === 0) {
      invalidCount++
    } else {
      validSpeeds.push(r.speed)
    }
    // console.log(r.startDateTime)
    speeds[r.speed] = speeds[r.speed] + 1
  })

  _85th = parseInt((rows.length - invalidCount) * 0.85)
  _85th = validSpeeds[_85th]

  return {
    _85th,
    speeds,
    direction,
    count: rows.length,
    invalidCount,
    endGentry
  }
}

module.exports = getSection