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
      default: () => {
        return {
          responsive: true,
          maintainAspectRatio: false
        }
      }
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  },
  watch: {
    chartData: function (newVal, oldVal) {
      this.renderChart(newVal, this.options)
    }
  }
}
</script>
