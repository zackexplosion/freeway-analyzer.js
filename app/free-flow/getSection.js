const Table = require('cli-table3')
var babar = require('babar')
const gentries = require('../../lib/gentries')

const startGentryId = '01F3676S' || process.argv[2]
const endGentryId = '01F3686S' || process.argv[3]
const startGentry = gentries(startGentryId)
const endGentry = gentries(endGentryId)

console.log(`${startGentry.sectionStart} ${startGentry.locationMileRaw} ~ ${endGentry.sectionStart} ${endGentry.locationMileRaw}`)

// table is an Array, so you can `push`, `unshift`, `splice` and friends
let speeds = {}

async function main(Models){
  let rows = await Models.M06A_DETAILS.find({
    startGentry: startGentryId,
    endGentry: endGentryId
  })

  rows.forEach(r => {
    if ( typeof speeds[r.speed] === 'undefined') {
      speeds[r.speed] = 0
    }
    // console.log(r.speed)
    speeds[r.speed] = speeds[r.speed] + 1
  })
  let babarData = []
  Object.keys(speeds).forEach(k => {
    babarData.push([k, speeds[k]])
  })

  console.log(babar(babarData ,{
    width: 150,
    height: 40
  }))
  process.exit(1)
}

require('../common')((err, Models) => {
  main(Models)
  // process.exit()
})
