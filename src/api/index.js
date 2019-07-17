import Vue from 'vue'
import axios from 'axios'

// 在vue原型上挂载一个$http 这个axios是ajax 这样$http就可以在全局上面使用
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
Vue.prototype.$http = axios
