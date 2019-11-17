<template>
<div>
  <el-table
    highlight-current-row
    :data="sections"
    height="200"
    style="width: 100%"
    @current-change="handleCurrentChange"
  >
    <el-table-column
      prop="startGentryId"
      label="ID"
    />
    <el-table-column
      prop="startGentry.roadName"
      label="路名"
      sortable
    />
    <el-table-column
      prop="startGentry.locationMile"
      label="路段"
      :formatter="sectionRange"
      width="400"
      sortable
    />
    <el-table-column
      prop="tripLength"
      label="距離"
      sortable
    />
    <el-table-column
      prop="startGentry.direction"
      label="方向"
      sortable
    />
    <el-table-column
      prop="_85th"
      label="85th"
      sortable
    />
    <el-table-column
      fixed="right"
      label="action"
    >
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">Detail</el-button>
      </template>
    </el-table-column>
  </el-table>
  <ul>
    <li>車輛總計 {{data.count}}輛, 無效資料 {{data.invalidCount}}輛</li>
    <li>行駛方向 {{data.direction}}</li>
    <li>85分位 {{data._85th}} KM/h </li>
  </ul>
  <div class="chart">
    <line-chart
      v-if="loaded"
      :chart-data="chartData"
    />
  </div>
</div>
</template>

<script>
import LineChart from './Line'
import request from '@/lib/request'
export default {
  name: 'SectionList',
  components: {
    LineChart
  },
  data () {
    return {
      sections: [],
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
      }
    }
  },
  created () {
    request('/sections').then(sections => {
      this.sections = sections
    })
  },
  methods: {
    handleCurrentChange (row) {
      console.log(row)
      this.loaded = false
      request('/sections/' + row.startGentryId).then(res => {
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
    },
    handleClick (row) {
      // this.$router.push('/freeflow/' + row.startGentryId)
    },
    sectionRange (row, col) {
      let s = row.startGentry
      let e = row.endGentry
      return `${s.sectionStart} ${s.locationMileRaw} ~ ${e.sectionEnd}  ${e.locationMileRaw}`
    },
    getMiles (row, col) {
      let r = Math.abs(row.endGentry.locationMile - row.startGentry.locationMile).toFixed(2)

      if (isNaN(r)) return -1
      return r
    }
  }
}
</script>

<style scoped>

</style>
