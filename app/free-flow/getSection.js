const Table = require('cli-table3')
var babar = require('babar')
const gentries = require('../../lib/gentries')

const startGentryId = process.argv[2] || '01F3676S'
// const endGentryId = process.argv[3] || '01F3686S'
const startDateTime = process.argv[3] || '2015-01-01 00'
const startGentry = gentries(startGentryId)
const endGentry = gentries(endGentryId)

// table is an Array, so you can `push`, `unshift`, `splice` and friends


async function main() {
  db = await require('../common')()
  let query = {
    startGentryId: startGentryId,
    // endGentry: endGentryId
  }
  console.log('querying....', query)
  let rows = await db.models.Freeflow.find(query)
  // console.log(rows)
  let speeds = []
  rows.forEach(r => {
    if ( typeof speeds[r.speed] === 'undefined') {
      speeds[r.speed] = 0
    }
    // console.log(r)
    speeds[r.speed] = speeds[r.speed] + 1
  })
  let babarData = []
  Object.keys(speeds).forEach(k => {
    babarData.push([k, speeds[k]])
  })
  console.log(`${startGentry.sectionStart} ${startGentry.locationMileRaw} ~ ${endGentry.sectionStart} ${endGentry.locationMileRaw}`)
  console.log(babar(babarData ,{
    width: 150,
    height: 40
  }))
  process.exit(1)
}

main()