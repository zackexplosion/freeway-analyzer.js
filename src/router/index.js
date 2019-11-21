import Vue from 'vue'
import Router from 'vue-router'
import SectionList from '@/components/SectionList'
import FreeflowChart from '@/components/FreeflowChart'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SectionList',
      component: SectionList,
      meta: {
        title: 'Dashboard'
      }
    },
    {
      path: '/freeflow/:startGentryId',
      name: 'FreeflowChart',
      component: FreeflowChart
    }
  ]
})
