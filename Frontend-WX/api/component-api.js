import { reactive } from "vue"
// 获取胶囊按钮的位置
export const buttonPosition = ()=>{
	// 存储要使用的胶囊按钮位置数据
	const buttonData = reactive({
		but_height:'0px',
		but_top:'0px',
		but_button:'0px'
	})
	const {height,top,bottom} = uni.getStorageSync('buttonPosition')
	buttonData.but_height = height + 'px'
	buttonData.but_top = top + 'px'
	buttonData.but_button = bottom + 10 + 'px'
	return {
		but_height:buttonData.but_height,
		but_top:buttonData.but_top,
		but_button:buttonData.but_button
	}
}