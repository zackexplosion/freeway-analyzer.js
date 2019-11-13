const ObjectId = require('mongoose').Types.ObjectId
const vTypes = require('../lib/vehicleTypes')
const gentries = require('../lib/gentries')
const moment = require('moment')
const humanizeDuration = require('humanize-duration')
const Table = require('cli-table3')
// const table = new Table()
const table = new Table({
  head: ['Time', 'Section', 'Speed'],
  colWidths: [25, 50, 30]
});
console.log(table.toString());
function calculateSpeed(d1, d2, length) {
  // let duration = (d2 - d1) / 1000
  let duration = moment.duration(d2 - d1)
  let speed = (length / duration.asHours()).toFixed(2)
  // console.log('d1', d1)
  // console.log('d2', d2)
  // console.log('length', length)
  // console.log('speed', speed)
  return  {
    // duration: humanizeDuration(duration.asSeconds()),
    duration: humanizeDuration(duration.asSeconds() * 1000),
    speed
  }
}

require('./common')(async (err, Models) => {
  let row
  try {
    row = await Models.M06A.findOne(ObjectId(process.argv[2]))
  } catch (error) {

  }

  let speeds = []
  let accessTimes = []
  row['tripDetails'].forEach((d, i) => {
    let [startDateTime, currentGentry_id] = d.split('+')
    let speed = 0
    let duration = 0
    let startGentry = gentries(currentGentry_id)
    accessTimes.push(startDateTime)
    // if ( i == 0 ) {
    //   table.push([
    //     startDateTime.trim(),
    //     duration,
    //     startGentry.locationMileRaw + ', ' + startGentry.sectionStart,
    //     '0 KM/h',
    //   ])
    // }
    // else if (i == row['tripDetails'].length-1) {
    //   table.push([
    //     startDateTime.trim(),
    //     duration,
    //     startGentry.locationMileRaw + ', ' + startGentry.sectionStart,
    //     '0 KM/h',
    //   ])
    // }
    // else {
    if (i != 0 && i != row['tripDetails'].length-1) {
      // console.log(row['tripDetails'][i+1])
      let [nextDateTime, nextGentry_id] = row['tripDetails'][i+1].split('+')
      let nextGentry = gentries(nextGentry_id)
      // console.log('nextDateTime', nextDateTime)
      let result = calculateSpeed(new Date(startDateTime), new Date(nextDateTime), nextGentry.locationMile - startGentry.locationMile)
      speed = result.speed
      duration = result.duration
      speeds.push(speed)
      table.push([
        startDateTime.trim(),
        startGentry.locationMileRaw + ', ' + startGentry.sectionStart + ' -> ' + startGentry.sectionEnd,
        `${speed} KM/h`
      ])
    }
  })

  // let { speed, duration } = calculateSpeed(row['enterTime'], row['exitTime'], row['tripLength'])
  // let { speed, duration } = calculateSpeed(row['tripDetails'][0], row['tripDetails'][row['tripDetails'].length - 1], row['tripLength'])
  console.log('車種:', vTypes(row['vehicleType']))
  console.log('總里程:', row['tripLength'], 'KM')
  let duration = moment.duration(new Date(accessTimes[accessTimes.length-1]) - new Date (accessTimes[0]))
  duration = humanizeDuration(duration.asSeconds() * 1000)
  let direction = {
    'N': '北上',
    'S': '南下'
  }
  console.log('總時間:', duration )
  // console.log('方向:', direction[row])
  // console.log(':', duration)
  // console.log('平均速度:', speeds.reduce((a, b) => a+b ) + ' km/h')

  console.log(table.toString())
  process.exit()
})

