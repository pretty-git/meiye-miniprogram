<template>
	<view>
		<!-- vip car -->
		<view class="vip_car_bc" @click="details" :style="{'background-color':deadline<0?'#a8a8a8':' #FAA0E8'}">
			<view class="vip_car_circle"><!-- 小圆圈 --></view>
			<text class="car_name">{{carname}}</text>
			<text class="time" v-if="deadline>0">{{deadline}}天后过期</text>
			<text class="time" v-if="deadline==0">无限期</text>
			<text class="time" v-if="deadline<0">已过期</text>
			<text class="car_number">{{ carnumber }}</text>
			<text class="car_class">{{ carclass }}</text>
			<view class="" v-if="deadline!=0">
				<text class="residul" v-if="cardType == 1 || cardType == 4"> 剩余金额：￥{{lastprice}}</text>
				<text class="residul" v-if="cardType == 2"> </text>
				<text class="residul" v-if="cardType == 3">剩余抵扣次数 {{residul_time}} / {{all_time}}</text> <!-- 剩余次数 -->
			</view>

		</view>
		<!-- end -->
		<view class="deatils"> <!-- 交易明细 -->
			<view class="title">
				<view class="title_name">
					交易明细
				</view>
				<view class="btn" @click="transfer">
					卡内余额转出
				</view>
			</view>
			<view class="recordlist" v-for="(item,index) in recordlist" :key="index">
				<view class="site text_hidden" v-if="item.typeId == 9 || item.typeId == 10">
					转出卡&nbsp;卡号:{{item.mappingName}}: <!-- 地点 -->
				</view>
				<view class="site text_hidden" v-else>
					{{item.mappingName}}: <!-- 地点 -->
				</view>
				<view class="consumetime text_hidden"> <!-- 消费时间 -->
					{{item.createTime}}
				</view>
				<view class="price text_hidden">
					消费: {{item.ordAchievement}}
				</view>
				<view class="icon font ">
					&#xe604;
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				carname: '洗剪吹项目卡',
				carclass: '项目卡',
				carnumber: 'No:123456',
				lastprice: '',
				price: '￥15',
				id: '',
				time: '59天后过期',
				residul_time: '11',
				all_time: '20',
				recordlist: [],
				cardType: '',
				deadline: ''
			}
		},
		onLoad(props) {
			uni.request({ //获取购物券
				method: 'POST',
				url: getApp().globalData.url + '/applet/card/findOpenChargeCardInfoByType',
				data: {
					// customerId: uni.getStorageSync('user').customerId,
					openChargeCardId: props.id,
					typeId: 1
				},
				header: {
					"Content-Type": "application/x-www-form-urlencoded" //如果为空，加上头部接收     
				},
				success: (res) => {
					console.log(res, '11111111')
					this.carname = res.data.cardInfo.cardName
					this.carnumber = res.data.cardInfo.occNumber
					if (res.data.cardInfo.cardType == 1) {
						this.carclass = "储值卡"
					} else if (res.data.cardInfo.cardType == 2) {
						this.carclass = "会费卡"
					} else if (res.data.cardInfo.cardType == 3) {
						this.carclass = "项目卡"
					} else {
						this.carclass = "免费卡"
					}
					this.cardType = res.data.cardInfo.cardType
					this.lastprice = res.data.cardInfo.occPaymentAmount
					this.residul_time = res.data.cardInfo.numberUse
					this.all_time = res.data.cardInfo.oldNumberUse
					this.recordlist = res.data.cardOrderInfo
					this.deadline = res.data.cardInfo.deadline
					this.id = res.data.cardInfo.cardId
				},
				fail: (err) => {
					uni.showToast({
						title: '网络请求超时,请重试',
						icon: 'none'
					})
				}
			})
		},
		methods: {
			details() {
				uni.navigateTo({
					url: "../vipCarDetails/vipCarDetails?cardId=" + this.id
				})
			},
			transfer() {
				uni.navigateTo({
					url: "../VIPcar/VIPcarTransfer"
				})
			}
		}
	}
</script>

<style scoped>
	/* 卡片模块 */
	.vip_car_bc {
		width: 90%;
		margin: 0 auto;
		margin-top: 20px;
		height: 161px;
		color: rgba(80, 80, 80, 1);
		border-radius: 6px;
		position: relative;
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

	.time {
		position: absolute;
		top: 10%;
		right: 6%;
		color: rgba(255, 255, 255, 1);
		font-size: 14px;
	}

	.residul {
		position: absolute;
		right: 6%;
		bottom: 10%;
		color: rgba(255, 255, 255, 1);
		font-size: 14px;
	}

	/* 交易明细 */
	.deatils {
		width: 90%;
		margin: 0 auto;
	}

	.title {

		height: 76px;
		display: flex;
		flex-direction: row;
		line-height: 76px;

	}

	.title_name {
		color: rgba(80, 80, 80, 1);
		font-size: 16px;
		text-align: left;
		font-weight: bold;
		margin-left: 7%;
		width: 30%;

	}

	.btn {
		color: #FBFDF4;
		background-color: #FB4B5C;
		border-radius: 16px;
		font-size: 12px;
		line-height: 39px;
		font-weight: 600;
		height: 35px;
		margin: 21px 0;
		text-align: center;
		padding: 0px 6px;
		width: 30%;
		margin-left: 35%;
	}

	/* 交易记录 */
	.recordlist {
		width: 85%;
		margin: 0 auto;
		height: 60px;
		line-height: 60px;
		border-bottom: 1px solid #E5E5E5;
		position: relative;
	}

	.site {
		width: 80%;
		position: absolute;
		top: -26%;
		left: 0px;
		color: rgba(80, 80, 80, 1);
		font-size: 14px;
	}

	.consumetime {
		position: absolute;
		bottom: -23%;
		left: 0px;
		color: #BBBBBB;
		font-size: 14px;
	}

	.price {
		width: 40%;
		position: absolute;
		bottom: -25%;
		left: 60%;
		color: rgba(80, 80, 80, 1);
		font-size: 14px;
	}

	.icon {
		position: absolute;
		top: 2%;
		right: -7%;
		color: rgba(80, 80, 80, 1);
		font-size: 22px;
		font-weight: bold;
	}
</style>