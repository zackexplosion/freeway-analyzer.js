<template>
  <div id="app">
    <h1>高速公路自由車流分析器</h1>
    <h5>時段：2015/01/01 00 ~ 2015/01/01 04<br/>目前只有這時段</h5>
    <router-view/>
    <p>資料來源: 交通部高速公路局「<a href="http://tisvcloud.freeway.gov.tw" target="_blank">交通資料庫」</a></p>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
