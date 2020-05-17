import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import GnattYing from '../ganttYing';
Vue.config.productionTip = false;

Vue.use(Element);
Vue.use(GnattYing);

new Vue({
  render: h => h(App),
}).$mount('#app');
