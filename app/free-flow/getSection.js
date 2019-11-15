const moment = require('moment')
const babar = require('babar')
const getGentry = require('../../lib/gentries')

const startGentryId = process.argv[2] || '01F3676S'
// const endGentryId = process.argv[3] || '01F3686S'
const startDateTime = moment(process.argv[3] || '2015-01-01 00')
let endDateTime = moment(process.argv[4] || moment(startDateTime).add(1, 'hour'))
const startGentry = getGentry(startGentryId)
// const endGentry = gentries(endGentryId)

// table is an Array, so you can `push`, `unshift`, `splice` and friends

async function main() {
  db = await require('../common')()
  let query = {
    startGentryId: startGentryId,
    startDateTime: {
      $gte: startDateTime.toDate()
    },
    endDateTime: {
      $lte: moment(endDateTime).toDate()
    }
  }
  // console.log('querying....')
  process.stdout.write('querying....')

  // console.log(query)
  let rows = await db.models.Freeflow.find(query)
  process.stdout.clearLine()
  // process.stdout.moveCursor(0)
  // console.log(rows)
  let speeds = []
  let endGentry
  rows.forEach(r => {
    if ( typeof speeds[r.speed] === 'undefined') {
      speeds[r.speed] = 0
    }

    if(!endGentry) {
      endGentry = getGentry(r.endGentryId)
    }
    // console.log(r.startDateTime)
    speeds[r.speed] = speeds[r.speed] + 1
  })
  let babarData = []
  Object.keys(speeds).forEach(k => {
    babarData.push([k, speeds[k]])
  })
  let _formatter = 'YYYY/MM/DD HH'
  console.log('')
  console.log('Time Range:', startDateTime.format(_formatter), 'to', endDateTime.format(_formatter))
  console.log('Section:',`${startGentry.sectionStart} ${startGentry.locationMileRaw} ~ ${endGentry.sectionStart} ${endGentry.locationMileRaw}`)
  console.log(babar(babarData ,{
    width: 150,
    height: 20
  }))
  process.exit(1)
}

main()