<template>
	<view class="main">
		<!-- 储值卡  项目卡  会费卡     -->
		<form @submit="submits" report-submit="true">
			<view class="main_swiper">
				<swiper class="screen-swiper" :class="dotStyle ? 'square-dot' : 'round-dot'" :indicator-dots="true"
					:circular="true" :autoplay="true" interval="3000" duration="500">
					<swiper-item v-for="(item, index) in swiperList" :key="item.imgUrl" @click="swipertap(item)">
						<image :src="item.imgUrl" mode="aspectFill"></image>

					</swiper-item>
				</swiper>
				<view class="map" @click="navigateMap">
					<!--地图入口 -->
					<text class="map_icon">&#xe62e;</text>
					<text class="map_text">{{ getstoreId ? locationname : '定位中...' }}</text>
				</view>
				<view class="introduce" @click="intro_nav">
					<!--门店介绍入口 -->
					<text>门店介绍</text>
				</view>
			</view>
			<view class="line"></view>
			<!-- vip car begin 会员卡和特惠礼包，如果门店未配置，默认该模块自动没有-->
			<view v-if="carlist.length != 0">
				<view class="vip_nav">
					<view class="vip_car_text">
						<view class="birth_icon"><text>&#xe677;</text></view>
						<view class="birth_icon_text"><text>会员卡</text></view>
					</view>
				</view>

				<view class="vip_car">
					<scroll-view scroll-x="true">
						<view class="scoll-wrapper">
							<view v-for="(card, index) in carlist" :key="card.type" class="floor-item1"
								@click="VIPcar_more(card.type)">
								<view class="vip_car_bc" :style="{ 'background-image': card.color }">
									<text class="car_number">{{ card.carclass }}</text>
									<text class="car_name">{{ card.carname }}</text>
									<view class="vipbacimage car">
										<image :src="card.image" mode="aspectFill"></image>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>

			<!-- vip_car end -->
			<view class="line"></view>
			<mpopup ref="mpopup" :isdistance="true"></mpopup>
			<!-- 特惠礼包模块  begin -->
			<view v-if="giftlist.length != 0">
				<view class="gift_nav">
					<view class="gift_text">
						<view class="gift_icon"><text>&#xe624;</text></view>
						<view class="gift_icon_text"><text>特惠礼包</text></view>
					</view>
					<form @submit="submits" report-submit="true">
						<button form-type="submit" type="default" size="mini" class="gift_more" @click="giftmore">
							更多
							<text class="gift_more_text">&#xe604;</text>
						</button>
					</form>
				</view>

				<view class="gift_car">
					<view v-for="(item, index) in giftlist" :key="item.giftId" class="gift" @click="giftDetails(item)">
						<view class="img_verticle">
							<image :src="item.giftImg" mode="aspectFill"></image>
						</view>
						<view class="gift_purchase">立即抢购</view>
						<text class="giftname">{{ item.giftName }}</text>
						<view class="price">
							<view class="gift_price">￥{{ item.giftPricing }}</view>
							<view class="gift_origin">￥{{ item.giftOriginalPrice }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 特惠礼包  end -->
			<view class="line"></view>
			<!-- 项目类别begin -->
			<view style="width: 90%;margin: 0 auto;" v-if="classlist.length > 0">
				<view class="class_nav">
					<view class="class_text">
						<view class="class_icon"><text>&#xe65a;</text></view>
						<view class="class_icon_text"><text>项目类别</text></view>
					</view>
				</view>
				<scroll-view class="nav giftswiper" scroll-x>
					<view class="scoll-wrapper">
						<view v-for="(item, index) in classlist" :key="item.classificationIdOne" class="floor-item"
							@click="projectclassify(item)">
							<image :src="item.updateTime" mode="aspectFill"></image>
							<text class="classname">{{ item.claNameOne }}</text>
						</view>
					</view>
				</scroll-view>
			</view>
			<!-- 项目类别end -->
			<view class="line"></view>
			<!-- 本店手艺人模块	begin -->
			<view style="width: 90%;margin: 0 auto;" v-if="staffList.length > 0">
				<view class="craftman">
					<view class="craft_icon"><text>&#xe65b;</text></view>
					<view class="craft_icon_text"><text>本店手艺人</text></view>
				</view>
				<view style="padding-bottom: 20px;">
					<view class="craftman_line" v-for="(item, index) in staffList" :key="index">
						<view class="craftman_left">
							<view class="" style="display: flex;" @click="craftmanDetails(item.staffId)">
								<view class="craftman_icon">
									<!-- 头像 -->
									<image :src="item.staPhoto" mode="aspectFill"></image>
								</view>
								<view class="craftman_left_explain">
									<!-- 人物解释 -->
									<view class="craftman_left_top">
										<view class="craftman_name">
											<!-- 人物名字 -->
											{{ item.staNickName }}
										</view>
										<view class="craftman_label">
											{{ item.pgJobName }}
											<!-- 人物职位 -->
										</view>
									</view>
									<view class="craftman_left_star">
										<view v-for="(n, i) in item.craftman_left_star" :key="i"><text
												class="craftman_left_star_icon">&#xe616;</text></view>
										<view v-for="(n, index) in 5 - item.craftman_left_star" :key="index"><text
												class="craftman_left_star_icon">&#xe60b;</text></view>
									</view>

									<view class="craftman_left_bottom">Tel:{{ item.staPhone }}</view>
								</view>
							</view>
							<button form-type="submit" type="default" size="mini" class="order_icon"
								@click="chooseOrder(item)">去预约</button>
						</view>
					</view>
				</view>
				<!-- 优惠券弹窗部分 -->
				<view class="cu-modal bottom-modal" :class="modalName == 'payModal' ? 'show' : ''"
					catchtouchmove="disMove">
					<view class="cu_dialog2">
						<view class="bg-imgs"
							style="background-image: url('https://7765-we-63574e-1258830969.tcb.qcloud.la/%E5%9C%86%E8%A7%92%E7%9F%A9%E5%BD%A2%2014.png?sign=1b8809d58eef0b273dbc8c5a51c8d2fd&t=1569219710');">
							<view class="bg-imgs_title">新到的优惠券</view>
							<scroll-view scroll-y="true" style="height: 230px;">
								<view v-for="(item, index) in redpacketList" :key="index"
									style="background-image: url('https://7765-we-63574e-1258830969.tcb.qcloud.la/3.png?sign=e7a5cd5ca87724a1d89307c3ae5cc3a7&t=1569222050');"
									class="bgchild-images">
									<view class="item_name">{{ item.name }}</view>
									<view class="item_price">{{ item.price }}</view>
								</view>
							</scroll-view>

							<view class="getitbtn" @click="getcoupon(item)">立即领取</view>
						</view>
					</view>
					<view class="font closeicon" @tap="hideModal">&#xe652;</view>
				</view>
				<!-- 红包 -->
			</view>
		</form>
		<!-- 本店手艺人模块  end -->
	</view>
</template>
<script>
	import helper from '../../common/helper.js';
	import uniNoticeBar from '@/components/notice-bar/uni-notice-bar.vue';
	const util = require('../../recommend.js');
	export default {
		components: {
			uniNoticeBar
		},
		data() {
			return {
				getstoreId: false,
				modalName: null,
				redpacketList: [{
						name: '50元新人券',
						price: '50'
					},
					{
						name: '50元新人券',
						price: '50'
					},
					{
						name: '50元新人券',
						price: '50'
					},
					{
						name: '50元新人券',
						price: '50'
					}
				],
				show: false,
				locationname: '',
				swiperList: [],
				dotStyle: false,
				towerStart: 0,
				direction: '',
				animate: false,
				// 轮播数据end
				carlist: [{
						carname: '储值卡',
						type: '1',
						carclass: '名姿沙龙',
						image: '../../static/gift/m.png',
						color: 'linear-gradient(45deg, #FC84B5, #FA51A0)',
					},
					{
						carname: '项目卡',
						type: '3',
						carclass: '名姿沙龙',
						image: '../../static/gift/m.png',
						color: 'linear-gradient(45deg, #9E8AF6, #5E3CF0)',

					},
					{
						carname: '年费卡',
						type: '2',
						carclass: '名姿沙龙',
						image: '../../static/gift/m.png',
						color: 'linear-gradient(45deg, rgb(243 191 88), rgb(250 151 81))'
					}
				],
				giftlist: [],
				classlist: [],
				staffList: [],
			};
		},
		onShow() {
			var that = this;
			if (uni.getStorageSync('locationname')) {
				that.locationname = uni.getStorageSync('locationname');
				that.showModal(); //加载红包模块
				that.getstoreId = true;
			}
		},
		onLoad(options) {
			var that = this;
			this.getall().catch(err => {
				if (err) {
					console.log(err)
					uni.showToast({
						title: '网络请求超时,请重试',
						icon: 'none'
					});
				}
			});
			if (!uni.getStorageSync('locationname')) {
				util.getlocation();
				var interval = setInterval(function() {
					if (that.getstoreId == true) {
						clearInterval(interval);
						return;
					}
					if (uni.getStorageSync('locationname')) {
						that.locationname = uni.getStorageSync('locationname');
						that.getstoreId = true;
						that.getall().catch(err => {
							if (err) {
								console.log(err)
								uni.showToast({
									title: '网络请求超时,请重试',
									icon: 'none'
								});
							}
						});
						that.showModal();
						that.loadings(options);
					}
				}, 1000);
			}
			//不需要推荐最近的门店
			if (uni.getStorageSync('locationname')) {
				that.locationname = uni.getStorageSync('locationname');
				that.getstoreId = true;
				that.showModal();
				that.loadings(options);
			}
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: '刷新中',
				mask: true
			});

			this.getall().catch(err => {
				if (err) {
					console.log(err)
					uni.showToast({
						title: '网络请求超时,请重试',
						icon: 'none'
					});
				}
			});
			setTimeout(function() {
				uni.hideLoading();
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			
			// 扫码进入小程序后，对码的内容的处理，比如进入候客区，这个是员工使用的app端才能看到
			loadings(options) {
				if (options.scene) {
					if (!uni.getStorageSync('openId')) {
						setTimeout(function() {
							uni.reLaunch({
									url: '/pages/empty/empty'
								},
								500
							);
						});
						return;
					}
					if (options.scene.length > 5) {
						// x:项目  y:员工  t:类型1项目2礼包  m:金额
						var [severId, staffId, typeId, price] = decodeURIComponent(options.scene)
							.split('&')
							.map(item => {
								return item.split('=')[1];
							});
						var giftId = severId;
						if (typeId == 1) {
							giftId = '';
						} else if (typeId == 2) {
							severId = '';
						}
						if (uni.getStorageSync('openId') === '' || uni.getStorageSync('user') === null) {
							setTimeout(function() {
								uni.reLaunch({
										url: '/pages/empty/empty'
									},
									500
								);
							});
						}
						uni.request({
							method: 'POST',
							url: getApp().globalData.url + `/applet/customer/addPromote`,
							data: {
								staffId: staffId,
								customerId: uni.getStorageSync('user').customerId,
								serveId: severId,
								giftId: giftId,
								promoteAmount: price,
								status: 2
							},
							success: res => {
								console.log(res, '扫码推广');
							}
						});
					} else {
						if (options.scene) {
							uni.setStorageSync('storeId', options.scene);
							if (uni.getStorageSync('openId') === '' || uni.getStorageSync('user') === null) {
								setTimeout(function() {
									uni.reLaunch({
											url: '/pages/empty/empty'
										},
										500
									);
								});
							} else {
								uni.request({
									method: 'POST',
									url: getApp().globalData.url + `/applet/store/addWaitingArea`,
									data: {
										storeId: options.scene,
										customerId: uni.getStorageSync('user').customerId
									},
									success: res => {
										console.log(res, '候客区');
										uni.request({
											method: 'POST',
											url: getApp().globalData.url + '/applet/push/pushToTrans',
											data: {
												title: uni.getStorageSync('user').cusName,
												content: uni.getStorageSync('user').cusName,
												customerId: uni.getStorageSync('user').customerId,
												storeId: options.scene
											},
											success: res => {
												console.log(res, 'app推送');
											}
										});
										if (res.data.result == 'is succeed' || res.data.result == 'success') {
											uni.showToast({
												title: '进入候客区'
											});
										} else if (res.data.result == 'is failure') {
											uni.showToast({
												title: '预约过期请重新开单',
												icon: 'none'
											});
										}
									}
								});
							}
						}
					}
				}
			},
			submits(e) {
				console.log(e.detail.formId);
			},
			getBanner() {
				return new Promise((resolve, reject) => {
					resolve([{
						bodyType: 1,
						imgUrl: '../../static/21.png',
						carouselBody: '' // 公司介绍，富文本内容
					}, {
						bodyType: 1,
						imgUrl: '../../static/banner/3.png',
						carouselBody: '' // 公司介绍，富文本内容
					}]);
				});
			},
			getgiftclass() {
				return new Promise((resolve, reject) => {
					// let pageNum = 1;
					// let pageSize = 3;
					// uni.request({
					// 	method: 'POST',
					// 	url: getApp().globalData.url + '/applet/gift/findGiftList',
					// 	data: {
					// 		storeId: uni.getStorageSync('storeId'),
					// 		pageNumber: pageNum,
					// 		pageCount: pageSize
					// 	},
					// 	success: res => {
					// 		resolve(res.data.result.pageData);
					// 	},
					// 	fail: err => {
					// 		reject(err);
					// 	}
					// });
					resolve([{
						giftImg: '../../static/banner/1.png',
						giftId: 1,
						giftName: '时尚大礼包',
						giftPricing: 99,
						projectMiddles: [{
							projectPrice: 32
						}, {
							projectPrice: 42
						}, {
							projectPrice: 52
						}]
					}, {
						giftImg: '../../static/banner/2.jpg',
						giftId: 2,
						giftName: '染发大礼包',
						giftPricing: 89,
						projectMiddles: [{
							projectPrice: 32
						}, {
							projectPrice: 42
						}, {
							projectPrice: 52
						}]
					}, {
						giftImg: '../../static/banner/4.jpg',
						giftId: 3,
						giftName: '烫发大礼包',
						giftPricing: 199,
						projectMiddles: [{
							projectPrice: 312
						}, {
							projectPrice: 42
						}, {
							projectPrice: 52
						}]
					}]);
				});
			},
			getClass() {
				return new Promise((resolve, reject) => {
					// let storeId = uni.getStorageSync('storeId');
					// let level = 2;
					// uni.request({
					// 	method: 'GET',
					// 	url: getApp().globalData.url +
					// 		`/applet/store/classifyOne/${uni.getStorageSync('mechanismId')}/${storeId}`,
					// 	success: res => {
					// 		resolve(res.data.data);
					// 	},
					// 	fail: err => {
					// 		reject(err);
					// 	}
					// });
					resolve([{
						updateTime: '../../static/banner/5.jpg',
						classificationIdOne: 11,
						claNameOne: '大礼包',
						backstageClassificationTwoVos: [{
							serveNames: ['大礼包111']
						}]
					}]);
				});
			},
			initData() {
				//请求该门店员工
				return new Promise((resolve, reject) => {
					// uni.request({
					// 	method: 'POST',
					// 	url: getApp().globalData.url + '/applet/store/findStaffByStoId',
					// 	data: {
					// 		storeId: uni.getStorageSync('storeId')
					// 	},
					// 	success: res => {
					// 		resolve(res.data);
					// 	},
					// 	fail: err => {
					// 		reject(err);
					// 	}
					// });
					resolve([{
						starLevel: 4,
						staffId: 1,
						staPhoto: '../../static/banner/11.jpg',
						staNickName: '托尼',
						pgJobName: '总监',
						staPhone: 12345678901
					}]);
				});
			},
			async getall() {
				let [banner, giftClass, projectList, staffList] = await Promise.all([this.getBanner(), this
					.getgiftclass(), this.getClass(), this.initData()
				]);
				console.log(banner, giftClass, projectList, staffList)
				// 轮播图
				if (banner.length > 0) {
					this.swiperList = banner;
				}
				// 礼包分类
				this.giftlist = giftClass;
				for (let item of this.giftlist) {
					item.giftOriginalPrice = 0;
					for (let items of item.projectMiddles) {
						item.giftOriginalPrice = item.giftOriginalPrice + items.projectPrice;
					}
				}
				//项目分类
				var j = 0;
				console.log(projectList, 'projectList')
				this.classlist = projectList.filter(item => {
					if (item.backstageClassificationTwoVos.length > 0) {
						var newlists = item.backstageClassificationTwoVos.filter(items => {
							return items.serveNames.length > 0
						})
						return newlists.length > 0
					}

				})
				//手艺人列表
				this.staffList = staffList;
				this.staffList.forEach(item => {
					item.craftman_left_star = item.starLevel ? item.starLevel : 0;
				});
			},
			// 自定义弹出红包
			showModal(e) {
				this.modalName = null;
				// this.modalName = 'payModal'
			},
			hideModal(e) {
				this.modalName = null;
			},
			navigateMap() {
				uni.navigateTo({
					url: '../location/location'
				});
			},
			swipertap(item) {
				if (item.bodyType == 1) {
					uni.navigateTo({
						url: '../swipernav/swipernav?bodyType=' + item.bodyType + '&carouselBody=' + item
							.carouselBody
					});
				} else {
					uni.navigateTo({
						url: '../swipernav/swipernav'
					});
				}
			},
			VIPcar_more(index) {
				console.log(index)
				uni.navigateTo({
					url: '../VIPcar/VIPcar?index=' + index
				});
			},
			disMove() {},
			giftmore() {
				uni.navigateTo({
					url: '../giftmore/giftmore'
				});
			},
			intro_nav() {
				var storeId = uni.getStorageSync('storeId');
				uni.navigateTo({
					url: '../store_intro/store_intro?storeId=' + storeId
				});
			},
			projectclassify(item) {
				// uni.requestSubscribeMessage({
				// 	tmplIds: ['6brTQPBABapV_s6S4sCGJD-7hMW_UyB8XZFFrhV3wj4',
				// 		'ZCcGR13xaJ9lgC4hrrSaXH7FJVnGfKfjxdoaZpY30GA',
				// 		'Pbzp5xLY2C4F_EkLWX5gwEeDI55US-Ml3OocmYn3ZBw'
				// 	],
				// 	success(res) {
				// 		console.log(res);
				// 	},
				// 	fail(res) {
				// 		console.log(res);
				// 	}
				// });
				uni.navigateTo({
					url: '../projectclassify/projectclassify?classificationId=' + item.classificationIdOne
				});
			},
			craftmanDetails(e) {
				uni.navigateTo({
					url: '../craftsman/craftmanDetails?id=' + e
				});
			},
			chooseOrder(item) {
				uni.navigateTo({
					url: '../index/chooseOrder'
				});
			},
			giftDetails(item) {
				// uni.requestSubscribeMessage({
				// 	tmplIds: ['6brTQPBABapV_s6S4sCGJD-7hMW_UyB8XZFFrhV3wj4',
				// 		'ZCcGR13xaJ9lgC4hrrSaXH7FJVnGfKfjxdoaZpY30GA',
				// 		'Pbzp5xLY2C4F_EkLWX5gwEeDI55US-Ml3OocmYn3ZBw'
				// 	],
				// 	success(res) {
				// 		console.log(res);
				// 	},
				// 	fail(res) {
				// 		console.log(res);
				// 	}
				// });
				uni.navigateTo({
					url: '../giftdetails/giftdetails?giftId=' + item.giftId + '&giftPrice=' + item.giftPricing
				});
			},


			formMore() {
				uni.navigateTo({
					url: '../index/inform'
				});
			},
			indexf(index) {
				// index == 0?return true: false
				if (index == 0) return true;
				else if (index == 1) return false;
			},
			// 获取优惠券
			getcoupon(item) {
				this.modalName = null;
				uni.showToast({
					title: '领取成功',
					icon: 'success'
				});
			}
		}
	};
</script>
<style scoped>
	.isbackground {
		width: 100%;
		height: 50px;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 96;
		transition: all 0.3s ease-in-out;
	}

	.getMessageBotton {
		width: 90px;
		height: 30px;
		line-height: 30px;
		text-align: center;
		background-color: #e5cb30;
		margin: auto;
		border-radius: 50px;
	}

	.isbackgroundname {
		width: 60%;
		height: 50px;
		line-height: 50px;
		font-size: 16px;
		color: #fff;
		text-align: center;
	}

	/* 加载更多 */
	.uni-loadmore {
		height: 80upx;
		line-height: 80upx;
		text-align: center;
		padding-bottom: 30upx;
	}

	/* 红包 */
	.item_name {
		color: #ff0107;
		font-size: 23px;
		position: absolute;
		top: 24%;
		left: 11%;
		font-weight: bold;
	}

	.cu_dialog2 {
		display: inline-block;
		vertical-align: middle;
		height: 340px;
		width: 80%;
		overflow: hidden;
		position: fixed;
		top: 15%;
		left: 10%;
		right: 10%;
	}

	.getitbtn {
		/* position: ; */
		width: 80%;
		background-image: linear-gradient(180deg, #ff8b00, #ff9700);
		position: absolute;
		bottom: 20px;
		left: 10%;
		color: #fff;
		font-size: 16px;
		border-radius: 30px;
		text-align: center;
		height: 40px;
		line-height: 40px;
	}

	.item_price {
		color: #f57709;
		font-size: 20px;
		position: absolute;
		top: 44%;
		right: 17%;
		font-weight: bold;
	}

	.bg-imgs {
		height: 100%;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.bg-imgs_title {
		color: #fff;
		font-size: 22px;
		height: 45px;
		line-height: 45px;
		text-align: center;
		padding-top: 8px;
	}

	.bgchild-images {
		position: relative;
		height: 115px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	/* .cu-modal1 {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 1110;
}
.cu-modal1.show {
	opacity: 1;
	transition-duration: 0.3s;
	-ms-transform: scale(1);
	transform: scale(1);
	overflow-x: hidden;
	overflow-y: auto;
	pointer-events: auto;
}
 
.cu-dialog {
	position: relative;
	display: inline-block;
	vertical-align: middle;
	height: 300px;
	background-color: #f8f8f8;
	border-radius: 5px;
	width: 70%;
	overflow: hidden;
	left: 15%;
	right:15%;
	top: 100px;
} */
	.redcircle {
		position: absolute;
		top: -33px;
		left: 30px;
		z-index: 99999;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: blue;
	}

	.msgicon {
		position: fixed;
		top: 0px;
		left: 0px;
		font-size: 20px;
	}

	.main_swiper {
		position: relative;
	}

	swiper {
		height: 160px !important;
	}

	.screen-swiper {
		min-height: 160px !important;
	}

	.main {
		position: relative;
	}

	/* 地图图标  begin */
	.map {
		height: 31px;
		color: rgba(255, 255, 255, 1);
		background-color: rgba(56, 56, 56, 1);
		border-radius: 15px;
		line-height: 31px;
		text-align: center;
		position: absolute;
		top: 14px;
		left: 18px;
		padding: 0 10px;
	}

	.map_icon {
		font-family: iconfont;
		/* 引入图标 */
		color: #fff;
		font-size: 19px;
		/* vertical-align: text-bottom; */
	}

	.map_text {
		color: #ffffff;
		font-size: 12px;
		line-height: 20px;
		margin-left: 2px;
		vertical-align: text-bottom;
	}

	/* 地图图标  end */

	/* 门店介绍begin*/
	.introduce {
		width: 77px;
		height: 31px;
		position: absolute;
		right: 14px;
		top: 14px;
		opacity: 0.7;
		color: rgba(255, 255, 255, 1);
		background-color: rgba(56, 56, 56, 1);
		border-radius: 16px;
		font-size: 14px;
		line-height: 31px;
		text-align: center;
	}

	/* 门店介绍end */

	/* 轮播消息模块 */
	.marquee {
		width: 100%;

		height: 50px;

		align-items: center;

		color: #3a3a3a;

		background-color: white;

		display: flex;

		box-sizing: border-box;

		overflow: hidden;
	}

	.formicon {
		color: red;
		text-align: right;
		padding-right: 12px;
		font-size: 20px;
		width: 13%;
		margin: auto 0;
		margin-left: 5%;
	}

	.marquee_box {
		display: block;

		position: relative;
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 30px;
		overflow: hidden;
		margin: 10px 0;
	}

	.marquee_list {
		display: block;
		width: 80%;
		padding-left: 0px;
		padding-top: 2px;
	}

	.marquee_top {
		transition: all 0.5s;

		margin-top: -30px;
	}

	.form_more {
		display: flex;
		flex-direction: row;
		width: 20%;
		margin: auto 0;
	}

	.marquee_list li {
		height: 30px;
		width: 90%;
		line-height: 30px;

		font-size: 13px;
		list-style: none;
	}

	.marquee_list li span {
		padding: 0 2px;
	}

	/* vipcar导航栏	begin */
	.vip_nav {
		/* border-top: 10px solid #e5e5e5; */
		display: flex;
		flex-direction: row;
		width: 90%;
		margin: 0 auto;
		height: 65px;
		line-height: 65px;
		/* margin-top: 10px; */
	}

	.vip_car_text {
		/* margin-left: 14px; */
		/* width: 50%;*/
		display: flex;
		flex-direction: row;
	}

	.birth_icon {
		font-family: iconfont;
		font-size: 40rpx;
		color: rgba(56, 56, 56, 1);
		/* line-height: 50px; */
	}

	.birth_icon_text {
		/* margin-left: 6px; */
		color: rgba(80, 80, 80, 1);
		font-size: 16px;
		/* display: block; */

		/* margin-bottom: 20px; */
		/* margin-left: 6px; */
		/* line-height: 50px; */
	}

	.vip_more {
		font-size: 15px;

		/* line-height: 50px; */
		position: absolute;
		right: 4%;
	}

	.vip_more_text {
		/* font-size: 18px; */
		font-family: iconfont;
		color: rgba(80, 80, 80, 1);
	}

	/* vipcar 导航open-data栏end */
	/* vip 卡片区域begin */

	.vip_car {
		width: 90%;
		height: 110px;
		overflow: hidden;
		overflow-x: scroll;
		display: flex;
		margin: 0 auto;
	}

	.car {
		width: 48%;
		margin: 1%;
		/* margin: 0 10px 0 10px; */
	}

	.vip_car_bc {
		width: 205px;
		height: 95px;
		color: #fff;
		border-radius: 5px;
		position: relative;
	}

	.car_name {
		position: absolute;
		left: 13%;
		top: 57%;
		font-size: 15px;

		/* font-family: 'Times New Roman'; */
	}

	.car_number {
		position: absolute;
		left: 12%;
		bottom: 51%;
		font-size: 19px;
	}

	.vipbacimage {
		width: 52px;
		height: 60px;
		position: absolute;
		right: 6%;
		top: 10%;
	}

	.vipbacimage image {
		width: 52px;
		height: 60px;
		position: absolute;
		right: 5%;
		top: 10%;
	}

	/* vip卡片区域end */
	.line {
		width: 100%;
		height: 10px;
		background-color: #f2f3f3;
	}

	/* 特惠礼包模块开始 */
	.gift_nav {
		display: flex;
		flex-direction: row;
		width: 90%;
		margin: 0 auto;
		height: 65px;
		position: relative;
		line-height: 65px;
	}

	.gift_text {
		/* margin-left: 10px; */
		/* width: 50%;*/
		display: flex;
		flex-direction: row;
	}

	.gift_icon {
		font-family: iconfont;
		font-size: 36rpx;
		color: rgba(56, 56, 56, 1);
		/* line-height: 50px; */
	}

	.gift_icon_text {
		/* margin-left: 6px; */
		color: rgba(80, 80, 80, 1);
		font-size: 16px;
		/* display: block; */

		/* margin-bottom: 20px; */
		margin-left: 6px;
		/* line-height: 50px; */
	}

	.gift_more {
		font-size: 15px;
		background-color: #fff !important;
		/* line-height: 50px; */
		position: absolute;
		right: -9px;
		top: 14px;
	}

	.gift_more_text {
		/* font-size: 18px; */
		font-family: iconfont;
		color: rgba(80, 80, 80, 1);
	}

	.closeicon {
		position: absolute;
		top: 450px;
		left: 44%;
		color: #fff;
		font-size: 40px;
	}

	.gift_car {
		width: 90%;
		margin: 0 auto;
		height: 200px;
		overflow: hidden;
		overflow-x: scroll;
		display: flex;
		flex-direction: row;
		/* padding: 0 10px 0 0; */
	}

	.gift {
		width: 32%;
		/* padding-left: 10px; */
		/* margin: 0 10px 0 10px; */
		position: relative;
		display: flex;
		flex-direction: column;
		text-overflow: ellipsis;
		/*文字隐藏后添加省略号*/
		white-space: nowrap;
		/*强制不换行*/
		/* flex-flow: nowrap; */
		overflow: hidden;
		margin: 0 1%;
	}

	.img_verticle {
		display: flex;
		flex-direction: row;
		height: 125px;
		width: 100%;
		border-radius: 3px;
	}

	.gift image {
		width: 100%;
		height: 125px;
		/* margin-left: 3px; */
		border-radius: 3px;
	}

	.gift_purchase {
		width: 100%;
		height: 25px;
		position: absolute;
		bottom: 75px;
		color: rgba(255, 255, 255, 1);
		background-color: #fb4b5c;
		border-bottom-left-radius: 3px;
		border-bottom-right-radius: 3px;
		font-size: 13px;
		text-align: center;
		line-height: 25px;
	}

	.giftname {
		position: absolute;
		bottom: 42px;
		color: rgba(80, 80, 80, 1);
		font-size: 12px;
		text-align: center;
		/*  */
	}

	.price {
		display: flex;
		flex-direction: row;
		position: absolute;
		bottom: 13px;
		width: 100%;
	}

	.gift_price {
		color: #fb4b5c;
		font-size: 18px;
	}

	.gift_origin {
		color: rgba(166, 166, 166, 1);
		font-size: 14px;
		text-align: left;
		position: absolute;
		left: 60px;
		/* margin-bottom: 2px; */
		bottom: 0px;
		text-decoration: line-through;
	}

	/* 特惠礼包截杀 */
	/* <!-- 项目类别begin --> */
	.class_nav {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 65px;
		line-height: 65px;
	}

	.class_text {
		/* margin-left: 18px; */
		/* width: 50%;*/
		display: flex;
		flex-direction: row;
	}

	.class_icon {
		font-family: iconfont;
		font-size: 40rpx;
		color: rgba(56, 56, 56, 1);
		/* line-height: 50px; */
	}

	.class_icon_text {
		/* margin-left: 6px; */
		color: rgba(80, 80, 80, 1);
		font-size: 16px;
		/* display: block; */

		/* margin-bottom: 20px; */
		margin-left: 6px;
		/* line-height: 56px; */
	}

	.giftswiper {
		width: 100%;
		height: 145px;
		/* padding: 11px 13px 0px 21px; */
	}

	.scoll-wrapper {
		width: 100%;
		display: flex;
	}

	.floor-item {
		display: flex;
		flex-direction: column;
		width: 200upx;
		height: 250rpx;
		margin-right: 20upx;
		font-size: 14px;
		color: #007aff;
		text-align: center;
	}

	.floor-item1 {
		display: flex;
		flex-direction: column;
		/* width: 200upx; */
		height: 250rpx;
		margin-right: 20upx;
		font-size: 14px;
		color: #007aff;
		text-align: center;
	}

	.floor-item image {
		width: 200upx;
		height: 200rpx;
		/* border-radius: 23px; */
	}

	.classname {
		color: rgba(80, 80, 80, 1);
		font-size: 15px;
		text-align: center;
		/*  */
		margin-top: 8px;
	}

	/* <!-- 项目类别end --> */

	/* <!-- 本店手艺人模块	begin --> */

	.craftman {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 65px;
		line-height: 65px;
	}

	.craft_icon {
		font-family: iconfont;
		font-size: 50rpx;
		color: rgba(56, 56, 56, 1);
		line-height: 65px;
		/* margin-left: 20px; */
	}

	.craft_icon_text {
		/* margin-left: 6px; */
		color: rgba(80, 80, 80, 1);
		font-size: 16px;
		/* display: block; */

		/* margin-bottom: 20px; */
		margin-left: 6px;
		/* line-height: 56px; */
	}

	.craftman_line {
		padding: 22px 0px 11px 0px;
		position: relative;
		border-bottom: 1px solid #f1f1f1;
	}

	.craftman_left {
		display: flex;
		flex-direction: row;
	}

	.craftman_icon {
		width: 90px;
		height: 80px;
		border-radius: 4px;
	}

	.craftman_icon image {
		width: 90px;
		height: 80px;
		border-radius: 4px;
		margin-right: 15px;
	}

	.craftman_left_explain {
		display: flex;
		flex-direction: column;
		margin-left: 20px;
	}

	.craftman_left_top {
		display: flex;
		flex-direction: row;
		margin-bottom: 8px;
	}

	.craftman_name {
		color: rgba(80, 80, 80, 1);
		font-size: 13px;
		text-align: left;
		font-weight: bold;
		margin: auto 0;
	}

	.craftman_label {
		color: rgba(255, 255, 255, 1);
		background-color: rgba(212, 48, 48, 1);
		border-radius: 4px;
		font-size: 11px;
		text-align: center;
		margin-left: 10px;
		padding: 3px 7px;
	}

	.craftman_left_star {
		font-size: 15px;
		color: rgba(255, 141, 26, 1);
		display: flex;
		flex-direction: row;
		margin-bottom: 5px;
	}

	.craftman_left_star_icon {
		font-family: iconfont;
		font-size: 12px;
		margin: 0 2px;
	}

	.craftman_left_bottom {
		color: rgba(80, 80, 80, 1);
		margin-top: 7px;
	}

	.craftman_left_bottom_label {
		width: 66px;
		height: 22px;
		color: rgba(80, 80, 80, 1);
		/* background-color: rgba(204, 204, 204, 1); */
		border: 1px solid rgba(204, 204, 204, 1);
		border-radius: 12px;
		font-size: 11px;
		line-height: 22px;
		margin-right: 7px;
		text-align: center;
		/* letter-spacing: 0.5px; */
	}

	.order_icon {
		position: absolute;
		width: 70px;
		height: 32px;
		bottom: 44rpx;
		right: 0px;
		color: rgba(255, 255, 255, 1);
		background-color: #fd4571;
		border-radius: 20px;
		font-size: 13px;
		text-align: center;
		line-height: 32px;
	}

	/*<!-- 本店手艺人模块  end --> */
	.fromicon {
		font-size: 25px;
		color: rgba(255, 255, 255, 1);
	}

	form button {
		padding: 0;
	}

	form button::after {
		content: '';
		display: none;
	}
</style>