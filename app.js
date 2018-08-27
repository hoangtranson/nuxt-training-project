import Vue from 'vue';
import App from './pages/index.vue';
import { createRouter } from './router';

import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faPen, faPlus, faEye, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import TablePagination from './components/paging';

Vue.use(VueMaterial);
library.add(faTrash, faPen, faPlus, faEye, faArrowLeft);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;

Vue.component(TablePagination.name, TablePagination);

export function createApp() {
    // create router instance
    const router = createRouter();


    const app = new Vue({
        // inject router into root Vue instance
        router,
        render: h => h(App)
    })

    // return both the app and the router
    return { app, router };
}