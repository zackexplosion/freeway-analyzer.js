import Vue from 'vue'
import Router from 'vue-router'
import SectionList from '@/components/SectionList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SectionList',
      component: SectionList
    }
  ]
})
