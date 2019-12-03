<template>
	<div id="home">
		<el-container>
			<el-header>
				<div class="home-logo">
					<img src="../assets/logo.jpg" />
					<p>电商后台管理系统</p>
				</div>

			</el-header>
			<el-container>
				<el-aside width="200px">
					
					<!--侧边栏star-->
					<el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
						<el-submenu index="1">
							<!--一级菜单模板-->
							<template slot="title">
								<!--图标-->
								<i class="el-icon-location"></i>
								<!--内容-->
								<span>导航一</span>
							</template>
							<el-menu-item index="1-1">选项1</el-menu-item>
						</el-submenu>
						
						<el-submenu index="2">
							<!--一级菜单模板-->
							<template slot="title">
								<!--图标-->
								<i class="el-icon-location"></i>
								<!--内容-->
								<span>导航二</span>
							</template>
							<el-menu-item index="1-1">选项1</el-menu-item>
						</el-submenu>
						<el-submenu index="3">
							<!--一级菜单模板-->
							<template slot="title">
								<!--图标-->
								<i class="el-icon-location"></i>
								<!--内容-->
								<span>导航三</span>
							</template>
							<el-menu-item index="1-1">
								<template slot="title">
								<!--图标-->
								<i class="el-icon-location"></i>
								<!--内容-->
								<span>选项一</span>
							</template>
							</el-menu-item>
						</el-submenu>
						<el-submenu index="4">
							<!--一级菜单模板-->
							<template slot="title">
								<!--图标-->
								<i class="el-icon-location"></i>
								<!--内容-->
								<span>导航四</span>
							</template>
							<el-menu-item index="1-1">选项1</el-menu-item>
						</el-submenu>
						
					</el-menu>
					<!--侧边栏end-->
				</el-aside>
				<el-main>Main</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
</script>

<style scoped>
	#home {
		height: 100%;
		/*background-color: #999;*/
	}
	
	.el-container {
		height: 100%;
	}
	
	.home-logo {
		display: flex;
		align-items: center;
	}
	
	.home-logo img {
		height: 40px;
		width: 40px;
		border-radius: 50%;
	}
	
	.home-logo p {
		font-size: 22px;
		margin-left: 20px;
		color: #fff;
		font-weight: 700;
	}
	
	.el-header {
		background-color: #333;
		padding-left: 0;
	}
	
	.el-aside {
		background-color: #666;
	}
	
	.el-main {
		background-color: #999;
	}
</style>