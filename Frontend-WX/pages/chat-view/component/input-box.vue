<template>
	<view class="input-box-area">
		<image @click="show = !show" :src="show ? '/static/yuyin.png' : '/static/jianpan.png'" mode="widthFix"></image>
		<view class="input-content" v-show="show">
			<textarea
			class="textarea-box"
			placeholder="你有什么想知道的,快来问我"
			:show-confirm-bar="false"
			maxlength="500"
			cursor-spacing="20"
			fixed
			:auto-height="textareaValue.autoHeight"
			@linechange="lineChange"
			v-model="inputContent"
			></textarea>
		</view>
		<view class="speech-sound" v-show="!show" @longpress="longpress" @touchend="touchend">按住  说话</view>
		<image src="/static/fasong.png" mode="widthFix" @click="sendIng"></image>
	</view>
	<!-- 录制语音弹窗 -->
	<view class="mask-view" v-if="showAudio"></view>
	<view class="record-text" v-if="showAudio">
		{{storageArr.map(item=>item.result).join(' ')}}
	</view>
	<view class="recording-pop-up" v-if="showAudio">
		<text class="release">松开  发送</text>
		<text class="in-recognition">正在识别声音...</text>
		<view class="audio-wave">
			<text class="audio-wave-text"
			v-for="(item,index) in barData" :key="index"
			:style="{'animationDelay':item}"
			></text>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref,getCurrentInstance,onMounted } from "vue"
	import {onLoad} from '@dcloudio/uni-app'
	const instance = getCurrentInstance();
	import {chatbotMessage,inProgress} from '@/store/index.js'
	import {aliToken,aliyunUrl,appKey} from '@/api/request.js'
	import {SpeechTranscription} from '@/voice/st.js'
	// 切换键盘输入还是语音合成
	const show = ref(true)
	// 存储textarea的属性
	const textareaValue = reactive({
		autoHeight:true,
		alignItems:'center',
		height:'0px'
	})
	// 输入框换行时触发
	const lineChange = (event)=>{
		// console.log(event);
		const {height,lineCount} = event.detail
		// 如果>=2行
		textareaValue.alignItems = lineCount >= 2 ? 'flex-end' : 'center'
		// 如果>=6行，不再自动增高
		if(lineCount >= 6){
			textareaValue.autoHeight = false
			textareaValue.height = height
		}else{
			textareaValue.autoHeight = true
		}
	}
	// textarea的父级高度
	const textareaHeight = ref('')
	// 获取textarea的父级高度
	onMounted(()=>{
		setTimeout(()=>{
			const query = uni.createSelectorQuery().in(instance);
			query.select('.input-content').boundingClientRect((res)=>{
				textareaHeight.value = res.height + 'px'
			}).exec()
		},300)
	})
	// 声波动画数据
	const barData = ref([
		'1s','0.9s','0.8s','0.7s','0.6s','0.5s','0.4s','0.3s','0.2s','0.1s',
		'1s','0.9s','0.8s','0.7s','0.6s','0.5s','0.4s','0.3s','0.2s','0.1s',
	])
	// 显示隐藏语音录制区域
	const showAudio = ref(false)
	// 输入框的值
	const inputContent = ref('')
	// 获取全局唯一的录音管理器
	const recorderManager = wx.getRecorderManager()
	// 阿里云实例化的类
	const launckVoice = ref(null)
	// 监听录音错误事件
	recorderManager.onError(res=>{
		showAudio.value = false
		const typeData = [
			{
				type:'operateRecorder:fail auth deny',
				text:'右上角里设置里打开麦克风'
			},
			{
				type:'operateRecorder:fail NotFoundError',
				text:'请打开麦克风才可以说话'
			},
		]
			typeData.forEach(item=>{
				if(res.errMsg == item.type){
					uni.showToast({
						icon:'none',
						title:item.text
					})
				}
			})
		// 强制关闭阿里云语音识别监听
		launckVoice.value.shutdown()
	})
	// 手指长按开始说话
	const longpress = async()=>{
		console.log('长安开始');
		if(inProgress().queryValue())return false
		showAudio.value = true
		await launckVoice.value.start(launckVoice.value.defaultStartParams())
		recorderManager.start({
			duration:100000,
			sampleRate:16000,
			numberOfChannels:1,
			format:'PCM',
			frameSize:4
		})
	}
	// 手指放开
	const touchend = ()=>{
		console.log('手指放开');
		showAudio.value = false
		recorderManager.stop()
	}
	// 实时输出录音
	recorderManager.onFrameRecorded(res=>{
		console.log(res);
		launckVoice.value.sendAudio(res.frameBuffer)
	})
	// 监听录音结束
	recorderManager.onStop(res=>{
		console.log('录音结束了');
		console.log(res);
		showAudio.value = false
		// 强制关闭阿里云语音识别监听
		launckVoice.value.shutdown()
		// 录制结束取出文字发送大模型
		if(storageArr.value.length > 0){
			storageArr.value.forEach(item=>{
				inputContent.value += item.result
			})
			setTimeout(async()=>{
				await sendIng()
			},400)
		}
	})
	// ----------------阿里云语音识别----------------
	// 存储语音识别结果
	const storageArr = ref([])
	onLoad(async()=>{
		const token = await aliToken()
		const st = new SpeechTranscription({
			url:aliyunUrl,
			token:token.data,
			appkey:appKey
		})
		launckVoice.value = st
		// 实时语音识别开始。
		st.on("started",()=>{
			console.log('实时语音识别开始');
		})
		// 实时语音识别中间结果。
		st.on("changed",msg=>{
			console.log('实时语音识别中间结果');
			console.log(msg);
			const res = JSON.parse(msg)
			const queryIndex = storageArr.value.findIndex(item=>item.index === res.payload.index)
			if(queryIndex >= 0){
				storageArr.value[queryIndex].result = res.payload.result
			}else{
				storageArr.value.push(res.payload)
			}
		})
		// 提示句子结束。
		st.on("end",msg=>{
			console.log('提示句子结束');
			console.log(msg);
			const res = JSON.parse(msg)
			const queryIndex = storageArr.value.findIndex(item=>item.index === res.payload.index)
			if(queryIndex >= 0){
				storageArr.value[queryIndex].result = res.payload.result
			}else{
				storageArr.value.push(res.payload)
			}
		})
		// 连接关闭。
		st.on("closed",()=>{
			console.log('连接关闭');
		})
		// 错误。
		st.on("failed",(err)=>{
			console.log('阿里云语音识别错误');
			console.log(err);
			uni.showToast({
				icon:"none",
				title:'录音出现错误'
			})
		})
	})
	// 发送
	const sendIng = ()=>{
		console.log(inputContent.value);
		if(inProgress().queryValue())return false
		if(inputContent.value.trim() === '')return false
		chatbotMessage().startSending(inputContent.value.trim())
		// 放松完毕清空输入框
		inputContent.value = ''
		// 清空录音的结果
		storageArr.value = []
	}
</script>

<style lang="less" scoped>
	.input-box-area{
		background-color: #F8F8F8;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: v-bind('textareaValue.alignItems');
		padding-bottom: 68rpx;
		padding-top: 20rpx;
		image{
			width: 47rpx;
			margin: 0 20rpx;
		}
		.input-content{
			background-color: #ffffff;
			flex: 1;
			width: 100%;
			border-radius: 15rpx;
			padding: 10rpx;
			.textarea-box{
				width: 100%;
				height: v-bind('textareaValue.height');
			}
		}
		.speech-sound{
			flex: 1;
			background: linear-gradient(to right, #A2C5FE,#C0E7FD);
			text-align: center;
			border-radius: 15rpx;
			color: #fff;
			height: v-bind('textareaHeight');
			line-height: v-bind('textareaHeight');
		}
	}
	// 录制语音遮罩层
	.mask-view{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.7);
		z-index: 10000;
	}
	// 语音转换的文字
	.record-text{
		position: fixed;
		bottom: 500rpx;
		left: 10rpx;
		right: 10rpx;
		color: #ffffff;
		height: 300rpx;
		line-height: 1.4;
		overflow: auto;
		padding: 10rpx;
		z-index: 10000;
	}
	// 录制区域
	.recording-pop-up{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(to right, #07D280,#16CBDC);
		height: 500rpx;
		z-index: 10000;
		display: flex;
		flex-direction: column;
		align-items: center;
		.release{
			color: #ffffff;
			font-size: 33rpx;
			padding: 30rpx 0;
			font-weight: bold;
		}
		.in-recognition{
			color: #ffffff;
			font-size: 40rpx;
			padding: 30rpx 0;
			font-weight: bold;
		}
		// 声波效果
		.audio-wave{
			padding-top: 50rpx;
			.audio-wave-text{
				background-color: #ffffff;
				width: 7rpx;
				height: 10rpx;
				margin: 0 5rpx;
				border-radius: 5rpx;
				display: inline-block;
				border: none;
				animation: wave 0.2s ease-in-out;
				animation-iteration-count: infinite;
				animation-direction: alternate;
			}
			@keyframes wave {
				from{
					transform: scaleY(1);
				}
				to{
					transform: scaleY(4);
				}
			}
		}
	}
</style>