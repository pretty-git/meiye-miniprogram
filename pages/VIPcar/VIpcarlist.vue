<template>
	<view class="">
		<view class="cu-bar back-top">
			<view class="action" style="width: 100%;">
				<view class="text-df margin-right-sm" style="width: 80%;">开启会员卡过期提醒</view>
				<switch class="sm" @change="SerShadow"></switch>
			</view>
		</view>
		<view class="main">
			<view class="vip_car_bc" v-for="(item,index) in carlist" :key="item.openChargeCardId"
				@click="vipcarlist_detail(item.openChargeCardId)">
				<view>
					<view class="vip_car_circle"><!-- 小圆圈 --></view>
					<text class="car_name">{{item.cardName}}</text>
					<text class="car_number">{{item.occNumber }}</text>
					<view class="" v-if="item.numberUse == 0">
						<text class="car_time">无限期</text>
					</view>
					<view class="" v-else>
						<text class="car_time" v-if="item.cardType == 3"> 剩余次数：{{item.numberUse}}</text>
						<text class="car_time" v-if="item.cardType == 1 || item.cardType == 4">
							剩余金额：￥{{item.occPaymentAmount}}</text>
						<text class="car_time" v-if="item.cardType == 2"> </text>
					</view>
					<view class="rencentUse" v-if="item.recentUse">最近使用</view>
				</view>
			</view>
			<view class="" style="height: 60px;width: 100%;	">

			</view>
		</view>
		<mpopup ref="mpopup" :isdistance="true"></mpopup>
		<view class="add_newcar" @click="addnewcar">
			+ 办张新的会员卡
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				carlist: [],
			}
		},
		onLoad() {
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			// uni.request({    //获取购物券
			// 	method: 'POST',
			// 	url: getApp().globalData.url + '/applet/card/findOpenChargeCardInfoByType',
			// 	data: {
			// 		customerId: uni.getStorageSync('user').customerId,
			// 		// customerId:  5+1,
			// 		openChargeCardId:'',
			// 		typeId:0
			// 	},
			// 	header: {
			// 		"Content-Type": "application/x-www-form-urlencoded" //如果为空，加上头部接收     
			// 	},
			// 	success: (res) => {
			// 		console.log(res)
			// 		this.carlist = res.data.cardInfo
			// 		uni.hideLoading()
			// 	},fail:(err) => {
			// 			this.error()
			// 			uni.hideLoading()
			// 		}
			// 	})
			this.carlist = [{
				cardName: '优惠券1',
				occNumber: 3,
				numberUse: 0,
				openChargeCardId: 1,
				recentUse: true
			}, {
				cardName: '优惠券2',
				occNumber: 3,
				numberUse: 0,
				openChargeCardId: 2,
				cardType: 1,
				occPaymentAmount: 20,
			}, {
				cardName: '优惠券3',
				occNumber: 3,
				openChargeCardId: 3,
				numberUse: 6,
				cardType: 3,
				occPaymentAmount: 20,
			}]
		},
		onPullDownRefresh() {
			// console.log('refresh');
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 500);
		},
		methods: {
			SerShadow(e) {
				if (e.detail.value) {
					uni.requestSubscribeMessage({
						tmplIds: ['fqkatwaYnXAw1raTr-lRbq5Ux1g_nU_MTeexN_TPK50'],
						success(res) {
							uni.showToast({
								title: '开启成功',
								icon: 'success'
							})
						}
					})
				}
			},
			vipcarlist_detail(id) {
				// console.log(item)
				uni.navigateTo({
					url: "../vipCarDetails/vipCarListDetail?id=" + id
				})
			},
			addnewcar() {
				uni.navigateTo({
					url: "../VIPcar/VIPcar"
				})
			}
		}
	}
</script>

<style scoped>
	.main {
		padding-top: 60px;
	}

	/* 卡片模块 */
	.vip_car_bc {
		width: 90%;
		margin: 0 auto;
		margin-top: 10px;
		height: 115px;
		color: rgba(80, 80, 80, 1);
		background-color: #F074AD;
		border-radius: 6px;
		position: relative;
	}

	.back-top {
		box-shadow: 0px 0px 5px 3px #eee;
		position: fixed;
		top: 0px;
		width: 100%;
		z-index: 9999;
		background-color: #fff;
	}

	.vip_car_circle {
		width: 39px;
		height: 39px;
		position: absolute;
		left: 4%;
		top: 9%;
		background-color: #fff;
		box-shadow: rgba(255, 255, 255, 1) solid 1px;
		border-radius: 21px;
		text-align: center;
	}

	.car_name {
		position: absolute;
		top: 18%;
		left: 18%;
		/* right: 50%; */
		color: #fff;
		font-size: 16px;
		font-weight: bold;
	}

	.car_number {
		position: absolute;
		left: 5%;
		bottom: 9%;
		color: #fff;
		font-size: 14px;
	}

	.car_time {
		position: absolute;
		right: 6%;
		bottom: 6%;
		color: rgba(255, 255, 255, 1);
		font-size: 14px;
	}

	.rencentUse {
		color: rgba(255, 255, 255, 1);
		font-size: 14px;
		position: absolute;
		top: 8%;
		right: 6%;
	}

	.add_newcar {
		position: fixed;
		bottom: 0px;
		width: 100%;
		height: 45px;
		color: #fff;
		background-color: #CA89FF;
		border-radius: 4px;
		font-size: 14px;
		line-height: 45px;
		text-align: center;
	}
</style>