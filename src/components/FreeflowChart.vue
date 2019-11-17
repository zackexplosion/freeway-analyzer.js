<template>
<div>

  <div class="chart">
    <line-chart
      v-if="loaded"
      :chart-data="chartData"
    />
  </div>
</div>
</template>

<script>
// import LineChart from './LineChart.js'
import LineChart from './Line'
import request from '@/lib/request'
// const MAX_SPEED = 350
export default {
  components: {
    LineChart
  },
  data () {
    // let xLabel = []

    // for (let i = 0; i <= MAX_SPEED; i++) {
    //   xLabel.push(i)
    // }
    return {
      data: {},
      loaded: false,
      chartData: {
        labels: [],
        datasets: [
          {
            label: '車量',
            backgroundColor: '#f87979',
            data: []
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        height: '400px'
      }
    }
  },
  created () {
    request('/sections/' + this.$route.params.startGentryId).then(res => {
      this.data = res
      // this.chartdata[0].data = sections.speeds.map()
      let data = []
      let xLabel = []
      Object.keys(res.speeds).forEach(k => {
        xLabel.push(k)
        data.push(res.speeds[k])
      })
      let chartData = this.chartData
      chartData.datasets[0].data = data
      chartData.labels = xLabel
      this.chartData = Object.assign({}, {}, chartData)

      this.loaded = true
    })
  }
}
</script>

<style scoped>
.chart {
  height: 40vh;
}
</style>
