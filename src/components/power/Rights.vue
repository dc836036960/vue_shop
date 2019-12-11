<template>
	<div id="rights">
		<!--展示权限列表-->
		<!--面包屑导航的展示-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
		  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!--卡片区域-->
		<el-card>
			<!--表格:权限列表展示-->
			<el-table :data='rightsList' border stripe>
				<el-table-column label="#" type='index' width='180'></el-table-column>
				<el-table-column  label="权限名称" prop='authName' width='180'></el-table-column>
				<el-table-column  label="路径" prop='path' width='180'></el-table-column>
				<el-table-column  label="权限等级" prop='level' width='180'>
					<template slot-scope="scope">
						<!--{{scope.row.level}}-->
						<el-tag type="success" v-if='scope.row.level=== "0"'>一级</el-tag>
						<el-tag type="info" v-else-if=' scope.row.level === "1"'>二级</el-tag>
						<el-tag type="warning" v-else>三级</el-tag>
					</template>
				</el-table-column>
			</el-table>
			
		</el-card>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				rightsList:[]
			}
		},
		methods:{
			//获取所有权限列表的方法
			async getRightsList(){
			const { data:res } = await	this.$http.get('rights/list')
				//console.log(res.data)
				this.rightsList = res.data;
				console.log(this.rightsList)
			}
		},
		created(){
			this.getRightsList();
		}
	}
</script>

<style>
</style>