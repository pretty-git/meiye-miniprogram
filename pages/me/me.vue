<template>
	<view>

		<view class="user_top">
			<!-- 头部 -->
			<view class="user-top-icon">
				<view class="user-top-image" style="width: 66px;height: 66px;border-radius: 50%;" v-if="message!=''">
					<image :src="list.cusHeadPortrait" mode="aspectFill"></image> <!-- 用户头像 -->
				</view>
				<view class="font user-top-image1" v-else>
					<text>&#xe8c9;</text>
				</view>
			</view>
			<view class="user-top-message">
				<view class="user-top-name" v-if="message!=''">
					<!-- 用户名字 -->
					{{list.cusNickName}}
				</view>
				<view class="user-top-name1" v-else @click="personal1">
					点击登录
				</view>
				<view class="user-top-set-text" @click="personal" v-if="message!=''">
					个人设置
				</view>

			</view>

			<view class="uer-top-set">
				<view style="line-height: 0px;">
					<!-- <text class="font" style="font-size: 20px;">&#xe654; </text> -->
					<view class="user-top-id" v-if="list.cardGrade!=null && list.cardGrade != ''">
						<!-- 什么级别 -->
						{{list.cardGrade}}
					</view>
				</view>

				<view class="uer-top-set-up" @click="upVIP">
					<!-- 立即升级 -->
					立即升级
				</view>
			</view>
		</view>
		<!-- 预约列表显示 -->
		<view style="position: relative;background-color: #fff; margin: 15px 10px 19px 14px;border-radius: 5px; padding-top: 15px;display: flex;"
		 v-if="item.isPay == 1">
			<view class="comlabel bg-orange">
				提醒
			</view>
			<view style="display: flex;flex-direction: column;">
				<view class="order_list_show">
					<view class="order_list_show_src">
						<image :src="'http://my.cloud.xmstruggle.com/' + list.staPhoto" mode="aspectFill"></image>
					</view>
					<view class="order_list_show_ms">
						<view class="order_list_show_name">
							{{list.staName}}
						</view>
						<view class="order_list_show_more">
							{{list.message}}为你服务
						</view>
					</view>
				</view>
			</view>

			<!-- 显示未付款订单 -->
			<view class="notFinish" v-if="notfinishlistlength!=0" @click="notfinish">
				<view class="notFinish_text">
					有未支付订单<text class="font notFinish_icon">&#xe67c;</text>
				</view>
			</view>
		</view>

		<!-- /* 积分系类 begin */ -->
		<view class="total_list">
			<view class="comlabel bg-yellow">
				钱包
			</view>
			<view class="total_list_full" @click="turnintegral">
				<view class="total_list_number">
					{{list.integral}}
				</view>
				<view class="total_list_name">
					积分
				</view>
			</view>
			<view class="total_list_full" @click="turn_red_packet">
				<view class="total_list_number">
					{{list.redPacketQuantity }}
				</view>
				<view class="total_list_name">
					红包
				</view>
			</view>
			<view class="total_list_full" @click="turnvipcar">
				<view class="total_list_number">
					{{list.cardQuantity}}
				</view>
				<view class="total_list_name">
					会员卡
				</view>
			</view>
			<!-- <view class="total_list_full" @click="coupon">
					<view class="total_list_number">
						{{shopping_card}}
					</view>
					<view class="total_list_name" >
						购物券
					</view>
				</view> -->
			<view class="total_list_full" @click="turnbalance">
				<view class="total_list_number">
					{{balance}}
				</view>
				<view class="total_list_name">
					余额
				</view>
			</view>
		</view>
		<!-- /* 积分系列  end */ -->
		<!-- 列表三 begin -->
		<view class="shopping_list">
			<view class="comlabel bg-pink">
				购物
			</view>
			<view class="shopping_list1">
				<view class="shopping_list_view" @click="scan">
					<view class="shopping_list_icon">
						&#xe659;
					</view>
					<view class="shopping_list_name">
						门店扫码购
					</view>
				</view>
				<view class="shopping_list_view" @click="shoppingBag">
					<view class="shopping_list_icon">
						&#xe657;<view class='cu-tag badge' v-if="shopping_cart_number!=0">{{shopping_cart_number}}</view>
					</view>
					<view class="shopping_list_name">
						购物袋
					</view>
				</view>
				<view class="shopping_list_view" @click="receipt">
					<view class="shopping_list_icon">
						&#xe653;
					</view>
					<view class="shopping_list_name">
						购物小票
					</view>
				</view>
				<view class="order_list_view" @click="myOrder">
					<view class="order_list_icon">
						&#xe65c;
					</view>
					<view class="order_list_name">
						我的订单
					</view>
				</view>
			</view>
		</view>

		<!-- 列表三  end -->
		<!-- 列表四 begin -->
		<!-- 列表四 end -->

		<!-- 列表五 begin -->
		<view class="total_list">
			<view class="comlabel bg-red">
				关心
			</view>
			<view class="total_list_full" @click="collectProject">
				<view class="total_list_number">
					{{list.attentionProjectQuantity}}
				</view>
				<view class="total_list_name">
					项目
				</view>
			</view>
			<view class="total_list_full" @click="collectCraftman">
				<view class="total_list_number">
					{{list.attentionCraftsmenQuantity}}
				</view>
				<view class="total_list_name">
					手艺人
				</view>
			</view>
			<!-- <view class="total_list_full" @click="collectStore">
					<view class="total_list_number">
						{{store}}
					</view>
					<view class="total_list_name" >
						门店
					</view>
				</view> -->
			<view class="total_list_full" @click="collectMovie">
				<view class="total_list_number">
					{{list.attentionEntertainmentQuantity}}
				</view>
				<view class="total_list_name">
					视频
				</view>
			</view>
			<view class="total_list_full" @click="browingHistory">
				<view class="total_list_number">
					{{history}}
				</view>
				<view class="total_list_name">
					浏览记录
				</view>
			</view>
		</view>

		<!-- 列表五end -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: {
					attentionCraftsmenQuantity: 0,
					attentionEntertainmentQuantity: 0,
					attentionProjectQuantity: 0,
					cardGrade: 0,
					cardQuantity: 0,
					cusName: 0,
					integral: 0,
					cusNickName: '未知',
					isPay: 0,
					isService: 0,
					redPacketQuantity: 0,
					serveTime: 0,
					shoppingQuantity: 0,
					staName: 0,
					staPhoto: 0
				},
				message: '',
				notfinishlistlength: 1,
				user: {},
				user_top_id: '黑钻会员',
				// 积分系类参数
				integral: 0,
				red_packet: 0,
				vipcar: 0,
				shopping_card: 0,
				balance: 0,
				// 第五栏记录
				project: 0,
				craftmannumber: 0,
				store: 0,
				video: 0,
				history: 0,
				units: ['瓶', '袋', '盒'],
				orderlist: [{
					src: 'https://7765-we-63574e-1258830969.tcb.qcloud.la/mingzi/man.jpg?sign=13cd306d8fac42cffcdff6364956af2d&t=1565946123',
					name: '托尼老师',
					message: '明天15:00为你服务'
				}],
				shopping_cart_number: 0,
			}
		},
		onShow() {
			if (uni.getStorageSync('user').customerId) {
				this.gethomeList()
				this.history = uni.getStorageSync('learnList').length + uni.getStorageSync('projectList').length
				this.shopping_cart_number = uni.getStorageSync('shoppingcart').length
			}
			if (uni.getStorageSync('openId') && uni.getStorageSync('user')) {
				this.message = '111'
				uni.request({
					method: 'GET',
					url: getApp().globalData.url +
						`/applet/shoppingtrolley/selectShoppingTrolleyList/${uni.getStorageSync('user').customerId}/${uni.getStorageSync('storeId')}`,
					header: {
						"Content-Type": "application/json" //如果为空，加上头部接收 
					},
					success: (res) => {
						console.log(res, '购物袋')
						var list = res.data
						var shoppinglist = []
						if (list.length > 0) {
							for (let i = 0; i < list.length; i++) {
								var unit = list[i].goodsSize + this.units[list[i].goodsUnit]
								shoppinglist.push({
									shoppingTrolleyId: list[i].shoppingTrolleyId,
									img: 'http://my.cloud.xmstruggle.com/' + list[i].goodsImg,
									name: list[i].goodsName,
									spec: unit,
									price: list[i].goodsSellPrice,
									number: list[i].goodsNum,
									goodsId: list[i].goodsId,
									selected: false
								})
							}
							uni.setStorageSync('shoppingcart', shoppinglist)
							this.shopping_cart_number = list.length
						} else {
							uni.setStorageSync('shoppingcart', '')
							this.shopping_cart_number = 0
						}
			
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
		onPullDownRefresh() {
			var that = this
			uni.showLoading({
				title: '刷新中',
				mask: true
			})
			setTimeout(function() {
				that.gethomeList()
				that.history = uni.getStorageSync('learnList').length + uni.getStorageSync('projectList').length
				that.shopping_cart_number = uni.getStorageSync('shoppingcart').length
				uni.hideLoading()
				uni.stopPullDownRefresh();
			}, 500);
			console.log("下拉刷新");
		},
		methods: {
			gethomeList() {
				uni.request({
					method: 'POST',
					url: getApp().globalData.url + `/applet/customer/customerHomepage`,
					data: {
						customerId: uni.getStorageSync('user').customerId,
						storeId: uni.getStorageSync('storeId'),
						openId: uni.getStorageSync('user').openId
					},
					header: {
						"Content-Type": "application/x-www-form-urlencoded" //如果为空，加上头部接收 
					},
					success: (res) => {
						this.list = res.data.customerHomepage
						console.log(res, '我的')
					},
					fail: (err) => {
						uni.showToast({
							title: '网络请求超时,请重试',
							icon: 'none'
						})
					}

				})
			},
			turnvipcar() {
				uni.navigateTo({
					url: "../VIPcar/VIpcarlist"
				})
			},
			myOrder() {
				uni.navigateTo({
					url: "../myOrder/myOrder"
				})
			},
			turn_red_packet() {
				uni.navigateTo({
					url: "../me/red_packet"
				})
			},
			coupon() {
				uni.navigateTo({
					url: "../me/coupon"
				})
			},
			turnintegral() {
				uni.navigateTo({
					url: "../me/integral"
				})
			},
			turnbalance() {
				uni.navigateTo({
					url: "../me/balance"
				})
			},
			personal() {
				uni.navigateTo({
					url: "../me/personal"
				})
			},
			personal1() {
				setTimeout(function() {
					uni.reLaunch({
						url: '/pages/empty/empty'
					}, 500)
				})
			},
			collectProject() {
				uni.navigateTo({
					url: "../me/collectProject"
				})
			},
			collectCraftman() {
				uni.navigateTo({
					url: "../me/collectCraftman"
				})
			},
			collectStore() {
				uni.navigateTo({
					url: "../me/collectStore"
				})
			},
			collectMovie() {
				uni.navigateTo({
					url: "../me/collectMovie"
				})
			},
			browingHistory() {
				uni.navigateTo({
					url: "../me/browingHistory"
				})
			},
			shoppingBag() {
				uni.navigateTo({
					url: "../me/shoppingBag"
				})
			},
			receipt() {
				uni.navigateTo({
					url: "../me/receipt"
				})
			},
			scan() {
				uni.scanCode({
					success: function(res) {
						uni.navigateTo({
							url: "../myOrder/commodity?id=" + res.result
						})
					}
				});
			},
			upVIP() {
				uni.navigateTo({
					url: "../VIPcar/VIPcar?index=1"
				})
			},
			notfinish() {
				uni.navigateTo({
					url: "../myOrder/myOrder?index=3"
				})
			}

		}
	}
</script>

<style scoped>
	/* 名片顶部begin */
	page {
		background-image: linear-gradient(45deg, #f1f1f1, #E8E8E8);
	}

	.comlabel {
		width: 44px;
		height: 25px;
		left: 0px;
		position: absolute;
		top: -12px;
		border-radius: 5px;
		font-size: 13px;
		line-height: 25px;
		text-align: center;

	}

	.user_top {
		width: 93%;
		margin-left: 16px;
		height: 127px;
		display: flex;
		flex-direction: row;
		background-color: #fff;
		margin-top: 10px;
		position: relative;
		border-radius: 5px;

	}

	.user-top-icon {
		width: 66px;
		height: 66px;
		border-radius: 34px;
		margin: 15px 0px 37px 14px;
		position: absolute;

	}

	.user-top-image {
		position: relative;
		top: 12%;
		left: 5%;
	}

	.user-top-image1 {
		font-size: 60px;
		position: relative;
		top: 19%;
		left: 13%;
		color: #D898FA;
	}

	.user-top-icon image {
		width: 66px;
		height: 66px;
		border-radius: 50%;
	}

	.user-top-message {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 50%;
		padding-left: 10px;
		left: 20%;
	}

	.user-top-name {
		color: #000000;
		font-size: 18px;
		text-align: left;
		font-weight: bold;
		margin: 30px 0 10px 10px;
	}

	.user-top-name1 {
		color: #000000;
		font-size: 18px;
		text-align: left;
		font-weight: bold;
		margin: 45px 0 10px 10px;
	}

	.user-top-id {
		color: rgba(80, 80, 80, 1);
		font-size: 15px;
		text-align: left;
		margin: 0px 0 19px 10px;
	}

	.uer-top-set {
		position: absolute;
		right: 36px;
		top: 37px;
	}

	.user-top-set-text {
		color: #fb4b5c;
		font-size: 18px;
		text-align: left;
		/* font-weight: bold; */
		margin-top: 0px;
		padding-left: 10%;

	}

	.uer-top-set-up {
		width: 78px;
		height: 26px;
		line-height: 26px;
		opacity: 0.88;
		color: rgba(255, 255, 255, 1);
		background-color: #41ACDF;
		border-radius: 14px;
		font-size: 14px;
		text-align: center;
		margin: 0 auto;
		/* margin: 0 36px 37px 0; */
	}

	/* 名片顶部end */
	/* 积分系类 begin */
	.total_list {
		width: 95%;
		height: 97px;
		margin: 15px 14px 19px 10px;
		background-color: #fff;
		display: flex;
		flex-direction: row;
		position: relative;
	}

	.total_list_full {
		display: flex;
		width: 25%;
		flex-direction: column;
		margin: auto 0;
	}

	.total_list_number {
		text-align: center;
		color: rgba(80, 80, 80, 1);
		font-size: 16px;
		font-weight: bold;
	}

	.total_list_name {
		color: #808080;
		font-size: 14px;
		text-align: center;
		margin-top: 11px;
	}

	/* 积分系列  end */
	/* 第三列表begin */
	.shopping_list_icon {
		font-family: iconfont;
		position: relative;
	}

	.shopping_list {
		width: 95%;
		height: 85px;
		margin: 10px 14px 19px 10px;
		background-color: #fff;
		text-align: center;
		position: relative;
	}

	.shopping_list1 {
		display: flex;
		flex-direction: row;
		text-align: center;
	}

	.shopping_list_view {
		width: 25%;
	}

	.shopping_list_icon {
		font-size: 35px;
		/* color: rgba(0, 0, 0, 1); */
		margin: 13px 0 7px 5px;
	}

	.shopping_list_name {
		color: #808080;
		font-size: 14px;
		margin: 0 0 9px 7px;
	}

	/* 第三列表end */
	/* <!-- 列表四 begin --> */
	.oder_list {
		width: 95%;
		margin: 10px 14px 19px 10px;
		background-color: #fff;
		text-align: center;
	}

	.order_list_icon {
		font-family: iconfont;
		color: #ED1C24;
	}

	.order_list_details {
		display: flex;
		flex-direction: row;
	}

	.order_list_view {
		width: 20%;
	}

	.order_list_icon {
		font-size: 35px;
		margin-top: 14px;
		margin-bottom: 7px;
	}

	.order_list_name {
		font-size: 14px;
		margin-bottom: 10px;
		color: #808080;
	}

	.order_list_show {
		display: flex;
		flex-direction: row;
		margin-top: 9px;
		background-color: #fff;
		width: 100%;
		padding-right: 10px;
	}

	.order_list_show_src {
		width: 45px;
		height: 45px;
		border-radius: 4px;
		margin-left: 17px;
		margin-bottom: 11px;
	}

	.order_list_show_src image {
		width: 45px;
		height: 45px;
		border-radius: 4px;
	}

	.order_list_show_ms {
		display: flex;
		margin-left: 5px;
		flex-direction: column;
	}

	.order_list_show_name {
		color: rgba(80, 80, 80, 1);
		font-size: 14px;
		text-align: left;
		font-weight: bold;
		margin-left: 10px;
		margin-bottom: 5px;
		margin-top: 3px;
	}

	.order_list_show_more {
		color: rgba(128, 128, 128, 1);
		font-size: 13px;
		text-align: left;
		margin-left: 10px;
	}

	/* 未完成订单提醒 */
	.notFinish {
		width: 40%;
		/* border-left: 1px solid #FF9700; */
		position: relative;

	}

	.notFinish_text {
		padding: 20px 0 0 20px;
		font-size: 16px;

	}

	.notFinish_icon {
		position: absolute;
		top: 0px;
		right: 0px;
		font-size: 25px;
		color: red;
	}

	/* <!-- 列表四 end --> */
	/* <!-- 列表五 begin --> */
	.focus_icon {
		width: 36px;
		height: 20px;
		position: absolute;
		top: -11px;
		left: -5px;
		;
		color: rgba(255, 255, 255, 1);
		background-color: rgba(246, 73, 73, 1);
		border-radius: 6px;
		font-size: 11px;
		text-align: center;
	}

	/* <!-- 列表五end --> */
</style>
