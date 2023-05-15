<template>
	<!-- 待使用模块 -->
	<view class="page" :style="{height:winHeight+'px'}">
		<view class="page_top">
			<view class="flex" style="padding-top: 25px;">
				<view class="font topicon">
					<text v-if="states==1 ">&#xe628;</text>
					<text v-if="states==4">&#xe66e;</text>
					<text v-if="states==5">&#xe71b;</text>
					<text v-if="states==6">&#xe71b;</text>
				</view>
				<view class="top_text">
					<text v-if="states==1">等待服务</text>
					<text v-if="states==4">已完成</text>
					<text v-if="states==5">已失效</text>
					<text v-if="states==6">已申请退款</text>
				</view>
			</view>

			<view class="top_time1" v-if="states==2 && detailList.appResult.inDate !=0">
				<view class="font flex_row topicon1">
					<text style="font-size: 28px;">&#xe628;</text>
					<text style="margin: 0 10px;font-size: 18px;">待使用项目</text>
				</view>
				<view class="topicon2 flex_column">
					<view>{{detailList.appResult.inDate}}天后过期</view>
					<view>请在 {{detailList.appResult.endTime}} 前使用</view>
				</view>
			</view>
			<view class="top_time11" v-if="states==2 && detailList.appResult.inDate == 0">
				<view class="font flex_row topicon11">
					<text style="font-size: 30px;">&#xe628;</text>
					<text style="margin: 0 10px;font-size: 22px;">待使用项目</text>
				</view>
				<view class="topicon3">
					无限期
				</view>
			</view>
			<view class="top_time">
				<view class="">
					<text v-if="states==1 && detailList.orderType !='店开单'"> 请在{{detailList.endTime}}前 </text>
					<text v-if="states==4">感谢您在名姿消费</text>
					<text v-if="states==5">超出订单预约的时间</text>
					<text v-if="states==6">已申请退款</text>
				</view>
				<view class="">
					<text v-if="states==1 && detailList.orderType !='店开单'">到店享受服务 </text>
					<text v-if="states==4 || states==6">欢迎再次光临 </text>
					<text v-if="states==5">可重新预约或退款</text>
				</view>
			</view>
		</view>
		<view class="order_modal">
			<view class="flex order" @click="chooseCraftman">
				<view class="font ordericon vertical lefticon">

					<text v-if="states==2">&#xe629;</text>
				</view>
				<view class="order_text vertical width nowrap">
					<view class="flex_row"
						v-if="(states==1||states==4 ||states == 6) && detailList.projectOrderRelevanceLists.length == 1">
						<view class="use_craftman">
							<image :src=" detailList.projectOrderRelevanceLists[0].staPhoto" mode="aspectFill"></image>
						</view>
						<text
							style="margin: auto 10px;width: 70%;">{{ detailList.projectOrderRelevanceLists[0].staName}}
							很高兴为您服务</text>
					</view>
					<view class="flex_row "
						v-if="(states==1||states==4 ||states == 6) && detailList.projectOrderRelevanceLists.length != 1">
						{{ detailList.staName}}很高兴为您服务

					</view>

					<view class="" v-if="states==5">
						<view class="flex_row" v-if="detailList.orderType == '预约单'">
							<view class="use_craftman">
								<image :src=" detailList.projectOrderRelevanceLists[0].staPhoto" mode="aspectFill">
								</image>
							</view>
							<text
								style="margin: auto 10px;width: 70%;">{{ detailList.projectOrderRelevanceLists[0].staName}}
								很高兴为您服务</text>
						</view>
						<view class="flex_row" v-else>
							<view class="font" style="font-size: 25px;color: #CA89FF;">&#xe646;</view>
							<view style="margin: auto 10px;width: 70%;">期待下次为你服务</view>
						</view>
					</view>
					<text v-if="states==2">预约手艺人和时间以使用本项目</text>
				</view>
				<view class="font righticon vertical">
					&#xe604;
				</view>
			</view>
			<view class="flex order">
				<view class="font ordericon vertical lefticon">
					&#xe648;
				</view>
				<view class="order_text vertical width nowrap"
					v-if="states==1 ||states==4||states==5||states == 6 || states==2">

					<view v-if="states==2" class="flex_row nowrap">可用门店：
						<view class="" v-for="(item,index ) in detailList.backstageStores" :key='index'>
							{{item.stoName}}、
						</view>

					</view>
					<view class="" v-else>
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

				</view>
				<view class="font righticon vertical">
					&#xe604;
				</view>
			</view>
		</view>
		<!-- 服务项目部分 -->
		<view class="pro_modal">
			<view class=" flex pro_top">
				<view class="font proicon">
					&#xe619;
				</view>
				<view class="protext vertical">
					服务项目
				</view>
			</view>
			<view class="proList flex" @click="projectDetails(detailList.appResult.serveId)" v-if="states == 2">
				<view class="proimage">
					<image :src="detailList.appResult.pictureId" mode="aspectFill"></image>
				</view>
				<view style="margin-left: 15px;padding-top: 12px;">
					<view class="detailList_name">
						{{detailList.appResult.serveName}}
					</view>
					<view class="detailList_price">
						￥{{detailList.appResult.suggestPrice}}
					</view>
				</view>

			</view>

			<view class="proList flex" v-for="(item,index) in detailList.projectOrderRelevanceLists" :key="index"
				@click="projectDetails (item.serveId)" v-else>
				<view class="proimage">
					<image :src="item.pictureId" mode="aspectFill"></image>
				</view>
				<view style="margin-left: 15px;padding-top: 12px;">
					<view class="detailList_name">
						{{item.serveName}}
					</view>
					<view class="detailList_price">
						￥{{item.suggestPrice}}
					</view>
				</view>

			</view>

			<view style="width: 100%;text-align: center;">
				<view class="flex tel">
					<view class="telicon font vertical">
						&#xe668;
					</view>
					<view class="vertical tel_text">
						联系门店
					</view>
				</view>
			</view>
		</view>
		<!-- 订单模块 -->
		<view class="pay_modal" v-if="classifyId!=3">
			<view class="flex hei vertical">
				<view class="pay_left">
					订单编号:
				</view>
				<view class="">
					{{detailList.orderNumber}}
				</view>
			</view>
			<view class="flex hei vertical">
				<view class="pay_left">
					下单时间:
				</view>
				<view class="">
					{{detailList.createTime}}
				</view>
			</view>
			<view class="flex hei vertical"
				v-if="states == 2 || states == 1 ||states == 3 || states == 4 || states == 6">
				<view class="pay_left">
					支付方式:
				</view>
				<view class="" v-if="detailList.consumptionState == 0">
					<view class=""
						v-if="detailList.giftOrderId == null || detailList.giftOrderId == undefined ||  detailList.giftOrderId == 0">
						<view class="" v-if="detailList.ordPaymentMethod == 1 || detailList.ordPaymentMethod == 0">
							微信
						</view>
						<view class="" v-if="detailList.ordPaymentMethod == 2">
							支付宝
						</view>
						<view class="" v-if="detailList.ordPaymentMethod == 3">
							会员卡
						</view>
					</view>
					<view class="" v-else>
						赠送
					</view>
				</view>
				<view class="" v-if="detailList.consumptionState == 1">
					未支付
				</view>
			</view>
			<view class="flex hei vertical" v-else-if="states == 5">
				<view class="pay_left">
					支付方式:
				</view>
				<view class="" v-if=" detailList.orderType == '赠送项目'">
					赠送
				</view>
				<view class="" v-else-if="detailList.consumptionState == 0">
					<!-- 0是支付 -->
					<view class="" v-if="detailList.ordPaymentMethod == 1 || detailList.ordPaymentMethod == 0">
						微信
					</view>
					<view class="" v-if="detailList.ordPaymentMethod == 2">
						支付宝
					</view>
					<view class="" v-if="detailList.ordPaymentMethod == 3">
						会员卡
					</view>
				</view>
				<view class="" v-else-if="detailList.consumptionState == 1">
					<view class="">
						未支付
					</view>
				</view>
			</view>
			<!-- <view class="flex hei vertical" v-else>
					<view class="pay_left">
						支付方式:
					</view>
					<view class="">
						未支付
					</view>
				</view> -->
		</view>
		<!-- 订单总额模块 -->


		<view style="background-color: #fff;width: 100%;">
			<!-- 屏幕溢出 -->
			<view class="allprice_modal" v-if="classifyId!=3">
				<view class="flex hei vertical">
					<view class="pay_left">
						订单总额
					</view>
					<view class="allprice_wid">
						￥{{detailList.ordAchievement}}
					</view>
				</view>
				<view class="flex hei vertical" v-if="states == 2">
					<view class="pay_left">
						子项目价格
					</view>
					<view class="allprice_wid">
						￥{{detailList.appResult.suggestPrice}}
					</view>
				</view>
				<view class="" v-else-if="states == 5">
					<view class="flex hei vertical" v-if=" detailList.orderType == '赠送项目'">
						<view class="pay_left">
							享受优惠
						</view>
						<view class="allprice_wid">
							￥0
						</view>
					</view>
					<view class="flex hei vertical" v-else>
						<view class="pay_left">
							子项目价格
						</view>
						<view class="allprice_wid">
							￥{{detailList.projectOrderRelevanceLists[0].suggestPrice}}
						</view>
					</view>
				</view>

				<view class="flex hei vertical" v-else>
					<view class="pay_left">
						享受优惠
					</view>
					<view class="allprice_wid">
						-￥{{Allprice-detailList.ordAchievement}}
					</view>
				</view>

				<view class="flex hei vertical">
					<view class="pay_left">
						支付时间:
					</view>
					<view class="allprice_wid"
						v-if="detailList.consumptionState == 0 || detailList.consumptionState == null || detailList.consumptionState == undefined">
						{{detailList.ordStatementTime}}
					</view>
					<view class="allprice_wid" v-else>
						未支付
					</view>
				</view>
			</view>
			<view class="truePrice flex" v-if="states == 1">
				<view class="" style="font-size: 12px; color: red;padding-top: 2px;padding-right: 10px;">
					过期退
				</view>
				<view class="pay_left1" v-if="detailList.consumptionState == 0">
					实付款:
				</view>
				<view class="pay_left1" v-if="detailList.consumptionState == 1">
					应付款:
				</view>
				<view style="color:#ff6c90;">
					￥{{detailList.ordAchievement}}
				</view>
			</view>
			<view class="truePrice flex" v-else-if="states == 2">
				<view class="pay_left1">
					实付款:
				</view>
				<view style="color:#ff6c90;"
					v-if="detailList.giftOrderId == null || detailList.giftOrderId == undefined ||  detailList.giftOrderId == 0">
					￥{{detailList.ordAchievement}}
				</view>
				<view style="color:#ff6c90;" v-else>
					￥0
				</view>
			</view>
			<view class="truePrice flex" v-else-if="states == 5">
				<view class="pay_left1" v-if="detailList.consumptionState == 0 ">
					实付款:
				</view>
				<view class="pay_left1" v-if="detailList.consumptionState == 1 && detailList.orderType != '赠送项目'">
					应付款:
				</view>
				<view style="color:#ff6c90;" v-if=" detailList.orderType == '赠送项目'">
					￥0
				</view>
				<view style="color:#ff6c90;" v-else>
					￥{{detailList.ordAchievement}}
				</view>
			</view>
			<view class="truePrice flex" v-else>

				<view class="pay_left1" v-if="detailList.consumptionState == 0">
					实付款:
				</view>
				<view class="pay_left1" v-if="detailList.consumptionState == 1">
					应付款:
				</view>
				<view style="color:#ff6c90;">
					￥{{detailList.ordAchievement}}
				</view>
			</view>
		</view>
		<view class="occupymodal">

		</view>
		<!-- 底部按钮 -->
		<view class="bottom_btn flex">

			<view class="vertical" style="color: #ff6c90;font-size: 14px;width: 60%;" v-if="states == 6">
				已申请退款，款项将原路退回
			</view>
			<view class="vertical" style="color: #ff6c90;font-size: 14px;width: 40%;" v-if="states == 2">
				<view class=""
					v-if="detailList.giftOrderId == null || detailList.giftOrderId == undefined ||  detailList.giftOrderId == 0">
					<view class=""
						v-if="detailList.customizationId == 0 || detailList.customizationId == undefined || detailList.customizationId == null">
						本单为礼包项目
					</view>
					<view class="" v-else>
						本单为美丽定制项目
					</view>
				</view>
				<view class="" v-else>
					本单为赠送项目
				</view>
			</view>
			<view class="vertical" style="color: #ff6c90;font-size: 14px;width: 40%;" v-else-if="states ==4">
				<view class=""
					v-if="detailList.paymentCustomerName == null || detailList.paymentCustomerName == undefined ||  detailList.paymentCustomerName == 0 ||  detailList.paymentCustomerName == ''">
					本单为{{detailList.orderType}}
				</view>
				<view class="" v-else>
					本单为{{detailList.paymentCustomerName}}
				</view>

			</view>
			<view class="vertical" style="color: rgba(128, 128, 128, 1);font-size: 14px;width: 40%;" v-else>
				本单为{{detailList.orderType}}
			</view>
			<view class="bottom_btn1 vertical" v-if="states==1 && detailList.orderType !='店开单'" @click="changOrderTime">
				修改时间
			</view>
			<view class="bottom_btn1 vertical" v-if="states==1" @tap="showModal" data-target="payModal">
				取消订单
			</view>
			<view class="bottom_btn1 vertical" v-if="states==2 && isPresented == 1">
				转赠好友
			</view>
			<view class="bottom_btn1 vertical" v-if="states==2" @click="chooseCraftman">
				预约使用
			</view>
			<view class="bottom_btn1 vertical" v-if="states==4 && detailList.typeId == 0" @click="comAdvice">
				投诉建议
			</view>
			<view class="bottom_btn1 vertical" v-if="states==4 && detailList.backstageEvaluates.length === 0"
				@click="evalute">
				服务评价
			</view>
			<view class="bottom_btn1 vertical" v-if="states==4">
				再次购买
			</view>
			<!-- <view v-if="detailList.orRefund " class="vertical" style='color: red;'>
					已申请退款，款项将原路退回
				</view> -->
			<view class="flex">
				<view class=" vertical" v-if="states==5&&detailList.orRefund==false"
					style="color: red;width: 88px; text-align: center;">
					退款
				</view>
				<view class="bottom_btn1 vertical" v-if="states==5" @click="chooseCraftman"
					style=" position: absolute; right: 0px; top: 12px;">
					重新预约
				</view>
			</view>
		</view>

		<!-- 底部支付层begin -->
		<view class="cu-modal bottom-modal" :class="modalName=='payModal'?'show':''">
			<view class="cu_dialog2">
				<view class="cu-bar bg-white">
					<view style="color: rgba(80, 80, 80, 1);font-size: 16px;font-weight: bold;margin-left: 5%;">取消订单
					</view>
					<view class="action text-gray font" @tap="hideModal1" style="font-size: 22px;">&#xe64a;</view>
				</view>
				<view class="allpay">
					<view style="text-align: left;padding:10px 20px;color: #000;">
						请选择取消订单的原因：
					</view>
					<radio-group class="radio-group" @change="radioChange">
						<label class="radio_click clearfix" v-for="(item,index) in mustList" :key="index">
							<radio :value="item.value" :checked="item.check" />
							<text style="margin-left: 10px;font-size: 14px;width: 100%; text-align: left;">
								{{item.value}}</text>
						</label>
					</radio-group>
				</view>
				<view class="okBtn" @tap="hideModal ">
					确定
				</view>

			</view>
		</view>
		<!-- 底部窗口end -->
	</view>

</template>
<script>
	export default {
		data() {
			return {
				modalName: null,
				states: '',
				detailList: {},
				winHeight: '',
				timePay: "2019-02-15 07:22:36",
				mustList: [

					{
						value: '不想要了',
					},
					{
						value: '选错门店了',
					},
					{
						value: '有项目降价'
					},
					{
						value: '其他'
					}
				],
				typeId: '',
				Allprice: '',
				orderId: '',
				refunse: '',
				classifyId: '',
				isPresented: ''
			}
		},
		methods: {
			onLoad(props) {
				this.classifyId = props.classifyId
				var classifyId = props.classifyId
				console.log(props.serverId);
				var id = props.id;
				var typeId = props.typeId
				this.states = props.typeId
				this.isPresented = props.isPresented
				if (props.serverId == undefined) {
					var severId = ''
				} else {
					var severId = Number(props.serverId)
				}

				if (typeId == 2) {
					uni.request({ //获取购物券
						method: 'POST',
						url: getApp().globalData.url + '/applet/order/findOrderInfoByOrderIdAndType',
						data: {
							// customerId: uni.getStorageSync('user').customerId,
							"orderId": Number(id),
							"typeId": Number(typeId),
							"classifyId": Number(classifyId),
							serveId: severId
						},
						header: {
							"Content-Type": "application/x-www-form-urlencoded" //如果为空，加上头部接收     
						},
						success: (res) => {
							console.log(res, '1111111')

							this.Allprice = res.data.result.ordAchievement
							res.data.result.appResult.pictureId = 'http://my.cloud.xmstruggle.com/' + res.data
								.result.appResult.pictureId
							this.detailList = res.data.result
							this.orderId = res.data.result.orderId
						},
						fail: (err) => {
							uni.showToast({
								title: '网络请求超时,请重试',
								icon: 'none'
							})
						}
					})
				} else if (typeId == 4 || typeId == 5) {
					uni.request({ //获取购物券
						method: 'POST',
						url: getApp().globalData.url + '/applet/order/findOrderInfoByOrderIdAndType',
						data: {
							// customerId: uni.getStorageSync('user').customerId,
							"orderId": Number(id),
							"typeId": Number(typeId),
							"classifyId": Number(classifyId),
							serveId: severId
						},
						header: {
							"Content-Type": "application/x-www-form-urlencoded" //如果为空，加上头部接收     
						},
						success: (res) => {
							console.log(res, '1111111')

							this.Allprice = 0
							for (var i = 0; i < res.data.result.projectOrderRelevanceLists.length; i++) {
								this.Allprice += res.data.result.projectOrderRelevanceLists[i].suggestPrice
								res.data.result.projectOrderRelevanceLists[i].pictureId =
									'http://my.cloud.xmstruggle.com/' + res.data.result
									.projectOrderRelevanceLists[
										i].pictureId
								res.data.result.projectOrderRelevanceLists[i].staPhoto =
									'http://my.cloud.xmstruggle.com/' + res.data.result
									.projectOrderRelevanceLists[
										i].staPhoto
							}
							this.detailList = res.data.result
							this.orderId = res.data.result.orderId
						}
					})

				} else {
					uni.request({ //获取购物券
						method: 'POST',
						url: getApp().globalData.url + '/applet/order/findOrderInfoByOrderIdAndType',
						data: {
							// customerId: uni.getStorageSync('user').customerId,
							"orderId": Number(id),
							"typeId": Number(typeId),
							"classifyId": 0
						},
						header: {
							"Content-Type": "application/x-www-form-urlencoded" //如果为空，加上头部接收     
						},
						success: (res) => {
							console.log(res, '1111111')

							this.Allprice = 0
							for (var i = 0; i < res.data.result.projectOrderRelevanceLists.length; i++) {
								this.Allprice += res.data.result.projectOrderRelevanceLists[i].suggestPrice
								res.data.result.projectOrderRelevanceLists[i].pictureId =
									'http://my.cloud.xmstruggle.com/' + res.data.result
									.projectOrderRelevanceLists[
										i].pictureId
								res.data.result.projectOrderRelevanceLists[i].staPhoto =
									'http://my.cloud.xmstruggle.com/' + res.data.result
									.projectOrderRelevanceLists[
										i].staPhoto
							}
							this.detailList = res.data.result
							this.orderId = res.data.result.orderId
						},
						fail: (err) => {
							uni.showToast({
								title: '网络请求超时,请重试',
								icon: 'none'
							})
						}
					})
				}

				// console.log(this.detailList)
				let that = this;
				//  高度自适应
				uni.getSystemInfo({
					success: function(res) {
						let calc = res.windowHeight + 130;
						that.winHeight = calc;
					}
				});
			},
			chooseCraftman() {
				uni.navigateTo({
					url: '../craftsman/craftsman'
				})
			},
			changOrderTime() {
				uni.navigateTo({
					url: '../index/chooseTime?staffId=' + this.detailList.projectOrderRelevanceLists[0].staffId +
						'&type=' + '1' +
						'&changeorderid=' + this.detailList.projectOrderRelevanceLists[0].appointmentId
				})
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal1(e) {
				this.modalName = null
			},
			hideModal(e) {
				var myDate = new Date();
				var y = myDate.getFullYear()
				var m = myDate.getMonth() + 1;
				m = m < 10 ? '0' + m : m;
				var d = myDate.getDate();
				d = d < 10 ? ('0' + d) : d;
				var h = myDate.getHours()
				h = h < 10 ? '0' + h : h;
				var m1 = myDate.getMinutes()
				m1 = m1 < 10 ? '0' + m1 : m1;
				var s = myDate.getSeconds()
				s = s < 10 ? '0' + s : s;
				var time = y + '-' + m + '-' + d + ' ' + h + ':' + m1 + ':' + s;
				this.modalName = null
				uni.request({ //获取购物券
					method: 'POST',
					url: getApp().globalData.url + '/applet/order/updateOrder',
					data: {
						"orderId": this.orderId,
						refundInformation: this.refunse,
						updateTime: time,
						consumptionState: this.detailList.consumptionState
					},
					header: {
						"Content-Type": "application/json" //如果为空，加上头部接收     
					},
					success: (res) => {
						if (res.data.result == 'success') {
							uni.request({ //获取购物券
								method: 'GET',
								url: getApp().globalData.url + '/applet/appoint/updateDelState',
								data: {
									appointmentId: this.detailList.projectOrderRelevanceLists[0]
										.appointmentId,
								},
								header: {
									"Content-Type": "application/json" //如果为空，加上头部接收     
								},
								success: (res) => {
									console.log(res, '1111111')
								}
							})
							uni.showToast({
								title: '取消订单成功',
								icon: 'success'
							})
							uni.navigateTo({
								url: "../myOrder/myOrder?index=" + 5
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
			radioChange: function(e) {
				this.refunse = e.detail.value
			},
			comAdvice() {
				//console.log));
				var list = encodeURIComponent(JSON.stringify(this.detailList))
				uni.navigateTo({
					url: '../myOrder/comAdvice?detailList=' + list + '&state=' + this.states
				})
			},
			evalute() {
				uni.navigateTo({
					url: '../myOrder/evaluate?item=' + encodeURIComponent(JSON.stringify(this.detailList))
				})
			},
			projectDetails(id) {
				uni.navigateTo({
					url: '../giftdetails/projectdetail?serveId=' + id
				})
			}
		}
	}
</script>


<style scoped>
	.occupymodal {
		background-color: #fff;
		height: 50px;
		width: 100%;
	}

	.page {
		position: absolute;
		bottom: 0px;
		top: 0px;
		background-color: #fff !important;
		width: 100%;
		/* height: 100%; */

	}

	/* 头部部分 */
	.page_top {
		width: 100%;
		height: 135px;
		background-color: #CA89FF;
		position: relative;
	}

	.topicon {
		color: rgba(255, 255, 255, 1);
		font-size: 25px;
		/* padding-top: 3px; */
		margin-top: 5%;
		margin-left: 5%;
		font-weight: bold;
	}

	.topicon1 {
		color: rgba(255, 255, 255, 1);
		font-size: 14px;
		margin-left: 15%;
		font-weight: bold;
	}

	.topicon11 {
		color: rgba(255, 255, 255, 1);
		font-size: 14px;
		font-weight: bold;

	}

	.topicon2 {
		color: rgba(255, 255, 255, 1);
		font-size: 15px;
		margin-left: 55%;
		width: 100%;
	}

	.topicon3 {
		color: rgba(255, 255, 255, 1);
		font-size: 20px;
		position: absolute;
		top: 3%;
		right: 22%;
	}

	.top_text {
		color: rgba(255, 255, 255, 1);
		font-size: 23px;
		margin-top: 4%;
		margin-left: 2%;
	}

	.top_time {
		position: absolute;
		top: 25%;
		color: rgba(255, 255, 255, 1);
		right: 5%;
	}

	.top_time1 {
		position: absolute;
		top: 4%;
	}

	.top_time11 {
		width: 100%;
		position: absolute;
		top: 23%;
		left: 8%;

	}

	.order_modal {
		width: 90%;
		position: absolute;
		top: 13%;
		right: 5%;
		left: 5%;
		height: 126px;
		color: rgba(80, 80, 80, 1);
		background-color: rgba(255, 255, 255, 1);
		border-radius: 4px;
		font-size: 14px;
		line-height: 150%;
		box-shadow: 0px 9px 40px 3px rgba(0, 0, 0, 0.5);
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
		width: 90%;
		text-align: left;
		padding-left: 10px;
		font-size: 14px;
	}

	/* 服务模块 */
	.pro_modal {
		background-color: #fff;
		padding-top: 260upx;
		width: 100%;
	}

	.pro_top {
		padding-bottom: 10px;
		border-bottom: 1px solid #e5e5e5;
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
		width: 25%;
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
		border-bottom: 1px solid #e5e5e5;
		margin-top: 15px;
		padding-bottom: 15px;
		padding-left: 15px;
	}

	.detailList_price {
		color: rgba(255, 108, 144, 1);
		font-size: 14px;
	}

	.pay_modal {
		margin-top: 10px;
		width: 100%;
		height: 100px;
		background-color: #fff;
		margin-bottom: 10px;
	}

	.pay_left {
		width: 22%;
		letter-spacing: 1px;
		color: rgba(80, 80, 80, 1);
		font-size: 14px;
		font-weight: bold;
	}

	.pay_left1 {
		width: 40%;
		letter-spacing: 1px;
		color: rgba(80, 80, 80, 1);
		font-size: 14px;
		font-weight: bold;
	}

	.hei {
		height: 30px;
		line-height: 30px;
		padding-left: 15px;
	}

	.allprice_modal {
		background-color: #fff;
		width: 100%;
		margin-bottom: 10px;
		border-bottom: 1px solid #e5e5e5;
	}

	.allprice_wid {
		width: 68%;
		text-align: right;
	}

	.truePrice {
		height: 30px;
		width: 100%;
		/* margin-bottom: 100px; */
		margin-top: 5px;
		padding-left: 55%;
	}

	.truePrice1 {
		height: 30px;
		width: 100%;
		/* margin-bottom: 100px; */
		margin-top: 5px;
		padding-left: 69%;
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
		font-size: 12px;
		text-align: center;
		margin-right: 10px;
	}

	/* 底部窗口 */
	.cu_dialog2 {
		position: relative;
		display: inline-block;
		vertical-align: middle;
		height: 330px;
		background-color: #fff;
		border-radius: 5px;
		width: 100%;
		overflow: hidden;
		position: relative;
	}

	/* 必选项 */
	.radio-group {
		background-color: #fff;
		width: 100%;
		margin: 10px 0;
	}

	.radio_click {
		display: flex;
		flex-direction: row;
		height: 45px;
		line-height: 45px;
		margin: 0px 14px;

	}

	.price {
		font-size: 14px;
		width: 68%;
		text-align: right;
	}

	uni-radio .uni-radio-input {
		-webkit-appearance: none;
		appearance: none;
		margin-right: 5px;
		outline: 0;
		border: 1px solid #d1d1d1;
		background-color: #fff;
		border-radius: 50%;
		width: 17px;
		height: 17px;
		position: relative;
	}

	.okBtn {
		position: absolute;
		bottom: 0px;
		left: 33%;
		width: 34%;
		height: 30px;
		color: rgba(255, 255, 255, 1);
		background-color: rgba(212, 48, 48, 1);
		border-radius: 14px;
		font-size: 14px;
		line-height: 30px;
		text-align: center;
		margin: 10px 0;

	}
</style>