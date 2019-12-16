
const fastcsv = require('fast-csv')
module.exports = function parseCSV (file, onData = () => {}) {
  return new Promise((resolve, reject) => {
    let index = 0
    fastcsv
      .parseFile(file)
      .on('error', error => {
        reject(error)
      })
      .on('data', row => {
        let r = {
          vehicleType: parseInt(row[0]),
          enterTime: row[1],
          enterGentry: row[2],
          exitTime: row[3],
          length: parseFloat(row[5]),
          exitGentry: row[4],
          tripDetails: row[7].split(';')
        }
        index++
        onData(index, r)
      })
      .on('end', rowCount => {
        resolve(rowCount)
      })
  })
}
