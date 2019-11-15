moment = require('moment')
startDate = moment('2016-06-09')


for(let i = 0; true;i++ ) {
  if (startDate.isSame(moment('2016-11-18'))) {
    process.exit()
  }
  console.log(`http://tisvcloud.freeway.gov.tw/history/TDCS/M06A/M06A_${startDate.format('YYYYMMDD')}.tar.gz`)

  startDate.add(1, 'day')


  if (i % 40 === 0) {
    console.log('---')
  }
}

// const gentries = require('./lib/_gentries')

// console.log(Object.keys(gentries))

