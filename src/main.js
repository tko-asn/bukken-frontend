import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// vue-loaders
import "vue-loaders/dist/vue-loaders.css";
import VueLoaders from "vue-loaders";
// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

Vue.use(VueLoaders);

library.add(fas);
Vue.component('fa-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
