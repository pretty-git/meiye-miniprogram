<template>
	<view class="bg">
		<view class="form">
			<view v-for="(item,index) in formlist" :key="index" class="formlist">
				<view style="margin-top: 10px;padding-bottom: 10px;" class="flex_row">
					<view class="formicon font">
						&#xe64b;
					</view>
					<view class="flex_column" style="width: 60%;">
						<view class="formtime">
							{{item.time}}
						</view>
						<view class="formdetails nowrap">
							{{item.details}}
						</view>
					</view>
					<view class="paybtn" v-if="item.whetherpay" @click="payment(id)">
						代支付
					</view>
				</view>
			</view>
		</view>
	</view>

</template>
<script>
	export default {
		data() {
			return {
				formlist: [{
						time: '10:15:23',
						details: "您购买的染烫项目已经快过期请及时使用。",
						whetherpay: false
					},
					{
						time: '10:15:23',
						details: "您的朋友请求您代付订单。",
						whetherpay: true
					},
					{
						time: '10:15:23',
						details: "您购买的染烫项目已经快过期请及时使用。",
						whetherpay: false
					}
				]
			}
		},
		methods: {
			payment(it) {
				uni.navigateTo({
					url: '../myOrder/statement'
				})
			}
		}
	}
</script>


<style scoped>
	.bg {
		/* position: absolute; */
		bottom: 0;
		top: 0;
		background-color: #fff !important;
		width: 100%
	}

	page {
		background-color: #fff;
	}

	.form {
		margin-top: 10px;
	}

	.formlist {
		border-bottom: 1px solid #f1f1f1;
		padding: 0 15px;
		margin: 10px 0;
	}

	.formicon {
		font-size: 35px;
		color: #EA5765;
		margin: auto 10px;

	}

	.formtime {
		color: rgba(80, 80, 80, 1);
		font-size: 14px;
		margin: auto 0;
		/* margin-left: 10px; */
	}

	.formdetails {
		color: rgba(80, 80, 80, 1);
		font-size: 14px;
		margin: 5px 0;
		/* padding-bottom: 10px; */
		/* width: 90%; */
	}

	.paybtn {
		color: #fff;
		background-color: #FB5A69;
		width: 70px;
		height: 30px;
		text-align: center;
		line-height: 30px;
		border-radius: 5px;
		margin-top: 10px;
	}
</style>