import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index.js'

Vue.use(Router)

// route-level code splitting
import Realtime from '../views/Realtime.vue'
import Favorites from '../views/Favorites.vue'
import Home from '../views/Home.vue'

export function createRouter() {
  return new Router({
    mode: 'history',
    scrollBehavior: () => ({
      y: 0
    }),
    routes: [{
      path: '/mobile/home',
      component: Home,
      children: [{
        path: '/mobile/home/',
        component: Realtime
      }, {
        path: '/mobile/favorites',
        component: Favorites
      }
      ]
    },
      {
      path: '/mobile',
      redirect: '/mobile/home'
    }]
  })
}