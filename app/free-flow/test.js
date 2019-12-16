const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const lowdb = low(adapter)
const babar = require('babar')
const printData = require('./printData')

let data = lowdb.get('freeflows').find({
  key: '03F0217S,03F0301S,2019-12-14 15:00'
}).value()

// Object.keys(data.data).forEach(k => {

// })

let speeds = data.data['小貨車'].speeds
// console.log(speeds)

let babarData = []
// let maxY = 0
// console.log(speeds)
Object.keys(speeds).forEach(k => {
  babarData.push([k, speeds[k]])
})

console.log(babar(babarData, {
  width: 150,
  height: 20,
  // maxY: 10,
  yFractions: 1
}))
