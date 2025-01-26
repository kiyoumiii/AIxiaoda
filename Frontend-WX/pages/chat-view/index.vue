<template>
	<!-- 顶部导航切换 -->
	<view class="menu-view">
		<view class="button-top"></view>
		<view class="menu-style">
			<text v-for="(item,index) in menu" :key="index"
			:class="{'select-menu':selectNavIndexFun.index === index}"
			@click="selectNav(index)"
			>{{item}}</text>
		</view>
	</view>
	<view class="ment-view-height"></view>
	<!-- 创建新对话的内容展示 -->
	<startPageVue v-show="selectNavIndexFun.index === 1 && chatbotMessageFun.messages.length <= 0"></startPageVue>
	<!-- 文生文的对话组件 -->
	<chatAreaVue class="chatAreaVue" v-show="selectNavIndexFun.index === 1 && chatbotMessageFun.messages.length > 0"></chatAreaVue>
	<!-- ai绘图组件 -->
	<aiDrawingVue v-show="selectNavIndexFun.index === 2"></aiDrawingVue>
	<!-- 底部输入框 -->
	<inputBoxVue v-show="selectNavIndexFun.index === 1"></inputBoxVue>
	<!-- 个人中心 -->
	<personalCenter v-show="selectNavIndexFun.index === 0"></personalCenter>
	<!-- 登录页面 -->
	<loginPage v-if="!userData().isLogin"></loginPage>
	<!-- 高度 -->
	<view style="height: 300rpx;"></view>
</template>

<script setup>
	import { ref,watch,getCurrentInstance } from "vue"
	import {onLoad} from '@dcloudio/uni-app'
	// 胶囊按钮坐标
	import {buttonPosition} from '@/api/component-api.js'
	const {but_height,but_top,but_button} = buttonPosition()
	// 创建新对话的内容展示
	import startPageVue from "./component/start-page.vue";
	// 文生文的对话组件
	import chatAreaVue from "./component/chat-area.vue";
	// ai绘图组件
	import aiDrawingVue from "./component/ai-drawing.vue";
	// 底部输入框
	import inputBoxVue from "./component/input-box.vue";
	// 个人中心
	import personalCenter from '@/pages/personal-center/index.vue'
	// 登录页面
	import loginPage from '@/pages/login-page/index.vue'
	const menu = ref(['我的','对话','AI绘画'])
	import {selectNavIndex,chatbotMessage,inProgress,userData} from '@/store/index.js'
	const selectNavIndexFun = selectNavIndex()
	const chatbotMessageFun = chatbotMessage()
	// 切换导航栏
	const selectNav = (index)=>{
		if(inProgress().queryValue())return false
		selectNavIndexFun.$patch(state=>{
			state.index = index
		})
	}
	// 监听组件高度，始终滚动底部
	const instance = getCurrentInstance();
	watch(()=>chatbotMessageFun.messages,(newval)=>{
		setTimeout(()=>{
			const query = uni.createSelectorQuery()
			query.select('.chatAreaVue').boundingClientRect()
			query.exec(rect=>{
				uni.pageScrollTo({
				  scrollTop: rect[0].height + 200
				})
			})
		},500)
	},{deep:true})
	// 获取本地缓存用户信息，判断登录状态
	onLoad(()=>{
		userData().isLoggedIn()
	})
</script>

<style lang="less">
	page{
		background-color: #F3F3F3;
	}
	.menu-view{
		height: v-bind('but_button');
		background:linear-gradient(#FCE7CC,#F3F3F3);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 9999;
		.button-top{
			height: v-bind('but_top');
		}
		.menu-style{
			display: flex;
			align-items: center;
			height: v-bind('but_height');
			padding-left: 20rpx;
			.select-menu{
				color: #333 !important;
			}
		}
		.menu-style text{
			color: #9D9486;
			font-weight: bold;
		}
		.menu-style text:nth-child(2){
			padding: 0 60rpx;
		}
	}
	.ment-view-height{
		height: v-bind('but_button');
	}
</style>