<template>
<div>
  <el-table
    highlight-current-row
    :data="sectionsFiltered"
    height="400"
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
  </el-table>
  <div
    v-if="loaded"
    class="chart"
  >
    <article>
      車輛總計: {{data.count}} 輛, 無效資料: {{data.invalidCount}} 輛, 行駛方向: {{data.direction}}, 85分位: {{data._85th}} KM/h
    </article>
    <line-chart
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
      search: '',
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
  computed: {
    sectionsFiltered () {
      // TODO
      // implement filter function
      return this.sections.filter(data => {
        if (!this.search) return true
        return true
      })
    }
  },
  methods: {
    searchData (sections) {
      console.log('sections', sections)
      return sections.filter(data => {
        if (!this.search) {
          return data
        }
        // !this.search || data.name.toLowerCase().includes(this.search.toLowerCase())
      })
    },
    handleCurrentChange (row) {
      // this.loaded = false
      this.gtagTracking(row)

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
    sectionRange (row, col) {
      let s = row.startGentry
      let e = row.endGentry
      return `${s.sectionStart} ${s.locationMileRaw} ~ ${e.sectionEnd}  ${e.locationMileRaw}`
    },
    gtagTracking (row) {
      // console.log(row)
      // console.log(this.sectionRange(row))
      if (window.gtag) {
        window.gtag('event', 'click', {
          'event_category': 'section',
          'event_label': this.sectionRange(row)
        })
      }
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
.chart {
  min-height: 40vh;
}
.chart article {
  padding:2em;
}
</style>
