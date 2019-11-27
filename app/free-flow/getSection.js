const moment = require('moment')
const getGentry = require('../../lib/gentries')

async function getSection (startGentryId, startDateTime, endDateTime) {
  let query = {
    startGentryId: startGentryId,
    startDateTime: {
      $gte: moment(startDateTime).toISOString()
    },
    endDateTime: {
      $lte: moment(endDateTime).toISOString()
    }
  }
  console.log('querying....')
  console.log(query)

  let rows = await db.models.Freeflow.find(query).sort({speed: 1})
  // process.stdout.clearLine()
  // process.stdout.moveCursor(0)
  // console.log('rows', rows.length)
  let speeds = {}
  let invalidCount = 0
  let endGentry = ''
  let startGentry = getGentry(startGentryId)
  let direction
  // rows.
  var _85th = 0
  var validSpeeds = []
  rows.forEach(r => {
    if (typeof speeds[r.speed] === 'undefined') {
      speeds[r.speed] = 0
    }

    if (!endGentry && r.endGentryId != r.startGentryId) {
      endGentry = getGentry(r.endGentryId)
      direction = r.endGentryId[r.endGentryId.length - 1]
    }

    if (r.speed === 0) {
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
    startDateTime,
    endDateTime,
    _85th,
    speeds,
    direction,
    count: rows.length,
    invalidCount,
    startGentryId,
    startGentry,
    endGentry
  }
}

module.exports = getSection
