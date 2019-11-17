<template>
  <el-table
    :data="sections"
    height="500"
    style="width: 100%">
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
      prop="sectionRange"
      label="路段"
      :formatter="sectionRange"
    />
    <el-table-column
      prop="startGentry.direction"
      label="方向"
      sortable
    />
    <el-table-column
      prop="_85th"
      label="85th"
      :formatter="_85th"
      sortable
    />
    <el-table-column
      label="里程"
      :formatter="getMiles"
      sortable
    />
  </el-table>
</template>

<script>
import request from '@/lib/request'
export default {
  name: 'SectionList',
  data () {
    return {
      sections: []
    }
  },
  created () {
    request('/sections').then(sections => {
      this.sections = sections
    })
  },
  methods: {
    _85th (row, col) {
      if (isNaN(row._85th)) {
        return 0
      }
      return row._85th
    },
    sectionRange (row, col) {
      return `${row.startGentry.sectionStart} ~ ${row.startGentry.sectionEnd}`
    },
    getMiles (row, col) {
      let r = Math.abs(row.endGentry.locationMile - row.startGentry.locationMile).toFixed(2)

      if (isNaN(r)) return 0
      return r
    }
  }
}
</script>

<style scoped>

</style>
