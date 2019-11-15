const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId
mongoose.set('useCreateIndex', true)
const DB_HOST = process.env.DB_HOST || '127.0.0.1'
const DB_PORT = process.env.DB_PORT || 27017


// const M06A = mongoose.model('M06A', {
//   vehicleType: { type: Number, index: true},
//   enterTime: { type: Date, index: true},
//   enterGentry: { type: String, index: true},
//   exitTime: { type: Date, index: true},
//   exitGentry: { type: String, index: true},
//   tripLength: { type: Number, index: true},
//   tripDetails: [String]
// })

mongoose.model('Freeflow', {
  key: { type: String, index: true, unique: true},
  vehicleId: { type: String, index: true},
  vehicleType: { type: String, index: true},
  tripStartDateTime: { type: Date, index: true},
  startDateTime: { type: Date, index: true},
  startGentryId: { type: String, index: true},
  startGentry: { type: Object},
  endDateTime: { type: Date, index: true},
  endGentryId: { type: String, index: true},
  endGentry: { type: Object},
  tripLength: { type: String, index: true},
  speed: { type: Number, index: true}
})

let url = `mongodb://${DB_HOST}:${DB_PORT}/freeway`
let options = {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  useUnifiedTopology: true
}
module.exports = mongoose.connect(url, options)