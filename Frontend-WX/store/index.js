import { defineStore } from 'pinia'
import {createCompletions,createImages,wxLogin,saveChatHistory,
userChatList
} from '@/api/request.js'
// 存储顶部导航栏下标
export const selectNavIndex = defineStore('selectNavIndex',{
	state:()=>({
		index:1,//0:我的，1：对话；2：ai会话
	})
})
// 判断登录状态，存储用户信息，存储对话记录
export const userData = defineStore('userData',{
	state:()=>({
		isLogin:false,//true:已登录，false：未登录
		userInfo:{},//用户信息
		chatList:[],//聊天列表
		sessionId:'',//会话id
		newChat:true,//true：开启新会话，false：已有对话（或者打开了历史会话）
	}),
	actions:{
		// 未登录获取用户信息
		async isNotLoggedIn(nickName, avatar, code){
			// 请求接口
			const result = await wxLogin({nickName, avatar, code})
			// console.log(result);
			// 存储本地缓存
			uni.setStorageSync('userInfo',result.data)
			this.userInfo = result.data
			// 请求聊天列表
			const chatListData = await userChatList()
			this.chatList = chatListData.data
			this.isLogin = true
		},
		// 获取本地缓存用户信息，判断登录状态
		async isLoggedIn(){
			const userinfo = uni.getStorageSync('userInfo')
			this.userInfo = userinfo ? userinfo : {}
			this.isLogin = userinfo ? true : false
			if(!userinfo)return false
			// 请求聊天列表
			const chatListData = await userChatList()
			this.chatList = chatListData.data
		}
	}
})
// 文生文
export const chatbotMessage = defineStore('chatbotMessage',{
	state:()=>({
		//{"role": "user", "content": ""},
		messages:[],//存储聊天记录
		receiveText:''//接受大模型返回的文本数据
	}),
	actions:{
		// 接收服务器端大模型返回的数据
		async handleText(objVal){
			// console.log(objVal);
			let aiMessages = this.messages[this.messages.length - 1]
			// 服务器开始响应
			aiMessages.finish_reason = 'respond'
			// 把大模型发返回的文本追加到receiveText
			this.receiveText += objVal.choices[0].delta.content || ''
			// 把文本追加到ai的回复中
			aiMessages.content = this.receiveText
			// 判断是否回复完毕
			if(objVal.choices[0].finish_reason){
				// 存储状态
				aiMessages.finish_reason = objVal.choices[0].finish_reason
				// 如果有联网查询的数据
				aiMessages.web_search = objVal.web_search ? objVal.web_search : []
				// 如果回复异常
				const condition = [
					{type:'length',content:'到达token上限,请重新开启新会话'},
					{type:'sensitive',content:'非常抱歉，我目前无法提供你需要的具体信息'},
					{type:'network_error',content:'推理异常，我或许出现了一些问题，你可以重新尝试'},
				]
				condition.forEach(item=>{
					if(objVal.choices[0].finish_reason === item.type){
						aiMessages.content = item.content
					}
				})
				// 对话已完毕
				inProgress().value = false
				// console.log(this.messages);
				// 存储对话记录到服务器
				const uploadChat = [...this.messages.slice(-2)]
				const result = await saveChatHistory({
					messages:uploadChat,
					sessionId:userData().sessionId
				})
				console.log(result);
				if(userData().newChat){
					userData().chatList.unshift(result.data)
					userData().sessionId = result.data.session_id
					userData().newChat = false
				}
			}
		},
		// 发送数据到服务器端
		async startSending(content){//content:发送的值
			this.receiveText = ''//清空上一次的结果
			this.messages.push({"role": "user", content})
			this.messages.push({
				"role": "assistant",
				"content":"",
				"finish_reason":"start",
				"web_search":[],//搜索网页返回的结果
			})
			// 对话正在进行中
			inProgress().value = true
			/* 
			 finish_reason：
				start：开始中，
				respond:ai响应中
				stop代表推理自然结束或触发停止词。
				tool_calls 代表模型命中函数。
				length代表到达 tokens 长度上限。
				sensitive 代表模型推理内容被安全审核接口拦截。请注意，针对此类内容，请用户自行判断并决定是否撤回已公开的内容。
				network_error 代表模型推理异常。
			 */
			// 请求服务器端进行发送
			try{
				await createCompletions({messages:this.messages})
			}catch(err){
				this.messages[this.messages.length - 1].finish_reason = 'stop'
				this.messages[this.messages.length - 1].content = 'AI回复异常,你可重试'
				console.log(err);
				// 对话结束
				inProgress().value = false
			}
		}
	}
})
// 文生图
export const chatCreateImages = defineStore('chatCreateImages',{
	state:()=>({
		messages:[],//url;prompt
	}),
	actions:{
		// 开始发送
		async seartSending(content){
			console.log(content);
			this.messages = [
				{
					url:'',
					prompt:'AI正在生成中...'
				}
			]
			inProgress().value = true
			try{
				const res = await createImages({prompt:content})
				// console.log(res);
				let aimessages = this.messages[0]
				if(res.serviceCode === 200){
					aimessages.url = res.data.url
				}else{
					aimessages.url = ''
				}
				aimessages.prompt = res.data.prompt || res.msg || '当前生成图片出错,你可重试'
				inProgress().value = false
			}catch(err){
				this.messages = [
					{
						url:'',
						prompt:'当前生成图片出错,你可重试'
					}
				]
				inProgress().value = false
			}
		}
	}
})
// 查询对话是否进行中
export const inProgress = defineStore('inProgress',{
	state:()=>({
		value:false,//false：表示对话完毕，true：正在进行中
	}),
	actions:{
		queryValue(){
			if(this.value){
				uni.showToast({
					icon:'none',
					title:'当前业务正在进行中'
				})
				return true
			}
		}
	}
})