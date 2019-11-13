const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId
mongoose.set('useCreateIndex', true)
const DB_HOST = process.env.DB_HOST || 'db'
const DB_PORT = process.env.DB_PORT || 27017


const M06A = mongoose.model('M06A', {
  vehicleType: { type: Number, index: true},
  enterTime: { type: Date, index: true},
  enterGentry: { type: String, index: true},
  exitTime: { type: Date, index: true},
  exitGentry: { type: String, index: true},
  tripLength: { type: Number, index: true},
  tripDetails: [String]
})

const M06A_DETAILS = mongoose.model('M06A_DETAILS', {
  vehicleId: { type: ObjectId, index: true},
  vehicleType: { type: Number, index: true},
  startDateTime: { type: Date, index: true},
  endDateTime: { type: Date, index: true},
  startGentry: { type: String, index: true},
  endGentry: { type: String, index: true},
  tripLength: { type: String, index: true},
  speed: { type: Number, index: true},
})

M06A_DETAILS.schema.index({
  vehicleId: 1,
  gentry: 1,
}, {
  unique: true,
})

var Models = {
  M06A,
  M06A_DETAILS
}

module.exports = function(cb){
  mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/freeway`, {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    useUnifiedTopology: true
  }).then(() => {
    return cb(null, Models)
  }, err => {
    return cb(err, null)
  })
}