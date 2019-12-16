// const moment = require('moment')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const lowdb = low(adapter)
lowdb.defaults({ avaiable_datetime: [], freeflows: [] }).write()

const calDataByFile = require('./calDataByFile')
// lowdb.defaults({ freeflows: [] }).write()
const filePath = '/Users/zack/Downloads/TDCS_M06A_20191214_150000.csv'
async function main () {
  // var hrstart = process.hrtime()
  try {
    // let data = await calDataByFile(filePath)
    // let tmp = lowdb.get('tmp')
    // if (Object.keys(tmp.value()).length === 0) {
    //   let data = await calDataByFile(filePath)
    //   console.log('writing to db')
    //   // Set a user using Lodash shorthand syntax
    //   lowdb.set('tmp', data).write()
    // }

    let data = await calDataByFile(filePath)

    Object.keys(data).forEach(k => {
      // console.log(k)
      if (lowdb.get('freeflows').find({ key: k }).value() === undefined) {
        let [startGentryId] = k.split(',')

        let maxSpeed = 0

        Object.keys(data[k]).forEach(vTypes => {
          // let _85th = 0
          let _85thCount = data[k][vTypes].validCount * 0.85
          let _85thCounter = 0
          let _85th = 0
          Object.keys(data[k][vTypes].speeds).forEach(s => {
            s = parseInt(s)
            if (s > maxSpeed) {
              maxSpeed = s
            }

            _85thCounter = _85thCounter + data[k][vTypes].speeds[s]

            if (_85thCounter >= _85thCount && _85th === 0) {
              _85th = s
            }
          })

          data[k][vTypes]['_85th'] = _85th
        })

        lowdb
          .get('freeflows')
          .push({
            key: k,
            startGentryId: startGentryId,
            data: data[k],
            maxSpeed
          })
          .write()
      }
    })
  } catch (e) {
    console.log(e)
  }
  process.exit()
}

main()
