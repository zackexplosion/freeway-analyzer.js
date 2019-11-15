// TODO
// web ui?

var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
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