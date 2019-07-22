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
// 引入第三方的树状表格
import TreeTble from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTble)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
