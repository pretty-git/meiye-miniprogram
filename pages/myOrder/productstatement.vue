<template>
	<view id="statement">

		<!-- 加入商品模块 -->
		<view class="pay_top">
			<view class="top_title">
				<view class="text">
					商品名称/规格
				</view>
				<view class="text">
					数量
				</view>
				<view class="text">
					价格
				</view>
			</view>
			<view class="top_content_com" v-for="(item,index) in commentlist" :key="index">
				<view class=" wid2 nowrap">
					{{item.name}} <text style="font-size: 20upx;color: #8F8D8E;">({{item.spec}})</text>
				</view>
				<view class="pay_tel wid3" style="border: 2upx solid #E5E5E5;">
					<text class="font" style="font-size: 30upx; font-weight: bold;"
						@click="addnumber(index)">&#xe641;</text>
					<text style="padding: 0 30upx;font-size: 30upx;">{{item.number}}</text> <text
						@click="subnumber(index)" class="font"
						style="font-size: 30upx; font-weight: bold;">&#xe644;</text>
				</view>
				<view class="pay_staff wid4">
					￥{{item.price}}
				</view>
				<view class="pay_staff wid5 subicon font" @click="subcomment(index)">
					&#xe6aa;
				</view>
			</view>
			<view class="addcombtn" @click="addcomment">
				添加商品
			</view>
			<view style="height: 20upx;"></view> <!-- 空白行 -->
		</view>
		<view class="bottom_show">
			<view class="bottom_line">
				<view class="left">
					总金额
				</view>
				<view class="right">
					￥{{AllprojectPrice}}
				</view>
			</view>
			<view class="conpou bottom_line ">
				<view class="left">
					优惠券/会员卡
				</view>
				<view style="display: flex;flex-direction: row;" class="right" @tap="showModal "
					data-target="bottomModal">
					<!-- <view class="caricon"  @click="upVIP"  >
							升级会员
						</view> -->
					<view class="redline">
						<text class="font" style="font-size: 12px;">&#xe660;</text>选择优惠
					</view>
					<view class="font"
						style="font-size: 20px; color: #CCCCCC;margin: auto 0;font-weight: bold;padding-left: 4px;">
						&#xe604;
					</view>
					<!-- <view class="font icon" style="margin: auto 0;" @tap="showModal " data-target="bottomModal">
						&#xe639;
					</view> -->

				</view>

			</view>
			<!-- 卡循环 -->
			<view class="bottom_line" v-for="(tab, ind) in paycarlist" :key="ind">
				<view class="paycarlist">
					<view class="paycar_name">
						{{tab.cardName}}
					</view>
					<view class="paycar_price" v-if="tab.cardType == 1">
						-￥{{tab.optimalAmount + tab.usableMoney }}
					</view>
					<view class="paycar_price" v-else>
						-￥{{tab.optimalAmount}}
					</view>
					<view class="subicon font" @click="subpayVipcar(ind)">
						<!-- 删除优惠的会员卡 -->
						&#xe6aa;
					</view>
				</view>

			</view>
			<!-- 实付金额 -->
			<view class="true_price bottom_line">
				<view class="left">
					实付金额
				</view>
				<view class="right">
					￥{{trueprice>0?trueprice:0}}
				</view>
			</view>
		</view>
		<!-- 会员卡升级层begin -->

		<!-- 支会员卡升级层end -->
		<!-- 底部窗口 begin -->
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''">
			<view class="cu_dialog1">
				<view class="cu-bar bg-white">
					<view style="color: rgba(80, 80, 80, 1);font-size: 14px;font-weight: bold;margin-left: 5%;">抵扣方式
					</view>
					<view class="action text-gray font" @tap="hideModal" style="font-size: 20px;">&#xe64a;</view>
				</view>
				<scroll-view class="swiper-one-list" scroll-y="true">
					<view class="" v-if="carlist.length == 0"
						style="width: 100%;text-align: center;font-size: 15px;color: #A8A8A8;padding: 10px 0;">
						暂无会员卡可使用~
					</view>
					<view v-for="(car,index) in carlist" :key="index" class="list1">
						<view class="vip_car_bc1" style="background-image: linear-gradient(45deg, #FC84B5, #FA51A0)">
							<text class="car_number1">{{ car.cardTypeName }}</text>
							<text class="car_name1">{{ car.cardName }}</text>
							<view class="vipbacimage car1">
								<image src="../../static/gift/m.png" mode="aspectFill"></image>
							</view>
						</view>
						<view class="circle1" :class="{onvipcar: car.checked==true}" @click="chooseit1(index)">
							<view class="circlemin1" :class="{on1: car.checked==true}">
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="submit" @tap="hideModal">
					确定
				</view>
			</view>
		</view>
		<!-- 底部窗口end -->
		<!-- 底部按钮 -->
		<!-- 下方按钮 -->
		<view class="bottom">
			<view class="show_price" @click="showprice">
				<!-- 支付跳转传递礼包的价格 -->
				立即支付
			</view>
			<button class="buybtn" open-type="share">
				其他代付
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				paycarlist: [], //可以优惠的列表获取

				upgradeCarList: [], //选择要升级的卡
				cueIndex: 0, //选择的付款方式
				resultprice: '123',
				trueprice: 0,
				choose: 0,
				choosevipcard: 0,
				AllprojectPrice: 0, //服务项目总价格
				modalName: null,
				scrollLeft: 0,
				isClickChange: false,
				currentTab: 0,
				scrollHeight: 0,
				menuTabs: [],

				carlist: [{
						name: '红包',
						number: 0
					},
					{
						name: '会员卡',
						number: 0
					}

				],

				commentlist: [],
				listString: '',
				updatacarlist: []
			}
		},
		onShow() {
			this.AllprojectPrice = 0; //每次页面加载得初始化总金额
			this.commentlist = uni.getStorageSync('productOrder')
			for (var i = 0; i < this.commentlist.length; i++) {
				this.commentlist[i].selected = this.commentlist[i].price
			}
			console.log(this.commentlist)
			for (var i = 0; i < this.commentlist.length; i++) {
				this.commentlist[i].price = this.commentlist[i].selected * this.commentlist[i].number
				this.AllprojectPrice += this.commentlist[i].price
			}
			this.trueprice = this.AllprojectPrice
		},
		methods: {
			//减vipcar
			subpayVipcar(index) { //减优惠卡数组
				var list = this.paycarlist;
				if (this.paycarlist[index].cardType == 1) {
					this.trueprice = this.trueprice + Number(this.paycarlist[index].optimalAmount) + Number(this
						.paycarlist[index].usableMoney);
				} else {
					this.trueprice = this.trueprice + Number(this.paycarlist[index].optimalAmount);
				}
				this.paycarlist.splice(index, 1);
				// console.log(this.paycarlist);

			},
			subcomment(index) {
				if (this.commentlist.length == 1) {
					uni.showToast({
						title: '商品不能减少了哦',
						icon: 'none'
					})
				} else {
					var list = this.commentlist;
					this.AllprojectPrice -= Number(list[index].price); //减商品后修改总金额
					this.trueprice = this.AllprojectPrice
					this.commentlist.splice(index, 1); //减加入的商品数量
				}
				uni.setStorageSync('productOrder', this.commentlist)

				//修改实际金额的价格
			},
			subnumber(index) {
				if (this.commentlist[index].number == 1) {
					uni.showToast({
						title: '宝贝不能减少了哦',
						icon: 'none'
					})
				} else {
					this.commentlist[index].number = this.commentlist[index].number - 1
					this.commentlist[index].price -= this.commentlist[index].selected
					this.trueprice -= this.commentlist[index].selected
					this.AllprojectPrice = 0
					for (var i = 0; i < this.commentlist.length; i++) {
						this.AllprojectPrice += this.commentlist[i].price
					}
				}
			},
			addnumber(index) {
				console.log(this.commentlist[index].price)
				this.commentlist[index].number = this.commentlist[index].number + 1
				this.commentlist[index].price += this.commentlist[index].selected
				this.trueprice += this.commentlist[index].selected
				this.AllprojectPrice = 0
				for (var i = 0; i < this.commentlist.length; i++) {
					this.AllprojectPrice += this.commentlist[i].price
				}
			},

			checkboxChange(e) {
				var items = this.carlist,
					values = e.detail.value;
				// console.log(values);
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					// console.log(i);
					const item = items[i]
					if (values.includes(item.carnumber)) { //判定一个数组是否包含一直指定的值
						// console.log("包含");
						this.$set(item, 'checked', true)
					} else {
						// console.log("不包含");
						this.$set(item, 'checked', false)
					}
				}
				// console.log(items)
			},
			CueIndex(index) {
				// console.log(index);
				this.cueIndex = index;
				// console.log(this.cueIndex);
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
				var listString = ''
				if (this.commentlist[0].goodsId == undefined) {
					for (var i = 0; i < this.commentlist.length; i++) {
						if (i == 0) {
							if (this.commentlist[i].number == 1) {
								listString = this.commentlist[i].id
							} else {
								for (var j = 0; j < this.commentlist[i].number; j++) {
									if (j == 0) {
										listString = this.commentlist[i].id
									} else {
										listString = listString + ',' + this.commentlist[i].id
									}
								}

							}
						} else {
							for (var j = 0; j < this.commentlist[i].number; j++) {
								listString = listString + ',' + this.commentlist[i].id
							}
						}
					}
				} else {
					for (var i = 0; i < this.commentlist.length; i++) {
						if (i == 0) {
							if (this.commentlist[i].number == 1) {
								listString = this.commentlist[i].goodsId
							} else {
								for (var j = 0; j < this.commentlist[i].number; j++) {
									if (j == 0) {
										listString = this.commentlist[i].goodsId
									} else {
										listString = listString + ',' + this.commentlist[i].goodsId
									}
								}

							}
						} else {
							for (var j = 0; j < this.commentlist[i].number; j++) {
								listString = listString + ',' + this.commentlist[i].goodsId
							}
						}
					}
				}

				console.log(listString, 'listString')
				uni.request({
					method: 'POST',
					url: getApp().globalData.url + `/applet/order/egoMembershipCardByGood`,
					data: {
						"storeId": uni.getStorageSync('storeId'),
						"customerId": uni.getStorageSync('user').customerId,
						// "customerId": 51,
						"goodIds": listString,
						"amount": this.AllprojectPrice,
					},
					header: {
						"Content-Type": "application/x-www-form-urlencoded" //如果为空，加上头部接收
					},
					success: (res) => {
						console.log(res.data, 'ssssssssss')
						if (res.data.length == 0) {
							this.carlist = []
							return;
						}
						this.carlist = res.data
						for (var i = 0; i < this.carlist.length; i++) {
							var book = 0
							for (var j = 0; j < this.paycarlist.length; j++) {
								if (this.carlist[i].cardId == this.paycarlist[j].cardId) {
									this.carlist[i].checked = true
									book = 1
								}
							}
							if (book == 0) {
								this.carlist[i].checked = false
							}
						}
						console.log(this.carlist, 'this.carlist')
					},
					fail: (err) => {
						uni.showToast({
							title: '网络请求超时,请重试',
							icon: 'none'
						})
					}
				})
			},
			hideModal(e) {
				this.trueprice = this.AllprojectPrice
				this.modalName = null
				for (var i = 0; i < this.carlist.length; i++) {
					if (this.carlist[i].checked == true) {
						if (this.carlist[i].cardType == 1) {
							this.trueprice = this.trueprice - this.carlist[i].optimalAmount - this.carlist[i].usableMoney
							console.log(this.trueprice)
						} else {
							this.trueprice = this.trueprice - this.carlist[i].optimalAmount
							console.log(this.trueprice)
						}
					}
				}
				this.paycarlist = []
				for (var i = 0; i < this.carlist.length; i++) {
					if (this.carlist[i].checked == true) {
						this.paycarlist.push(this.carlist[i])
					}
				}
			},
			chooseit(item) {
				this.choose = item.id
			},
			chooseit1(index) {
				var book = 0
				this.paycarlist = []
				for (var i = 0; i < this.carlist.length; i++) {
					if (this.carlist[i].checked == true) {
						this.paycarlist.push(this.carlist[i])
					}
				}
				console.log(this.paycarlist, 'this.paycarlist')
				if (this.paycarlist.length != 0 && this.carlist[index].checked == false) {
					for (var i = 0; i < this.carlist[index].goodIdStr.length; i++) {
						for (var j = 0; j < this.paycarlist.length; j++) {
							for (var k = 0; k < this.paycarlist[j].goodIdStr.length; k++) {
								if (this.paycarlist[j].goodIdStr[k] == this.carlist[index].goodIdStr[i]) {
									uni.showToast({
										title: '优惠重复',
										icon: 'none'
									})
									book = 1
									return;
								}
							}

						}

					}
				}
				if (book == 0) {
					this.carlist[index].checked = !this.carlist[index].checked
					console.log(this.carlist)
				}
			},
			swichMenu(current) {
				//点击其中一个 menu
				if (this.currentTab == current) {
					return false;
				} else {
					this.currentTab = current;
					this.setScrollLeft(current);
				}
			},
			payment(item) {
				uni.navigateTo({
					url: '../payment/payment'
				})
			},
			addcomment() {
				uni.navigateTo({
					url: '../myOrder/commonCart'
				})
			},
			showprice() { //立即支付

				var orderNumber
				var openId = uni.getStorageSync('openId')
				if (!openId) {
					uni.reLaunch({
						url: '../empty/empty'
					})
					return;
				}
				var that = this
				uni.request({ //获取购物券
					method: 'POST',
					url: getApp().globalData.url + '/wx/wxPay', //保存所选会员卡回滚
					data: {
						payAmount: 0.01,
						openId: openId,
						tradeType: 'JSAPI',
						mechanismId: uni.getStorageSync('mechanismId'),
						typeId: 3
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
								console.log(event, '支付反馈');
								if (event.errMsg == "requestPayment:ok") {
									var list = []
									for (var i = 0; i < that.commentlist.length; i++) {
										list.push({
											goodId: that.commentlist[i].goodsId,
											goodNumber: that.commentlist[i].number
										})
									}
									console.log(list)
									uni.request({
										method: 'POST',
										url: getApp().globalData.url +
											`/applet/order/addSellingOrder`,
										data: {
											"mechanismId": uni.getStorageSync(
												'mechanismId'),
											"storeId": uni.getStorageSync('storeId'),
											"staffId": '',
											orderNumber: '',
											"ordCustomerId": uni.getStorageSync('user')
												.customerId,
											"saleId": that.listString,
											"ordStatementTime": '',
											"paymentCustomerId": uni.getStorageSync('user')
												.customerId,
											"ordState": 3,
											"consumptionState": 0,
											"ordPaymentMethod": 1,
											"ordAchievement": that.trueprice,
											"sellGoodOrders": list
										},
										header: {
											"Content-Type": "application/json" //如果为空，加上头部接收
										},
										success: (res) => {
											console.log()
											var orderlist = []
											var updatalist = []
											console.log(that.paycarlist, 'paycarlist')
											for (var i = 0; i < that.paycarlist
												.length; i++) {
												updatalist = []
												for (var j = 0; j < that.paycarlist[i]
													.giveDiscountInfos.length; j++) {
													if (that.paycarlist[i]
														.giveDiscountInfos[j]
														.giveGood == undefined || that
														.paycarlist[i]
														.giveDiscountInfos[
															j].giveGoodTime ==
														undefined) {} else {
														updatalist.push({
															giveGood: that
																.paycarlist[i]
																.giveDiscountInfos[
																	j]
																.giveGood,
															giveGoodTime: that
																.paycarlist[i]
																.giveDiscountInfos[
																	j]
																.giveGoodTime
														})
													}

												}
												if (that.paycarlist[i].cardType == 1) {
													var list = {}
													list.creditAmount = that
														.paycarlist[i].usableMoney
													list.giveCreditAmount = that
														.paycarlist[i].giveGold
													list.giveInfos = updatalist
													orderlist.push({
														commonOrderId: res.data
															.orderId,
														storeId: uni
															.getStorageSync(
																'storeId'),
														openChargeCardId: that
															.paycarlist[i]
															.openChargeCardId,
														ordCustomerId: uni
															.getStorageSync(
																'user')
															.customerId,
														staffId: '',
														cardType: that
															.paycarlist[i]
															.cardType,
														settlementCard: list
													})
												} else if (that.paycarlist[i]
													.cardType == 2) {
													var list = {}
													list.creditAmount = that
														.paycarlist[i].discountMoney
													list.giveInfos = updatalist
													orderlist.push({
														commonOrderId: res.data
															.orderId,
														storeId: uni
															.getStorageSync(
																'storeId'),
														openChargeCardId: that
															.paycarlist[i]
															.openChargeCardId,
														ordCustomerId: uni
															.getStorageSync(
																'user')
															.customerId,
														staffId: '',
														cardType: that
															.paycarlist[i]
															.cardType,
														settlementCard: list
													})
												} else {
													var list = {}
													list.giveInfos = updatalist
													orderlist.push({
														commonOrderId: res.data
															.orderId,
														storeId: uni
															.getStorageSync(
																'storeId'),
														openChargeCardId: that
															.paycarlist[i]
															.openChargeCardId,
														ordCustomerId: uni
															.getStorageSync(
																'user')
															.customerId,
														staffId: '',
														cardType: that
															.paycarlist[i]
															.cardType,
														settlementCard: list
													})
												}
											}
											uni.request({
												method: 'POST',
												url: getApp().globalData.url +
													`/applet/order/updateOpenChargeCardInfoByGood`,
												data: {
													"backstageChargeCardOrders": orderlist
												},
												success: (res) => {
													console.log(res,
														'ssssssssss')
													if (res.data.result ==
														"success") {
														uni.navigateTo({
															url: '../me/receipt'
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
											var list = uni.getStorageSync(
												'shoppingcart');
											for (var j = 0; j < list.length; j++) {
												var book = 0
												var index = 0
												for (var i = 0; i < that.commentlist
													.length; i++) {
													if (that.commentlist[i].goodsId ==
														list[j].goodsId)
														book = 1
													index = i
												}
												if (book == 1) {
													list.splice(index, 1)
												}
											}
											uni.setStorageSync('shoppingcart', list)
											uni.setStorageSync('productOrder', '')
										},
										fail: (err) => {
											uni.showToast({
												title: '网络请求超时,请重试',
												icon: 'none'
											})
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
		}
	}
</script>

<style lang="less">
	#statement {
		.pay_top {
			width: 100%;
			background-color: #fff;
			margin: 30upx 0;
		}

		.top_title {
			display: flex;
			flex-direction: row;

		}

		.redline {
			background-image: linear-gradient(#FC7127, #F93B14);
			font-size: 12px;
			color: #fff;
			width: 75%;
			border-radius: 3px;
			text-align: center;
			letter-spacing: 1px;
			height: 20px;
			line-height: 20px;
		}

		.text {
			color: rgba(80, 80, 80, 1);
			font-size: 32upx;
			font-weight: bold;
			width: 33.3%;
			text-align: center;
			border-bottom: 4rpx solid #f1f1f1;
			padding: 10px 0;

		}

		.top_content {
			display: flex;
			flex-direction: row;
			width: 100%;
			line-height: 44upx;
			padding: 20upx 0;
		}

		.top_content_com {
			display: flex;
			flex-direction: row;
			width: 100%;
			line-height: 44upx;
			padding: 30rpx 0;
		}

		.wid1 {
			width: 50%;
			text-align: center;
		}

		.wid2 {
			width: 50%;
			text-align: center;
		}

		.wid3 {
			width: 30%;
			text-align: center;
		}

		.wid4 {
			width: 25%;
			text-align: right;
		}

		.wid5 {
			width: 20%;
			text-align: center;
		}

		.wid7 {
			width: 30%;
			text-align: center;
		}

		.wid8 {
			width: 20%;
			text-align: center;
		}

		.wid {
			width: 100%;
			text-align: center;
		}

		.pay_name {
			display: flex;
			flex-direction: row;
			width: 42%;
		}

		.pay_name1 {
			width: 42%;
			text-align: center;
		}

		.serial {
			border: 2upx solid #999;
			border-radius: 72upx;
			width: 46upx;
			margin-left: 30upx;
			margin-right: 10upx;
			line-height: 46upx;
			height: 46upx;
		}

		/* 项目栏 */
		.child {
			display: flex;
			flex-direction: row;
			border-bottom: 1px solid rgba(114, 130, 138, 0.18);
			padding: 10px 0;
			padding-left: 15px;
		}

		.middle_content {
			width: 100%;
			line-height: 22px;
			padding: 10px 0;
			border-bottom: 1px dotted #999;
		}

		.w {
			padding-left: 25px;
			display: flex;
			flex-direction: row;
		}

		.pro_serial {
			border: 1px solid #999;
			border-radius: 36px;
			width: 23px;
			line-height: 23px;
			height: 23px;
			position: absolute;
			top: 9px;
			text-align: center;
			left: 12px;
		}

		.allprice {
			text-align: right;
			/* padding-right: 20px; */
			padding: 10px 20px 0px 0;
		}

		.addcombtn {
			width: 90px;
			height: 35px;
			background-color: #FB4B5C;
			color: #FFFFFF;
			border-radius: 30px;
			text-align: center;
			line-height: 35px;
			font-size: 13px;
			margin-left: 70%;

		}

		/* 总金额模块 */
		.bottom_show {
			width: 100%;
			margin-top: 10px 0;
			background-color: #fff;
		}

		.bottom_line {
			display: flex;
			flex-direction: row;
			margin: 10px 0;
			padding-top: 10px;
		}

		.right {
			margin: auto 0;
			color: rgba(80, 80, 80, 1);
			font-size: 18px;
			font-weight: bold;
			padding-right: 20px;
			width: 40%;
			text-align: right;
		}

		.icon {
			color: rgba(153, 153, 153, 1);
			font-size: 30px;
			padding-left: 15px;
		}

		.left {
			margin: auto 0;
			font-size: 16px;
			color: #505050;
			width: 90%;
			padding-left: 15px;
			text-align: left;
		}

		.caricon {
			margin: auto 0;
			width: 65px;
			height: 29px;
			color: #fff;
			background-color: #FB4B5C;
			border-radius: 8px;
			font-size: 12px;
			line-height: 29px;
			text-align: center;
		}

		.subicon {
			font-size: 18px;
			color: red;
			font-weight: bold;
		}

		.paycarlist {
			display: flex;
			flex-direction: row;
			width: 100%;
			padding: 0 15px;
			/* text-align: right; */
			margin: 5px 0;
		}

		.paycar_name {
			font-size: 15px;
			font-weight: bold;
			width: 60%;
			text-align: right;
		}

		.paycar_price {
			font-size: 15px;
			margin: 0 10px;
			font-weight: bold;
			width: 30%;
			text-align: center;
		}

		.true_price {
			padding-bottom: 60px;
		}

		/* 升级卡片页面begin */
		checkbox.round .wx-checkbox-input,
		checkbox.round .uni-checkbox-input {
			border-radius: 100upx;
			background-color: rgba(255, 195, 0, 1) !important;
		}

		.round {
			position: absolute;
			top: 3%;
			left: 5%;
		}

		switch.blue[checked] .wx-switch-input,
		checkbox.blue[checked] .wx-checkbox-input,
		radio.blue[checked] .wx-radio-input,
		switch.blue.checked .uni-switch-input,
		checkbox.blue.checked .uni-checkbox-input,
		radio.blue.checked .uni-radio-input {
			background-color: rgba(255, 195, 0, 1) !important;
			/* border-color: #0081ff !important; */
			color: #ffffff !important;
		}

		.middle-dialog {
			position: relative;
			display: inline-block;
			vertical-align: middle;
			height: 337px;
			background-color: #f8f8f8;
			border-radius: 5px;
			width: 100%;
			overflow: hidden;
		}

		.choosebtn {
			font-size: 12px;
			float: right;
			margin-right: 5%;
			/* : 1px solid #F1F1F1; */
			width: 110px;
			height: 30px;
			text-align: center;
			background-color: #39b54a;
			color: #FFFFFF;
			line-height: 30px;
			border-radius: 30px;
			box-shadow: 6upx 6upx 8upx rgba(48, 156, 63, 0.2);
		}

		.middle_title {
			position: absolute;
			top: 5%;
			left: 5%;
			font-size: 13px;
			font-weight: bold;
		}

		.action1 {
			font-size: 22px;
			position: absolute;
			right: 5%;
			top: 3%;
		}

		.showcarlist {
			width: 30%;
			margin: 5px;
			/* margin-top: 40px; */

		}

		.midlle-car-top {
			width: 100%;
			height: 44px;
		}

		.vip_car {
			width: 100%;
			height: 100%;
			/* overflow: hidden; */
			/* overflow-x: scroll; */
			display: flex;
			flex-direction: row;
			background-color: #fff;
			flex-wrap: wrap;
			padding-right: 30px;
			position: relative;
			padding-top: 10px;
		}

		.car {
			width: 30%;
			height: 50px;
			/* padding: 0 26px; */
			/* padding-left: 30px; */
			/* margin: 16px 0; */
		}

		/* .car_list {
			width: 100%;
			margin: 0 10px 0 10px;
		} */
		.vip_car_bc {
			width: 100%;
			height: 72px;
			color: rgba(80, 80, 80, 1);
			background-color: rgba(56, 56, 56, 1);
			border-radius: 4px;
			font-size: 11px;
			/* margin: 5px 9px 5px 2px; */
			position: relative;
		}

		.vipcarchooseIndex {
			position: absolute;
			top: 0px;
			left: 0px;
			font-size: 20px;
			color: red;
			z-index: 99999;
		}

		.vip_car_circle {
			width: 16px;
			height: 16px;
			position: absolute;
			left: 2px;
			top: 2px;
			color: rgba(80, 80, 80, 1);
			background-color: rgba(255, 195, 0, 1);
			box-shadow: rgba(255, 255, 255, 1) solid 1px;
			border-radius: 12px;
			text-align: center;
		}

		.swiper-car-list {
			/* margin-top: 60px; */
			height: 250px;
			/* scroll-view加上页面的高度就可以自适应 */
			border-bottom: 1px solid #f1f1f1;
			width: 100%;
			/* margin-bottom: 600px; */
			overflow: auto;
		}

		.car_name {
			position: absolute;
			right: 5%;
			top: 7%;
			color: rgba(255, 195, 0, 1);
			font-size: 8px;
		}

		.car_number {
			position: absolute;
			left: 2%;
			bottom: 3%;
			color: rgba(255, 195, 0, 1);
			font-size: 8px;
		}

		.car_class {
			color: rgba(80, 80, 80, 1);
			font-size: 11px;
			text-align: center;
			font-weight: bold;
			margin-top: 7px;
		}

		.car_price {
			position: absolute;
			bottom: 0%;
			color: rgba(212, 48, 48, 1);
			font-size: 16px;
			font-weight: bold;
			right: 5%;
		}

		/* 升级卡片页面end */
		/* 升级卡片页面end */
		.cu-bar {
			width: 100%;
			height: 40px;
		}

		.body-view {

			height: 400px;
			width: 100%;
		}

		.top-menu-view {
			display: flex;
			white-space: nowrap;
			width: 100%;
			background-color: #ffffff;
			height: 46px;
			/* 在这里设置导航条高度 */
			border-bottom: 2px solid #f1f1f1;
			/* padding-right: 15px; */
		}

		.top-menu-view .menu-one-view {
			display: inline-block;
			white-space: nowrap;
			height: 100%;
			width: 50%;
		}

		.top-menu-view .menu-one-view .menu-one {
			/* 在这里写 单个按钮样式 */
			/* margin: 12px 12px 18px 22px; */
			position: relative;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			/* width: 50%; */
			text-align: center;
		}

		.top-menu-view .menu-one-view .menu-one .menu-one-txt {
			height: 40upx;
			font-size: 26upx;
			font-weight: 400;
			color: rgba(154, 154, 154, 1);
			line-height: 40upx;
			margin-top: 10px;
		}

		.top-menu-view .menu-one-view .menu-one .menu-one-bottom {
			position: absolute;
			bottom: 0;
			width: 100%;
		}

		.top-menu-view .menu-one-view .menu-one .menu-one-bottom .menu-one-bottom-color {
			width: 100%;
			height: 4upx;
		}

		.top-menu-view .menu-one-view .menu-one-act {
			/* 在这里写 单个按钮样式 */
			/* margin: 12px 12px 18px 22px; */
			position: relative;
			margin: 0 26%;
			height: 100%;
			/* width: 65px; */
			display: flex;
			align-items: center;
			justify-content: center;
			border-bottom: 3px solid rgba(255, 119, 119, 1);
			;
		}

		.top-menu-view .menu-one-view .menu-one-act .menu-one-txt {
			height: 30px;
			font-size: 26upx;
			font-weight: 400;
			color: rgba(0, 170, 255, 1);
			line-height: 40upx;
			margin-top: 10px;
		}

		.top-menu-view .menu-one-view .menu-one-act .menu-one-bottom {
			position: absolute;
			bottom: 0;
			width: 100%;
			display: flex;
			justify-content: center;
		}

		.top-menu-view .menu-one-view .menu-one-act .menu-one-bottom .menu-one-bottom-color {
			width: 60%;
			height: 4upx;
			background: rgba(0, 170, 255, 1);
		}

		.swiper-box-list {
			/* flex: 1; */
			width: 100%;
			height: 250px;
			background-color: #ffffff;
		}

		.swiper-one-list {
			/* margin-top: 60px; */
			height: 100%;
			border-bottom: 1px solid #f1f1f1;
			width: 100%;
			/* margin-bottom: 600px; */
			overflow: auto;
		}

		// 会员卡列表
		// .floor-item1 {
		// 	display: flex;
		// 	flex-direction: column;
		// 	/* width: 200upx; */
		// 	height: 250rpx;
		// 	margin-right: 20upx;
		// 	font-size: 14px;
		// 	color: #007aff;
		// 	text-align: center;
		// }
		.vip_car1 {
			width: 90%;
			height: 110px;
			overflow: hidden;
			overflow-x: scroll;
			display: flex;
			margin: 0 auto;
		}

		.car1 {
			width: 48%;
			margin: 1%;
			/* margin: 0 10px 0 10px; */
		}

		.vip_car_bc1 {
			width: 190px;
			height: 80px;
			color: #fff;
			border-radius: 5px;
			position: relative;
			margin: 10px 40px;


		}

		.car_name1 {
			position: absolute;
			left: 13%;
			top: 57%;
			font-size: 12px;

		}

		.car_number1 {
			position: absolute;
			left: 12%;
			bottom: 51%;
			font-size: 17px;

		}

		.vipbacimage {
			width: 40px;
			height: 45px;
			position: absolute;
			right: 6%;
			top: 10%;


		}

		.vipbacimage image {
			width: 40px;
			height: 46px;
			position: absolute;
			right: 5%;
			top: 27%;

		}

		.circle1 {
			width: 19px;
			height: 19px;
			border: 2px solid #80848c;
			border-radius: 50%;
			position: absolute;
			right: 10%;
			top: 45%;
		}

		.circlemin1 {
			width: 9px;
			height: 9px;
			border-radius: 50%;
			position: absolute;
			background-color: #fff;
			right: 16%;
			top: 18%;
		}

		.list1 {
			height: 100px;
			width: 90%;
			margin: 10px auto;
			border: 1px solid #E8E8E8;
			position: relative;
		}

		.onvipcar {
			width: 19px;
			height: 19px;
			border: 2px solid #d43030;
			border-radius: 50%;
			position: absolute;
			right: 10%;
			top: 45%;

		}

		// 会员卡列表end
		/* 顶部nav  end */
		/* 选择红包卡券的窗口 */
		.cu_dialog1 {
			position: relative;
			display: inline-block;
			vertical-align: middle;
			height: 400px;
			background-color: #f8f8f8;
			border-radius: 5px;
			width: 100%;
			overflow: hidden;
		}

		.cu_dialog2 {
			position: relative;
			display: inline-block;
			vertical-align: middle;
			height: 250px;
			background-color: #f8f8f8;
			border-radius: 5px;
			width: 100%;
			overflow: hidden;
		}

		.list {
			height: 66px;
			width: 90%;
			margin: 10px auto;
			border: 1px solid #E8E8E8;
			position: relative;
		}

		.list_usecause {
			width: 28%;
			word-break: break-all;
			height: 63px;
			position: absolute;
			left: 0px;
			top: 0px;
			color: rgba(255, 255, 255, 1);
			background-color: rgba(42, 130, 228, 1);
			font-size: 12px;
			line-height: 66px;
			text-align: center;
		}

		.list_usecause1 {
			width: 28%;
			word-break: break-all;
			height: 63px;
			position: absolute;
			left: 0px;
			top: 0px;
			color: rgba(255, 255, 255, 1);
			background-color: #d4a200;
			font-size: 13px;
			line-height: 66px;
			text-align: center;
		}

		.list_name {
			color: rgba(80, 80, 80, 1);
			font-size: 11px;
			position: absolute;
			top: 8%;
			left: 32%;
			font-weight: bold;
		}

		.list_time {
			color: rgba(166, 166, 166, 1);
			position: absolute;
			bottom: 10%;
			left: 32%;
			font-size: 11px;
		}

		.circle {
			width: 19px;
			height: 19px;
			border: 2px solid rgba(128, 132, 140, 1);
			border-radius: 50%;
			position: absolute;
			right: 4%;
			top: 31%;
		}

		.on {
			width: 19px;
			height: 19px;
			border: 2px solid rgba(212, 48, 48, 1);
			border-radius: 50%;
			position: absolute;
			right: 4%;
			top: 31%;
		}

		.circlemin {
			width: 9px;
			height: 9px;
			border-radius: 50%;
			position: absolute;
			background-color: #fff;
			right: 16%;
			top: 18%;
		}

		.on1 {
			width: 100%;
			height: 100%;
			border-radius: 50%;
			position: absolute;
			background-color: rgba(212, 48, 48, 1);
			top: 0%;
			left: 0%;
			border: 2px solid #fff;
		}

		.submit {
			width: 42%;
			height: 35px;
			color: #ffffff;
			box-shadow: 6rpx 6rpx 8rpx rgba(204, 69, 59, 0.2);
			background-color: #e54d42;
			border-radius: 13px;
			font-size: 13px;
			line-height: 35px;
			text-align: center;
			margin: 2px auto;
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
			height: 50px;
			color: #fff;
			background-color: #5D76E4;
			font-size: 17px;
			line-height: 50px;
			text-align: center;
		}

		.buybtn {
			width: 50%;
			height: 50px;
			color: #FB4B5C;
			background-color: #fff;
			font-size: 17px;
			line-height: 50px;
			text-align: center;
			// border: 1px solid #1890ff;
		}

		/* 支付方式按钮 */
		.allpay {
			width: 100%;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
		}

		.cd {
			width: 33.3%;
			width: 88px;
			margin: 5px 15px;
			height: 40px;
			color: rgba(42, 130, 228, 1);
			background-color: rgba(255, 255, 255, 1);
			border: 1px solid rgba(42, 130, 228, 1);
			border-radius: 21px;
			font-size: 14px;
			line-height: 40px;
			text-align: center;
		}

		.cu-bar {
			margin-bottom: 10px;
		}

		.choosepaybtn {
			width: 100%;
			display: flex;
			flex-direction: row;
			position: absolute;
			bottom: 0px;
		}

		.choosepaybtn2,
		.choosepaybtn1 {
			line-height: 50px;
			/* margin: 10px 0; */

			width: 50%;
			height: 50px;
			color: #fff;
			font-size: 16px;
			background-color: #39B54A;
			text-align: center;
		}

		.choosepaybtn1 {
			background-color: #1890FF;
		}

		.CueIndex {
			background-color: #1890FF;
			color: #fff;
		}
	}
</style>