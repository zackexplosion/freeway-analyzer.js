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
      count
    } = await getSection(startGentryId, startDateTime, endDateTime)

    if(speeds.length == 0) {
      console.log('查無資料')
      process.exit()
    }

    console.log('')
    console.log('Time Range:', startDateTime.format(_formatter), 'to', endDateTime.format(_formatter))
    console.log('起點:',`${startGentry.sectionStart} ${startGentry.locationMileRaw}`)
    console.log('終點:',`${endGentry.sectionStart} ${endGentry.locationMileRaw}`)
    console.log('車輛:', count)
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

  let rows = await db.models.Freeflow.find(query).sort({speed: -1})
  process.stdout.clearLine()
  // process.stdout.moveCursor(0)
  // console.log('rows', rows.length)
  let speeds = {}
  let endGentry = ''
  rows.forEach(r => {
    // console.log(r.startDateTime)
    if ( typeof speeds[r.speed] === 'undefined') {
      speeds[r.speed] = 0
    }

    if(!endGentry) {
      endGentry = getGentry(r.endGentryId)
    }
    // console.log(r.startDateTime)
    speeds[r.speed] = speeds[r.speed] + 1
  })
  return {
    speeds,
    count: rows.length,
    endGentry
  }
}

module.exports = getSection