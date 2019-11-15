const moment = require('moment')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const lowdb = low(adapter)
const startDateTime = moment('2015-01-01 00')
const endDateTime = moment('2015-01-01 04')
const getGentry = require('../../lib/gentries')
const _gentries = require('../../lib/_gentries')
const getSection = require('./getSection')
lowdb.defaults({ freeflows: [] }).write()
async function main() {
  // var hrstart = process.hrtime()
  try {
    // set db as global variable
    db = await require('../common')
    global.db = db
    let gentry_list = Object.keys(_gentries)

    while(gid = gentry_list.shift()){
      // let gentry = getGentry(gid)
      // console.log(gentry)
      let r = await getSection(gid, startDateTime, endDateTime)

      // Add a post
      lowdb
        .get('freeflows')
        .push(r)
        .write()
    }
  } catch(e) {
    console.log(e)
  }
  process.exit()
}



main()