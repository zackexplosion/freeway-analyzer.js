const dl = require('download-file-with-progressbar')
const cliProgress = require('cli-progress')
const path = require('path')
const fs = require('fs')
// decompress files from tar.gz archive

module.exports = function (url) {
  return new Promise((resolve, reject) => {
    // create a new progress bar instance and use shades_classic theme
    const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)

    let total = 0
    console.log('Downloading', url)
    let filename = path.basename(url)
    dl(url, {
      filename: filename + '.downloading',
      // filename: 'the filename to store, default = path.basename(YOUR_URL) || "unknowfilename"',
      // dir: 'the folder to store, default = os.tmpdir()',
      onDone: (info) => {
        // stop the progress bar
        bar1.stop()
        if (info.size < 10000) {
          return reject('file not found')
        }
        let newPath = path.join(
          path.dirname(info.path),
          filename
        )
        fs.renameSync(
          info.path,
          newPath
        )
        resolve(newPath)
      },
      onError: (err) => {
        reject(err)
      },
      onProgress: (curr, _total) => {
        if (total === 0) {
          total = _total
          bar1.start(total, 0)
        }

        // update the current value in your application..
        bar1.update(curr)
      }
    })
  })
}
