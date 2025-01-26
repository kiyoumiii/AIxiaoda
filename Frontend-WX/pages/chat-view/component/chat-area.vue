<template>
	<block v-for="(item,index) in chatbotMessage().messages" :key="index">
	<view class="user-message" v-if="item.role === 'user'">{{item.content}}</view>
	<view class="zhipu-message" v-if="item.role === 'assistant'">
		<towxml :nodes="appContext.$towxml(item.content,'markdown')"></towxml>
		<loadingVue v-if="item.finish_reason == 'start'"></loadingVue>
		<!-- 联网查询的数据 -->
		<view v-if="item.web_search.length > 0">
			<text class="recommend-tips">我还为你推荐以下内容</text>
			<view class="recommend-content">
				<text class="recommend-item text-show"
				v-for="(itema,indexa) in item.web_search" :key="indexa"
				@click="copyText(itema.link)"
				>{{indexa + 1}}.{{itema.title}} —— {{itema.media}}</text>
			</view>
		</view>
	</view>
	</block>
</template>

<script setup>
	import { ref,getCurrentInstance } from "vue"
	import loadingVue from './loading.vue'
	import {chatbotMessage} from '@/store/index.js'
	const instance = getCurrentInstance()
	const appContext = ref(null)
	appContext.value = instance.appContext.config.globalProperties
	// 复制链接
	const copyText = (url)=>{
		uni.setClipboardData({
			data:url,
			success(){
				uni.showToast({
					icon:'none',
					title:'链接已复制,请到浏览器打开'
				})
			}
		})
	}
</script>
<style lang="less" scoped>
	.user-message{
		background-color: #20C57D;
		border-radius: 4rpx;
		color: #fff;
		padding: 15rpx;
		margin: 30rpx 20rpx 0 20rpx;
		display: inline-block;
	}
	.zhipu-message{
		background-color: #ffffff;
		border-radius: 4rpx;
		color: #333;
		padding: 15rpx;
		margin: 30rpx 20rpx 0 20rpx;
		.recommend-tips{
			background-color: #F3F3F3;
			border-radius: 10rpx;
			margin: 20rpx 0;
			padding: 15rpx;
			font-weight: bold;
		}
		.recommend-content{
			background-color: #F3F3F3;
			border-radius: 10rpx;
			padding: 15rpx;
			.recommend-item{
				margin-bottom: 15rpx;
				color: #006C45;
			}
			.recommend-item:last-child{
				margin-bottom:0
			}
		}
	}
</style>