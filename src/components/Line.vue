<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: {
    chartData: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  mounted () {
    let options = {
      responsive: true,
      maintainAspectRatio: false
    }
    // console.log('mountted')
    // console.log(this.chartData)
    this.renderChart(this.chartData, options)
  }
}
</script>
