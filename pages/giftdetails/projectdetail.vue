<template>
	<view class="main">
		<button class="top" open-type="share">
			<image :src="data.pictureId" mode="aspectFill"></image>
			<view class="share_icon">
				&#xe633;
			</view>
		</button> <!-- 图片top -->
		<!-- 信息介绍部分begin -->
		<view class="top_message">
			<view class="flex_row">
				<view class="name">
					{{data.serveName?data.serveName:''}}
				</view>
				<view class="" v-if="beginshop" style="margin: auto 0;margin-right: 80px;">
					<view class="uni-countdown">
						<view class="uni-countdown__number"><text v-if="hour == 0">0</text>{{hour}}</view>
						<view class="uni-countdown__splitor">:</view>
						<view class="uni-countdown__number"><text v-if="minute == 0">0</text>{{minute}}</view>
						<view class="uni-countdown__splitor">:</view>
						<view class="uni-countdown__number">{{second}}</view>
					</view>
				</view>
				<view class="" v-else style="margin: auto 0;">
					该团购已结束！
				</view>
				<view class="care_icon font" @click="ifCareclik">
					<text v-if="ifcare">{{ifcare? '&#xe609;' : '&#xe630;'}}</text>
					<text style="color: rgba(80, 80, 80, 1);font-size: 14px;padding-left: 4px;">关注</text>
				</view>
			</view>

			<view class="flex_row">
				<view class="price_intro">
					价格：￥{{price}}
				</view>
			</view>
		</view>
		<!-- 信息介绍部分end -->
		<!-- /* 团购部分bengin */ -->
		<view class="bulk_modul">
			<view class="spell_title">
				团购拼单
			</view>
			<view class="spell_title_ex">
				本项目拼团成功后，项目不可退，如果拼单失败钱将原路退回
			</view>
			<view class="spell_message">
				<view class="directorlist flex_row" v-for="(item,index) in directorlist" :key="index" v-if="beginshop">
					<view class="director_name">{{item.pgJobName}}：</view>
					<view class="director_name">
						{{item.numberPerson}}人成群
					</view>
					<view class="director_name">
						￥{{item.yuanTime}}元/人/次
					</view>
					<!-- <button  open-type="share" class="spell_btn"> -->
					<button @click='payIt(index)' class="spell_btn">
						立即拼单
					</button>
				</view>
				<view class="" v-else style="text-align: center;margin: 20px 0;">
					暂无可抢购项目~
				</view>
			</view>
		</view>
		<tui-modal :show="modal" @click="handleClick" @cancel="hide" title="提示" content="是否分享拼单？"></tui-modal>
		<!-- /* 团购部份end */ -->
		<!-- 支付层页面begin -->

		<!-- 支付层页面end -->
		<!-- 优惠券部分begin -->
		<!-- <view class="coupons_modul">
				<view class="coupons" v-for="(it,index) in coupons" :key="index">
					<view class="coupons_price">
						{{it.coupons_price}}
					</view>
					<view class="coupons_prompt">
						{{it.coupons_prompt}}
					</view>
					<view class="to_receive" @click="getclick(index)">
						<text v-if="it.occupy">已领</text>
						<text v-else>领取</text>
					</view>
				</view>
			</view> -->
		<!-- 优惠券部分end -->
		<!-- 项目介绍begin -->
		<view class="intro_modul">
			<view class="intro_text">
				项目介绍
			</view>
			<view class="text" v-html="data.serverParticulars" style="margin: 0 5%;"></view>
			<!-- 				<view class="intro_text">
					项目介绍
				</view>
				<view class="intro_image">
					<image :src="src" mode="aspectFill"></image>
				</view>
				<view class="intro_word">
					  为了借助社交产品的流量，让用户主动分享APP中的内容到社交平台来达到拉新和促活的目的，市场上绝大多数APP都有第三方分享的功能，它是内容分发的最有效途径，并且大大降低了企业的营销成本。
				</view> -->
		</view>
		<view class="occupymodal">

		</view>
		<!-- 项目end -->
		<view class="botton" @click="OrderProject">
			预约此项目
		</view>
	</view>
</template>

<script>
	import tuiButton from "@/components/button/button"
	import tuiModal from "@/components/modal/modal"
	export default {
		components: {
			tuiButton,
			tuiModal
		},
		data() {
			return {
				id: '',
				ifcare: false,
				src: '',
				name: '',
				intro: '',
				time: '',
				price: '',
				cureent: -1,
				data: {},
				winHeight: '',
				second: 0,
				hour: 0,
				minute: 0,
				beginshop: false,
				price_intro: '',
				directorlist: [],

				modalName: null,
				bussname: '',
				// price:'￥789.00',
				bankcard: '',
				serveId: '',
				serveName: '',
				seconds: 0,
				timer: null,
				projectConcernId: 0,
				modal: false,
				list: ''
			};
		},
		onLoad(e) {
			// if (!uni.getStorageSync('openId') || uni.getStorageSync('user').length == 0) {
			// 	setTimeout(function() {
			// 		uni.reLaunch({
			// 			url: '/pages/empty/empty'
			// 		}, 500)
			// 	})
			// }
			this.serveId = 1
			this.id = 2
			this.getData()
			this.getgroup()
			let that = this;
			//  高度自适应
			uni.getSystemInfo({
				success: function(res) {
					// console.log(res)
					let calc = res.windowHeight + 130;
					that.winHeight = calc;
				}
			});
		},
		methods: {
			onShareAppMessage: function() {
				return {
					title: '你的好友给您发了拼单项目,快来加入吧',
					desc: '分享页面的内容',
					path: 'pages/giftdetails/projectdetail?serveId=' + this.serveId + '&classificationId=' + this.id // 路径，传递参数到指定页面。
				}
			},
			payIt(index) {
				var openId = uni.getStorageSync('openId')
				if (!openId) {
					uni.reLaunch({
						url: '../empty/empty'
					})
					return;
				}
				var that = this
				uni.request({
					url:getApp().globalData.url + `/applet/groupBuying/selectIsGroupBuying/${that.list.groupBuyingId}/${uni.getStorageSync('user').customerId}`,
					method: 'POST',
					header: {
							"Content-Type": "application/json" //如果为空，加上头部接收     
						},
					success: (res) => {
						if(res.data.data == 1) {
							uni.showToast({
								title: '已经成功加入拼单，请勿重复拼单',
								icon: 'none'
							})
						}else {
							uni.request({ //获取购物券
								method: 'POST',
								url: getApp().globalData.url + '/wx/wxPay', //保存所选会员卡回滚
								data: {
									/** 是否团购*/
									isGroupBuying:1,
									/** 团购id*/
									groupBuyingId:that.list.groupBuyingId,
									payAmount: 0.01,
									openId: openId,
									tradeType: 'JSAPI',
									mechanismId: uni.getStorageSync('mechanismId'),
									typeId: 5 //项目相关
								},
								header: {
									"Content-Type": "application/json" //如果为空，加上头部接收     
								},
								success: (res) => {
									uni.requestPayment({
										timeStamp: res.data.data.timeStamp, //记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了
										nonceStr: res.data.data.nonceStr,
										package: `prepay_id=${res.data.data.prepayId}`,
										signType: res.data.data.signType,
										paySign: res.data.data.sign,
										success: function(event) {
											// success   
											console.log(event);
											if (event.errMsg == "requestPayment:ok") {
												var backstageGroupBuyingOrder = {}
												backstageGroupBuyingOrder.mechanismId = uni.getStorageSync('mechanismId'),
													backstageGroupBuyingOrder.storeId = uni.getStorageSync('storeId'),
													backstageGroupBuyingOrder.groupBuyingId = that.list.groupBuyingId,
													backstageGroupBuyingOrder.postGradeId = that.directorlist[index].postGradeId,
													backstageGroupBuyingOrder.serveId = that.list.serveId
												var backstageSpellGroup = {}
												backstageSpellGroup.customerId = uni.getStorageSync('user').customerId,
													backstageSpellGroup.spellGroupAmount = that.directorlist[index].yuanTime,
													backstageSpellGroup.serveId = that.list.serveId,
													backstageSpellGroup.paymentMethod = 1
												uni.request({
													method: 'POST',
													url: getApp().globalData.url + `/applet/groupBuying/spellGroup`,
													data: {
														"backstageGroupBuyingOrder": backstageGroupBuyingOrder,
														"backstageSpellGroup": backstageSpellGroup
													},
													header: {
														"Content-Type": "application/json" //如果为空，加上头部接收
													},
													success: (res) => {
														console.log(res)
														if(res.data.result != 'OK') {
															that.modal = true
														}
														
													},
													fail: (err) => {
														uni.showToast({
															title: '网络请求超时,请重试',
															icon: 'none'
														})
							
													},
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
						}
					}
				})
				

			},
			handleClick(e) {
				let index = e.index;
				if (index === 0) {
					this.modal = false
				} else {
					this.modal = false
				}
				this.hide()
			},
			show() {
				this.modal = true
			},
			hide() {
				this.modal = false
			},
			getgroup() {
				uni.request({
					method: 'POST',
					url: getApp().globalData.url + `/applet/groupBuying/findGroupInfoByServeId`,
					data: {
						serveId: this.serveId
						// serveId:154
					},
					header: {
						"Content-Type": "application/x-www-form-urlencoded" //如果为空，加上头部接收
					},
					success: (res) => {
						console.log(res)
						this.list = res.data.result
						if (res.data.result != null) {
							this.serveId = res.data.result.serveId
							this.directorlist = res.data.result.groupBuyingRelevanceList
							if (res.data.result.hhMmSs == '00:00:00') {
								this.beginshop = false
							} else {
								var time = res.data.result.hhMmSs
								this.hour = time.split(':')[0]
								this.minute = Number(time.split(':')[1])
								this.second = Number(time.split(':')[2])
								this.startData()
								this.beginshop = true
							}

						}

					},
					fail: (err) => {
						uni.showToast({
							title: '网络请求超时,请重试',
							icon: 'none'
						})
						uni.hideLoading()
					}
				})
			},
			endproject() {
				var groupBuyingRelevanceList = []
				for (var item of this.directorlist) {
					groupBuyingRelevanceList.push({
						postGradeId: item.postGradeId
					})
				}
				uni.request({
					method: 'POST',
					url: getApp().globalData.url + `/applet/groupBuying/updateStatus`,
					data: {
						"groupBuyingId": this.directorlist[0].groupBuyingId,
						"serveId": this.serveId,
						"groupBuyingRelevanceList": groupBuyingRelevanceList
					},
					header: {
						"Content-Type": "application/x-www-form-urlencoded" //如果为空，加上头部接收
					},
					success: (res) => {
						console.log(res, '1111111111111')
					}
				})
			},
			startData() {
				this.seconds = this.toSeconds(this.hour, this.minute, this.second)
				if (this.seconds <= 0) {
					this.beginshop = false

					return
				}
				this.countDown()
				this.timer = setInterval(() => {
					this.seconds--
					if (this.seconds < 0) {
						this.endproject()
						this.beginshop = false
						this.timeUp()
						return
					}
					this.countDown()
				}, 1000)
			},
			toSeconds(hours, minutes, seconds) {
				console.log((hours * 60 * 60) + (minutes * 60) + seconds, '1111')
				return (hours * 60 * 60) + (minutes * 60) + seconds
			},
			timeUp() {
				clearInterval(this.timer)
			},
			countDown() {
				let seconds = this.seconds
				let [hour, minute, second] = [0, 0, 0]
				if (seconds > 0) {
					hour = Math.floor(seconds / (60 * 60))

					minute = Math.floor(seconds / 60) - (hour * 60)
					second = Math.floor(seconds) - (hour * 60 * 60) - (minute * 60)
				} else {
					this.timeUp()
				}
				if (hour < 10) {
					hour = '0' + hour
				}
				if (minute < 10) {
					minute = '0' + minute
				}
				if (second < 10) {
					second = '0' + second
				}
				this.hour = hour
				this.minute = minute
				this.second = second
			},
			getData() {
							const result = {
								specialOffer: 199,
								serveId: 1,
								serverParticulars: '超高性价比，时尚最前头',
								isConcern: 1,
								projectConcernId: 1,
								serveName: '时尚大礼包'
							}
							// console.log(this.data,'11111111111')
							this.data = result
							this.price = result.specialOffer
							this.serveId = result.serveId
							this.serverParticulars = result.serverParticulars
							if (result.isConcern == 0) {
								this.ifcare = false
							} else {
								this.ifcare = true
							}
							this.projectConcernId = result.projectConcernId
							this.serveName = result.serveName
							this.data.pictureId = '../../static/banner/1.png'
							var list = uni.getStorageSync('projectList')
							var book = 0
							if (list != '') {
								for (var i = 0; i < list.length; i++) {
									if (list[i].id == this.serveId) {
										book = 1
									}
								}
								if (book == 0) {
									list.push({
										id: this.serveId,
										src: this.data.pictureId,
										list_name: this.serveName,
										list_intro: this.data.serverParticulars,
										list_price: this.price
									})
								}

							} else {
								var list = []
								list.push({
									id: this.serveId,
									src: this.data.pictureId,
									list_name: this.serveName,
									list_intro: this.data.serverParticulars,
									list_price: this.price
								})
							}
							console.log(list, 'list')
							uni.setStorageSync('projectList', list)

				
			},
			// onShareAppMessage: function (res) {
			//    if (res.from === 'button') {
			//      // 来自页面内转发按钮
			//      console.log(res.target)
			//    }
			//    return {
			//      title: '礼包分享',
			//      path: '/pages/giftdetails/projectdetail'
			//    }
			// 				// 当分享出去的卡片被点击时，在页面的onLoad(options){}，options参数中接收
			//  },
			showModal(e) {
				// this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			getclick(index) {
				this.coupons[index].occupy = true
				// console.log(this.coupons)
			},
			OrderProject() {
				var that = this
				uni.showModal({
					title: '提示',
					content: '该订单为到店支付',
					success: function(res) {
						if (res.confirm) {

							console.log(that.id, that.price, that.serveId)
							uni.navigateTo({
								url: "../craftsman/craftsman?id=" + that.id + '&serveName=' + that.serveName + '&price=' + that.price +
									'&serveId=' + that.serveId
							})
						} else if (res.cancel) {
							uni.showToast({
								title: '取消预约',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						uni.showToast({
							title: '网络请求超时,请重试',
							icon: 'none'
						})
					}
				});

			},
			ifCareclik() {
				if (this.ifcare == false) {
					uni.request({
						method: 'POST',
						url: getApp().globalData.url + '/applet/project/insertProjectConcern',
						data: {
							projectId: this.serveId,
							userId: uni.getStorageSync('user').customerId,
							storeId: uni.getStorageSync('storeId')
						},
						success: (res) => {
							if (res.data.result == 'SUCCESS') {
								uni.showToast({
									title: '关注成功'
								});
							}
						},
						fail: (err) => {
							uni.showToast({
								title: '网络请求超时,请重试',
								icon: 'none'
							})
						}
					})
				} else {
					uni.request({
						method: 'GET',
						url: getApp().globalData.url + `/applet/project/deleteProjectConcernById/${this.projectConcernId}`,
						success: (res) => {
							if (res.data.result == 'SUCCESS') {
								uni.showToast({
									title: '取消成功'
								});
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
				this.ifcare = !this.ifcare;
			},
		}
	};
</script>

<style scoped lang="scss">
	$countdown-height:44upx;

	.uni-countdown {
		padding: 2upx 0;
		display: inline-flex;
		flex-wrap: nowrap;
		justify-content: center;

		&__splitor {
			justify-content: center;
			line-height: $countdown-height;
			padding: 0 5upx;
			font-size: $uni-font-size-base;
			color: #000;
		}

		&__number {
			line-height: $countdown-height;
			justify-content: center;
			height: $countdown-height;
			border-radius: $uni-border-radius-base;
			margin: 0 5upx;
			font-size: $uni-font-size-base;
			border: 1px solid #000000;
			font-size: $uni-font-size-sm;
			padding: 0 10upx;
			color: #FFFFFF;
			background-color: #FF6100;
			border-color: #FF6100;
		}
	}

	.main {
		/* position: absolute; */
		bottom: 0px;
		top: 0px;
		background-color: #fff !important;
		width: 100%;
		/* height: 100%; */

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
		border-bottom: 5px solid rgba(229, 229, 229, 1);
	}

	.name {
		width: 50%;

		height: 24px;
		color: rgba(80, 80, 80, 1);
		font-size: 16px;
		text-align: left;
		font-weight: bold;
		margin: 15px 0 10px 14px;
	}

	.intro {
		padding-top: 10px;
		padding-left: 5px;
		color: rgba(166, 166, 166, 1);
		font-size: 14px;
		text-align: left;
		margin: auto 24upx;
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
		bottom: 18px;
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
		margin-top: 8px;
	}

	.spell_title_ex {
		color: #AAAAAA;
		font-size: 13px;
		margin-left: 14px;
		padding: 10px 0;
	}

	.directorlist1 {
		display: flex;
		flex-direction: row;
		margin-bottom: 10px;

	}

	.bulk_modul {
		border-bottom: 5px solid rgba(229, 229, 229, 1);
	}

	.director {
		width: 100%;
		padding: 8px 0 0 28px;
		display: flex;
		flex-direction: row;
		color: #F14D5C;
	}

	.director_name {
		width: 25%;
		font-size: 14px;
		/* padding-top: 5px; */
		text-align: center;
		margin: auto 0;
		color: #F8B551;

	}

	.directorlist {
		font-size: 14px;
		padding: 10px 0;
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
		width: 25%;
		padding-top: 5px;
	}

	.manager_price {
		/* margin-right: 15px; */
		width: 35%;
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
		right: 0;
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
