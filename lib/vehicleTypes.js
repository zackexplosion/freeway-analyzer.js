var types = {
  31: '小客車', // Normal car
  32: '小貨車', // Small truck
  41: '大客車', // Bug
  42: '大貨車', // Big truck
  5: '聯結車' // Truck with trailers
}
https://github.com/ttsa/freeway-analyzer.js/blob/master/lib/vehicleTypes.js
module.exports = function (id) {
  let name = types[id]
  if (name) {
    return name
  } else {
    return `未知 (${id})`
  }
}
