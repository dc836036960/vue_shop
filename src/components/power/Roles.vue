<template>
	<div id="roles">
		<!--面包屑导航的展示-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
		  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!--卡片区域-->
		<el-card>
			<!--表格区域-->
			<el-table :data='rolesList' style='width=100%' border>
				<el-table-column type='expand'>
					<template slot-scope='scope'>
						<!--{{scope.row}}-->
						<el-row  :class="['bottomBorder',i1===0?'topBorder':'','ceter']" v-for='(item1,i1) in scope.row.children' :key='item1.id'>
							<!--一级权限-->
							<el-col :span='5'>
								<el-tag type='success' @close='removRoles(scope.row,item1.id)' closable>{{item1.authName}}</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<!--二级和三级-->
							<el-col :span='19'>
								<el-row :class="[ i2===0?'':'topBorder','ceter' ]" v-for='(item2,i2) in item1.children' :key='item2.id'>
									<el-col :span='6'>
										<el-tag type='warning' @close='removRoles(scope.row,item2.id)' closable>{{item2.authName}}</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>
									
									<el-col :span='18' >
										<el-tag type='primary' @close='removRoles(scope.row,item3.id)' closable v-for='(item3,i3) in item2.children' :key='item3.id'>{{ item3.authName }}</el-tag>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column type='index' label='#'></el-table-column>
				<el-table-column label="角色名称" prop="roleName" ></el-table-column>
				<el-table-column label="角色描述" prop="roleDesc" ></el-table-column>
				<el-table-column label="操作" width='400'>
					<template slot-scope='scope'>
						<!--编辑角色-->
						<el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
						<!--删除角色-->
						<el-button type="success" icon="el-icon-delete" size="mini">删除</el-button>
						
						<!--分配-->
						<el-button type="warning" icon="el-icon-setting" size="mini" @click='setRights(scope.row)'>分配权限</el-button>
						
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		
		<!--分配权限的对话框-->
		<el-dialog @close='watchDialogClose'  title="分配权限" :visible.sync="setRightdialogVisible" width="50%">
		  <!--权限列表展示-->
		  <el-tree ref='treeRef'  :default-checked-keys="treeArrKey"  node-key="id" default-expand-all  show-checkbox :data="treeList" :props="treeProps"></el-tree>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="setRightdialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="setRightsTrue">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				rolesList:[],
//				控制我们分配权限的显示和隐藏的
				setRightdialogVisible:false,
				treeList:[],
				treeProps:{
					children :'children',
					label :'authName'
				},
				treeArrKey:[],
				//存储角色id
				rolesId:'',
			}
		},
		methods:{
			//获取所有的角色列表数据
			 async getRolesList(){
				const {data:res } = await this.$http.get('roles');
				this.rolesList = res.data;
				console.log(this.rolesList)
			},
			//删除指定权限
			async removRoles(role,rightId){
				//alert(1)
				//删除之前,防止误操作
				const ret = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
       	}).catch(err=>err )
       	if(ret !== 'confirm') return this.$message.info('取消删除');
				//调用接口
				const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
				if(res.meta.status !== 200 ){
					return this.$message.error('操作失败');
				}
				//删除成功后,重新渲染页面
				this.$message.success('删除成功');
				//自动合上,用户体验不太好
				//this.getRolesList();
				//我们换个好点的写法
				role.children = res.data;
			},
		
			//分配权限方法
			async setRights(role){
			//	存储角色id
				this.rolesId = role.id
				const {data:res} = await this.$http.get('rights/tree')
				if(res.meta.status !== 200 ){
					return this.$message.error('获取失败')
				}
				this.treeList = res.data;
				//调用这个递归方法
				this.getRightsChecked(role,this.treeArrKey);
				console.log(this.treeArrKey)
				this.setRightdialogVisible = true;
			},
			getRightsChecked(node,arr){
				//node节点
				//arr数组
				if(!node.children){
					return arr.push(node.id)
				}
				
				node.children.forEach( item => {
					//递归操作
					this.getRightsChecked(item,arr)
				})
			},
			//监听权限分配的对话框的关闭
			watchDialogClose(){
				this.treeArrKey = []
			},
			//点击确定按钮,实现权限分配方法
			
			async setRightsTrue(){
				//alert(1)
				//关闭对话框
				//获取到全选和半选的ID,组成一个数组
				/*[1,2,3,4,5,6]
				...[2,3]  -> 2 3*/
				 const arr = [
					 ...this.$refs.treeRef.getCheckedKeys(),
				 	 ...this.$refs.treeRef.getHalfCheckedKeys()
				 ];
				 //console.log(arr)
				 //把数组转换成以逗号分隔的字符串形式
				 const strArr = arr.join(',');
				 //console.log(strArr)
				 //发送ajax请求
				 
				 const {data:res} = await this.$http.post(`roles/${this.rolesId}/rights`,{
				 	rids:strArr
				 })
				 if(res.meta.status !== 200){
				 	return this.$message.error('更新失败')
				 }
				 this.$message.success('更新成功');
				 this.getRolesList();
				 this.setRightdialogVisible = false
			}
		
		},
		created(){
			this.getRolesList()
		}
	}
</script>

<style scoped>
	.el-tag {
		margin: 7px;
	}
	/*上边框线*/
	.topBorder {
		border-top: 1px solid #eee;
	}
	/*下边框线*/
	.bottomBorder {
		border-bottom: 1px solid #eee;
	}
	/*实现垂直居中的类(小tag)*/
	.ceter {
		display: flex;
		align-items: center;
	}
</style>