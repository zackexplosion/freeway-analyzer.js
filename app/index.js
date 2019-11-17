const cors = require('cors')
const express = require('express')
const app = express()

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const lowdb = low(adapter)

var db

// Set some defaults (required if your JSON file is empty)
lowdb.defaults({ freeflows: [], counter: 0 })
  .write()

app.use(cors())
app.get('/', function (req, res) {
  // Increment count
  lowdb.update('counter', n => {
    res.send('Hello World! #' + n)
    return n + 1
  })
    .write()
})

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
app.get('/sections/:id', function (req, res) {
  let query = {
    startGentryId: req.params.id
  }
  let row = lowdb.get('freeflows').find(query).value()
  res.json(row)
})

async function main () {
  // var hrstart = process.hrtime()
  try {
    // set db as global variable
    db = await require('./common')
    const PORT = process.env.NODE_PORT || 3000
    app.listen(PORT, function () {
      console.log(`Example app listening on port ${PORT}!`)
    })
  } catch (e) {
    console.log(e)
  }
}

main()
