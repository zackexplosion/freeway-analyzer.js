
var express = require('express')
var app = express()

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const lowdb = low(adapter)

// Set some defaults (required if your JSON file is empty)
lowdb.defaults({ freeflows: [], counter: 0 })
  .write()


app.get('/', function (req, res) {
  // Increment count
  lowdb.update('counter', n => {
    res.send('Hello World! #' + n)
    return n + 1
  })
  .write()
})

async function main() {
  // var hrstart = process.hrtime()
  try {
    // set db as global variable
    db = await require('./common')
    const PORT = process.env.NODE_PORT || 3000
    app.listen(PORT, function () {
      console.log(`Example app listening on port ${PORT}!`)
    })
  }
  catch(e){
    console.log(e)
  }
}

main()