import Vue from 'vue'
import App from './App.vue'
import router from './router'

//引入elementUI库
import ElementUI from 'element-ui'
//elementUI库的样式文件
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
