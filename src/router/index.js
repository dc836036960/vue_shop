import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import List from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'
import Reports from '../components/reports/Reports.vue'
import Orders from '../components/orders/Orders.vue'

Vue.use(VueRouter)

const router = new VueRouter({
	routes: [{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/login',
			component: Login
		},
		{
			path: '/home',
			component: Home,
			redirect: '/welcome',
			children: [{
					path: '/welcome',
					component: Welcome
				},
				{
					path: '/users',
					component: Users
				},
				{
					path: '/rights',
					component: Rights
				},
				{
					path: '/roles',
					component: Roles
				},
				{
					path: '/categories',
					component: Cate
				},
				{
					path:'/params',
					component:Params
				},
				{
					path:'/goods',
					component:List
				},
				{
					path:'/goods/add',
					component:Add
				},
				{
					path:'/orders',
					component:Orders
				},
				{
					path:'/reports',
					component:Reports
				},
				
			]
		},
	]
})
//路由导航守卫
router.beforeEach((to, from, next) => {
	//如果用户想要访问登录login页面,没必要做任何验证,直接放行
	if(to.path == '/login') return next();
	//获取token
	const tokenStr = window.sessionStorage.getItem('token');
	if(!tokenStr) return next('/login')
	next();
})

export default router