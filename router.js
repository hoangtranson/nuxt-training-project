// router.js
import Vue from 'vue';
import Router from 'vue-router';

import app from './pages/index.vue';
import articleDetail from  './pages/articleDetail.vue';

Vue.use(Router)

export function createRouter () {
  return new Router({
    routes: [
        { path: '/', component: app },
        { path: '/article/:id', component: articleDetail }
    ]
  })
}