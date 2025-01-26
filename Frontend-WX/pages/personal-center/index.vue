<template>
	<view class="modal-backdrop"></view>
	<view class="personal-center">
		<view class="user-info">
			<image :src="userDataStore.userInfo.avatar" mode="aspectFill"></image>
			<text>{{userDataStore.userInfo.nickName}}</text>
		</view>
		<text class="new-dialogue" @click="openChat">开启新对话</text>
		<text class="history" v-if="userDataStore.chatList.length > 0">对话历史</text>
		<!-- 消息列表 -->
		<scroll-view v-if="userDataStore.chatList.length > 0" scroll-y type="list" class="scroll-height" enhanced 	enable-passive>
			<view class="history-list" 
			v-for="(item,index) in userDataStore.chatList" :key="index"
			@click="selectChatHistory(item.session_id)"
			>
				<block v-for="(itema,indexa) in item.message" :key="indexa">
				<text class="text-show">{{itema.content}}</text>
				</block>
				<text>{{item.time}}</text>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
	// 胶囊按钮坐标
	import {buttonPosition} from '@/api/component-api.js'
	const {but_height,but_top,but_button} = buttonPosition()
	import {userData,chatbotMessage,selectNavIndex} from '@/store/index.js'
	const userDataStore = userData()
	const chatbotMessageStore = chatbotMessage()
	const selectNavIndexStore = selectNavIndex()
	import {onlyChatHistory} from "@/api/request.js"
	
	// 开启新会话
	const openChat = ()=>{
		userDataStore.newChat = true//开启新会话
		userDataStore.sessionId = ''//传递空的会话
		chatbotMessageStore.messages = []//清空暂存的对话数据
		selectNavIndexStore.index = 1//指向对话界面
	}
	// 点击聊天列表获取对应的聊天内容
	const selectChatHistory = async(sessionId)=>{
		// console.log(sessionId);
		userDataStore.newChat = false//不开启新会话
		userDataStore.sessionId = sessionId//传递会话id
		selectNavIndexStore.index = 1//指向对话界面
		uni.showLoading({
			mask:true,
			title:'请求中'
		})
		const result = await onlyChatHistory({sessionId})
		chatbotMessageStore.messages = result.data
		uni.hideLoading()
	}
</script>

<style lang="less" scoped>
	// 遮罩层
	.modal-backdrop{
		position: fixed;
		left: 0;
		top: v-bind('but_button');
		bottom: 0;
		right: 0;
		background:rgba(0, 0, 0,0.8);
	}
	.personal-center{
		background-color: #F8F8F8;
		position: fixed;
		left: -80%;
		top: v-bind('but_button');
		bottom: 0;
		width: 80%;
		animation: slideInFromLeft 0.5s forwards;
		@keyframes slideInFromLeft {
			from{
				left:-80%;
			}
			to{
				left:0
			}
		}
		.user-info{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding: 30rpx 0;
			image{
				width: 90rpx;
				height: 90rpx;
				border-radius: 50%;
			}
			text{
				font-size: 35rpx;
				font-weight: bold;
				padding-top: 10rpx;
			}
		}
		// 开启新对话
		.new-dialogue{
			margin: 45rpx 20rpx;
		}
		// 对话历史
		.history{
			margin: 30rpx 20rpx;
			border-bottom: 1rpx solid rgba(218, 218, 218,0.6);
			padding-bottom: 20rpx;
		}
		// 消息列表
		.scroll-height{
			height: 800rpx;
			.history-list{
				background-color: #ffffff;
				border-radius: 20rpx;
				margin: 20rpx;
				padding: 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
			.history-list text:nth-child(1){
				flex: 1;
			}
			.history-list text:nth-child(2){
				color: #9D9EAB;
				font-size: 26rpx;
				padding-left: 20rpx;
			}
		}
	}
</style>