<template>
	<view>
		<view class="car_list">
			<!-- 卡片模块 -->
			<view class="vip_car_bc">
				<view class="vip_car_circle"><!-- 小圆圈 --></view>
				<text class="car_name">{{cardName}}</text>
				<view class="share">

					<button class="share_text flex_row" open-type="share">
						<view class="share_icon font">
							&#xe64d;
						</view>分享
					</button>
				</view>
				<text class="car_number">{{ templateId }}</text>
				<text class="car_class">{{ cardTypeName }}</text>
				<text class="car_price"> ￥{{price}}</text>
			</view>
			<!-- 卡片介绍 -->
			<view class="car_intro" v-for="(item, index) in car_intro_list " :key="index">
				<view class="car_intro_title">
					{{item.car_intro_title}}
				</view>
				<view class="car_intro_text">
					{{item.cat_intro_text}}
				</view>

			</view>
			<view class="occupymodal"> </view> <!-- 因为底部有悬浮按钮 -->
		</view>
		<mpopup ref="mpopup" :isdistance="true"></mpopup>
		<view v-if="isOwer == 1">

		</view>
		<view class="buy_btn" @click="showModal" data-target="DialogModal1" v-else>
			购买办理
		</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				// 支付页面数据
				modalName: null,
				bussname: '名资美业',
				payprice: '789.00',
				bankcard: '招商银行信用卡(6666)',
				// end
				cardName: '',
				cardTypeName: '',
				templateId: '',
				price: 0,
				isOwer: '', //0是拥有
				car_intro_list: [{
						id: 1,
						car_intro_title: '会员卡介绍',
						cat_intro_text: '用户分享内容到社交媒体或好友，不应该是一种粗暴的强制行为，我们应该在保证产品本身内容有吸引力的核心前提下，仔细揣摩用户心理，结合产...',
						unit: ''
					},
					{
						id: 1,
						car_intro_title: '使用次数',
						cat_intro_text: '25',

					},
					{
						id: 1,
						car_intro_title: '使用期限',
						cat_intro_text: '购买之日起30天内',

					}
				],
				cardId: '',
				cardType: ''
			}
		},
		onLoad(props) {
			this.cardId = +props.cardId
			this.isOwer = props.isOwner
			console.log(props)
			// uni.showLoading({
			//     title: '加载中',
			// 	mask:true
			// });
			// uni.request({
			// 	method:'GET',
			// 	url: getApp().globalData.url + '/applet/card/edit/'+ this.cardId, //仅为示例，并非真实接口地址。
			// 	header: {
			// 		"Content-Type": "application/json" //如果为空，加上头部接收 
			// 	},
			// 	success: (res) => {
			var list = {
				cardName: '万能会员卡',
				cardType: 1,
				sellingPrice: 101,
				cardTypeName: '年卡',
				templateId: 'CD12288900',
				numberUse: 1,
				deadline: 3,
				cardDesc: '这里是是vip卡的介绍'
			}
			this.cardName = list.cardName
			this.cardTypeName = list.cardTypeName
			this.templateId = list.templateId
			var cardType = list.cardType
			this.cardType = cardType
			if (cardType == 1 || cardType == 2 || cardType == 3) {
				this.price = list.sellingPrice
			} else {
				this.price = list.giveGold
			}
			for (var i = 0; i < this.car_intro_list.length; i++) {
				if (i == 1) {
					if (Number(list.numberUse) != 0) {
						this.car_intro_list[i].cat_intro_text = list.numberUse + '次'
					} else {
						this.car_intro_list[i].cat_intro_text = '无限次'
					}
				} else if (i == 2) {
					if (Number(list.deadline) != 0) {
						this.car_intro_list[i].cat_intro_text = list.deadline + '天'
					} else {
						this.car_intro_list[i].cat_intro_text = '无限期'
					}
				} else {
					this.car_intro_list[i].cat_intro_text = list.cardDesc
				}
			}
			uni.hideLoading()
			// 	},fail:(err) => {
			// 			this.error()
			// 			uni.hideLoading()
			// 		}
			// });
		},
		methods: {
			showModal() {
				var that = this
				// uni.request({
				// 	method: 'POST',
				// 	url:  getApp().globalData.url + '/applet/card/applyCardOrConsumerCard',
				// 	data: {
				// 		mechanismId:uni.getStorageSync('mechanismId'),
				// 		staffId:'',
				// 		customerId:uni.getStorageSync('user').customerId,
				// 		storeId:uni.getStorageSync('storeId'),
				// 		cardId:that.cardId
				// 	},
				// 	header: {
				// 		"Content-Type": "application/json" //如果为空，加上头部接收     
				// 	},
				// 	success: (res) => {
				// 		console.log(res,'购买')
				// 		if(res.data.result == 'success') {
				// 			uni.showToast({
				// 				title:'购买成功',
				// 				icon:'none'
				// 			})
				// 			uni.navigateTo({
				// 				url:"../VIPcar/VIpcarlist"
				// 			})
				// 		}
				// 	}
				// })
				var orderNumber
				var openId = uni.getStorageSync('openId')
				var that = this
				if (!openId) {
					uni.reLaunch({
						url: '../empty/empty'
					})
					return;
				}
				uni.request({ //获取购物券
					method: 'POST',
					url: getApp().globalData.url + '/wx/wxPay', //保存所选会员卡回滚
					data: {
						payAmount: 0.01,
						openId: openId,
						tradeType: 'JSAPI',
						mechanismId: uni.getStorageSync('mechanismId'),
						typeId: that.cardType, //会员卡相关
					},
					header: {
						"Content-Type": "application/json" //如果为空，加上头部接收     
					},
					success: (res) => {
						console.log(res, 'res')
						orderNumber = res.data.data.orderNumber
						uni.requestPayment({
							timeStamp: res.data.data
								.timeStamp, //记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了
							nonceStr: res.data.data.nonceStr,
							package: `prepay_id=${res.data.data.prepayId}`,
							signType: res.data.data.signType,
							paySign: res.data.data.sign,
							success: function(event) {
								// success   
								console.log(event);
								if (event.errMsg == "requestPayment:ok") {
									uni.request({
										method: 'POST',
										url: getApp().globalData.url +
											'/applet/card/applyCardOrConsumerCard',
										data: {
											mechanismId: uni.getStorageSync('mechanismId'),
											staffId: '',
											orderNumber: orderNumber,
											customerId: uni.getStorageSync('user')
												.customerId,
											// customerId:51,
											storeId: uni.getStorageSync('storeId'),
											cardId: that.cardId
										},
										header: {
											"Content-Type": "application/json" //如果为空，加上头部接收     
										},
										success: (res) => {
											console.log(res, '购买')
											if (res.data.result == 'success') {
												uni.showToast({
													title: '购买成功',
													icon: 'none'
												})
												uni.navigateTo({
													url: "../VIPcar/VIpcarlist"
												})
											}
										}
									})
								}

							},
							fail: function(error) {
								uni.showToast({
									title: '支付失败',
									icon: 'none'
								})
							}
						});
					},
					fail: (err) => {
						uni.showToast({
							title: '网络请求超时,请重试',
							icon: 'none'
						})
					}
				})
			},
			// hideModal:function() {
			// 	this.modalName = null
			// },
			onShareAppMessage: function(res) {
				if (res.from === 'button') {
					// 来自页面内转发按钮
					console.log(res.target)
				}
				return {
					title: '测试转发',
					path: '/pages/vipCarDetails/vipCarDetails'
				}
				// 当分享出去的卡片被点击时，在页面的onLoad(options){}，options参数中接收
			},

			onShare(res) {
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession",
					type: 1,
					title: "你笑起来真好看",
					summary: "我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！",
					success: function(res) {
						console.log("success:" + JSON.stringify(res));
					},
					fail: function(err) {
						console.log("fail:" + JSON.stringify(err));
					}
				});
			},
		}
	}
</script>

<style scoped>
	page {
		background-color: #F1F1F1;
		height: 100%;
		/* position: relative; */
	}

	/* 卡片模块 */
	.vip_car_bc {
		width: 90%;
		margin: 0 auto;
		margin-top: 20px;
		height: 150px;
		color: rgba(80, 80, 80, 1);
		background-color: #F074AD;
		border-radius: 6px;
		position: relative;
	}

	.share {
		display: flex;
		flex-direction: column;
		position: absolute;
		top: 4%;
		right: 4%;
	}

	button::after {

		border: none;

	}

	button {
		padding: 0px;
		/* line-height: 0px; */
		line-height: 26px;
		background-color: rgba(56, 56, 56, 1);
	}

	.share_text {
		color: #fff;
		font-size: 14px;
		margin-top: 10px;
		padding-top: 7px;
		background-color: #F074AD;
	}

	.share_icon {
		font-size: 22px;
		color: rgba(255, 255, 255, 1);

	}

	.vip_car_circle {
		width: 39px;
		height: 39px;
		position: absolute;
		left: 4%;
		top: 4%;
		background-color: #fff;
		box-shadow: rgba(255, 255, 255, 1) solid 1px;
		border-radius: 21px;
		text-align: center;
	}

	.car_name {
		position: absolute;
		top: 37%;
		left: 30%;
		/* right: 50%; */
		color: #fff;
		font-size: 25px;
		font-weight: bold;
	}

	.car_number {
		position: absolute;
		left: 5%;
		bottom: 9%;
		color: #fff;
		font-size: 14px;
	}

	.car_class {
		position: absolute;
		left: 17%;
		top: 10%;
		color: #fff;
		font-size: 16px;
		font-weight: bold;
	}

	.car_price {
		position: absolute;
		right: 6%;
		bottom: 6%;
		color: #E5CB30;
		font-size: 24px;
		font-weight: bold;

	}

	/* 卡片介绍 */
	.car_intro {
		background-color: #fff;
		width: 90%;
		margin: 0 auto;
		padding: 4% 8px;
		margin-top: 15px;
		border-radius: 10px;

	}

	.car_intro_title {
		color: rgba(80, 80, 80, 1);
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 13px;
	}

	.car_intro_text {
		color: rgba(80, 80, 80, 1);
		line-height: 20px;
		text-align: left;
	}

	/* 购买按钮 */
	.buy_btn {
		width: 100%;
		height: 48px;
		position: fixed;
		bottom: 0px;
		color: rgba(255, 255, 255, 1);
		background-color: #CA89FF;
		font-size: 14px;
		line-height: 48px;
		text-align: center;
	}

	/* 支付层页面样式 */
	.cu-dialog {
		height: 270px;
		background-color: #fff !important;
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
		background-color: #35B936;
	}

	.action3 {
		height: 58px;
		padding-top: 30px;
		background-color: #fff;
	}

	.occupymodal {
		height: 60px;
		width: 100%;
	}
</style>