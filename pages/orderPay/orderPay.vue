<template>
	<view id="empty">
		<view class="top">
			<view class="top_title">
				<view class="title">预约订单</view>
				<view class="gift_price">应付款：{{ gift_price }}元</view>
			</view>
			<view class="top_bottom">
				<view class="margin_bottom name">项目:{{ name }}</view>
				<view class="margin_bottom craftman_name">手艺人：{{ craftname }}</view>
				<view class="margin_bottom craftman_name">时间：{{ time }}</view>
				<view class="margin_bottom location">地点：{{ location }}</view>
				<view class="margin_bottom tel">手机：{{ tel }}</view>
			</view>
		</view>
		<view class="hint1"></view>
		<!-- 下方按钮 -->
		<view class="bottom">
			<view class="show_price" @click="cashDelivery">预约完成</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: '',
				gift_price: 0,
				craftname: '',
				time: '',
				location: '',
				tel: '',
				orderid: '',
				customerId: '',
				mechanismId: '',
				projectId: '',
				projectname: '',
				storeId: '',
				trueprice: 0
			};
		},
		onLoad(res) {
			this.userId = uni.getStorageSync('user').customerId;
			// this.userId = 51
			const props = {
				mechanismId: 1,
				projectId: 2,
				storeId: 3,
				time: '2023-05-21 09:00:00',
				projectname: "时尚大礼包",
				staffId: 1,
				price: 89,
				staffname: '张三老师',
			}
			this.mechanismId = props.mechanismId;
			this.projectId = props.projectId; //拼接好的项目ID
			this.storeId = props.storeId;
			this.ordertime = props.time;
			this.name = props.projectname;
			this.staffId = props.staffId;
			this.gift_price = props.price;
			this.trueprice = props.price;
			this.craftname = props.staffname;
			this.time = props.time;
			this.tel = uni.getStorageSync('user').cusPhone || '12345678901';
			this.location = getApp().globalData.location || '厦门万达店';
			// this.getIVip()
			this.location = uni.getStorageSync('locationname') || '厦门万达店';
		},
		methods: {
			cashDelivery() {
				// 到店再付
				if (this.staffId == '-1') {
					var that = this;
					var price = that.gift_price;
					var projectlist = that.projectId.split(',');
					var lists = [];
					for (var i = 0; i < projectlist.length; i++) {
						lists.push({
							serveId: Number(projectlist[i]),
							staffId: '',
							appointmentId: ''
						}); ////到店再付不传)
					}
					var that = this;
					uni.showModal({
						title: '提示',
						content: '请确认订单信息',
						success: function(res) {
							if (res.confirm) {
								var price = that.gift_price;
								uni.request({
									method: 'POST',
									url: getApp().globalData.url + '/applet/appoint/addSave',
									data: {
										mechanismId: uni.getStorageSync('mechanismId'),
										storeId: uni.getStorageSync('storeId'),
										staffId: '',
										projectId: that.projectId,
										customerId: that.userId,
										appoMoney: price,
										appoTime: that.ordertime
									},
									success: res => {
										if (res.data.result == 'existence') {
											uni.showToast({
												title: '该时间已被预约，请换个时间',
												icon: 'none'
											});
										} else {
											var id = res.data.appointmentId;
											var projectlist = that.projectId.split(',');
											var lists = [];
											for (var i = 0; i < projectlist.length; i++) {
												lists.push({
													serveId: Number(projectlist[i]),
													staffId: '',
													appointmentId: Number(id)
												});
											}
											uni.request({
												method: 'POST',
												url: getApp().globalData.url +
													'/applet/order/addServeOrder',
												data: {
													projectOrder: {
														mechanismId: uni.getStorageSync(
															'mechanismId'),
														storeId: uni.getStorageSync(
															'storeId'),
														staffId: '', //到店再付不传
														ordCustomerId: Number(that.userId),
														ordState: 0,
														consumptionState: 1, //
														ordAchievement: price,
														orderType: '' //到店再付不传
													},
													projectOrderRelevance: lists
												},
												success: res => {
													console.log(res, '到店支付');
													if (res.data.result == 'success') {
														var index = 0;
														uni.navigateTo({
															url: '../myOrder/myOrder?index=' +
																index +
																'&navibacktype=' +
																1
														});
													} else {
														uni.showToast({
															title: '网络请求超时,请重试',
															icon: 'none'
														});
													}
												},
												fail: err => {
													uni.showToast({
														title: '网络请求超时,请重试',
														icon: 'none'
													});
												}
											});
										}
									},
									fail: err => {
										uni.showToast({
											title: '网络请求超时,请重试',
											icon: 'none'
										});
									}
								});
							}
						}
					});
				} else {
					var that = this;
					uni.showModal({
						title: '提示',
						content: '请确认订单信息',
						success: function(res) {
							if (res.confirm) {
								var price = that.gift_price;
								uni.request({
									method: 'POST',
									url: getApp().globalData.url + '/applet/appoint/addSave',
									data: {
										mechanismId: uni.getStorageSync('mechanismId'),
										storeId: uni.getStorageSync('storeId'),
										staffId: Number(that.staffId),
										projectId: that.projectId,
										customerId: that.userId,
										appoMoney: price,
										appoTime: that.ordertime
									},
									success: res => {
										if (res.data.result == 'existence') {
											uni.showToast({
												title: '该时间已被预约，请换个时间',
												icon: 'none'
											});
										} else {
											var id = res.data.appointmentId;
											var projectlist = that.projectId.split(',');
											var lists = [];
											for (var i = 0; i < projectlist.length; i++) {
												lists.push({
													serveId: Number(projectlist[i]),
													staffId: Number(that.staffId),
													appointmentId: Number(id)
												});
											}
											uni.request({
												method: 'POST',
												url: getApp().globalData.url +
													'/applet/order/addServeOrder',
												data: {
													projectOrder: {
														mechanismId: uni.getStorageSync(
															'mechanismId'),
														storeId: uni.getStorageSync(
															'storeId'),
														staffId: Number(that
														.staffId), //到店再付不传
														ordCustomerId: Number(that.userId),
														ordState: 0,
														consumptionState: 1, //
														ordAchievement: price,
														orderType: '预约单'
													},
													projectOrderRelevance: lists
												},
												success: res => {
													console.log(res, '到店支付');
													if (res.data.result == 'success') {
														var index = 0;
														uni.navigateTo({
															url: '../myOrder/myOrder?index=' +
																index +
																'&navibacktype=' +
																1
														});
													} else {
														uni.showToast({
															title: '网络请求超时,请重试',
															icon: 'none'
														});
													}
												},
												fail: err => {
													uni.showToast({
														title: '网络请求超时,请重试',
														icon: 'none'
													});
												}
											});
										}
									},
									fail: err => {
										uni.showToast({
											title: '网络请求超时,请重试',
											icon: 'none'
										});
									}
								});
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}
			}
		}
	};
</script>

<style lang="less">
	#empty {
		// margin-bottom: 70px;
		width: 100%;
		height: 100%;
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: center;

		/* top模块 */
		.top {
			margin-top: 20px;
			width: 100%;
			height: 225px;
			background-color: #ffffff !important;
			padding-left: 20px;
		}

		.top_title {
			display: flex;
			flex-direction: row;
			height: 50px;
		}

		.title {
			color: rgba(80, 80, 80, 1);
			font-size: 18px;
			/* line-height: 150%; */
			text-align: left;
			font-weight: bold;
			line-height: 50px;
		}

		.gift_price {
			margin-left: 40%;
			line-height: 50px;
			color: rgba(80, 80, 80, 1);
			font-size: 15px;
			font-weight: bold;
		}

		.top_bottom {
			color: rgba(80, 80, 80, 1);
			font-size: 15px;
			text-align: left;
		}

		.margin_bottom {
			margin-bottom: 10px;
		}

		/* 中间部分 */
		.middle {
			width: 100%;
			height: 85px;
			color: #fb4b5c;
			font-size: 15px;
			line-height: 85px;
			background-color: #f1f1f1;
			text-align: center;
		}

		/* 下部分 */
		.flex {
			display: flex;
			flex-direction: row;
			height: 51px;
			line-height: 51px;
			position: relative;
		}

		.hint1 {
			height: 50px;
			background-color: #fff;
			width: 100%;
		}

		.show_price {
			width: 100%;
			height: 52px;
			color: #fff;
			background-color: #ca89ff;
			font-size: 18px;
			line-height: 52px;
			text-align: center;
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
	}
</style>