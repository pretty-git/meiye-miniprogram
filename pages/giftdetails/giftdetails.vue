<template>
	<view class="main">
		<!-- 礼包项目begin -->
		<view class="top">
			<view class="nav">
				<view class="name">
					礼包项目
				</view>
				<button class="share_text" open-type="share">
					<text>分享</text>
					<view class="icon share_icon">
						&#xe64d;
					</view>

				</button>
			</view>

			<view class="giftlist" v-for="(item, index) in projectList" :key="index" @click="projectdetail(item)">
				<view class="list">
					<view class="giftimg">
						<image :src="item.pictureImg" mode="aspectFill"></image>
					</view>
					<view class="giftright">
						<view class="giftname nowrap">
							{{item.serveName}}
						</view>

						<view class="giftprice color">
							原价 ￥{{item.projectPrice}}
						</view>
					</view>
					<view class="giftright_class">
						<view class="giftnumber">
							{{item.projectNumber}}次
						</view>

						<!-- <view class="gifttime ">
							有效期:{{this.giftValidTime}}
						</view> -->
						<view class="gift_orgive" v-if="item.isPresented === 1">
							赠
						</view>
						<view class="minicon font">
							&#xe604;
						</view>
					</view>


				</view>

			</view>
			<view class="giftlist" v-for="(item, index) in productlist" :key="index">
				<view class="list">
					<view class="giftimg">
						<image :src="item.goodsImg" mode="aspectFill"></image>
					</view>
					<view class="giftright">
						<view class="giftname nowrap">
							{{item.goodsName}}
						</view>

						<view class="giftprice color">
							原价 ￥{{item.productPrice}}
						</view>
					</view>
					<view class="giftright_class">
						<!-- <view class="gifttime ">
							有效期:{{this.giftValidTime}}
						</view> -->
						<view class="gift_orgive" v-if="item.isPresented === 1">
							赠
						</view>
						<view class="minicon font">
							&#xe604;
						</view>
					</view>


				</view>

			</view>
		</view>
		<!-- 礼包项目end -->
		<!-- 可用门店begin -->
		<view class="store " @click="storemap">
			<view class="title">
				可用门店
			</view>
			<view class="storelist nowrap">
				{{storelist}}
			</view>
			<view class="icon list_icon">
				&#xe604;
			</view>
		</view>

		<!-- 可用门店end -->
		<view class="hint">*礼包订单将会拆分成单项目的子订单，请在“我的-待使用”中查看</view>
		<view style="height: 60px;width: 100%;background-color: #fff;"></view>
		<!-- 按钮选择 -->
		<view class="bottom">
			<view class="show_price">
				礼包特惠 ￥{{show_price}}
			</view>
			<view class="buybtn" @click="uppay" data-target="DialogModal1">
				<!-- 支付跳转传递礼包的价格 -->
				立即支付
			</view>
		</view>

	</view>

</template>

<script>
	export default {
		data() {
			return {
				giftId: '',
				show_price: '',
				projectList: [],
				winHeight: '',
				storelist: "厦大店、瑞景店、思明店、翔安店",
				modalName: null,
				bussname: '名资美业',
				payprice: '789.00',
				bankcard: '招商银行信用卡(6666)',
				productlist: [],
				// giftValidTime:'',
			}
		},
		onLoad(options) {
			this.giftId = options.giftId
			this.show_price = options.giftPrice
			console.log(options, '加载中');
			this.projectList = [{
				pictureImg:'../../static/banner/13.jpg',
				price: 33,
				serveName: '洗剪吹项目',
				projectPrice: 66,
				projectNumber: 2,
				isPresented: 1
			},{
				pictureImg:'../../static/banner/14.jpg',
				price:63,
				serveName: '烫发项目',
				projectPrice: 166,
				projectNumber: 1,
				isPresented: 0
			}]
			this.productlist = [{
				goodsImg: '../../static/banner/21.jpg',
				goodsName: '洗发水',
				productPrice: 199,
				isPresented: 1
			}]
			// uni.request({
			// 	method: 'GET',
			// 	url: getApp().globalData.url + `/applet/gift/findGiftById/` + this.giftId,
			// 	success: (res) => {
			// 		console.log(res.data)
			// 		res.data.result.projectMiddles.map(items=> {
			// 			items.pictureImg = 'http://my.cloud.xmstruggle.com/' + items.pictureImg
			// 		})
			// 		res.data.result.productMiddles.map(itemss=> {
			// 			itemss.pictureImg = 'http://my.cloud.xmstruggle.com/' + itemss.goodsImg
			// 		})
			// 		this.projectList = res.data.result.projectMiddles
			// 		this.productlist = res.data.result.productMiddles
			// 		this.storelist = res.data.result.stoName
			// 	},
			// 	fail: (err) => {
			// 		uni.showToast({
			// 			title: '网络请求超时,请重试',
			// 			icon: 'none'
			// 		})
			// 	}
			// })
			// this.show_price = this.projectList[0].price;
			this.payprice = this.show_price;
			let that = this;
			//  高度自适应
			uni.getSystemInfo({
				success: function(res) {
					console.log(res)
					let calc = res.windowHeight + 210;
					that.winHeight = calc;
				}
			});
		},
		methods: {
			onShareAppMessage: function(res) {
				if (res.from === 'button') {
					// 来自页面内转发按钮
					console.log(res.target)
				}
				return {
					title: '礼包分享',
					path: '/pages/giftdetails/giftdetails'
				}
				// 当分享出去的卡片被点击时，在页面的onLoad(options){}，options参数中接收
			},

			showModal(e) {
				// this.modalName = e.currentTarget.dataset.target
			},
			uppay() {
				var orderNumber
				var openId = uni.getStorageSync('openId')
				if (!openId) {
					uni.reLaunch({
						url: '../empty/empty'
					})
					return;
				}
				var that = this
				// uni.request({ //获取购物券
				// 	method: 'POST',
				// 	url: getApp().globalData.url + '/wx/wxPay', //保存所选会员卡回滚
				// 	data: {
				// 		payAmount: 0.01,
				// 		openId: openId,
				// 		tradeType: 'JSAPI',
				// 		mechanismId: uni.getStorageSync('mechanismId'),
				// 		typeId: 2 //礼包相关
				// 	},
				// 	header: {
				// 		"Content-Type": "application/json" //如果为空，加上头部接收     
				// 	},
				// 	success: (res) => {
				// 		console.log(res, 'res')
				// 		orderNumber = res.data.data.orderNumber
				// 		uni.requestPayment({
				// 			timeStamp: res.data.data.timeStamp, //记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了
				// 			nonceStr: res.data.data.nonceStr,
				// 			package: `prepay_id=${res.data.data.prepayId}`,
				// 			signType: res.data.data.signType,
				// 			paySign: res.data.data.sign,
				// 			success: function(event) {
				// 				// success   
				// 				console.log(event);
				// 				if (event.errMsg == "requestPayment:ok") {
									var list = []
									// uni.getStorageSync('user').customerId
									for (var i = 0; i < that.projectList.length; i++) {
										list.push({
											giftTemplateId: Number(that.giftId),
											validUtil: 0,
											customerId: uni.getStorageSync('user').customerId,
											serveId: that.projectList[i].projectId,
											serveNumber: that.projectList[i].projectNumber
										})
									}
									let saleId = that.productlist.map(item=>{
										 let json = []
										 json.push(item.productId)
										 return json
									 }).join(',')
									 console.log(saleId, 'saleId')
									// for (var i = 0; i < that.productlist.length; i++) {
									// 	if (i == 0) {
									// 		sstring = that.productlist[i].productId
									// 	} else {
									// 		sstring = sstring + ',' + that.productlist[i].productId
									// 	}
									// }
									uni.request({
										method: 'POST',
										url: getApp().globalData.url + `/applet/order/addGiftOrder`,
										data: {
											"projectOrder": {
												"mechanismId": uni.getStorageSync('mechanismId'),
												"storeId": uni.getStorageSync('storeId'),
												"staffId": '',
												"ordStatementTime": '',
												"ordCustomerId": uni.getStorageSync('user').customerId,
												"paymentCustomerId": uni.getStorageSync('user').customerId,
												// "ordCustomerId": 51,
												// "paymentCustomerId": 51,
												"ordState": 3,
												orderNumber: orderNumber,
												"consumptionState": 0,
												"ordPaymentMethod": 1,
												"ordAchievement": Number(that.show_price),
												"createTime": '',
												"giftTemplateId": Number(that.giftId),
												saleId: saleId
											},
											"giftOrders": list
										},
										header: {
											"Content-Type": "application/json"
										},
										success: (res) => {
											console.log(res.data, 'sssssssssssssss')
											if (res.data.result == 'success') {
												uni.navigateTo({
													url: "../myOrder/myOrder?index=" + 1
												})

											}
										},
										fail: (err) => {
											uni.showToast({
												title: '网络请求超时,请重试',
												icon: 'none'
											})
										}
									})
								// }
				// 			},
				// 			fail: function(error) {
				// 				uni.showToast({
				// 					title: '支付失败',
				// 					icon: 'none'
				// 				})
				// 			}
				// 		});
				// 	},
				// 	fail: (err) => {
				// 		uni.showToast({
				// 			title: '网络请求超时,请重试',
				// 			icon: 'none'
				// 		})
				// 	}
				// })

			},
			hideModal(e) {
				this.modalName = null
			},
			/* 门店地图 */
			storemap() {
				uni.navigateTo({
					url: '../giftmore/storemap'
				});
			},
			// 查看单项详情
			projectdetail(item) {
				uni.navigateTo({
					url: '../giftdetails/onlyprojectdetails?projectId=' + item.projectId
					// url: '../giftdetails/onlyprojectdetails?id='+ item.id
				});
			}
		}
	}
</script>

<style scoped>
	/* <!-- 礼包项目begin --> */
	page {
		background-color: #f1f1f1;
	}

	.top {
		padding-top: 10px;
	}

	.main {
		position: relative;
		height: 100%;
		/* position: absolute;
		top: 0px;
		width: 100%;
		
		bottom: 50%; */
	}

	.icon {
		font-family: iconfont;
	}

	button::after {

		border: none;

	}

	button {
		padding: 0px;
		line-height: 26px;
		background-color: #fff;
		width: 75%;
		text-align: right;
		font-size: 17px;
		margin: auto 0;

	}

	.nav {
		display: flex;
		flex-direction: row;
		/* width: 100%; */
		height: 35px;
		margin-left: 23px;
		position: relative;
	}

	.share text {
		position: absolute;
		color: rgba(80, 80, 80, 1);
		font-size: 15px;
		top: 8px;
		right: 27px;
	}

	.share_icon {
		font-size: 23px;
		color: rgba(212, 48, 48, 1);
		float: right;
		line-height: 35px;
		position: absolute;
		right: 42px;
		top: -2rpx;
		z-index: 999;
	}

	.name {
		color: rgba(80, 80, 80, 1);
		font-weight: bold;
		text-align: left;
		font-size: 15px;
		line-height: 35px;
	}

	/* 	.righticon {
		font-size: 20px;
		color: rgba(212, 48, 48, 1);
		float: right;
		line-height: 35px;
		position: absolute;
		right: 23px;
	} */
	.list {
		width: 100%;
		display: flex;
		flex-direction: row;

		border-bottom: 1px solid #f1f1f1;
		padding: 18px 0 20px 23px;
	}

	.giftlist {
		/* position: relative; */
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
		margin-left: 14px;
		position: relative;
		width: 30%;
	}

	.giftright_class {
		width: 41%;
		position: relative;
		padding-left: 3%;
	}

	.color {
		color: rgba(255, 108, 144, 1);
		font-size: 14px;
		position: absolute;
	}

	.giftname {
		color: #000;
		font-size: 14px;
	}

	.giftprice {
		top: 33px;
		left: 0px;
		font-size: 16px;
	}

	.gifttime {
		position: absolute;
		bottom: 12%;
		color: #848484;
		width: 100%;
	}

	.gift_orgive {
		padding-top: 3px;
	}

	.giftnumber {
		top: 3px;
		position: absolute;
		width: 100%;
		margin-left: 20%;
		/* left: 125px; */
	}

	.minicon {
		position: absolute;
		right: 13%;
		font-size: 26px;
		color: rgba(153, 153, 153, 1);
		top: 40%;
		font-weight: bold;

	}

	/* <!-- 礼包项目end --> */
	.store {
		width: 100%;
		height: 96px;
		border-top: 5px solid #f1f1f1;
		border-bottom: 5px solid #f1f1f1;
		position: relative;
	}

	.title {
		margin: 11px 0 14px 20px;
		color: rgba(80, 80, 80, 1);
		font-size: 18px;
		text-align: left;
		font-weight: bold;
	}

	.storelist {
		color: rgba(80, 80, 80, 1);
		font-size: 14px;
		text-align: left;
		margin: 0 0 20px 21px;
		width: 80%;
	}

	.list_icon {
		position: absolute;
		top: 24px;
		right: 20px;
		font-size: 26px;
		color: #999999;
		font-weight: bold;

	}

	.hint {
		width: 100%;
		height: 45px;
		line-height: 45px;
		color: #9D9D9D;
		font-size: 12px;
		text-align: center;
		background-color: #fff;

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
		color: #F14D5C;
		background-color: rgba(255, 255, 255, 1);
		font-size: 18px;
		line-height: 52px;
		text-align: center;
	}

	.buybtn {
		width: 50%;
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
		/* margin-top: 35px;	 */
	}

	.action3 {
		height: 58px;
		padding-top: 30px;
		background-color: #fff;
	}
</style>
