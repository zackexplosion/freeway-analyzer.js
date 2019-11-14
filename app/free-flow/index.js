// const moment = require('moment')
const vTypes = require('../../lib/vehicleTypes')
const gentries = require('../../lib/gentries')
const moment = require('moment')


function calculateSpeed(d1, d2, length) {
  // let duration = (d2 - d1) / 1000
  let duration = moment.duration(new Date(d2) - new Date(d1))
  let speed = (length / duration.asHours())
  // console.log('d1', d1)
  // console.log('d2', d2)
  // console.log('length', length)
  // console.log('speed', speed)
  speed = Math.round(Math.abs(speed))
  return speed
}

const START_DATE = new Date('2015-05-11T23:00:00.000Z')
const END_DATE = new Date('2015-05-11T22:00:00.000Z')

async function handleRow (Models, rows) {
  rows.forEach(async r => {
    let i = 0
    let details = r['tripDetails']
    let insert_rows = []
    while(i < details.length - 1) {
      try {
        // console.log(details[i])
        let [startDateTime, startGentry] = details[i].trim().split('+')
        let [endDateTime, endGentry] = details[i+1].trim().split('+')
        let tripLength = Math.abs(
          gentries(endGentry).locationMile -
          gentries(startGentry).locationMile
        ).toFixed(1)

        tripLength = parseFloat(tripLength)

        // console.log(gentries(endGentry).locationMile gentries(startGentry).locationMile)

        let speed = calculateSpeed(startDateTime, endDateTime, tripLength)
        let row_to_insert = {
          vehicleId: r._id,
          vehicleType: r.vehicleType,
          startDateTime,
          endDateTime,
          startGentry,
          endGentry,
          tripLength,
          speed
        }
        // console.log(M06A_DETAILS)
        // await Models.M06A_DETAILS.create(row_to_insert, function(err, d){
        //   console.log(err)
        //   console.log(d)
        // })
        insert_rows.push(row_to_insert)
      } catch (error) {
        console.error(error)
      }
      i++
    }
    try {
      await Models.M06A_DETAILS.insertMany(insert_rows)
      console.log(insert_rows.length, 'inserted')
    } catch (error) {
      console.log(error)
    }
    // console.log(insert_rows)
  })
}

require('../common')(async (err, Models) => {
  try {
    // row = await Models.M06A.findOne(ObjectId(process.argv[2]))

    // console.log(rows.length)
    let query = {
      "$where": 'this.enterGentry != this.exitGentry',
      "enterTime" : {
        $lt: START_DATE,
        $gte: END_DATE,
      }
    }
    console.log('couting....')
    let MAX_ROW = await Models.M06A.find(query).count()
    console.log(MAX_ROW, 'rows matched')
    let per_page = 1000
    let pages = MAX_ROW / per_page

    for(let i = 0; i < pages;i++) {
      let rows = await Models.M06A
                .find(query)
                .limit(1000)
                .skip(i * per_page)

      await handleRow(Models, rows)
    }


  } catch (error) {
    console.log(error)
  }
})