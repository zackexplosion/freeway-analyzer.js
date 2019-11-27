const targz = require('targz')
const path = require('path')

module.exports = function (src) {
  return new Promise((resolve, reject) => {
    let dest = path.dirname(src)
    targz.decompress({
      src,
      dest
    }, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve(dest)
      }
    })
  })
}
