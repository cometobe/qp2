import Vue from 'vue'
import Router from 'vue-router'
import Stand from '@/components/pages/stand.vue'
import Excel from '@/components/pages/excel.vue'
import Trend from '@/components/pages/trend.vue'
import Setting from '@/components/pages/Setting.vue'
import Analyse from '@/components/pages/Analysis.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/components/pages/home').default
    },
    {
      path: '/Stand',
      name: 'Stand',
      component: Stand
    },
    {
      path: '/Excel',
      name: 'Excel',
      component: Excel
    },
    {
      path: '/Trend',
      name: 'Trend',
      component: Trend
    },
    {
      path: '/Setting',
      name: 'Setting',
      component: Setting
    },
    {
      path: '/Analyse',
      name: 'Analyse',
      component: Analyse
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
