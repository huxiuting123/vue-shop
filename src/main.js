import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import './plugins/element.js'
// 引入公共样式文件
import './assets/css/global.css'
// 引入第三方字体图标接口文件
import './assets/fonts/iconfont.css'
// 引入api接口文件
import './api'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
