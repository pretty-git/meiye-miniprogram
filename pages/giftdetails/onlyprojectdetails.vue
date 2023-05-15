<template>
	<view class="main" >
			<button class="top" open-type="share">
				<image :src="src" mode="aspectFill"></image>
					<view class="share_icon" >
						&#xe633;
					</view>
			</button>  <!-- 图片top -->
			<!-- 信息介绍部分begin -->
			<view class="top_message">
				<view class="flex_row">
							<view class="name">
							{{serveName}}
						</view>
						<view class="care_icon font" @click="ifCareclik">
							<text v-if="ifcare" >{{ifcare? '&#xe609;' : '&#xe630;'}}</text>
							<text style="color: rgba(80, 80, 80, 1);font-size: 14px;padding-left: 4px;">关注</text>
						</view>
				</view>
				<view class="flex_row">
					<!-- <view class="time">
						{{time}}
					</view> -->
					<view class="price_intro" v-if="postGradeId.length!=0">
						价格：<p :key="item.postGradeId" v-for="item in postGradeId">{{item.pgJobName}} {{item.postPrice}}/次 </p>
					</view>
				</view>
				
			</view>	
		<mpopup  ref="mpopup" :isdistance="true"></mpopup>
			
			<view class="intro_modul">
				<view class="intro_text">
					项目介绍
				</view>
				<view class="text" v-html="serverParticulars" style="margin: 0 5%;"></view>	
			</view>
			
	</view>
</template>

<script> 
	export default {
// export default {
	data() {
		return {
			id:'',
			ifcare:false,
			src: '',
			serveName: '',
			intro: '',
			time: '',
			price: '',
			cureent:-1,
			data:{},
			winHeight:'',
			beginshop:true,
			price_intro:'',
			postGradeId:[],
			serverParticulars:'',
			projectConcernId:0
		};
	},
	// async onLoad(options){
	// 	this.src= options.src; // 字符串转对象
	// 	this.name= options.name; // 字符串转对象
	// 	this.id= options.id; // 字符串转对象
	// 	this.intro= options.intro; // 字符串转对象
	// 	this.price= options.price; // 字符串转对象
	// 	console.log(this.src);
	// 	},
	onLoad(e) {
		// if (uni.getStorageSync('openId') === '' || uni.getStorageSync('user') === null) {
		// 	setTimeout(function() {
		// 		uni.reLaunch(
		// 			{
		// 				url: '/pages/empty/empty'
		// 			},
		// 			500
		// 		);
		// 		return
		// 	});
		// }
	
		console.log(e,'项目id')
		this.id = e.projectId
		// this.getData()
		let that = this;
		//  高度自适应
		uni.getSystemInfo({
			success: function(res) {
				console.log(res)
				let calc = res.windowHeight + 130;
				that.winHeight = calc;
			}
		});
		let obj = {
			serveName: '时尚造型',
			serveId: 1,
			pictureId: '../../static/banner/33.jpg',
			backstagePostGradeLists: [{
				pgJobName: '拉直',
				postPrice: 49
			},{
				pgJobName: '修剪刘海',
				postPrice: 5
			}],
			serverParticulars: '时尚造型必备套餐，具备超高性价比',
			projectConcernId: 3,
			isConcern: 1
		}
		this.serveName = obj.serveName	
		this.serveId = obj.serveId
		this.src = obj.pictureId
		this.postGradeId = obj.backstagePostGradeLists
		this.serverParticulars = obj.serverParticulars
		this.projectConcernId = obj.projectConcernId
		if(obj.isConcern == 1) {
			this.ifcare = true
		}else {
			this.ifcare = false
		}
		
	},
	methods:{
		// getData(){
		// 	wx.request({
		// 		method: 'GET',
		// 		url: getApp().globalData.url + `/applet/project/findProjectByServerId/${this.id}`,
		// 		data: {
					
		// 		},
		// 		header: {
		// 		    "Content-Type": "application/x-www-form-urlencoded" //如果为空，加上头部接收
		// 		},
		// 		success: (res) => {
		// 			if(res.statusCode === 200){
		// 				 this.data = res.data.result
		// 				 this.data.pictureId = 'http://my.cloud.xmstruggle.com/' + this.data.pictureId
		// 				 console.log(this.data)
		// 			}
		// 		}
		// 	})
		// },
		onShareAppMessage: function (res) {
		   if (res.from === 'button') {
		     // 来自页面内转发按钮
		     console.log(res.target)
		   }
		   return {
		     title: '礼包分享',
		     path: '/pages/giftdetails/projectdetail'
		   }
						// 当分享出去的卡片被点击时，在页面的onLoad(options){}，options参数中接收
		 },
		ifCareclik() {
			if(this.ifcare == false) {
				uni.request({
				method:'POST',
				url:getApp().globalData.url + '/applet/project/insertProjectConcern',
				data:{
					projectId:this.serveId,
					userId:uni.getStorageSync('user').customerId,
					storeId:uni.getStorageSync('storeId')
				},
				success: (res) => {
					if(res.data.result == 'SUCCESS') {
						uni.showToast({
							title: '关注成功'
						});
					}
				},fail:(err) => {
						uni.showToast({
							title:'网络请求超时,请重试',
							icon:'none'
						})
					}
				})
			}else {
				uni.request({
				method:'GET',
				url:getApp().globalData.url + `/applet/project/deleteProjectConcernById/${this.projectConcernId}`,
				success: (res) => {
					if(res.data.result == 'SUCCESS') {
						uni.showToast({
							title: '取消成功'
						});
					}
				},fail:(err) => {
						uni.showToast({
							title:'网络请求超时,请重试',
							icon:'none'
						})
					}
				})
			}
			this.ifcare = !this.ifcare;
		},
	}
};
</script>

<style scoped>
	.main {
		/* position: absolute; */
		  bottom: 0px;
		  top:0px;
			background-color: #fff!important;
		  width: 100%;
		  /* height: 100%; */
		  
	}
	button::after{
	
	border: none;
	
	}
	button{
		padding: 0px;
		line-height: 26px;
		background-color: #fff;
		width: 75%;
		text-align: right;
		font-size: 17px;
		margin: auto 0;
		border-radius: 0px;
	}
	.top {
			width: 100%;
			height: 188px;
			position: relative;
		}
	.top image {
		width: 100%;
		height: 188px;
	}
	.share_icon {
		font-family: iconfont;
		width: 38px;
		height: 38px;
		line-height: 84upx;
		background-color: rgba(56, 56, 56, 0.6);
		border-radius: 19px;
		font-size: 23px;
		color: rgba(255, 255, 255, 1);
		text-align: center;
		position: absolute;
		top: 17px;
		right: 14px;
		}
		/* <!-- 信息介绍部分begin --> */

		.top_message {
			width: 100%;
			height: 240upx;
			position: relative;
			border-bottom: 11px solid rgba(229, 229, 229, 1);
		}
		.name {
			width: 50%;
			
			height: 24px;
			color: rgba(80, 80, 80, 1);
			font-size: 16px;
			text-align: left;
			font-weight: bold;
			margin: 10px 0 10px 14px;
		}
		.intro {
			top: 303px;
			color: rgba(166, 166, 166, 1);
			font-size: 14px;
			text-align: left;
			margin:auto 24upx;
		}
		.time {
			color: rgba(166, 166, 166, 1);
			font-size: 14px;
			text-align: left;
			margin: 0px 0 17px 14px;
		}
		.price_intro {
			color: #F14D5C;
			font-size: 14px;
			text-align: left;
			position: absolute;
	
			bottom: 11px;
			right: 13px;
		}
		.care_icon {
			font-size: 20px;
			color: rgba(212, 48, 48, 1);
			position: absolute;
			top: 26upx;
			right: 14px;
		}
		/* <!-- 信息介绍部分end --> */
		/* 团购部分bengin */
		.left {
			width: 85%;
		}
		.spell_title {
			color: rgba(80, 80, 80, 1);
			font-size: 16px;
			margin-left: 14px;
			font-weight: bold;
			padding: 10px 0;
		}
		.spell_title_ex {
			color: #AAAAAA;
			font-size: 13px;
			margin-left: 14px;
			margin-top: 8px;
		}
		.directorlist1 {
			display: flex;
			flex-direction: row;
			margin-bottom: 10px;
			
			}
			.bulk_modul {
				border-bottom: 11px solid rgba(229, 229, 229, 1);
			}
			.director {
				width: 100%;
				padding: 8px 0 0 28px;
				display: flex;
				flex-direction: row;
				color: #F14D5C;
			}
			.director_name {
				width: 15%;
				font-size: 14px;
				 padding-top: 5px;
		
			}
			.directorlist {
				font-size: 14px;
				margin-left: 10px;
				
			}
			.spell_btn {
				width: 72px;
				height: 29px;
				color: #fff;
				background-color: #F8B551;
				border-radius: 4px;
				font-size: 14px;
				line-height: 29px;
				text-align: center;
				margin-left: 20px;
			}
			.manager_number {
				/* margin-right: 15px; */
				width: 30%;
				padding-top: 5px;
			}
			.manager_price {
				/* margin-right: 15px; */
				width: 30%;
				padding-top: 5px;
				  
		
			}
		
		/* 团购部份end */
		
		/* <!-- 优惠券部分begin --> */
		.coupons_modul {
			width: 100%;
			height: 73px;
			padding-bottom: 10px;
			display: flex;
			flex-direction: row;
			margin-top: 10px;
		}
		.coupons {
			width: 33.3%;
			height: 53px;
			background-color: #FD80DB;
			border-radius: 6px;
			overflow: hidden;
			position: relative;
			margin: 0 10px;
		}
		.coupons_price {
			color: #fff;
			font-size: 19px;
			text-align: center;
			font-weight: bold;
			width: 79%;
			height: 33px;
			line-height: 33px;
			text-align: center;
		}
		.coupons_prompt {
			color: #fff;
			font-size: 13px;
			width: 79%;
			text-align: center;
		}
		.to_receive {
			width: 21%;
			height: 53px;
			top: 0;
			text-align: center;
			line-height: 25px;
			right:0 ;
			position: absolute;
			color: rgba(255, 255, 255, 1);
			background-color: #E71EB1;
			font-size: 14px;
		}
		/* <!-- 优惠券部分end --> */
		
			/* <!-- 项目介绍begin --> */
			
		/* <!-- 项目end --> */
		.botton {
			width: 100%;
			height: 52px;
			top: auto;
			bottom: -1px;
			position: fixed;
			color: rgba(255, 255, 255, 1);
			background-color: #CA89FF;
			font-size: 18px;
			line-height: 52px;
			text-align: center;
		}
		.occupymodal {
			background-color: #fff;
			height: 60px;
			width: 100%;
			}

		.intro_text {
			margin: 10px 0 10px 14px;
			font-size: 18px;
			font-weight: bold;

		}
		.intro_image {
			width: 100%;
			padding: 0 14px;
			height: 198px;
		}
		.intro_image image {
			width: 100%;
			height: 198px;
		}
		.intro_word {
			width: 100%;
			padding: 19px 14px;
			color: rgba(80, 80, 80, 1);
			font-size: 14px;
		}
		/* 支付层页面样式 */
		.cu-dialog {
				height: 270px;
			}
		.icon1 {
			font-family: iconfont;
			font-size: 29px;
			margin-right: 5px;
		}
		.bg-white {
			width: 100%;
			height: 50%;
		}
		.cu-bar .action2 {
			    font-size: 25px;
				position: absolute;
				left: 16px;
				top: 9px;
		}
		.password {
			position: absolute;
			top: 13px;
			right: 10px;
			color: rgba(153, 153, 153, 1);
			font-size: 16px;
		}
		.bg-white {
			height: 16px;
			/* border-bottom: 1px solid #e8e8e8; */
		}
		.padding-xl {
			width: 100%;
			height: 110px;
		}
		.busname {
			color: rgba(102, 102, 102, 1);
			font-size: 18px;
			margin: 0 auto;
		}
		.price {
			color: rgba(0, 0, 0, 1);
			font-size: 39px;
			margin-top: 20px;
		}
		.card {
			text-indent: 13px;
			color: rgba(128, 128, 128, 1);
			font-size: 17px;
		}
		.cu-btn1 {
			color: #ffffff;
			-webkit-box-shadow: 6rpx 6rpx 8rpx rgba(114, 130, 138, 0.2);
			box-shadow: 6rpx 6rpx 8rpx rgba(114, 130, 138, 0.2);
			border-radius: 6px;
			font-size: 18px;
			height: 45px;
			width: 90%;
			margin: 0 auto;
			line-height: 45px;
			text-align: center;
			margin-top: 35px;	
			background-color: #35B936;
		}
</style>
