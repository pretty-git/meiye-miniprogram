<script>
import Vue from 'vue';
import amap from './amap-wx.js';
import { mapMutations } from 'vuex';
export default {
	globalData: {
		// url:"http://192.168.0.33",
		// url:"http://192.168.0.35",
		qnyUrl: 'http://my.cloud.xmstruggle.com/',
		url: 'https://api1.shilrna.com',
		userInfo: [],
		locationname: '厦大店',
		province: '', //省
		city: '', //市
		phonenumber: '', 
		isCanUse: uni.getStorageSync('isCanUse') || true, //默认为true
		storeId: 5,
		mechanismId: 1,
		ifWaitCustomer: false,
		commentlist: [],
		vipcarList: [],
		ifExit: false
	},
	onLaunch() {
		// 获取小程序更新机制兼容
		if (uni.canIUse('getUpdateManager')) {
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				if (res.hasUpdate) {
					updateManager.onUpdateReady(function() {
						uni.showModal({
							title: '更新提示',
							content: '新版本已经准备好，是否重启应用？',
							success: function(res) {
								if (res.confirm) {
									// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
									updateManager.applyUpdate();
								}
							}
						});
					});
					updateManager.onUpdateFailed(function() {
						// 新的版本下载失败
						uni.showModal({
							title: '已经有新版本了哟~',
							content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
						});
					});
				}
			});
		} else {
			// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
			uni.showModal({
				title: '提示',
				content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
			});
		}
		
	},
	onHide() {
		

		// if(getApp().globalData.vipcarList.length!=0) {
		// 	uni.request({    //获取购物券
		// 		method: 'POST',
		// 		url: getApp().globalData.url + '/applet/card/rollBackCardInfoByServe',
		// 		data:JSON.stringify(getApp().globalData.vipcarList),
		// 		header: {
		// 			"Content-Type": "application/json" //如果为空，加上头部接收
		// 		},
		// 		success: (res) => {
		// 			console.log(res,'退出保存')
		// 			getApp().globalData.ifExit = true
		// 		},fail:(err) => {
		// 				uni.showToast({
		// 					title:'网络请求超时,请重试',
		// 					icon:'none'
		// 				})
		// 			}
		// 	})
		// }
	}
};
</script>

<style>
@import 'colorui/main.css';
@import 'colorui/icon.css';
@import 'colorui/iconfont.css';
@font-face {
	font-family: 'iconfont';
	src: url('https://at.alicdn.com/t/font_945634_tjbbe0vrxfe.ttf') format('truetype');
}
.flex_row {
	display: flex;
	flex-direction: row;
}
.flex_column {
	display: flex;
	flex-direction: column;
}
.main {
	background-color: #ffffff;
}
page {
	background-color: #fff;
}
.font {
	font-family: iconfont;
}
.text_hidden {
	overflow: hidden;
	white-space: nowrap; /*不显示的地方用省略号...代替*/
}
.nowrap {
	text-overflow: ellipsis; /*文字隐藏后添加省略号*/
	white-space: nowrap; /*强制不换行*/
	/* flex-flow: nowrap; */
	overflow: hidden;
}
</style>
