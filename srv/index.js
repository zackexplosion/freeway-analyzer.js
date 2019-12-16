const cors = require('cors')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const lowdb = low(adapter)
export default (app, http) => {
  // Set some defaults (required if your JSON file is empty)
  // lowdb.defaults({ freeflows: [], counter: 0 })
  //   .write()

  app.use(cors())

  app.get('/sections', function (req, res) {
    let list = []
    let rows = lowdb.get('freeflows').value()
    rows.map(f => {
      let _85th = isNaN(f._85th) ? -1 : f._85th
      let tripLength = Math.abs(f.endGentry.locationMile - f.startGentry.locationMile).toFixed(2)

      if (isNaN(tripLength)) {
        tripLength = -1
        return false
      }

      list.push({
        startGentryId: f.startGentryId,
        startGentry: f.startGentry,
        endGentry: f.endGentry,
        tripLength,
        _85th
      })
    })
    res.json(list)
  })

  app.get('/sections/:startGentryId?', function (req, res) {
    let query = {
      startGentryId: req.params.id,
      endGentryId: req.params.id,
      starTime: req.params.id
    }

    let query = {
      key: `${}`
    }
    let row = lowdb.get('freeflows').find(query).value()
    res.json(row)
  })
}
