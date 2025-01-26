<template>
	<view class="login-page">
		<image class="login-image" src="/static/login.png" mode="widthFix"></image>
		<text class="login-tips">登录体验更多AI功能</text>
		<view class="login-view">
			<button open-type="chooseAvatar" id="avatar-button" @chooseavatar="chooseavatar">
			  <image class="avatar" :src="userInfo.avatar === '' ? '/static/touxiang.png' : userInfo.avatar"></image>
			</button>
			<form class="form-submit" @submit="fromSubmit">
				<input type="nickname" class="weui-input" name="input" placeholder="请输入昵称"/>
				<button form-type="submit" class="submit-button" :loading="loading">登录</button>
			</form>
		</view>
	</view>
</template>

<script setup>
	import {wxLogin,uploadUrl} from '@/api/request.js'
	import {userData} from '@/store/index.js'
	import {reactive,ref} from 'vue'
	// 存储头像昵称
	const userInfo = reactive({
		avatar:'',
		nickname:''
	})
	// 获取头像
	const chooseavatar = (event)=>{
		userInfo.avatar = event.detail.avatarUrl
	}
	const loading = ref(false)
	// 登录
	const fromSubmit = async(event)=>{
		userInfo.nickname = event.detail.value.input
		// 校验
		if(userInfo.avatar === '' || userInfo.nickname.trim() === ''){
			uni.showToast({
				icon:'none',
				title:'请填写头像和昵称'
			})
			return false
		}
		loading.value = true
		// 上传头像
		const uploadAvatar = await uni.uploadFile({
			url:uploadUrl,
			filePath:userInfo.avatar,
			name:'file'
		})
		const fileurl = JSON.parse(uploadAvatar.data).data.fileurl
		// 获取code
		uni.login({
			success:async(res)=>{
				await userData().isNotLoggedIn(
				userInfo.nickname,
				fileurl,
				res.code
				)
				loading.value = false
			}
		})
	}
	
</script>

<style lang="less" scoped>
	.login-page{
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background-color: #ffffff;
		z-index: 9999;
		.login-image{
			width: 100%;
			margin-top: 110rpx;
		}
		.login-tips{
			font-weight: bold;
			padding: 40rpx 20rpx;
		}
		.login-view{
			display: flex;
			flex-direction: column;
			align-items: center;
			#avatar-button,.avatar{
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
			}
			.form-submit{
				width: 100%;
				.weui-input{
					padding: 20rpx;
					margin: 20rpx;
					border-bottom: 1rpx solid #f2f2f2;
				}
				.submit-button{
					background:linear-gradient(to right,#A2C5FE, #C0E7FD);
					padding: 15rpx 0;
					margin: 55rpx 20rpx 0 20rpx;
				}
			}
		}
	}
</style>