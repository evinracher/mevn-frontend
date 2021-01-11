import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vuelidate from 'vuelidate'

Vue.use(Vuelidate)
Vue.use(BootstrapVue)
Vue.use(VueAxios, axios)

// Base route of our API
// axios.defaults.baseURL = 'http://localhost:3000/api';
axios.defaults.baseURL = 'https://mevn-task-app.herokuapp.com/api';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
