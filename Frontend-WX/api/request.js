const requestUrl = 'http://192.168.31.6:7000'
import {chatbotMessage,userData} from '@/store/index.js'
let buffer = ''
export const aliyunUrl = "wss://nls-gateway.cn-shanghai.aliyuncs.com/ws/v1"
export const appKey = '阿里云实时语音识别key'
export const uploadUrl = 'https://meituan.thexxdd.cn/cha/file/uploadfile'
import { encode } from 'js-base64';
// 获取token
function getToken(){
	const token = uni.getStorageSync('userInfo').token || ''
	const base64Token = encode(token + ":")
	return "Basic " + base64Token
}

// http请求
const request = (url,method,data = {},enableChunked = false)=>{
	return new Promise((resolve,reject)=>{
		const requestTask = wx.request({
			url:requestUrl + url,
			method,
			data,
			enableChunked,
			header:{Authorization:getToken()},
			success:res=>{
				const status = res.statusCode
				switch(status){
					case 200:
						resolve(res.data)
						break
					case 404:
						console.error('404异常')
						reject("404")
						break
					case 401:
						userData().isLogin = false
						console.error('401没有访问权限')
						reject("401")
						break
					case 500:
					case 501:
					case 502:
					case 503:
						console.log(res.data)
						uni.showToast({
							icon:"none",
							title:"出现异常"
						})
						reject("出现异常")
						break
					case 400:
						console.error(res)
						reject("400")
						break
					case 422:
						console.error(res.data)
						uni.showToast({
							icon:"none",
							title:res.data.msg
						})
						reject("422")
						break
				}
			},
			fail:err=>{
				console.log(err);
				uni.showToast({
					icon:"none",
					title:"出现异常"
				})
			}
		})
		// 如果流式返回数据
		requestTask.onChunkReceived(response=>{
			// console.log(response);
			let arrayBuffer = response.data
			const arrayBufferss = new Uint8Array(arrayBuffer)
			let string = ''
			for(let i = 0; i < arrayBufferss.length; i++){
				// unicode字符
				string += String.fromCharCode(arrayBufferss[i])
			}
			// console.log(string);
			// 编码和解码
			buffer += decodeURIComponent(escape(string))
			// console.log(buffer);
			// 循环检查buffer里面是否包含换行符
			while(buffer.includes('\n')){
				const index = buffer.indexOf('\n')
				// 留下需要的
				const chunk = buffer.slice(0,index)
				// 去掉已经处理过
				buffer = buffer.slice(index + 1)
				// 判断以data:开头并且不含有data: [DONE]
				if(chunk.startsWith('data: ') && !chunk.includes('[DONE]')){
					const jsonData = JSON.parse(chunk.replace('data: ',''))
					chatbotMessage().handleText(jsonData)
				}
			}
		})
	})
}

// 文生文的接口
export const createCompletions = (params)=>{
	return request('/create-completions','POST',params,true)
}
// 文生图的接口
export const createImages = (params)=>{
	return request('/create-images','POST',params)
}
// 获取阿里云token
export const aliToken = ()=>{
	return request('/alitoken','GET')
}
// 用户登录
export const wxLogin = (params)=>{
	return request('/wxlogin','POST',params)
}
// 存储聊天记录
export const saveChatHistory = (params)=>{
	return request('/save-chat-history','POST',params)
}
// 获取用户的全部聊天记录列表
export const userChatList = ()=>{
	return request('/fetch-chat-history','GET')
}
// 点击聊天列表获取对应的聊天内容
export const onlyChatHistory = (params)=>{
	return request('/only-chat-history','GET',params)
}