const cliProgress = require('cli-progress');

// create new container
const multibar = new cliProgress.MultiBar({
  clearOnComplete: false,
  // hideCursor: true
  format: '{period} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} '
}, cliProgress.Presets.shades_grey);

const moment = require('moment')
const {
  isMainThread, parentPort, workerData, threadId,
  MessageChannel, MessagePort, Worker
} = require('worker_threads')
const workerThread = require('./worker')


function mainThread() {
  const worker_count = parseInt(8 || process.env.THREADS)
  var BASE_PATH = process.argv[2]
  if (!BASE_PATH) {
    throw '找不到目標資料夾'
  }
  const startDate = moment(process.argv[3] || '2015-01-01 00:00:00')
  const endDate = moment(process.argv[4] || '2016-01-01 00:00:00')
  var duration = moment.duration(endDate.diff(startDate));
  var peroid_length = (duration.asHours() + 1) / worker_count

  console.log('startDate', startDate, 'endDate', endDate)
  console.log('peroid_length', peroid_length)

  // create worker
  for (let i = 0;i < worker_count; i++) {
    let startIndex = i * (peroid_length)
    let endDate = moment(startDate).add(startIndex + peroid_length-1, 'hours').format()
    let _workderData = {
      BASE_PATH,
      startDate: moment(startDate).add(startIndex, 'hours').format(),
      endDate
    }
    // console.log(i, '_workderData', 'startDate', _workderData.startDate, 'endDate', _workderData.endDate)


    const worker = new Worker(__filename, { workerData: _workderData })
    const format = 'YYYY/MM/DD HH'
    const bar = multibar.create(peroid_length, 0, {
      period: `${moment(_workderData.startDate).format(format)} ~ ${moment(_workderData.endDate).format(format)}`
    })
    worker.on('message', msg => {
      if (msg.progress) {
        // console.log(msg)
        bar.increment(msg.progress)
      }
    })

    worker.on('exit', code => {
      console.log(`main: worker stopped with exit code ${code}`);
      bar.stop()
    })
  }
}

if (isMainThread) {
  mainThread()
} else {
  workerThread()
}