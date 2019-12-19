<template>
	<div id="user">
		<!--面包屑导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
		  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!--卡片-->
		<el-card>
		 	<!--搜索栏-->
		  <!--栅格系统-->
		  <el-row :gutter="60">
			  <el-col :span="10">
			  	<el-input placeholder="请输入内容" v-model='userInfo.query' clearable @clear='getUsersList'>
				    <el-button slot="append" icon="el-icon-search" @click='getUsersList'></el-button>
				  </el-input>
			  </el-col>
			  <el-col :span="6"> 
			  	
			  	<el-button type="primary" @click='dialogVisible=true'>添加用户</el-button>
			  </el-col>
			</el-row>
		</el-card>
		<!--表格展示数据-->
		<el-table :data='usesList' border stripe>
			<el-table-column label='#' type='index'></el-table-column>
			<el-table-column label='姓名' prop='username'></el-table-column>
			<el-table-column label='邮箱' prop='email'></el-table-column>
			<el-table-column label='电话' prop='mobile'></el-table-column>
			<el-table-column label='角色' prop='role_name'></el-table-column>
			<el-table-column label='状态'>
				<!--作用域插槽-->
				<template slot-scope="scope">
					<!--{{ scope.row }}-->
					<el-switch v-model="scope.row.mg_state" @change='stateChange(scope.row)'></el-switch>
				</template>
			</el-table-column>
			<el-table-column label='操作'>
				
				<template slot-scope='scope'>
					<!--修改按钮-->
				  <el-button @click='editUserInfo(scope.row.id)' type="primary" icon="el-icon-edit" circle size='mini'></el-button>
				  <!--删除按钮-->
				  <el-button @click='removeUserById(scope.row.id)' type="danger" icon="el-icon-delete" circle size='mini'></el-button>
				  <!--设置按钮-->
				   <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable='false'>
				   	<el-button type="danger" icon="el-icon-s-tools" circle size='mini' @click='setRoles(scope.row)'></el-button>
			    </el-tooltip>
				</template>
			</el-table-column>
		</el-table>
		<!--分页功能-->
		<el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userInfo.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="userInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
   </el-pagination>
   <!--添加用户对话框-->
   <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close='addClose'>
  	<!--添加用户的表单区域-->
  	<el-form :model="addForm" :rules="addFormRul" ref="addFormRef" label-width="70px">
		 <!--用户名-->
		 <el-form-item label="用户名" prop="username">
		    <el-input v-model="addForm.username"></el-input>
		  </el-form-item>
		
		<!--密码-->
			<el-form-item label="密码" prop="password">
		    <el-input v-model="addForm.password"></el-input>
		  </el-form-item>
	
		<!--邮箱-->
			<el-form-item label="邮箱" prop="email">
		    <el-input v-model="addForm.email"></el-input>
		  </el-form-item>
		
		<!--手机-->
			<el-form-item label="手机" prop="mobile">
		    <el-input v-model="addForm.mobile"></el-input>
		  </el-form-item>
		</el-form>
		
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="dialogVisible = false">取 消</el-button>
	    <el-button type="primary" @click="addUser">确 定</el-button>
	  </span>
	</el-dialog>
 
		<!--编辑用户的对话框-->
		<el-dialog  @close='editClose' title="编辑用户" :visible.sync="editdialogVisible" width="50%">
		  <!--表单内容-->
		  <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRef" label-width="70px">
			  <!--用户名-->
			  <el-form-item label="用户名" prop="username">
			    <el-input v-model="editUserForm.username" disabled></el-input>
			  </el-form-item>
			  <!--邮箱-->
			  <el-form-item label="邮箱" prop="email">
			    <el-input v-model="editUserForm.email"></el-input>
			  </el-form-item>
			  <!--电话-->
			  <el-form-item label="电话" prop="mobile">
			    <el-input v-model="editUserForm.mobile"></el-input>
			  </el-form-item>
			</el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="editdialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="editUserSubmit">确 定</el-button>
		  </span>
		</el-dialog>
		
			
		<!--分配角色对话框-->
		<el-dialog @close='setRolesClose' title="分配角色" :visible.sync="setRoledialogVisible" width="50%">
		 	<div>
		 		<!--<pre>
		 			{{userInfos}}
		 		</pre>
		 		-->
		 		<p>当前用户名:{{userInfos.username}}</p>
		 		<p>当前角色名:{{userInfos.role_name}}</p>
		 		<p>修改新的角色:
		 			 <el-select v-model="rolesId" placeholder="请选择">
				    <el-option v-for="item in roleList"
				      :key="item.id"
				      :label="item.roleName"
				      :value="item.id">
				    </el-option>
				  </el-select>
		 		</p>
		 	</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="setRoledialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="saveRoles">确 定</el-button>
		  </span>
		</el-dialog>
	
	
	</div>
	
	
	
</template>

<script>
	export default {
		data(){
			//自定义验证规则
			//rule验证规则
			//value要验证的内容
			var checkEmail = (rule, value, callback)=>{
				//自定义一个邮箱的验证规则,使用正则
				const regEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
				
				if(regEmail.test(value)) {
					callback()
				}
				callback(new Error('验证失败'));
			}
			//自定义验证手机号
			var checkMobil = (rule, value, callback)=>{
				//自定义一个邮箱的验证规则,使用正则
				const regMobil = /^1(3|4|5|7|8|9)\d{9}$/;
				if(regMobil.test(value)) {
					callback()
				}
				callback(new Error('验证失败'));
			}
			return {
				
          userInfo:{
          	//要查询用户
          	query:'',
          	//当前的页码(第几页)
          	pagenum:1,
          	//每页展示的数据,默认给2
          	pagesize:2
          },
          	//所有的用户基本数据
          usesList:[],
         	// 总的数据条数
          total:0,
         // 控制对话框的显示隐藏
          dialogVisible:false,
          addForm:{
          	username:'',
          	password:'',
          	email:'',
          	mobile:''
          },
         // 添加用户的验证规则
          addFormRul:{
          	username:[
          		 { required: true, message: '请输入用户名', trigger: 'blur' },
           		 { min: 3, max: 8, message: '长度在 3 到 8个字符', trigger: 'blur' }
          	],
          	password:[
          		 { required: true, message: '请输入密码', trigger: 'blur' },
           		 { min: 6, max: 18, message: '长度在 6 到18个字符', trigger: 'blur' }
          	],
          	email:[
							 { validator:checkEmail, trigger: 'blur' }
          	],
          	mobile:[
          		{ validator:checkMobil, trigger: 'blur' }
          	]
          	
          },
          //点击修改弹框的显示和隐藏
					editdialogVisible:false,
					//根据ID查询到的用户信息
					editUserForm:{},
					editUserFormRules:{
						email:[
							 { validator:checkEmail, trigger: 'blur' }
          	],
          	mobile:[
          		{ validator:checkMobil, trigger: 'blur' }
          	]
					},
//					控制角色分配对话框的显示隐藏
					setRoledialogVisible:false,
					//用户数据
					userInfos:[],
					//角色列表
					roleList:[],
					rolesId:''
			
					
			}
			
		},
		created(){
			this.getUsersList();
		},
		methods:{
			//获取用户列表(表格中的)
			async getUsersList(){
				const {data:res} = await this.$http.get('users',{ params:this.userInfo })
				//console.log(res)
				if(res.meta.status !== 200 ){
					return this.$message.error(res.meta.msg)
				}
				this.usesList = res.data.users;
				this.total = res.data.total;
			},
			async stateChange(datas){
				const {data:res} = await this.$http.put(`users/${datas.id}/state/${datas.mg_state}`)
				console.log(res)
				if(res.meta.status !== 200 ){
					res.data.mg_state = !res.data.mg_state;
					return this.$message.error(res.meta.msg)
				}
				this.$message.success('修改成功')
			},
			handleSizeChange(val){
				//每页展示的数据量
				console.log(val)
				this.userInfo.pagesize = val;
				this.getUsersList();
				
			},
			handleCurrentChange(val){
				//当前页的改变
				console.log(val);
				this.userInfo.pagenum = val;
				this.getUsersList();
			},
			//关闭添加框清除表单内容的方法
			addClose(){
				this.$refs.addFormRef.resetFields();
			},
			//点击确定添加用户的方法
			 addUser(){
				this.$refs.addFormRef.validate(async (vali)=>{
					console.log(vali)
					if(!vali){
						return this.$message.error('添加失败')
					}
					//预验证通过,发送ajax请求
					const {data:ret} = await this.$http.post('users',this.addForm);
					if(ret.meta.status !== 201 ){
						return this.$message.error(ret.meta.msg)
					}
					//关闭对话框
					this.dialogVisible = false;
					this.getUsersList();
				})
			},
			//根据ID查询到要修改的用户的操作
			async editUserInfo(id){
				const {data:res} = await this.$http.get('users/' + id);
				console.log(res)
				if(res.meta.status !== 200) return this.$message.error(ret.meta.msg)
				this.editUserForm = res.data;
				this.editdialogVisible = true;
			},
			//清除内容
			editClose(){
				this.$refs.editUserFormRef.resetFields();
			},
			//修改完成确认提交
			editUserSubmit(){
				//预校验
					this.$refs.editUserFormRef.validate( async vali => {
						//预校验失败
						if(!vali) return this.$message.error('编辑失败')
						//预校验成功
						const {data:res} = await this.$http.put('users/' + this.editUserForm.id,{
							id:this.editUserForm.id,
							email:this.editUserForm.email,
							mobile:this.editUserForm.mobile
						})
						if(res.meta.status !== 200 ) return this.$message.error('更新失败');
						//更新成功操作
						//1.提示用户成功
						this.$message.success('更新成功');
						//关闭修改信息对话窗口
						this.editdialogVisible = false;
						//重新渲染页面
						this.getUsersList()
					})
			},
			//根据用户ID删除该用户的方法
			async removeUserById(id){
				//alert(id)
				//给用户一个提示框,是都真的删除
				const ret = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
       }).catch(err=>  err )
				console.log(ret)
				//confirm 点击确定的时候的结果
				//cancel 点击取消的结果
				if(ret !== 'confirm') return this.$message.info('取消删除');
				//调用api实现删除用户
				const { data:res } = await this.$http.delete('users/' + id )
				if(res.meta.status != 200 ) return this.$message.error('删除失败')
				this.$message.success('删除成功');
				this.getUsersList();
			},
			//分配角色的方法
			async setRoles(role){
				this.userInfos  = role;
			//	alert(1)
				this.setRoledialogVisible = true;
				//获取角色列表
				const {data:res} = await this.$http.get('roles');
				if(res.meta.status !== 200 ){
					return this.$message.error('获取失败')
				}
				this.roleList = res.data;
				console.log(this.roleList)
			},
			//点击确定后保存分配角色
			async saveRoles(){
				//判断用户是否有选择新角色
				if(!this.rolesId){
					return this.$message.info('请选择角色')
				}
				//发送ajax
				const {data:res} = await this.$http.put(`users/${this.userInfos.id}/role`,{
					rid:this.rolesId
				});
				if(res.meta.status !== 200 ){
					return this.$message.error('设置角色失败')
				}
				this.$message.success('设置角色成功');
				//重新渲染页面
					this.getUsersList();
//				关闭对话框
				this.setRoledialogVisible = false;
			},
			//监听角色分配对话框的关闭
			setRolesClose(){
				this.rolesId = '';
			}
		}
		
	}
</script>

<style scoped>
	
	.el-pagination {
		margin-top: 10px;
	}
</style>