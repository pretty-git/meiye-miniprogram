<template>
	<view>

		<view class="order_modal">
			<view class="protext flex_row" style="width: 90%;text-align: left; margin-top: 10px;padding-top: 10px;">

				<view class="font" style="font-size: 28px;padding: 0 8px;">
					&#xe63d;
				</view>
				<view class="title">手艺人</view>

			</view>
			<view class="flex order" @click="CraftmanDetails">
				<view class="font ordericon vertical lefticon" v-if="detailList.projectOrderRelevanceLists.length == 1">
					<view class="use_craftman">
						<image :src="detailList.projectOrderRelevanceLists[0].staPhoto" mode="aspectFill"></image>
					</view>
				</view>
				<view class="order_text vertical width">
					<text>{{detailList.staName}} 已为您服务</text>
				</view>
				<view class="font righticon vertical">
					&#xe604;
				</view>
			</view>
			<view class="flex order">
				<view class="font ordericon vertical lefticon">
					&#xe648;
				</view>
				<view class="order_text vertical width nowrap">
					<view v-if="detailList.backstageStores.length==1">
						<view>
							{{detailList.backstageStores[0].stoProvince}}{{detailList.backstageStores[0].stoCity}}{{detailList.backstageStores[0].stoCounty}}{{detailList.backstageStores[0].stoAddress}}
						</view>
					</view>
					<view class="" v-else-if="detailList.backstageStores.length == 0">
						暂无可用门店
					</view>
					<view class="" v-else v-for="(item,index) in detailList.backstageStores" :key="index">
						{{item.stoAddress}}、
					</view>
				</view>
				<view class="font righticon vertical">
					&#xe604;
				</view>
			</view>
		</view>
		<!-- 服务项目部分 -->
		<view class="pro_modal">
			<view class=" pro_top">
				<view class="protext vertical">
					服务项目
				</view>
			</view>
			<view class="proList flex" v-for="(item,index) in detailList.projectOrderRelevanceLists" :key="index"
				@click="projectDetails">
				<view class="proimage">
					<image :src="item.pictureId" mode="aspectFill"></image>
				</view>
				<view style="display: flex; flex-direction: column;margin-left: 10px;">
					<view class="detailList_name">
						{{item.serveName}}
					</view>
				</view>
				<view class="detailList_price">
					￥{{item.suggestPrice}}
				</view>
			</view>
		</view>
		<!-- 问题描述模块 -->
		<view class="problem_modal">
			<view class="protext" style="padding: 10px 18px;">
				问题描述
			</view>
			<textarea placeholder="请您描述具体内容，我们将尽快给出回复" maxlength="500" v-model="desc"
				placeholder-style="color: rgba(166, 166, 166, 1);font-size: 14px; padding:10px" @input="values" />
			<!-- <view class="font playicon">
				&#xe62a;
			</view>      上传图片-->
		</view>
		<view class="" style="height: 100px;width: 100%;background-color: #fff;">

		</view>
		<!-- 按钮选择 -->
		<view class="bottom">
			<view class="show_price">
				联系人：{{detailList.projectOrderRelevanceLists[0].staName}}/{{detailList.projectOrderRelevanceLists[0].staPhone}}
			</view>
			<view class="buybtn" @click="comRecord(item)"> <!-- 提交建议 -->
				提交
			</view>
		</view>
	</view>

</template>
<script>
	export default {
		data() {
			return {
				detailList: [],
				desc: ''
			}
		},
		onLoad(props) {
			this.detailList = JSON.parse(decodeURIComponent(props.detailList))
		},
		methods: {
			values(e) {
				this.desc = e.detail.value
			},
			CraftmanDetails() {
				uni.navigateTo({
					url: '../craftsman/craftmanDetails'
				})
			},
			projectDetails() {
				uni.navigateTo({
					url: '../giftdetails/projectdetail'
				})
			},
			comRecord(item) {
				uni.request({ //获取购物券
					method: 'POST',
					url: getApp().globalData.url + '/applet/suggest/add',
					data: {
						customerId: uni.getStorageSync('user').customerId,
						"orderId": this.detailList.orderId,
						"complainReasons": this.desc
					},
					success: (res) => {
						if (res.data.result == "success") {
							uni.navigateTo({
								url: '../me/complaints'
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

			}
		}
	}
</script>


<style scoped>
	.order_modal {
		width: 90%;
		margin: 0 auto;
		height: 126px;
		color: rgba(80, 80, 80, 1);
		background-color: rgba(255, 255, 255, 1);
		border-radius: 4px;
		font-size: 14px;
		line-height: 150%;
		text-align: center;
	}

	.fix {
		display: flex;
		flex-direction: row;
	}

	.vertical {
		margin: auto 0;
	}

	/* 上下居中 */
	.use_craftman {
		width: 44px;
		height: 44px;
		border-radius: 4px;
	}

	.use_craftman image {
		width: 44px;
		height: 44px;
		border-radius: 4px;
	}

	.order {
		height: 50%;
		padding: 0 15px;
	}

	.lefticon {
		font-size: 28px;
		font-weight: bold;
		color: rgba(56, 56, 56, 1);
	}

	.righticon {
		font-size: 30px;
		font-weight: bold;
		color: rgba(153, 153, 153, 1);
	}

	.width {
		width: 80%;
		text-align: left;
		padding-left: 10px;
	}

	/* 服务模块 */
	.pro_modal {
		background-color: #fff;
		width: 90%;
		margin: 0 auto;
	}

	.pro_top {
		padding-bottom: 10px;
		padding-top: 20px;
	}

	.proicon {
		font-size: 24px;
		color: rgba(56, 56, 56, 1);
		padding-left: 17px;
	}

	.protext {
		font-size: 16px;
		font-weight: bold;
		padding-left: 8px;

	}

	.telicon {
		font-size: 25px;
		color: rgba(153, 153, 153, 1);
	}

	.tel {
		text-align: center;
		height: 40px;
		width: 230%;
		margin: auto;
	}

	.tel_text {
		margin-left: 10px;
	}

	.proimage {
		width: 90px;
		height: 62px;
		border-radius: 4px;
	}

	.proimage image {
		width: 90px;
		height: 62px;
		border-radius: 4px;
	}

	.detailList_name {
		font-size: 16px;
	}

	.detailList_time {
		color: rgba(166, 166, 166, 1);
		font-size: 14px;
		margin-top: 15px;
	}

	.proList {
		position: relative;
		margin-top: 15px;
		padding-bottom: 15px;
		padding-left: 15px;
	}

	.detailList_price {
		color: rgba(255, 108, 144, 1);
		font-size: 14px;
		position: absolute;
		top: 48%;
		left: 50%;

	}

	.pay_modal {
		margin-top: 10px;
		width: 100%;
		height: 100px;
		background-color: #fff;
		margin-bottom: 10px;
	}

	.pay_left {
		letter-spacing: 1px;
		color: rgba(80, 80, 80, 1);
		font-size: 14px;
		font-weight: bold;
		margin-right: 10px;
	}

	.hei {
		height: 30px;
		line-height: 30px;
		padding-left: 15px;
	}

	.allprice_modal {
		background-color: #fff;
		margin-bottom: 10px;
		border-bottom: 1px solid #e5e5e5;
	}

	.allprice_wid {
		width: 73%;
		text-align: right;
	}

	.truePrice {
		height: 30px;
		width: 100%;
		margin-bottom: 60px;
		margin-top: 5px;
		margin-left: 65%;
	}

	.bottom_btn {
		height: 50px;
		background-color: #fff;
		padding-left: 15px;
		position: fixed;
		bottom: 0px;
		background-color: #f1f1f1;
		width: 100%;
		/* border-bottom: 2px solid #F1F1F1; */
	}

	.bottom_btn1 {
		width: 88px;
		height: 29px;
		line-height: 29px;
		color: rgba(80, 80, 80, 1);
		border: 1px solid rgba(204, 204, 204, 1);
		border-radius: 16px;
		font-size: 14px;
		text-align: center;
		margin-right: 10px;
	}

	/* 问题描述 */
	.problem_modal {
		background-color: #fff;
		width: 90%;
		margin: 0 auto;
		margin-top: 15px;
	}

	textarea {
		background-color: rgba(229, 229, 229, 1);
		margin: 0 auto;
		padding-top: 10px;
	}

	.playicon {
		font-size: 28px;
		color: rgba(153, 153, 153, 1);
		padding: 11px 0 17px 17px;
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
		z-index: 9999;
	}

	.show_price {
		width: 70%;
		height: 48px;
		color: rgba(166, 166, 166, 1);
		background-color: rgba(255, 255, 255, 1);
		font-size: 14px;
		line-height: 48px;
		text-align: center;
	}

	.buybtn {
		width: 30%;
		height: 48px;
		color: rgba(255, 255, 255, 1);
		background-color: #FB4B5C;
		font-size: 14px;
		line-height: 48px;
		text-align: center;
	}
</style>