<template>
	<view class="start-page-view">
		<text class="greeting-text">你好，我是你的AI智能助手</text>
		<text class="intro-text">作为你的智能伙伴，我既能写文案，想点子，又能写代码，做表格</text>
		<view class="question-hint">
			<view class="question-text">你可以试着问我:</view>
			<view class="change-btn" @click="rendomData('002')">
				<image src="/static/huanyihuan.png" mode="widthFix"
				:class="{'rotate-animation':isRotating}"
				></image>
				<text>换一换</text>
			</view>
		</view>
		<!-- 用户的默认问题 -->
		<view class="default-questions">
			<view class="default-question-item" v-for="(item,index) in newData" :key="index" @click="send(item.problem)">
				<image :src="item.icon" mode="widthFix"></image>
				<view>{{item.title}}</view>
				<text class="text-show">{{item.problem}}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from "vue"
	import {onLoad} from '@dcloudio/uni-app'
	import M1 from '/static/start-page/m1.png'
	import M2 from '/static/start-page/m2.png'
	import M3 from '/static/start-page/m3.png'
	import M4 from '/static/start-page/m4.png'
	import M5 from '/static/start-page/m5.png'
	import M6 from '/static/start-page/m6.png'
	import M7 from '/static/start-page/m7.png'
	import M8 from '/static/start-page/m8.png'
	const problemData = [
		{
			icon:M1,
			title:'农夫山泉新品上市策略',
			problem:'请分析近期农夫山泉“绿瓶”纯净水上市的原因，并结合同期农夫山泉的价格战以及纯净水的广告营销话术，并指出对其他矿泉水品牌可能产生的影响，并分析消费者在其中的角色和可能受到的影响。'
		},
		{
			icon:M2,
			title:'2024电动汽车年中大盘点',
			problem:'帮我整理一下2024年电动汽车行业的大动态&大新闻'
		},
		{
			icon:M3,
			title:'活动方案策划',
			problem:'设计一份党纪学习教育实践活动的方案策划。活动主办方是某市街道办党组织，时间是2024年7月，目标是以实践教学形式增强党员同志的党性意识、纪律教育，积极推动大家“学纪、知纪、明纪、守纪”，主要活动内容包括： 1、活动背景和目的 2、活动主题和指导思想 3、活动时间和地点 4、活动参与对象 5、活动议程 活动内容和活动形式尽可能详细，需包括以下三个活动项目： （1）党支部书记领学，发表相关讲话：带领大家学习习近平总书记关于加强党的纪律建设的重要论述、新修订的《中国共产党纪律处分条例》，党员以小组为代表发表学习感想； （2）参观学习红色景点和展览：中共纪律建设历史陈列馆、中共“五大”会址、毛泽东同志旧居和武昌农民运动讲习所； （3）围绕“廉洁护青春、建功新时代”这一主题开展党纪知识竞赛。 注：项目标题自拟，要求有吸引力、格式对仗。此外，要求活动设计贴近实际生活，活动形式新颖，活动类型多样。 6、活动要求'
		},
		{
			icon:M4,
			title:'申论备考干货汇总',
			problem:'基于6篇文档，归纳出详细、具体的申论写作技巧，同时就如何提升申论写作的能力，为一位马克思专业的考生给出备考建议，列出一周的学习计划（要求结合该学生的专业背景提出切实有效的建议）。'
		},
		{
			icon:M5,
			title:'心得体会',
			problem:'请帮我写《红岩》心得体会，字数不少于800字。'
		},
		{
			icon:M6,
			title:'评析申论范文',
			problem:'评阅9篇申论范文的优缺点。以国家公务员申论考试为标准，从主题、结构、语言的维度进行评阅，并给上述每篇范文分别提出修改建议。'
		},
		{
			icon:M7,
			title:'领导发言稿润色',
			problem:'润色这篇讲话稿，要求保留全文主要意思和结构，适当增加引经据典。'
		},
		{
			icon:M8,
			title:'云南热门景点',
			problem:'我来云南旅游，请给我一些热门景点或者路线作参考'
		},
	]
	onLoad(()=>{
		rendomData('001')
	})
	// 随机取4项
	const newData = ref([])
	const isRotating = ref(false)
	const rendomData = (val)=>{
		// 防止多次点击
		if(isRotating.value)return
		newData.value = [...problemData].sort(()=>Math.random() - 0.5).splice(0,4)
		// console.log(newData.value);
		if(val === '002'){
			isRotating.value = true
			setTimeout(()=>{
				isRotating.value = false
			},1000)
		}
	}

	// 发送
	import {chatbotMessage} from '@/store/index.js'
	const send = (val)=>{
		chatbotMessage().startSending(val)
	}
</script>

<style lang="less" scoped>
	.start-page-view{
		background-color: #ffffff;
		border-radius: 5rpx;
		margin: 20rpx;
		padding: 20rpx;
		.greeting-text{
			font-size: 40rpx;
			font-weight: bold;
		}
		.intro-text{
			color: #777A8D;
			line-height: 1.5;
			padding: 25rpx 0;
		}
		.question-hint{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.question-text{
				color: #777A8D;
			}
			.change-btn{
				display: flex;
				align-items: center;
				image{
					width: 30rpx;
					margin: 0 10rpx;
				}
				text{
					color: #5A56D0;
				}
				.rotate-animation{
					transition: 1s;
					transform: rotate(360deg);
				}
			}
		}
		.default-questions{
			display: grid;
			grid-template-columns: repeat(2,1fr);
			gap: 20rpx;
			padding-top: 25rpx;
			.default-question-item{
				background-color: #F7F8FC;
				padding: 20rpx;
				border-radius: 4rpx;
				image{
					width: 50rpx;
				}
				view{
					font-size: 33rpx;
					font-weight: bold;
					padding: 10rpx 0;
				}
				text{
					color: #777A8D;
					line-height: 1.5;
					-webkit-line-clamp: 2 !important;
				}
			}
		}
	}
</style>