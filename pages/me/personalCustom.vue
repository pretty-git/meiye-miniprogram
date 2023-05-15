<template>
	<view class="bg">
		<view class="plan_name">
			<view class="text">
				计划名称
			</view>
			<view class="">
				{{plan_name}}
			</view>
		</view>
		<view class="time"> 
			<view class="text">
				定制日期
			</view>
			<view class="font">
				<text class="icon1">&#xe613;</text>{{time}}
			</view>
		</view>
		<view class="planList">
			<view class="title_top">
				<view class="title">
					定制项目
				</view>
				<view class="shopprice">
						购买价 <text style="color: #E94A59;font-weight: bold;margin-left: 5px;">￥{{price}}</text>
				</view>
			</view>
			<view v-for="(item,index) in planlist" :key="index" class="planlist" >
				<view class="list" @click="projectDetails(item.serveId)">
					<view class="giftimg">
						<image :src="item.pictureId" mode="aspectFill"></image>
					</view>
					<view class="giftright">
						<view class="giftname nowrap">
							{{item.serveName}}
						</view>
						<view class="giftnumber" >
							{{item.serveTime}}次/
						</view>
						<view class="giftprice color">
							￥{{item.suggestPrice}}
						</view>
						<view class="gifttime color" >
							{{displayReport == 0?'无限期':displayReport+'天' }}
						</view>
						<view class="resnumber" v-if="item.serveTime-item.usefulLife!=0">
							剩余次数:{{item.serveTime -item.usefulLife }}次
						</view>
						<view class="minicon font">
							&#xe604;
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 按钮选择 -->
		<view class="bottom" v-if="ifpay==true">
			<view class="buybtn" @click="paymoney">   <!-- 支付跳转传递礼包的价格 -->
				立即支付
			</view>
		</view>
	</view>
	
</template>
<script>
	export default {
		data() {
			return {
				bussname:'',
				payprice:'',
				bankcard:'',
				plan_name:'',
				time:'',
				price:'',
				planlist:[],
				orderId:'',
				customizationId:''
			}
		},
		onShow() {
			// console.log(props,'1111')
			var id = getApp().globalData.customizationId
			this.customizationId = getApp().globalData.customizationId
			// console.log(id)
			uni.request({
				method:'POST',
			    url: getApp().globalData.url + '/applet/customization/detailInfo', //仅为示例，并非真实接口地址。
			    data: {
						 "customizationId":id
			    }, 
			    header: {
			        "Content-Type": "application/json" //如果为空，加上头部接收 
			    },
			    success: (res) => {
					this.planlist=[]
					var list = res.data.data 
					this.time = list.createTime
					this.plan_name = list.activeRule
					this.orderId = list.orderId
					this.price = list.totalPrice
					if(list.state == 0 || list.state == 1 ) {
						this.ifpay = true
					}else {
						this.ifpay = false
					}
					this.planlist = list.customizationDetailInfos
					for(var i=0;i<this.planlist.length;i++) {
						this.planlist[i].pictureId = 'http://my.cloud.xmstruggle.com/' + this.planlist[i].pictureId
					}
			       console.log(this.planlist,'传递参数组')
			    },fail:(err) => {
						uni.showToast({
							title:'网络请求超时,请重试',
							icon:'none'
						})
					}
			});
		},
		methods:{
			paymoney() {
				
				var orderNumber
				var openId = uni.getStorageSync('openId')
				if(!openId) {
					 uni.reLaunch({
						url:'../empty/empty'
					 })
					 return;
				}
					var that = this
					uni.request({    //获取购物券
						method: 'POST',
						url: getApp().globalData.url + '/wx/wxPay',  //保存所选会员卡回滚
						data:{
							payAmount:0.01,
							openId:openId,
							tradeType:'JSAPI',
							typeId:4,//美丽定制
							mechanismId:uni.getStorageSync('mechanismId')
						},
						header: {
							"Content-Type": "application/json" //如果为空，加上头部接收     
						},
						success: (res) => {
							console.log(res,'res')
							orderNumber = res.data.data.orderNumber
							uni.requestPayment({
							  timeStamp: res.data.data.timeStamp,//记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了
							  nonceStr: res.data.data.nonceStr,
							  package: `prepay_id=${res.data.data.prepayId}`,
							  signType: res.data.data.signType,
							  paySign: res.data.data.sign,
							  success: function (event) {
								// success   
								console.log(event);
								if(event.errMsg == "requestPayment:ok") {
										uni.request({
											method:'POST',
										    url: getApp().globalData.url + '/applet/customization/paymentCustomization', //仅为示例，并非真实接口地址。
										    data: {
													consumptionState:0,
													 orderId:that.orderId,
													 orderNumber:orderNumber
										    }, 
										    header: {
										        "Content-Type": "application/json" //如果为空，加上头部接收 
										    },
										    success: (res) => {
												console.log(res)
										    },fail:(err) => {
													uni.showToast({
														title:'网络请求超时,请重试',
														icon:'none'
													})
												}
										});
									}
							  },
							  fail: function (error) {
								uni.showToast({
									title:'支付失败',
									icon:'none'
								})
							  }
							});
						},fail:(err) => {
								uni.showToast({
									title:'网络请求超时,请重试',
									icon:'none'
								})
							}
					})
			},
			hideModal(e) {
				this.modalName = null
			},
			projectDetails(id) {
				uni.navigateTo({
					url:'../giftdetails/projectdetail?serveId=' + id
				})
			}
		},
	}
</script>


<style scoped>
	.bg {
		background-color: #fff !important;
		/* position: absolute; */
		top: 0;
		width: 100%;
		height: 100%;
	}
	.plan_name {
		width: 100%;
		height: 70px;
		background-color: #fff;
		padding: 0 5%;
	}
	.time {
		width: 100%;
		height: 80px;
		background-color: #fff;
		padding: 0 5%;
	}
	.text {
		font-size: 16px;
		margin: 10px 0;
		padding-top: 10px;
		font-weight: bold;
	}
	.icon1 {
		color: #999999;
		margin-right: 10px;
		font-size: 22px;
	}
	.title_top {
		height: 60px;
		padding: 0 5%;
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid #f1f1f1;
	}
	.title {
			color: rgba(80, 80, 80, 1);
			font-size: 18px;
			font-weight: bold;
			margin: auto 0;
			width: 70%;
	}
	.shopprice {
			color: #000;
			font-size: 14px;
			margin: auto 0;
	}
	/* <!-- 礼包项目begin --> */
	page {
		background-color: #f1f1f1;
	}
	.planList {
		background-color: #fff;
		margin-top: 10px;
	}
	.top {
		margin-top: 10px;
	}
	.main {
		position: relative;
	}
	.icon {
		font-family: iconfont;
		}
	.nav{
		display: flex;
		flex-direction: row;
		/* width: 100%; */
		height: 35px;
		margin-left: 23px;
		margin-top: 12px;
		position: relative;
	}
	
	.share text{
		position:absolute;
		color: rgba(80, 80, 80, 1);
		font-size: 15px;
	    top: 8px;
		right: 27px;
	}
	.share_icon {
		font-size:20px;
		position:absolute;
		top: 2px;
		margin-right:40px;
	}
	.name {
		color: rgba(80,80,80,1);
		font-weight: bold;
		text-align: left;
		font-size: 15px;
		line-height: 35px;
	}
	.icon {
		font-size: 20px;
		color: rgba(212, 48, 48, 1);
		float: right;
		line-height: 35px;
		position: absolute;
		right: 23px;
	}
	.list {
		width: 100%;
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid #f1f1f1;
		padding: 18px 0 20px 23px;
	}
	.giftimg {
		width: 25%;
		height: 60px;
		border-radius: 4px;
	}
	.giftimg image {
		width: 100%;
		height: 60px;
		border-radius: 4px;
	}
	.giftright {
		margin-left: 10px;
		position: relative;
		width: 100%;
		padding-left: 10px;
	}
	.color {
		color: #E94A59;
		font-size: 14px;
		position: absolute;
	}
	.giftname {
		color: rgba(80, 80, 80, 1);
		font-size: 14px;
		width: 35%;
	}
	.giftprice {
		top: 33px;
		left: 10px;
	}
	.gifttime {
		top: 36px;
		left: 126px;
		width: 132px;
	}
	.gift_orgive {
		
	}
	.giftnumber {
		top: 0px;
		position: absolute;
		width: 100%;
		left: 123px;
	}
	.minicon {
		position: absolute;
		top: 27px;
		right: 10px;	
		font-size: 26px;
		color: rgba(153, 153, 153, 1);
		font-weight: bold;
	}
	.resnumber {
		font-size: 14px;
		position: absolute;
		top: 0px;
		left: 164px;
		width: 102px;
	}
		/* 两个按钮 */
		.bottom {
			display: flex;
			flex-direction: row;
			position: fixed;
			bottom: 0;
			top: auto;
			left: 0px;
			width: 100%;
			}
			.show_price {
				width: 50%;
				height: 52px;
				color: rgba(227, 60, 100, 1);
				background-color: rgba(255, 255, 255, 1);
				font-size: 18px;
				line-height: 52px;
				text-align: center;
			}
			.buybtn {
				width: 100%;
				height: 52px;
				color: rgba(255, 255, 255, 1);
				background-color: #CA89FF;
				font-size: 18px;
				line-height: 52px;
				text-align: center;
			}
			/* 支付层页面样式 */
			.cu-dialog {
					height: 270px;
				}
			.icon1 {
				font-family: iconfont;
				font-size: 25px;
				font-weight: bold;
				margin-right: 15px;
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
			.payprice {
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
			}
</style>
