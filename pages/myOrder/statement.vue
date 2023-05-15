<template>
	<view id="statement">
		<view class="pay_top">
			<view class="top_title">
				<view class="text">
					顾客
				</view>
				<view class="text">
					性别
				</view>
				<view class="text">
					开单员
				</view>
			</view>
			<view class="top_content" v-for="(item,index) in paylist" :key="index">
				<view class="pay_name wid1" style="position: relative;">
					<view class="serial">{{index+1}}</view><text>{{item.cusName}}</text>
					<text class="font" style="position: absolute;right: 16upx;color: #E8CA1D;"
						v-if="item.typeId != '1'"></text>
					<text class="font" style="position: absolute;right: 16upx;color: #E8CA1D;"
						v-if="item.typeId == '1'">&#xe65e;</text>
					<text class="font" style="position: absolute;right:-10upx;color: #FB4B5C;font-weight: bold;"
						v-if="item.isImport == true">主</text>
					<text class="font" style="position: absolute;right:-10upx;color: #FB4B5C;font-weight: bold;"
						v-if="item.isImport == false"></text>
				</view>
				<view class="pay_tel wid1" v-if="item.cusSex == '1'">男</view>
				<view class="pay_tel wid1" v-if="item.cusSex == '2'">女</view>
				<view class="pay_staff wid1">
					{{item.staffName}}
				</view>
			</view>
		</view>
		<!-- 项目模块 -->
		<view class="pay_top">
			<view class="top_title">
				<view class="text">
					手艺人
				</view>
				<view class="text">
					服务项目
				</view>
				<view class="text">
					收费
				</view>
			</view>
			<view class="middle_content" v-for="(item,index) in paylist" :key="index">
				<view style="position: relative;">
					<view class="pro_serial">{{index+1}}</view>
					<view class="child " v-for="(itemable, id) in item.projectOrderRelevanceLists" :key="id">
						<view class="flex_row">
							<view class="wid w flex_column">
								<text>{{itemable.staName}} </text>
								<!-- <view class="pro_name " v-for="(child,it) in itemable.craftname" :key="it">
										 <text v-if="child.ifappoint" style="color: red;position: absolute;right: -24upx;">指定</text>
									</view> -->
							</view>
							<view class="pay_tel wid">
								{{itemable.serveName}}
							</view>
							<view class="pay_staff wid">
								￥{{itemable.suggestPrice}}
							</view>
						</view>
						<view class="flex_row" style="padding-top: 10px;" @tap="showModal($event,index,id)"
							data-target="bottomModal">
							<view class="" style="width: 65%;padding-left: 7%;">
								红包/会员卡
							</view>
							<view class="redline">
								<text class="font" style="font-size: 12px;">&#xe660;</text>选择优惠
							</view>
							<view class="font"
								style="font-size: 20px; color: #CCCCCC;margin: auto 0;font-weight: bold;padding-left: 4px;">
								&#xe604;
							</view>
						</view>
						<view class="paycarlist" @click="subpayred" v-if="itemable.paylists.name!=undefined">
							<view class="paycar_name">
								{{itemable.paylists.name}}
							</view>
							<view class="paycar_price">
								-￥{{itemable.paylists.price}}
							</view>
							<view class="subicon font">
								<!-- 删除优惠的红包 -->
								&#xe6aa;
							</view>
						</view>
					</view>
				</view>
				<view class="allprice">
					小计：￥{{item.totalPrice}}
				</view>
			</view>
		</view>
		<!-- 加入商品模块 -->
		<view class="pay_top">
			<view class="top_title">
				<view class="text">
					商品名称
				</view>
				<view class="text">
					规格
				</view>
				<view class="text">
					价格
				</view>
			</view>
			<view class="top_content_com" v-for="(item,index) in commentlist" :key="index">
				<view class="wid2 nowrap">
					{{item.name}} <text style="font-size: 20upx;color: #8F8D8E;">({{item.size}})</text>
				</view>
				<view class="pay_tel wid3" style="border: 2upx solid #E5E5E5;">
					<text class="font" style="font-size: 16px; font-weight: bold;"
						@click="addnumber(index)">&#xe641;</text>
					<text style="padding: 0 30upx;font-size: 30upx;">{{item.number}}</text>
					<text @click="subnumber(index)" class="font"
						style="font-size: 16px; font-weight: bold;">&#xe644;</text>
				</view>
				<view class="pay_staff wid4">
					￥{{item.price}}
				</view>
				<view class="pay_staff wid5 subicon font" @click="subcomment(index)">
					&#xe6aa;
				</view>
			</view>
			<view v-if="commentlist.length>0" class="flex_row" style="padding-top: 10px;padding-bottom: 10px;"
				@tap="showModal1" data-target="bottomModal1">
				<view class="" style="width: 65%;padding-left: 7%;">
					红包/会员卡
				</view>
				<view class="redline">
					<text class="font" style="font-size: 12px;">&#xe660;</text>选择优惠
				</view>
				<view class="font"
					style="font-size: 20px; color: #CCCCCC;margin: auto 0;font-weight: bold;padding-left: 4px;">
					&#xe604;
				</view>
			</view>
			<view class="paycarlist" v-for="(item,index) in paycarlist" :key="index" @click="subproCar(index)">
				<view class="paycar_name">
					{{item.cardName}}
				</view>
				<view class="paycar_price">
					-￥{{item.price}}
				</view>
				<view class="subicon font">
					<!-- 删除优惠的红包 -->
					&#xe6aa;
				</view>
			</view>
			<view style="height: 10px;"></view> <!-- 空白行 -->
			<view class="addcombtn" @click="addcomment">
				添加商品
			</view>
		</view>
		<!-- 升级的卡片模块 -->
		<!-- 底部窗口 begin -->
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal1'?'show':''">
			<view class="cu_dialog1">
				<view class="cu-bar bg-white">
					<view style="color: rgba(80, 80, 80, 1);font-size: 28upx;font-weight: bold;margin-left: 5%;">抵扣方式
					</view>
					<view class="action text-gray font" @tap="hideModal" style="font-size: 40upx;">&#xe64a;</view>
				</view>
				<scroll-view class="swiper-one-list" scroll-y="true" style="height: 75% !important;">
					<view class="" v-if="carlist.length == 0 "
						style="text-align: center;width: 100%;padding-top: 20px;">
						暂无可选会员卡~
					</view>
					<view v-for="(car,index) in carlist" :key="index" class="list1">
						<view class="vip_car_bc1" style="background-image: linear-gradient(45deg, #FC84B5, #FA51A0)">
							<text class="car_number1">{{ car.cardTypeName }}</text>
							<text class="car_name1">{{ car.cardName }}</text>
							<view class="vipbacimage car1">
								<image :src="'http://my.cloud.xmstruggle.com/' + car.cardImg" mode="aspectFill"></image>
							</view>
						</view>
						<view class="circle1" :class="{onvipcar: car.checked == true}" @click="chooseit2(index)">
							<!-- <view class="circlemin1" :class="{on1: car.checked == true}" @click="chooseit1(index)">
						</view> -->
						</view>
					</view>
				</scroll-view>
				<view class="submit" @tap="hideModal">
					确定
				</view>
			</view>
		</view>
		<!-- 总金额模块 -->
		<view class="bottom_show">
			<view class="bottom_line">
				<view class="left">
					总金额
				</view>
				<view class="right">
					￥{{AllprojectPrice}}
				</view>
			</view>
			<!-- 卡循环 -->
			<view class="conpou bottom_line ">
				<view class="left">
					优惠券/会员卡
				</view>
				<!-- 	<view style="display: flex;flex-direction: row;" class="right">
						<view class="caricon"  @click="upvipcar"  >
							升级会员
						</view>
				</view> -->

			</view>
			<view class="bottom_line" v-for="(tab, ind) in shopcarlist" :key="ind">
				<view class="paycarlist">
					<view class="paycar_name">
						{{tab.cardName}}
					</view>
					<view class="paycar_price">
						￥{{tab.ordAchievement}}
					</view>
					<view class="subicon font" @click="subpayVipcar(ind)">
						<!-- 删除优惠的会员卡 -->
						&#xe6aa;
					</view>
				</view>

			</view>
			<!-- 实付金额 -->
			<view class="true_price bottom_line">
				<view class="left">
					实付金额
				</view>
				<view class="right">
					￥{{trueprice}}
				</view>
			</view>
		</view>

		<!-- 底部窗口 begin -->
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''">
			<view class="cu_dialog1">
				<view class="cu-bar bg-white">
					<view style="color: rgba(80, 80, 80, 1);font-size: 28upx;font-weight: bold;margin-left: 5%;">抵扣方式
					</view>
					<view class="action text-gray font" @tap="hideModal" style="font-size: 40upx;">&#xe64a;</view>
				</view>
				<scroll-view class="top-menu-view" scroll-x="true" :scroll-left="scrollLeft">
					<block v-for="(menuTab, index) in menuTabs" :key="index">
						<view class="menu-one-view" v-bind:id="'tabNum' + index" @click="swichMenu(index)">
							<view :class="[currentTab == index ? 'menu-one-act' : 'menu-one']"
								style="display: flex;flex-direction: column;">
								<view class="menu-one-txt">{{ menuTab.name }} ({{menuTab.number}})</view>
								<!-- <view class="menu-one-bottom"> -->
							</view>
						</view>
					</block>
				</scroll-view>
				<swiper :current="currentTab" class="swiper-box-list" duration="300" @change="swiperChange">
					<swiper-item>
						<!-- 红包部分-->
						<scroll-view class="swiper-one-list" scroll-y="true">
							<view class="" v-if="redlist.length == 0 "
								style="text-align: center;width: 100%;padding-top: 20px;">
								暂无可选红包~
							</view>
							<view class="list" v-for="(item, index) in redlist" :key="index">
								<view class="" style='width: 28%;background-color: red;height: 100%;'>
									<view class="list_usecause">￥{{ item.redPacketMoney }}</view>
									<view class="list_usecause1">满￥{{ item.redPacketSill }}可用</view>
								</view>
								<view class="list_name">{{ item.redPacketName }}</view>
								<view class="list_time">{{ item.validStartTime }}-{{item.validEndTime}}</view>
								<view class="circle" :class="{on: item.checked == true}" @click="chooseit(index)">
									<!-- <view class="circlemin" :class="{on1:  item.checked == true}" @click="chooseit(index)">
									</view> -->
								</view>
							</view>
						</scroll-view>
					</swiper-item>
					<swiper-item>
						<scroll-view class="swiper-one-list" scroll-y="true">
							<view class=""
								v-if="paylist[currentcproId].projectOrderRelevanceLists[currentchildId].carlist.length == 0 "
								style="text-align: center;width: 100%;padding-top: 20px;">
								暂无可选会员卡~
							</view>
							<view
								v-for="(car,index) in paylist[currentcproId].projectOrderRelevanceLists[currentchildId].carlist"
								:key="index" class="list1">
								<view class="vip_car_bc1"
									style="background-image: linear-gradient(45deg, #FC84B5, #FA51A0)">
									<text class="car_number1">{{ car.cardTypeName }}</text>
									<text class="car_name1">{{ car.cardName }}</text>
									<view class="vipbacimage car1">
										<image :src="'http://my.cloud.xmstruggle.com/' + car.cardImg" mode="aspectFill">
										</image>
									</view>
								</view>
								<view class="circle1" :class="{onvipcar: car.checked == true}"
									@click="chooseit1(index)">
									<!-- <view class="circlemin1" :class="{on1: car.checked == true}" @click="chooseit1(index)">
									</view> -->
								</view>
							</view>
						</scroll-view>
					</swiper-item>

				</swiper>
				<view class="submit" @tap="hideModal">
					确定
				</view>
			</view>
		</view>
		<view class="bottom" v-if="typeId == 1 && state == 0">
			<view class="show_price1" @click="showprice">
				<!-- 支付跳转传递礼包的价格 -->
				立即支付
			</view>
		</view>
		<view class="bottom" v-if="typeId != 1 && state == 0">
			<view class="show_price" @click="showprice">
				<!-- 支付跳转传递礼包的价格 -->
				立即支付
			</view>
			<button class="buybtn" open-type="share">
				其他代付
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				typeId: '',
				staffId: "",
				settleAccountsId: '',
				allproductMoney: 0,
				paycarlist: [], //商品会员卡获取
				upgradeCarList: [], //选择要升级的卡
				cueIndex: 0, //选择的付款方式
				chooseAllrespack: [],
				resultprice: '123',
				trueprice: 0,
				choose: 0,
				currentcproId: 0,
				currentchildId: 0, //点击优惠的id
				choosevipcard: 0,
				AllprojectPrice: 0, //服务项目总价格
				modalName: null,
				scrollLeft: 0,
				isClickChange: false,
				currentTab: 0,
				nothaveCar: false,
				shopcarlist: [],
				scrollHeight: 0,
				vipcarlength: 0,
				menuTabs: [{
						name: '红包',
						number: 0
					},
					{
						name: '会员卡',
						number: 0
					}
				],
				paylist: [], // 项目
				orderId: 0,
				carlist: [],
				projectlist: [],
				redlist: [{
					id: 0,
					classify: "discount",
					name: '烫发项目优惠券',
					begintime: '2019.02.19',
					endtime: '2019.05.23',
					usecause: '￥15满200可用'
				}],
				commentlist: [],
				cardOrderNumber: '',
				lastchooseCardindex: '',
				lastchooseCardilist: {},
				boolfinish: false,
				ordPaymentMethod: 1,
				state: 0
			}
		},
		onShow() {
			if (getApp().globalData.ifExit == true) {
				for (var i = 0; i < this.paylist.length; i++) {
					for (var j = 0; j < this.paylist[i].projectOrderRelevanceLists.length; j++) {
						this.trueprice += this.paylist[i].projectOrderRelevanceLists[j].paylists.price
						this.paylist[i].projectOrderRelevanceLists[j].paylists = []
					}
				}

			}
			this.commentlist = this.commentlist.concat(uni.getStorageSync('sellproduct'))
			var list = uni.getStorageSync('sellproduct')
			for (let i = 0; i < list.length; i++) {
				this.AllprojectPrice += list[i].price
				this.trueprice += list[i].price
			}
			console.log(this.commentlist, 'onReady')
		},

		onLoad(props) {
			console.log(props)
			if (props.typeId == null || props.typeId == undefined || props.typeId == '') {
				this.ordPaymentMethod = 1
			} else {
				this.typeId = props.typeId
				this.ordPaymentMethod = 9
			}
			if (uni.getStorageSync('openId') === '' || uni.getStorageSync('user') === null) {
				setTimeout(function() {
					uni.reLaunch({
						url: '/pages/empty/empty'
					}, 500)
				})
			}
			uni.setStorageSync('sellproduct', [])
			uni.request({ //获取购物券
				method: 'POST',
				url: getApp().globalData.url + `/applet/order/settleAccountsDetailInfo/${Number(props.id)}`,
				data: {
					"storeId": uni.getStorageSync('storeId'),
					customerId: uni.getStorageSync('user').customerId,
					// customerId: 51,
					"typeId": 3
				},
				header: {
					"Content-Type": "application/json" //如果为空，加上头部接收     
				},
				success: (res) => {
					console.log(res)
					this.state = res.data.result.state
					this.settleAccountsId = res.data.result.settleAccountsId
					this.staffId = res.data.result.staffId
					this.orderId = res.data.result.orderId
					this.orderMesg = res.data.result
					this.AllprojectPrice = 0
					this.trueprice = res.data.result.totalMoney
					this.paylist = res.data.result.backstageOrders
					this.payerId = res.data.result.payerId
					for (var item of this.paylist) {
						this.$set(item, 'isImport', false)
						this.$set(item, 'totalPrice', 0)
						if (item.ordCustomerId == this.payerId) {
							item.isImport = true
						} else {
							item.isImport = false
						}
						for (var item01 of item.projectOrderRelevanceLists) {
							this.$set(item01, 'payredpacklist', 0)
							this.$set(item01, 'payvipcarlist', 0)
							this.$set(item01, 'paylists', {}) //选择的会员卡项目
							this.$set(item01, 'paychooselists', {}) //选中的会员卡修改传递的数组
							this.$set(item01, 'carlist', []) //选中的项目绑定的会员卡列表
							item.totalPrice += item01.suggestPrice
						}
					}
					for (let i = 0; i < this.paylist.length; i++) { //子项目价格实付金额不加
						// this.trueprice += this.paylist[i].totalPrice
						this.AllprojectPrice += this.paylist[i].totalPrice
					}
					//卖品部分
					var list = []
					if (res.data.result.sellGoodOrders.length != 0) {
						for (var i = 0; i < res.data.result.sellGoodOrders.length; i++) {
							for (var j = 0; j < res.data.result.sellGoodOrders[i].backstageSaleOrders
								.length; j++) {
								var item = res.data.result.sellGoodOrders[i].backstageSaleOrders[j]
								this.trueprice += Number(item.goodsSellPrice * item.saleQuantity)
								this.AllprojectPrice += Number(item.goodsSellPrice * item.saleQuantity)
								list.push({
									name: item.goodsName,
									size: item.goodsSize,
									price: item.goodsSellPrice * item.saleQuantity,
									number: item.saleQuantity,
									originprice: item.goodsSellPrice,
									goodsId: item.goodId,
									staffId: res.data.result.staffId
								});
							}
						}

						this.commentlist = list
					}
					//会员卡
					this.shopcarlist = res.data.result.chargeCardOrderList
					for (var item of res.data.result.chargeCardOrderList) {
						this.trueprice += Number(item.ordAchievement)
						this.AllprojectPrice += Number(item.ordAchievement)
					}

					getApp().globalData.commentlist = this.commentlist
					// uni.setStorageSync('sellproduct',this.commentlist)
					console.log(res, '结账单')

				},
				fail: (err) => {
					uni.showToast({
						title: '网络请求超时,请重试',
						icon: 'none'
					})
				}
			})
		},
		// onHide() {
		// 	uni.showToast({
		// 		title:'隐藏'
		// 	})
		// 	console.log('隐藏')
		// },
		onUnload() {
			if (getApp().globalData.vipcarList.length != 0) {
				uni.request({ //获取购物券
					method: 'POST',
					url: getApp().globalData.url + '/applet/card/rollBackCardInfoByServe', //保存所选会员卡回滚
					data: JSON.stringify(getApp().globalData.vipcarList),
					header: {
						"Content-Type": "application/json" //如果为空，加上头部接收     
					},
					success: (res) => {
						console.log(res, '退出保存')

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
		methods: {
			subpayVipcar(index) { //减优惠卡数组
				var list = this.shopcarlist;
				this.AllprojectPrice -= Number(list[index].ordAchievement);
				this.trueprice -= Number(list[index].ordAchievement);
				this.shopcarlist.splice(index, 1);

			},
			onShareAppMessage: function() {
				return {
					title: '你的好友给您发了一个代付订单，请查阅',
					desc: '分享页面的内容',
					path: 'pages/myOrder/statement?id=' + this.settleAccountsId + '&typeId=' + 1 // 路径，传递参数到指定页面。
				}
			},
			chooseit(index) { //点击清空会员卡已有的   红包选择
				console.log(this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId]
					.payredpacklist, '2223')
				if (this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].payredpacklist == 0 &&
					this.paylist[
						this.currentcproId].projectOrderRelevanceLists[this.currentchildId].payvipcarlist == 0) {
					this.trueprice -= this.redlist[index].redPacketMoney
				} else {
					console.log('~2')
					this.trueprice += this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId]
						.paylists.price
					this.trueprice -= this.redlist[index].redPacketMoney
				}
				for (let i = 0; i < this.redlist.length; i++) {
					this.redlist[i].checked = false
				}
				for (let i = 0; i < this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId]
					.carlist.length; i++) {
					this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].carlist[i].checked =
						false
				}
				this.redlist[index].checked = true
				this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].payredpacklist = this
					.redlist[
						index].releaseRecordClientId
				this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].payvipcarlist =
					0 //每个子项目选择的红包或者会员卡
				this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].paylists.name = this
					.redlist[index]
					.redPacketName
				this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].paylists.price = this
					.redlist[
						index].redPacketMoney
				var list = []
				for (var i = 0; i < this.paylist.length; i++) {
					for (var j = 0; j < this.paylist[i].projectOrderRelevanceLists.length; j++) {
						console.log(this.paylist[i].projectOrderRelevanceLists[j].paychooselists,
							'this.paylist[i].projectOrderRelevanceLists[j].paychooselists')
						if (JSON.stringify(this.paylist[i].projectOrderRelevanceLists[j].paychooselists) != "{}")
							list.push(this.paylist[i].projectOrderRelevanceLists[j].paychooselists)
					}
				}
				getApp().globalData.vipcarList = list

				// 0没用  1使用
			},
			chooseit1(index) { //会员卡
				console.log(this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId]
					.payredpacklist, '会员卡')
				console.log(this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].payvipcarlist,
					'会员卡1111')
				if (this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].payredpacklist != 0 &&
					this.paylist[
						this.currentcproId].projectOrderRelevanceLists[this.currentchildId].payvipcarlist == 0) {
					console.log('~1')
					this.trueprice += this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId]
						.paylists.price
				}
				if (this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].payredpacklist == 0 &&
					this.paylist[
						this.currentcproId].projectOrderRelevanceLists[this.currentchildId].payvipcarlist != 0) {
					console.log('~1')
					this.trueprice += this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId]
						.paylists.price
				}
				if (this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].cardOrderNumber ==
					'' || this.paylist[
						this.currentcproId].projectOrderRelevanceLists[this.currentchildId].cardOrderNumber == null || this
					.paylist[this.currentcproId]
					.projectOrderRelevanceLists[this.currentchildId].cardOrderNumber == undefined) {

				} else {
					uni.request({ //获取购物券
						method: 'POST',
						url: getApp().globalData.url + '/applet/card/updateOpenChargeCardInfoByServe',
						data: this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId]
							.paychooselists,
						header: {
							"Content-Type": "application/json" //如果为空，加上头部接收     
						},
						success: (res) => {
							console.log(res, '会员卡修改11111111111')

						},
						fail: (err) => {
							uni.showToast({
								title: '网络请求超时,请重试',
								icon: 'none'
							})
						}
					})
				}
				//代表当前会员卡数组下被选中的消费订单
				if (this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].carlist[index]
					.cardType == 1 ||
					this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].carlist[index]
					.cardType == 4) {
					var money = this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].carlist[
							index].optimalAmount +
						this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].carlist[index]
						.usableMoney
					console.log(money, '~3')
				} else {
					var money = this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].carlist[
						index].optimalAmount
					console.log('~4')
				}
				//计算会员卡优惠价格
				if (money >= this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId]
					.suggestPrice) {
					console.log(this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId]
						.suggestPrice, '~5')
					this.trueprice = this.trueprice - this.paylist[this.currentcproId].projectOrderRelevanceLists[this
							.currentchildId]
						.suggestPrice
					this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].paylists.price = this
						.paylist[
							this.currentcproId].projectOrderRelevanceLists[this.currentchildId].suggestPrice
					console.log(this.trueprice, '~5')
				} else {
					console.log('~6')
					this.trueprice = this.trueprice - money
					this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].paylists.price =
						money //展示选中会员卡的钱
				}
				//计算使用会员卡总价的变化
				for (let i = 0; i < this.redlist.length; i++) {
					this.redlist[i].checked = false
				}
				for (let i = 0; i < this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId]
					.carlist.length; i++) {
					this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].carlist[i].checked =
						false
				}
				this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].paylists.name = this
					.paylist[this.currentcproId]
					.projectOrderRelevanceLists[this.currentchildId].carlist[index].cardName //展示选中会员卡的名字
				this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].carlist[index].checked =
					true
				this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].payredpacklist =
					0 ///单项目选中的红包价格
				this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].payvipcarlist = this
					.paylist[this.currentcproId]
					.projectOrderRelevanceLists[this.currentchildId].carlist[index].openChargeCardId ///单项目选中的红包id
				var list = {}
				if (this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].carlist[index]
					.cardDiscountInfos
					.length == 0) {
					list.creditAmount = ''
					list.giveCreditAmount = ''
					list.numberUse = ''
				} else {
					if (this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].carlist[index]
						.cardType == 1) {
						list.creditAmount = this.paylist[this.currentcproId].projectOrderRelevanceLists[this
							.currentchildId].carlist[
							index].usableMoney
						list.giveCreditAmount = this.paylist[this.currentcproId].projectOrderRelevanceLists[this
							.currentchildId].carlist[
							index].giveGold
					} else if (this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].carlist[
							index].cardType ==
						2) { //会费卡
						list.creditAmount = this.paylist[this.currentcproId].projectOrderRelevanceLists[this
							.currentchildId].carlist[
							index].discountMoney
					} else { //项目卡
						list.numberUse = this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId]
							.carlist[index].numberUse
					}
				}
				// console.log(this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].carlist[index].giveDiscountInfos,'this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].carlist[index].giveDiscountInfos')
				if (this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].carlist[index]
					.giveDiscountInfos
					.length == 0) {
					list.giveDiscountInfo = {}
				} else {
					var lis = {}
					lis.giveServe = this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId]
						.carlist[index].giveDiscountInfos[
							0].giveServe
					lis.giveServeTime = this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId]
						.carlist[index]
						.giveDiscountInfos[0].giveServeTime
					list.giveDiscountInfo = lis
				}
				// console.log(list,'list')
				// this.lastchooseCardindex = index
				// this.lastchooseCardilist = list
				uni.request({ //获取购物券
					method: 'POST',
					url: getApp().globalData.url + '/applet/card/updateOpenChargeCardInfoByServe',
					data: {
						"storeId": uni.getStorageSync('storeId'),
						"commonOrderId": this.paylist[this.currentcproId].orderId,
						"plusMinusType": 1, //选中
						"openChargeCardId": this.paylist[this.currentcproId].projectOrderRelevanceLists[this
							.currentchildId].carlist[
							index].openChargeCardId,
						"ordCustomerId": this.paylist[this.currentcproId].ordCustomerId,
						"staffId": this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId]
							.staffId,
						"serveId": this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId]
							.serveId,
						"cardType": this.paylist[this.currentcproId].projectOrderRelevanceLists[this
							.currentchildId].carlist[index].cardType,
						"settlementCard": list
					},
					header: {
						"Content-Type": "application/json" //如果为空，加上头部接收     
					},
					success: (res) => {
						console.log(res.data.cardOrderNumber, '会员卡修改')
						this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId]
							.cardOrderNumber = res.data.cardOrderNumber
						var lists = {}
						lists.storeId = uni.getStorageSync('storeId'),
							lists.commonOrderId = this.paylist[this.currentcproId].orderId,
							lists.plusMinusType = 2, //选中
							lists.openChargeCardId = this.paylist[this.currentcproId]
							.projectOrderRelevanceLists[this.currentchildId].carlist[
								index].openChargeCardId,
							lists.ordCustomerId = this.paylist[this.currentcproId].ordCustomerId,
							lists.staffId = this.paylist[this.currentcproId].projectOrderRelevanceLists[this
								.currentchildId].staffId,
							lists.serveId = this.paylist[this.currentcproId].projectOrderRelevanceLists[this
								.currentchildId].serveId,
							lists.cardType = this.paylist[this.currentcproId].projectOrderRelevanceLists[this
								.currentchildId].carlist[
								index].cardType,
							lists.orderId = res.data.cardOrderNumber
						lists.settlementCard = list
						console.log(list, '1111111111111111')
						this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId]
							.paychooselists = lists
						var listss = []
						for (var i = 0; i < this.paylist.length; i++) {
							for (var j = 0; j < this.paylist[i].projectOrderRelevanceLists.length; j++) {
								if (JSON.stringify(this.paylist[i].projectOrderRelevanceLists[j]
										.paychooselists) != "{}")
									listss.push(this.paylist[i].projectOrderRelevanceLists[j].paychooselists)
							}
						}
						console.log(listss, 'this.paylist[i].projectOrderRelevanceLists[j].paychooselists')
						getApp().globalData.vipcarList = listss
					},
					fail: (err) => {
						uni.showToast({
							title: '网络请求超时,请重试',
							icon: 'none'
						})
					}
				})


			},

			showprice() {
				var that = this
				var openId = uni.getStorageSync('openId')
				if (!openId) {
					uni.reLaunch({
						url: '../empty/empty'
					})
					return;
				}
				uni.request({ //获取购物券
					method: 'POST',
					url: getApp().globalData.url + '/wx/wxPay', //保存所选会员卡回滚
					data: {
						payAmount: 0.01,
						openId: openId,
						tradeType: 'JSAPI',
						mechanismId: uni.getStorageSync('mechanismId')
					},
					header: {
						"Content-Type": "application/json" //如果为空，加上头部接收     
					},
					success: (res) => {
						console.log(res, 'res')
						uni.requestPayment({
							timeStamp: res.data.data
							.timeStamp, //记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了
							nonceStr: res.data.data.nonceStr,
							package: `prepay_id=${res.data.data.prepayId}`,
							signType: res.data.data.signType,
							paySign: res.data.data.sign,
							success: function(event) {
								// success   
								console.log(event);
								if (event.errMsg == "requestPayment:ok") {
									uni.request({ //获取购物券
										method: 'POST',
										url: getApp().globalData.url +
											'/applet/order/settleAccountsIsPay',
										data: {
											settleAccountsId: that.settleAccountsId
										},
										header: {
											"Content-Type": "application/x-www-form-urlencoded" //如果为空，加上头部接收     
										},
										success: (res) => {
											if (res.data.result == 'success') {
												uni.showToast({
													title: '订单已支付,请勿重复支付',
													icon: 'none'
												})
											} else {
												uni.showLoading({
													title: '支付中',
													mask: true
												})
												var backstageChargeCardOrders = []
												for (var item of that.shopcarlist) {
													backstageChargeCardOrders.push({
															/** 订单id  都要传入进来 是要算提成的*/
															orderId: item.orderId,
															/** 机构id */
															// ("机构id")
															mechanismId: uni
																.getStorageSync(
																	'mechanismId'),
															/** 门店ID */
															storeId: uni
																.getStorageSync(
																	'storeId'),
															/** 开充卡id  实际上存储的是cardId*/
															openChargeCardId: item
																.openChargeCardId,
															// ("消费的顾客id")
															ordCustomerId: that
																.payerId,
															// ("操作员工id")
															staffId: that.staffId,
															/** 订单状态(0支付1未支付2退单) */
															ordState: 0,
															/** 支付方式:1微信 2支付宝 3会员卡 */
															ordPaymentMethod: that
																.ordPaymentMethod,
															/** 消费金额 */
															// ("消费金额")
															ordAchievement: item
																.ordAchievement,
															/** 开卡3、充卡6、消费卡7 */
															// ("开充卡订单类型 3开卡 6充卡 7消费卡 8赠送 9转入 10转出")
															typeId: 3,
															/** 结账单id*/
															settleAccountsId: that
																.settleAccountsId
														}

													)
												}
												if (that.commentlist.length !=
													0) { // 有卖品
													var billsPrice = 0
													var brandGoodsInventories = []
													var depotOrderDetails = []
													var saleId = ''
													var sellGoodOrders = []
													for (var i = 0; i < that
														.commentlist.length; i++) {
														if (i == 0) {
															saleId = that.commentlist[
																i].goodsId
														} else {
															saleId = saleId + ',' +
																that.commentlist[i]
																.goodsId
														}
													}
													for (var item of that
														.commentlist) {
														billsPrice += item.price
														sellGoodOrders.push({
															staffId: item
																.staffId,
															goodId: item
																.goodsId,
															/** 卖品数量 */
															goodNumber: item
																.number,
															orderStatus: that
																.settleAccountsId
														})
														depotOrderDetails.push({
															/** 卖品编号 */
															goodsNumbering: item
																.goodsId,
															/**  卖品数量 */
															goodsQuantity: item
																.number,
															/** 容量 */
															goodsCapacity: item
																.size,
															/** 出入库方式 */
															depotOrderType: '',
															/**  门店ID */
															storeId: uni
																.getStorageSync(
																	'storeId'),
															/**  顾客/员工 */
															useUserId: 0,
															/** 创建人 */
															operator: 0
														})
														brandGoodsInventories.push({
															goodsId: item
																.goodsId,
															goodsInventory: item
																.number,
															depotOrderType: ''
														})
													}

													uni.request({ //卖品
														method: 'POST',
														url: getApp()
															.globalData.url +
															'/applet/order/settleAccounts',
														data: {
															"depotOrder": { //此处是单对象
																/** 机构ID */
																organizationId: uni
																	.getStorageSync(
																		'mechanismId'
																		),
																/**门店ID*/
																storeId: uni
																	.getStorageSync(
																		'storeId'
																		),
																/** 单据金额 */
																billsPrice: billsPrice,
																/** 单据类型 0：入库 1：出库 */
																billsType: 1,
																/** 出入库方式 0：采购 1：报损2：退货 3：换货 4：领料 5：销售 */
																accessWay: 5,
																/** 状态 0:已确认 1：已支付 2：撤销 */
																isState: 1,
																/** 操作员工/顾客 */
																depotStaff: that
																	.payerId,
																/** 操作 0:员工 1:顾客 */
																depotStaffType: 1,
																/** 操作人 */
																operator: 0
															},
															"depotOrderDetails": depotOrderDetails,
															"brandGoodsInventories": brandGoodsInventories
														},
														header: {
															"Content-Type": "application/json" //如果为空，加上头部接收     
														},
														success: (res) => {
															console.log(
																res,
																'卖品出入')

														},
														fail: (err) => {
															that.error()

														}
													})
													uni.request({
														method: 'POST',
														url: getApp()
															.globalData.url +
															'/applet/order/calSettleAccounts',
														data: {
															projectOrder: { //主要看是否有卖品 可有可无
																// ("卖品id")
																saleId: saleId,
																// ("顾客id")
																ordCustomerId: that
																	.payerId,
																// ("付款人(顾客)id")
																paymentCustomerId: that
																	.payerId,
																// ("订单状态(0待服务1服务中2待结账3已完成4失效)")
																ordState: 3,
																// ("消费状态(0支付1未支付2退单)")
																consumptionState: 0,
																// ("支付方式(微信、支付宝)")
																ordPaymentMethod: that
																	.ordPaymentMethod,
																//@ApiModelProperty("员工id")  如果是店员端那边 staffId不会为空 小程序用户自己添加就为空 (考虑是否能拿到提成)
																// ("订单所带来的收益")
																ordAchievement: billsPrice,
																// ("机构id")
																mechanismId: uni
																	.getStorageSync(
																		'mechanismId'
																		),
																staffId: that
																	.staffId,
																// ("门店id")
																storeId: uni
																	.getStorageSync(
																		'storeId'
																		),
																sellGoodOrders: sellGoodOrders
															},
															backstageChargeCardOrders: backstageChargeCardOrders,
															settleAccounts: {
																/** 结账表id */
																settleAccountsId: that
																	.settleAccountsId,
																/** 订单id,多个 一起结账 */
																orderId: that
																	.orderId,
																/** 是否支付 0否1是 */
																state: 1,
																payMethod: that
																	.ordPaymentMethod,
															}
														},
														header: {
															"Content-Type": "application/json" //如果为空，加上头部接收     
														},
														success: (res) => {
															console.log(
																res,
																'卖品出入')

														},
														fail: (err) => {
															that.error()

														}
													})

												} else {
													uni.request({ //获取购物券
														method: 'POST',
														url: getApp()
															.globalData.url +
															'/applet/order/calSettleAccounts',
														data: {
															projectOrder: {},
															backstageChargeCardOrders: backstageChargeCardOrders,
															settleAccounts: {
																/** 结账表id */
																settleAccountsId: that
																	.settleAccountsId,
																/** 订单id,多个 一起结账 */
																orderId: that
																	.orderId,
																/** 是否支付 0否1是 */
																state: 1
															}
														},
														header: {
															"Content-Type": "application/json" //如果为空，加上头部接收     
														},
														success: (res) => {
															console.log(
																res,
																'卖品出入')

														},
														fail: (err) => {
															that.error()

														}
													})
												}
												var releaseRecordClientId = ''
												var book = 0
												let redList = []

												for (var i = 0; i < that.paylist
													.length; i++) { //红包模块
													for (var j = 0; j < that.paylist[i]
														.projectOrderRelevanceLists
														.length; j++) {
														redList.push({
															redPacketId: that
																.paylist[i]
																.projectOrderRelevanceLists[
																	j]
																.payredpacklist,
															orderId: that
																.orderId,
															resistanceMoney: that
																.paylist[i]
																.projectOrderRelevanceLists[
																	j].paylists
																.price,
															storeId: uni
																.getStorageSync(
																	'storeId'),
															organizationId: uni
																.getStorageSync(
																	'mechanismId'
																	)
														})
														if (that.paylist[i]
															.projectOrderRelevanceLists[
																j].payredpacklist !=
															0 && book == 0) {
															releaseRecordClientId =
																that.paylist[i]
																.projectOrderRelevanceLists[
																	j].payredpacklist
															book = 1
														} else if (that.paylist[i]
															.projectOrderRelevanceLists[
																j].payredpacklist !=
															0 && book == 1) {
															releaseRecordClientId =
																releaseRecordClientId +
																',' + that.paylist[i]
																.projectOrderRelevanceLists[
																	j].payredpacklist
														}

													}
												}
												console.log(releaseRecordClientId)

												if (releaseRecordClientId != '') {
													uni.request({ //提交红包
														method: 'GET',
														url: getApp()
															.globalData.url +
															`/applet/redpacket/updateReleaseRecordClientState/${releaseRecordClientId}/{that.orderId}`,
														header: {
															"Content-Type": "application/json" //如果为空，加上头部接收     
														},
														success: (res) => {
															console.log(
																res,
																'红包')
														},
														fail: (err) => {
															uni.showToast({
																title: '网络请求超时,请重试',
																icon: 'none'
															})
														}
													})
													// 红包消费
													uni.request({
														method: 'POST',
														url: getApp()
															.globalData.url +
															`/applet/resistance/add`,
														data: redList,
														header: {
															"Content-Type": "json" //如果为空，加上头部接收
														},
														success: (res) => {
															console.log(
																res,
																'红包提交')
														}
													})

												}
												// 积分上传
												let integralList = []
												for (let itm of that.paylist) {
													for (let itms of itm
															.projectOrderRelevanceLists) {
														integralList.push({
															orderId: that
																.orderId,
															clientId: that
																.payerId,
															serveId: itms
																.serveId,
															integralMoney: that
																.trueprice,
															storeId: uni
																.getStorageSync(
																	'storeId'),
															organizationId: uni
																.getStorageSync(
																	'mechanismId'
																	)
														})
													}
												}
												uni.request({
													url: getApp().globalData
														.url +
														'/applet/resistance/insertClientIntegral',
													method: 'POST',
													data: integralList,
													header: {
														"Content-Type": "application/vnd.ms-excel" //如果为空，加上头部接收
													},
													success: (res) => {
														console.log(res,
															'积分提交')
													}
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
			},
			addnumber(index) {
				this.commentlist[index].number = this.commentlist[index].number + 1
				this.commentlist[index].price += this.commentlist[index].originprice
				this.AllprojectPrice += this.commentlist[index].originprice
				this.trueprice += this.commentlist[index].originprice
				uni.setStorageSync('sellproduct', this.commentlist);
			},
			upvipcar() {
				// uni.navigateTo({
				// 	url:'../../card/card?typeId=' + 1 + '&settleAccountsId=' + this.settleAccountsId 
				// })
			},
			subnumber(index) {
				if (this.commentlist[index].number == 1) {
					uni.showToast({
						title: '宝贝不能减少了哦',
						icon: 'none'
					})
				} else {
					this.commentlist[index].number = this.commentlist[index].number - 1
					this.commentlist[index].price -= this.commentlist[index].originprice
					this.AllprojectPrice -= this.commentlist[index].originprice
					this.trueprice -= this.commentlist[index].originprice
					uni.setStorageSync('sellproduct', this.commentlist);

				}
			},
			subcomment(index) {
				this.AllprojectPrice -= Number(this.commentlist[index].price) //减商品后修改总金额
				this.trueprice -= Number(this.commentlist[index].price)
				this.commentlist.splice(index, 1); //减加入的商品数量
				if (this.paycarlist.length != 0) {
					this.trueprice += this.paycarlist[0].price
					this.paycarlist = []
				}
				uni.setStorageSync('sellproduct', this.commentlist);
				//修改实际金额的价格
			},
			subpayred(index) { //减红包
				// console.log(this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].paychooselists)
				if (JSON.stringify(this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId]
						.paychooselists) !=
					"{}" && this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId]
					.payredpacklist == 0) {
					uni.request({ //获取购物券
						method: 'POST',
						url: getApp().globalData.url + '/applet/card/updateOpenChargeCardInfoByServe',
						data: this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId]
							.paychooselists,
						header: {
							"Content-Type": "application/json" //如果为空，加上头部接收     
						},
						success: (res) => {
							// console.log(res,'会员卡删除')
							var list = []
							for (var i = 0; i < this.paylist.length; i++) {
								for (var j = 0; j < this.paylist[i].projectOrderRelevanceLists.length; j++) {
									// console.log(this.paylist[i].projectOrderRelevanceLists[j].paychooselists,'this.paylist[i].projectOrderRelevanceLists[j].paychooselists')
									if (JSON.stringify(this.paylist[i].projectOrderRelevanceLists[j]
											.paychooselists) != "{}")
										list.push(this.paylist[i].projectOrderRelevanceLists[j].paychooselists)
								}
							}
							getApp().globalData.vipcarList = list
							this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId]
								.paychooselists = {}
							this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId]
								.cardOrderNumber == ''
						},
						fail: (err) => {
							uni.showToast({
								title: '网络请求超时,请重试',
								icon: 'none'
							})
						}
					})
				}
				if (this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].paylists.price !=
					undefined) {
					this.trueprice += this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId]
						.paylists.price
				}
				this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].paylists.name = undefined
				this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].paylists.price = undefined
				this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].payredpacklist = 0
				this.paylist[this.currentcproId].projectOrderRelevanceLists[this.currentchildId].payvipcarlist = 0
				// console.log(this.paycarlist);
			},
			showModal(e, index, id) {
				this.currentcproId = index
				this.currentchildId = id
				var serveId = this.paylist[index].projectOrderRelevanceLists[id].serveId
				var projectClassId = this.paylist[index].projectOrderRelevanceLists[id].serveClassId
				var redPacketSill = this.paylist[index].projectOrderRelevanceLists[id].suggestPrice
				uni.request({ //获取购物券
					method: 'GET',
					url: getApp().globalData.url +
						`/applet/redpacket/selectAppletRedPacketList/${this.orderMesg.payerId}/${serveId}/${redPacketSill}`,
					header: {
						"Content-Type": "application/json" //如果为空，加上头部接收     
					},
					success: (res) => {
						console.log(res.data.result, '红包')
						this.menuTabs[0].number = res.data.result.length
						if (res.data.result.length == 0) {
							this.nothaveCar = true
						}
						this.redlist = res.data.result
						for (let i = 0; i < this.redlist.length; i++) {
							if (this.redlist[i].releaseRecordClientId == this.paylist[this.currentcproId]
								.projectOrderRelevanceLists[this
									.currentchildId].payredpacklist) {
								this.$set(this.redlist[i], 'checked', true)
							} else {
								this.$set(this.redlist[i], 'checked', false)
							}
						}
						console.log(this.redlist, 'redlist')
					},
					fail: (err) => {
						uni.showToast({
							title: '网络请求超时,请重试',
							icon: 'none'
						})
					}
				})
				uni.request({ //获取购物券
					method: 'POST',
					url: getApp().globalData.url + '/applet/card/egoMembershipCardByServe',
					data: {
						"storeId": uni.getStorageSync('storeId'),
						"customerId": uni.getStorageSync('user').customerId,
						// "customerId":51,
						"serveId": serveId,
						"amount": redPacketSill
					},
					header: {
						"Content-Type": "application/x-www-form-urlencoded" //如果为空，加上头部接收     
					},
					success: (res) => {

						this.menuTabs[1].number = res.data.length
						this.paylist[index].projectOrderRelevanceLists[id].carlist = res.data
						for (let i = 0; i < this.paylist[index].projectOrderRelevanceLists[id].carlist
							.length; i++) {
							if (this.paylist[index].projectOrderRelevanceLists[id].carlist[i]
								.openChargeCardId == this.paylist[this.currentcproId]
								.projectOrderRelevanceLists[this.currentchildId].payvipcarlist) {
								this.$set(this.paylist[index].projectOrderRelevanceLists[id].carlist[i],
									'checked', true)
							} else {
								this.$set(this.paylist[index].projectOrderRelevanceLists[id].carlist[i],
									'checked', false)
							}

						}
						console.log(this.paylist[index].projectOrderRelevanceLists[id].carlist, '会员卡')
					},
					fail: (err) => {
						uni.showToast({
							title: '网络请求超时,请重试',
							icon: 'none'
						})
					}
				})
				this.modalName = e.currentTarget.dataset.target
			},
			showModal1(e) {
				this.modalName = e.currentTarget.dataset.target
				var listString = ''
				var price = 0
				for (var i = 0; i < this.commentlist.length; i++) {
					if (i == 0) {
						if (this.commentlist[i].number == 1) {
							listString = this.commentlist[i].goodsId
						} else {
							for (var j = 0; j < this.commentlist[i].number; j++) {
								if (j == 0) {
									listString = this.commentlist[i].goodsId
								} else {
									listString = listString + ',' + this.commentlist[i].goodsId
								}
							}

						}
					} else {
						for (var j = 0; j < this.commentlist[i].number; j++) {
							listString = listString + ',' + this.commentlist[i].goodsId
						}
					}
					price += this.commentlist[i].price
					this.allproductMoney = price
				}
				console.log(listString, 'listString')

				uni.request({
					method: 'POST',
					url: getApp().globalData.url + `/applet/order/egoMembershipCardByGood`,
					data: {
						"storeId": uni.getStorageSync('storeId'),
						"customerId": uni.getStorageSync('user').customerId,
						// "customerId": 51,
						"goodIds": listString,
						"amount": price,
					},
					header: {
						"Content-Type": "application/x-www-form-urlencoded" //如果为空，加上头部接收
					},
					success: (res) => {
						console.log(res.data, 'ssssssssss')
						console.log(this.paycarlist, 'this.paycarlist[0].cardId')
						this.carlist = res.data
						for (var i = 0; i < this.carlist.length; i++) {
							var book = 0
							if (this.paycarlist.length == 0) {

							} else {
								if (this.carlist[i].cardId == this.paycarlist[0].cardId) {
									this.carlist[i].checked = true
									book = 1
								}
							}

							if (book == 0) {
								this.carlist[i].checked = false
							}
						}
						console.log(this.carlist, 'this.carlist')
					},
					fail: (err) => {
						uni.showToast({
							title: '网络请求超时,请重试',
							icon: 'none'
						})
					}
				})
			},
			subproCar(index) {
				this.trueprice += this.paycarlist[index].price
				this.paycarlist.splice(index, 1)
			},
			hideModal() {
				this.modalName = null
				for (var i = 0; i < this.paylist.length; i++) {
					for (var j = 0; j < this.paylist[i].projectOrderRelevanceLists.length; j++) {
						console.log(this.paylist[i].projectOrderRelevanceLists[j])

					}
				}
			},

			chooseit2(index) {
				if (this.paycarlist.length != 0) {
					this.trueprice += this.paycarlist[0].price //切换先加后减
				}
				var list = []
				for (let i = 0; i < this.carlist.length; i++) {
					this.carlist[i].checked = false
				}
				this.carlist[index].checked = true
				var price = 0
				if (this.carlist[index].cardType == 1) {
					var caremoney = this.carlist[index].optimalAmount + this.carlist[index].usableMoney
				} else {
					var caremoney = this.carlist[index].optimalAmount
				}

				if (caremoney >= this.allproductMoney) {
					price = this.allproductMoney
				} else {
					price = caremoney
				}
				this.trueprice -= price
				list.push({
					cardId: this.carlist[index].cardId,
					cardName: this.carlist[index].cardName,
					price: price
				})
				this.paycarlist = list
			},
			swichMenu: async function(current) {
				//点击其中一个 menu
				if (this.currentTab == current) {
					return false;
				} else {
					this.currentTab = current;
					this.setScrollLeft(current);
				}
			},
			swiperChange: async function(e) {
				let index = e.target.current;
				this.setScrollLeft(index);
				this.currentTab = index;
			},
			setScrollLeft: async function(tabIndex) {
				let leftWidthSum = 0;
				for (var i = 0; i <= tabIndex; i++) {
					let nowElement = await this.getWidth('tabNum' + i);
					leftWidthSum = leftWidthSum + nowElement.width;
				}
				let winWidth = uni.getSystemInfoSync().windowWidth;
				this.scrollLeft = leftWidthSum > winWidth ? leftWidthSum - winWidth : 0;
			},
			getWidth: function(id) {
				//得到元素的宽高
				return new Promise((res, rej) => {
					uni.createSelectorQuery()
						.select('#' + id)
						.fields({
								size: true,
								scrollOffset: true
							},
							data => {
								res(data);
							}
						)
						.exec();
				});
			},
			payment(item) {
				uni.navigateTo({
					url: '../payment/payment'
				})
			},
			addcomment() {
				uni.navigateTo({
					url: '../myOrder/commonCart'
				})
			}
		}
	}
</script>

<style lang="less">
	#statement {
		.pay_top {
			width: 100%;
			background-color: #fff;
			margin: 15px 0;
		}

		.top_title {
			display: flex;
			flex-direction: row;

		}

		.text {
			color: rgba(80, 80, 80, 1);
			font-size: 16px;
			font-weight: bold;
			width: 33.3%;
			text-align: center;
			margin: 10px 0;
			padding-bottom: 5px;
			border-bottom: 1px solid #f1f1f1;
		}

		.top_content {
			display: flex;
			flex-direction: row;
			width: 100%;
			line-height: 22px;
			padding: 10px 0;
		}

		.top_content_com {
			display: flex;
			flex-direction: row;
			width: 100%;
			line-height: 22px;
			padding-left: 30px;
			padding-bottom: 10px;
		}

		.wid1 {
			width: 50%;
			text-align: center;
		}

		.wid2 {
			width: 45%;
			text-align: left;
		}

		.wid3 {
			width: 30%;
			text-align: center;
		}

		.wid4 {
			width: 30%;
			text-align: right;
		}

		.wid5 {
			width: 20%;
			text-align: center;
		}

		.wid7 {
			width: 30%;
			text-align: left;
		}

		.wid8 {
			width: 20%;
			text-align: center;
		}

		.wid {
			width: 100%;
			text-align: center;
		}

		.pay_name {
			display: flex;
			flex-direction: row;
			width: 42%;
		}

		.serial {
			border: 1px solid #999;
			border-radius: 36px;
			width: 23px;
			margin-left: 15px;
			margin-right: 5px;
			line-height: 23px;
			height: 23px;
		}

		/* 项目栏 */
		.child {
			border-bottom: 1px solid rgba(114, 130, 138, 0.18);
			padding: 10px 0;
			padding-left: 15px;
		}

		.middle_content {
			width: 100%;
			line-height: 22px;
			padding: 10px 0;
			border-bottom: 1px dotted #999;
		}

		.w {
			padding-left: 25px;
			display: flex;
			flex-direction: row;
		}

		.pro_serial {
			border: 1px solid #999;
			border-radius: 36px;
			width: 23px;
			line-height: 23px;
			height: 23px;
			position: absolute;
			top: 9px;
			text-align: center;
			left: 12px;
		}

		.redline {
			background-image: linear-gradient(#FC7127, #F93B14);
			font-size: 12px;
			color: #fff;
			width: 20%;
			border-radius: 3px;
			text-align: center;
			letter-spacing: 1px;
			height: 20px;
			line-height: 20px;
		}

		.allprice {
			text-align: right;
			padding: 10px 30px 10px 0;
			border-bottom: 1px solid #f1f1f1;
		}

		.addcombtn {
			width: 90px;
			height: 35px;
			background-color: #FB4B5C;
			color: #FFFFFF;
			border-radius: 30px;
			text-align: center;
			line-height: 35px;
			font-size: 13px;
			margin-left: 67%;

		}

		/* 总金额模块 */
		.bottom_show {
			width: 100%;
			margin-top: 10px 0;
			background-color: #fff;
		}

		.bottom_line {
			display: flex;
			flex-direction: row;
			margin: 10px 0;
		}

		.right {
			margin: auto 0;
			color: rgba(80, 80, 80, 1);
			font-size: 18px;
			font-weight: bold;
			padding-right: 20px;
			text-align: right;
		}

		.icon {
			color: rgba(153, 153, 153, 1);
			font-size: 30px;
			padding-left: 15px;
		}

		.left {
			margin: auto 0;
			font-size: 16px;
			color: #505050;
			width: 90%;
			padding-left: 15px;
			text-align: left;
		}

		.caricon {
			margin: auto 0;
			width: 65px;
			height: 29px;
			color: #fff;
			background-color: #FB4B5C;
			border-radius: 8px;
			font-size: 12px;
			line-height: 29px;
			text-align: center;
		}

		.subicon {
			font-size: 20px;
			color: red;
			font-weight: bold;
		}

		.paycarlist {
			display: flex;
			flex-direction: row;
			width: 100%;
		}

		.paycar_name {
			font-size: 15px;
			font-weight: bold;
			width: 68%;
			text-align: right;
		}

		.paycar_price {
			font-size: 15px;
			margin: 0 10px;
			font-weight: bold;
			width: 15%;
			text-align: center;
		}

		.true_price {
			padding-bottom: 60px;
		}

		/* 升级卡片页面end */
		.cu-bar {
			width: 100%;
			height: 40px;
		}

		.body-view {

			height: 400px;
			width: 100%;
		}

		.top-menu-view {
			display: flex;
			white-space: nowrap;
			width: 100%;
			background-color: #ffffff;
			height: 46px;
			/* 在这里设置导航条高度 */
			border-bottom: 2px solid #f1f1f1;
			/* padding-right: 15px; */
		}

		.top-menu-view .menu-one-view {
			display: inline-block;
			white-space: nowrap;
			height: 100%;
			width: 50%;
		}

		.top-menu-view .menu-one-view .menu-one {
			/* 在这里写 单个按钮样式 */
			/* margin: 12px 12px 18px 22px; */
			position: relative;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			/* width: 50%; */
			text-align: center;
		}

		.top-menu-view .menu-one-view .menu-one .menu-one-txt {
			height: 40upx;
			font-size: 26upx;
			font-weight: 400;
			color: rgba(154, 154, 154, 1);
			line-height: 40upx;
			margin-top: 10px;
		}

		.top-menu-view .menu-one-view .menu-one .menu-one-bottom {
			position: absolute;
			bottom: 0;
			width: 100%;
		}

		.top-menu-view .menu-one-view .menu-one .menu-one-bottom .menu-one-bottom-color {
			width: 100%;
			height: 4upx;
		}

		.top-menu-view .menu-one-view .menu-one-act {
			/* 在这里写 单个按钮样式 */
			/* margin: 12px 12px 18px 22px; */
			position: relative;
			margin: 0 26%;
			height: 100%;
			/* width: 65px; */
			display: flex;
			align-items: center;
			justify-content: center;
			border-bottom: 3px solid rgba(255, 119, 119, 1);
			;
		}

		.top-menu-view .menu-one-view .menu-one-act .menu-one-txt {
			height: 30px;
			font-size: 26upx;
			font-weight: 400;
			color: rgba(0, 170, 255, 1);
			line-height: 40upx;
			margin-top: 10px;
		}

		.top-menu-view .menu-one-view .menu-one-act .menu-one-bottom {
			position: absolute;
			bottom: 0;
			width: 100%;
			display: flex;
			justify-content: center;
		}

		.top-menu-view .menu-one-view .menu-one-act .menu-one-bottom .menu-one-bottom-color {
			width: 60%;
			height: 4upx;
			background: rgba(0, 170, 255, 1);
		}

		.swiper-box-list {
			/* flex: 1; */
			width: 100%;
			height: 250px;
			background-color: #ffffff;
		}

		.swiper-one-list {
			/* margin-top: 60px; */
			height: 100%;
			border-bottom: 1px solid #f1f1f1;
			width: 100%;
			/* margin-bottom: 600px; */
			overflow: auto;
		}

		// 会员卡列表
		// .floor-item1 {
		// 	display: flex;
		// 	flex-direction: column;
		// 	/* width: 200upx; */
		// 	height: 250rpx;
		// 	margin-right: 20upx;
		// 	font-size: 14px;
		// 	color: #007aff;
		// 	text-align: center;
		// }
		.vip_car1 {
			width: 90%;
			height: 110px;
			overflow: hidden;
			overflow-x: scroll;
			display: flex;
			margin: 0 auto;
		}

		.car1 {
			width: 48%;
			margin: 1%;
			/* margin: 0 10px 0 10px; */
		}

		.vip_car_bc1 {
			width: 190px;
			height: 80px;
			color: #fff;
			border-radius: 5px;
			position: relative;
			margin: 10px 40px;


		}

		.car_name1 {
			position: absolute;
			left: 13%;
			top: 57%;
			font-size: 12px;

		}

		.car_number1 {
			position: absolute;
			left: 12%;
			bottom: 51%;
			font-size: 17px;

		}

		.vipbacimage {
			width: 40px;
			height: 45px;
			position: absolute;
			right: 6%;
			top: 10%;


		}

		.vipbacimage image {
			width: 40px;
			height: 46px;
			position: absolute;
			right: 5%;
			top: 27%;

		}

		.circle1 {
			width: 20px;
			height: 20px;
			border: 2px solid #80848c;
			border-radius: 50%;
			position: absolute;
			right: 10%;
			top: 45%;
		}

		.circlemin1 {
			width: 9px;
			height: 9px;
			border-radius: 50%;
			position: absolute;
			background-color: #fff;
			right: 16%;
			top: 18%;
		}

		.list1 {
			height: 100px;
			width: 90%;
			margin: 10px auto;
			border: 1px solid #E8E8E8;
			position: relative;
		}

		.onvipcar {
			background-color: red;

		}

		// 会员卡列表end
		/* 顶部nav  end */
		/* 选择红包卡券的窗口 */
		.cu_dialog1 {
			position: relative;
			display: inline-block;
			vertical-align: middle;
			height: 400px;
			background-color: #f8f8f8;
			border-radius: 5px;
			width: 100%;
			overflow: hidden;
		}

		.cu_dialog2 {
			position: relative;
			display: inline-block;
			vertical-align: middle;
			height: 250px;
			background-color: #f8f8f8;
			border-radius: 5px;
			width: 100%;
			overflow: hidden;
		}

		.list {
			height: 66px;
			width: 90%;
			margin: 10px auto;
			border: 1px solid #E8E8E8;
			position: relative;
		}

		.list_usecause {
			word-break: break-all;
			color: rgba(255, 255, 255, 1);
			font-size: 12px;
			padding-top: 10px;
		}

		.list_usecause1 {
			word-break: break-all;
			font-size: 13px;
			text-align: center;
			color: #fff;
			padding-top: 5px;
		}

		.list_name {
			color: rgba(80, 80, 80, 1);
			font-size: 11px;
			position: absolute;
			top: 8%;
			left: 32%;
			font-weight: bold;
		}

		.list_time {
			color: rgba(166, 166, 166, 1);
			position: absolute;
			bottom: 10%;
			left: 32%;
			font-size: 11px;
		}

		.circle {
			width: 19px;
			height: 19px;
			border: 2px solid rgba(128, 132, 140, 1);
			border-radius: 50%;
			position: absolute;
			right: 4%;
			top: 31%;
		}

		.on {
			background-color: red;
		}

		.circlemin {
			width: 9px;
			height: 9px;
			border-radius: 50%;
			position: absolute;
			background-color: #fff;
			right: 16%;
			top: 18%;
		}

		.on1 {
			width: 100%;
			height: 100%;
			border-radius: 50%;
			position: absolute;
			background-color: rgba(212, 48, 48, 1);
			top: 0%;
			left: 0%;
			border: 2px solid #fff;
		}

		.submit {
			width: 35%;
			height: 30px;
			color: #ffffff;
			-webkit-box-shadow: 6rpx 6rpx 8rpx rgba(204, 69, 59, 0.2);
			box-shadow: 6rpx 6rpx 8rpx rgba(204, 69, 59, 0.2);
			background-color: #e54d42;
			border-radius: 13px;
			font-size: 13px;
			line-height: 30px;
			text-align: center;
			margin: 10px auto;
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

		.show_price {
			width: 50%;
			height: 50px;
			color: #fff;
			background-color: #5D76E4;
			font-size: 17px;
			line-height: 50px;
			text-align: center;
		}

		.show_price1 {
			width: 100%;
			height: 50px;
			color: #fff;
			background-color: #5D76E4;
			font-size: 17px;
			line-height: 50px;
			text-align: center;
		}

		.buybtn {
			width: 50%;
			height: 50px;
			color: #FB4B5C;
			background-color: #fff;
			font-size: 17px;
			line-height: 50px;
			text-align: center;
			// border: 1px solid #1890ff;
		}

		/* 支付方式按钮 */
	}
</style>