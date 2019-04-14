import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

const app = new Vue({
  render: h => h(App),
}).$mount('#app')

document.addEventListener('DOMContentLoaded', function render() {
  app.$mount('#app');
});
