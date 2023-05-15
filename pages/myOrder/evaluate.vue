<template>
	<view class="page">
		<view style="font-size: 16px;margin: 20px;font-weight: bold;">
			订单评价
		</view>
		<view class="" style="margin: 20px;">
			订单编号：{{idnumber}}
		</view>
		<textarea placeholder=" 请使用7字以内标签短语，多个评价可用逗号隔开" maxlength="50" placeholder-class="hold" :value="text"
			@input="getInput" />
		<view class="flex">
			<view class="lefttext">
				技术评分
			</view>
			<uni-rate :value="value1" @change="onChange1" />
		</view>
		<view class="flex">
			<view class="lefttext">
				效果评分
			</view>
			<uni-rate :value="value2" @change="onChange2" />
		</view>
		<view class="flex">
			<view class="lefttext">
				态度评分
			</view>
			<uni-rate :value="value3" @change="onChange3" />
		</view>
		<view class="flex" style="border-bottom: 1px solid #f1f1f1;">
			<view class="lefttext">
				综合评分
			</view>
			<uni-rate :value="allvalue" disabled="true" />
			<view class="" style="margin-top: 4px;
								margin-left: 20px;
								font-size: 16px;
								color: #FF4444;
								">
				{{allvalue}} 分
			</view>
		</view>

		<view style="font-size: 16px;margin: 20px;font-weight: bold;">
			手艺人评价
		</view>
		<!-- <view class="flex_column">
						<view class="" style="color: #FF9D3E;font-size: 15px; font-weight: bold;margin-bottom: 5px;">
							￥{{price}}
						</view>
						<view class="">
							{{time}}
						</view>
					</view> -->
		<view class="" style="margin: 25px 0;" v-for="(item,index) in staffList" :key="index">
			<textarea placeholder=" 请使用7字以内标签短语，多个评价可用逗号隔开" maxlength="50" placeholder-class="hold"
				:value="item.evaDetails" @input="gesstInput($event,index)" />
			<view class="flex_row">
				<view class="craftman_image">
					<image :src="item.staPhoto" mode="aspectFill"></image>
				</view>
				<view class="flex_column" style="width: 50%;">
					<view class="" style="font-size: 15px;font-weight: bold;margin-bottom: 5px;">
						{{item.staName}}
					</view>
					<view class="">
						服务项目：{{item.serveName}}
					</view>
				</view>
			</view>
			<view class="" style="background-color: #fff;margin-top: 10px;">
				<view class="flex">
					<view class="lefttext">
						技术评分
					</view>
					<uni-rate :value="item.evaTechnicalScore" @change="onChange4($event,index)" />
				</view>
				<view class="flex">
					<view class="lefttext">
						效果评分
					</view>
					<uni-rate :value="item.evaEffectivenessScore" @change="onChange5($event,index)" />
				</view>
				<view class="flex">
					<view class="lefttext">
						态度评分
					</view>
					<uni-rate :value="item.evaAttitudeScore" @change="onChange6($event,index)" />
				</view>
				<view class="flex">
					<view class="lefttext">
						综合评分
					</view>
					<uni-rate :max="5" :value="item.evaComprehensiveScore" disabled="true" />
					<!-- <uni-rate :disabled="true" :value="provalue" /> -->
					<view class="" style=":margin-top: 4px;
											margin-left: 20px;
											font-size: 16px;
											color: #FF4444;
											;" v-if="item.evaComprehensiveScore == undefined">
						0分
					</view>
					<view class="" style=":margin-top: 4px;
											margin-left: 20px;
											font-size: 16px;
											color: #FF4444;
											;" v-else>
						{{item.evaComprehensiveScore}} 分
					</view>
				</view>
			</view>

		</view>
		<view class="" style="width: 100%;height: 50px;background-color: #fff;">

		</view>

		<view class="bottm">
			<view class="radio">
				<checkbox :checked="ifname" class="round" />匿名
			</view>
			<view class="submitbtn" @click="submitEvaluate">
				提交评价
			</view>
		</view>
	</view>
</template>
<script>
	import uniRate from "@/components/uni-rate/uni-rate.vue"
	export default {
		components: {
			uniRate
		},
		data() {
			return {
				text: '',
				winHeight: '',
				ifname: false,
				src: 'https://7765-we-63574e-1258830969.tcb.qcloud.la/mingzi/man.jpg?sign=13cd306d8fac42cffcdff6364956af2d&t=1565946123',
				craftmanname: '托尼老师',
				projectname: '洗剪吹',
				price: '358',
				time: '30分钟',
				idnumber: "123456789012345",
				allvalue: 0,
				provalue: 0,
				value1: 0,
				value2: 0,
				value3: 0,
				value4: 0,
				value5: 0,
				value6: 0,
				orderMesg: {},
				staffList: [],
				orderEva: [],
				evalutaList: [],

			}
		},
		onLoad: function(option) {
			const item = JSON.parse(decodeURIComponent(option.item))
			console.log(item, '1111')
			this.orderMesg = item
			this.idnumber = item.orderNumber
			this.staffList = item.projectOrderRelevanceLists
			for (var it of this.staffList) {
				this.$set(it, 'evaEffectivenessScore', 0)
				this.$set(it, 'evaAttitudeScore', 0)
				this.$set(it, 'evaComprehensiveScore', 0)
				this.$set(it, 'evaTechnicalScore', 0)
				this.$set(it, 'evaDetails', '')
				if (it.staPhoto.slice(0, 5) != 'http:') {
					it.staPhoto = 'http://my.cloud.xmstruggle.com/' + it.staPhoto
				}
			}
			var list = []
			for (var i = 0; i < item.projectOrderRelevanceLists.length + 1; i++) {
				list.push({
					staffId: '',
					orderId: '',
					evaTechnicalScore: 0,
					evaEffectivenessScore: 0,
					evaAttitudeScore: 0,
					evaComprehensiveScore: 0,
					evaDetails: '',
					customerId: ''
				})
			}
			this.evalutaList = list
		},
		methods: {
			getInput(e) {
				this.text = e.detail.value
			},
			gesstInput(e, index) {
				this.staffList[index].evaDetails = e.detail.value
			},
			submitEvaluate() {
				// this.evalutaList[0].staffId = this.staffList[0].staffId
				this.evalutaList[0].orderId = this.orderMesg.orderId
				this.evalutaList[0].evaTechnicalScore = this.value1
				this.evalutaList[0].evaEffectivenessScore = this.value2
				this.evalutaList[0].evaAttitudeScore = this.value3
				this.evalutaList[0].evaComprehensiveScore = this.allvalue
				this.evalutaList[0].evaDetails = this.text
				this.evalutaList[0].customerId = this.orderMesg.ordCustomerId
				this.evalutaList[0].evaType = 1
				for (let i = 0; i < this.staffList.length; i++) {
					this.evalutaList[i + 1].evaDetails = this.staffList[i].evaDetails
					this.evalutaList[i + 1].orderId = this.orderMesg.orderId
					this.evalutaList[i + 1].customerId = this.orderMesg.ordCustomerId
					this.evalutaList[i + 1].staffId = this.staffList[i].staffId
					this.evalutaList[i + 1].evaTechnicalScore = this.staffList[i].evaTechnicalScore
					this.evalutaList[i + 1].evaEffectivenessScore = this.staffList[i].evaEffectivenessScore
					this.evalutaList[i + 1].evaAttitudeScore = this.staffList[i].evaAttitudeScore
					this.evalutaList[i + 1].evaComprehensiveScore = this.staffList[i].evaComprehensiveScore
					this.evalutaList[i + 1].evaType = 2
				}
				uni.request({
					method: 'POST',
					url: getApp().globalData.url + '/applet/evaluate/addSave',
					data: this.evalutaList,
					success: (res) => {
						if (res.data.result == 'success') {
							uni.showToast({
								title: '评价成功',
								icon: 'success'
							})
							uni.reLaunch({
								url: './myOrder?index=' + 3
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
			},
			mound(item) {
				return Math.round(item)
			},
			allfir() {
				return Math.round((this.value1 + this.value2 + this.value3) / 3)
			},
			profir(index) {
				return Math.round((this.staffList[index].evaTechnicalScore + this.staffList[index].evaEffectivenessScore +
					this.staffList[index].evaAttitudeScore) / 3)
			},
			onChange1(e) {
				// that.allvalue = 3
				this.value1 = e.value
				this.allvalue = this.allfir()
				console.log(this.allvalue)
			},
			onChange2(e) {
				this.value2 = e.value
				this.allvalue = this.allfir()
				// console.log(this.allvalue)
			},
			onChange3(e) {
				this.value3 = e.value
				this.allvalue = this.allfir()
				// console.log(that.allvalue)
			},
			onChange4(e, index) {

				this.staffList[index].evaTechnicalScore = e.value
				console.log(this.staffList[index])
				this.staffList[index].evaComprehensiveScore = this.profir(index)

			},
			onChange5(e, index) {
				console.log(e.value)
				this.staffList[index].evaEffectivenessScore = e.value
				this.staffList[index].evaComprehensiveScore = this.profir(index)
				console.log(this.staffList[index])
			},
			onChange6(e, index) {
				console.log(e.value)
				this.staffList[index].evaAttitudeScore = e.value
				this.staffList[index].evaComprehensiveScore = this.profir(index)
				console.log(this.staffList[index])
			},
		},
		mounted() {

		},
	}
</script>


<style>
	checkbox.round .wx-checkbox-input,
	checkbox.round .uni-checkbox-input {
		border-radius: 100upx;
		background-color: #fff !important;

	}

	.page {
		position: absolute;
		bottom: 0px;
		top: 0px;
		background-color: #fff !important;
		width: 100%;
		height: 100%;

	}

	.evaluateList {
		width: 20%;
	}

	.hold {
		color: rgba(166, 166, 166, 1);
		font-size: 14px;
		padding: 10px;
	}

	.itemlabel {
		width: 80%;
		/* padding: 0 10px; */
		margin: 5px;
		height: 36px;
		left: 95px;
		top: 103px;
		color: rgba(153, 164, 189, 1);
		border: 1px solid rgba(128, 128, 128, 1);
		border-radius: 18px;
		font-size: 14px;
		line-height: 36px;
		text-align: center;
	}

	textarea {
		background-color: #EEEEEE;
		width: 90%;
		margin: 10px auto;
		padding-top: 10px;
		padding-left: 10px;
	}

	.flex {
		display: flex;
		flex-direction: row;
		width: 90%;
		margin: 0 auto;
		height: 50px;

	}

	.lefttext {
		padding: 5px 10px;
		color: rgba(0, 0, 0, 1);
		font-size: 13px;
	}

	.rate {
		margin: auto 0;
		padding-left: 10px;
	}

	.bottm {
		position: fixed;
		bottom: 0px;
		width: 100%;
		height: 42px;
		display: flex;
		flex-direction: row;
		background-color: #fff;
	}

	.submitbtn {
		width: 120px;
		height: 42px;
		color: #fff;
		background-color: rgba(255, 68, 68, 1);
		font-size: 15px;
		line-height: 42px;
		text-align: center;
	}

	.radio {
		margin: auto 0;
		width: 70%;
		padding-left: 20px;
	}

	.craftman_image {
		width: 50px;
		height: 50px;
		border-radius: 100%;
		margin: 0 15px;
	}

	.craftman_image image {
		width: 50px;
		height: 50px;
		border-radius: 100%;
	}
</style>