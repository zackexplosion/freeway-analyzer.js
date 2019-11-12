const mongoose = require('mongoose')
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

var Models = {
  M06A
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