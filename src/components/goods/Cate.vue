<template>
	<div id="cate">
		<!--面包屑导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
		  <el-breadcrumb-item>商品分类列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!--卡片区域-->
		<el-card>
		<!--添加分类按钮-->
		<el-row>
			<el-col :span='5'>
				<el-button type='success' @click="addCate">添加分类</el-button>
			</el-col>
		</el-row>
		<!--展示分类-->
			<tree style="margin: 10px 0;" :data='cateList' :columns="columns" index-text="#" show-index :show-row-hover="false" :expand-type="false" :selection-type="false">
				<!--是否有效-->
				<template slot="isOk" slot-scope="scope">
					<!--<pre>
						{{scope.row.cat_deleted}}
					</pre>-->
					<i class="el-icon-error" style="color: orange;font-size: 20px;" v-if='scope.row.cat_deleted === false'></i>
        	<i class="el-icon-success" style="color: green;font-size: 20px;" v-else></i>
      	</template>
      	<!--排序-->
      	<template slot='level' slot-scope="scope">
      		<el-tag type='warning' v-if="scope.row.cat_level===0">一级</el-tag>
      		<el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
      		<el-tag type="primary" v-else>三级</el-tag>
      	</template>
      	<!--操作-->
      	<template slot="setting" slot-scope="scope">
      		<el-button type="warning" size="mini" class="el-icon-edit">编辑</el-button>
      		<el-button type="success" size="mini" class="el-icon-delete">删除</el-button>
      	</template>
			</tree>
		<!--分页展示-->
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="cateInfo.pagenum"
      :page-sizes="[1, 2, 3, 5]"
      :page-size="cateInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    
		</el-card>
		
		<!--添加分类的对话框-->
		<el-dialog @close="addCateClose" title="添加分类" :visible.sync="addCatedialogVisible" width="50%">
		  <!--添加分类的表单-->
		  <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
			  <el-form-item label="分类名称:" prop="cat_name">
			    <el-input v-model="addCateForm.cat_name"></el-input>
			  </el-form-item>
			  <!--options要展示的数据
			  	props配置选项
			  -->
			  <el-form-item label="父级分类:">
			     <el-cascader clearable v-model="cascaderKeys" :options="parentCate" :props="cascaderProps"
    @change="cascaderChange"></el-cascader>
			  </el-form-item>
			</el-form>
			
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addCatedialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="saveCate">确 定</el-button>
		  </span>
		</el-dialog>
		
	</div>
</template>

<script>
	export default {
		data(){
			return {
				cateInfo:{
					type:3,
					pagenum:1,
					pagesize:5
				},
				//分类列表数据存储
				cateList:[],
				//保存总的数据条数
				total:0,
				//每一列展示的数据
				columns:[
					{
						label: '分类名称',
						prop: 'cat_name',
					},
					{
						label: '是否有效',
						prop: 'cat_deleted',
						type: 'template',
            template: 'isOk',
					},
					{
						label: '排序',
						prop: 'cat_level',
						type: 'template',
            template: 'level',
					},
					{
						label:'操作',
						type: 'template',
            template: 'setting',
					}
				],
				
				//控制添加分类对话框的显示和隐藏
				addCatedialogVisible:false,
				addCateForm:{
					//分类名称
					cat_name:'',
					//父级id
					cat_pid:0,
					//分类层级(0,1,2)
					cat_level:0
				},
				//校验规则
				addCateFormRules:{
					cat_name:[
						{ required: true, message: '请输入分类名称', trigger: 'blur' },
					]
				},
				//父级分类
				parentCate:[],
				//级联选择框的配置
				cascaderProps:{
					checkStrictly:"true",
					expandTrigger:"hover",
					value:"cat_id",
					label:"cat_name",
					children:"children"
				},
				cascaderKeys:[],
			}
		},
		methods:{
			//每页展示数据条数的改变
			handleSizeChange(val){
				//console.log(val)
				this.cateInfo.pagesize = val;
				this.getCateList();
			},
			//当前显示第几页
			handleCurrentChange(val){
				//console.log(val)
				this.cateInfo.pagenum = val;
				this.getCateList();
			},
			//获取商品分类
			async getCateList(){
				const {data:res} = await this.$http.get('categories',{
					params:this.cateInfo
				})
				if(res.meta.status !== 200 ){
					return this.$message.error('获取失败')
				}
				this.cateList = res.data.result;
				this.total = res.data.total;
				//console.log( this.cateList )
			},
			//添加分类的方法
			async addCate(){
				//获取父级分类数据
				const {data:res} = await this.$http.get('categories',{ params:{type:2}} )
				if(res.meta.status !== 200 ){
					return this.$message.error('获取失败')
				}
				this.parentCate = res.data;
				//console.log(this.parentCate)
				
				//显示添加分类对话框
				this.addCatedialogVisible = true;
			},
			//级联选择器内容改变事件
			cascaderChange(){
				console.log(this.cascaderKeys)
			/*	是一个数组
				如果选择了父级分类,这个数组中肯定有元素*/
				if( this.cascaderKeys.length > 0 ) {
					//证明有选择父级分类
					this.addCateForm.cat_pid = this.cascaderKeys[ this.cascaderKeys.length-1 ]
					this.addCateForm.cat_level = this.cascaderKeys.length;
					
				}else{
					//没有选择父级分类
					this.addCateForm.cat_pid = 0
					this.addCateForm.cat_level = 0;
					
				}
				this.cascaderKeys.length > 0
				
			},
			//监听添加分类对话框的关闭事件
			addCateClose(){
				//重置表单
				this.$refs.addCateFormRef.resetFields();
				this.cascaderKeys=[];
			},
			//点击确定按钮实现添加分类
			saveCate(){
				console.log(this.addCateForm)
				//预校验
				this.$refs.addCateFormRef.validate(async vali => {
					if(!vali) return;
					const {data:res} = await this.$http.post('categories',this.addCateForm)
					if(res.meta.status !== 201 ){
						return this.$message.error('创建失败')
					}
					//提示成功
					this.$message.success('操作成功')
					//重新渲染数据
					this.getCateList()
					//关闭对话框
					this.addCatedialogVisible = false;
				});
			}
		},
		created(){
			this.getCateList()
		},
	}
</script>

<style scoped>
	.color {
		color:orange
	}
	.el-cascader {
		width: 100%;
	}
</style>