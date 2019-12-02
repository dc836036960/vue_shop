import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/base.css'
//阿里图标库
import './assets/font/iconfont.css'

//引入elementUI库
import ElementUI from 'element-ui'
//elementUI库的样式文件
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
