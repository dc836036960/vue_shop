import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/base.css'
//阿里图标库
import './assets/font/iconfont.css'
//三级展示表格插件
import ZkTable from 'vue-table-with-tree-grid'
Vue.component('tree', ZkTable)

//引入elementUI库
import ElementUI from 'element-ui'
//elementUI库的样式文件
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//富文本编辑器的配置
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)



//引入axios,用来发送ajax
import axios from 'axios'
//配置一下路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//有权限的api添加token
axios.interceptors.request.use( config =>{
		//为请求头,添加token验证Authorization字段
		//console.log(config)
		config.headers.Authorization = window.sessionStorage.getItem('token');
		return config;
});

//axios挂载到Vue实例的原型对象上,后面就是可以直接使用this.$http
Vue.prototype.$http = axios




//全局过滤器
//padStart(字符串处理后的长度,用哪个字符在前面填充)字符串方法
Vue.filter('dateFilter',function(val){
	const date = new Date(val);
	const y = date.getFullYear();
	const m = (date.getMonth() + 1 + '').padStart(2,'0');
	const d = (date.getDate()+'').padStart(2,'0');
	//时分秒自己获取
	return `${y}-${m}-${d}`
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
