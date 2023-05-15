<template>
	<view class="page">
		<!-- <scroll-view scroll-y="true" style="height: 1000px;"> -->
			<view class="container" >
				<!-- 左侧栏 -->
				
					<view class="nav_left">
						<view class="calender flex_row" >
							<picker mode="date"  :start="startDate" :end="endDate"  @change="choosetime">
								<view style="display: flex;;">
									<view class="calender_icon font" >
										&#xe613; <text v-if="month!=nowmonth&&day!=nowday">今天</text>
									</view>
									<view class="calender_data ">
										{{month}}月{{day}}日
									</view>
								</view>
								
							</picker>
							
						</view>
						<block v-for="(item, index) in cateItems" :key="index">
							<view @click="tabtap(index)" :id="item.cate_id" class="nav_left_items" :class="{active: index == curIndex}">
							{{ item.time }}	
							<text class="show_true" v-if="index == curIndex">
								选择
							</text>
							</view>
						</block>
						<view class="" style="width: 100%;height: 60px;">
						</view>
					</view>
				
				
				<!--右侧栏-->
				<!-- 如果有孩子才跳转 -->
				<view class="nav_right_middle">
					<view class="nav_right_text">
						请选择改项目的手艺人
					</view>
					<!-- 123 -->
					<view class="craftman_main">
						<block v-for="(it, index) in cateItems[curIndex].children" :key="index" style="width: 50%;">  <!-- 不能用id -->
								 <view class="nav_right_items_city"  >
									<view class="nav_right_item">
										<view @click="switchRightTab(index)" class="craftman_src" :class="{on: index== cuecityIndex}">
										 	<image :src="it.staPhoto" mode="aspectFill"></image>
											<view class="choose" v-if="index == cuecityIndex">
												选择
											</view>
										 </view>
										 <text class="craftman_name">{{ it.staName }}</text>
										 <text class="show_man"  @click="craftmandetails(it.staffId)" v-if="it.staffId!='-1'">
										 	查看资料
										 </text>
									</view> 
								</view>
								<!-- {{it.name}} -->
							</block>
							<view class="" style="width: 100%;height: 60px;">
								
							</view>
					</view>
					
				</view>
			</view>
		<!-- </scroll-view> -->
		<!-- 下方按钮 -->
		<view class="bottom">
			<view class="show_price" @click="clearChoose">
				清除选择
			</view>
			<view class="buybtn" @click="pay" data-target="DialogModal1">   <!-- 选择预约 -->
				确认预约
			</view>
		</view>
		 <mpopup  ref="mpopup" :isdistance="true"></mpopup>
		
	</view>
</template>

<script>
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				nowmonth: '',
				nowday: '',
				nowhour: '',
				month: 12,
				day: 25,
				curIndex: 0,
				cuecityIndex: -1,
				winHeight: '',
				date: currentDate,
				cateItems: [],
				storeId: '',
				staffId: '',
				classificationId: '',
				smDate: '',
				book: 0,
				orderid: '',
				customerId: '',
				mechanismId: '',
				projectId: '',
				projectname: '',
				price: '',
				nowyear: '',
				staffname: '',
				type: '',
				changeList: {},
				giftTemplateId: ''
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		onLoad(props) {
			uni.showLoading({
				title: '加载中',
				mask: true,
			})
			console.log(props, '分类ID')
			this.projectId = props.serveId
			// 订单预约时间
			var type = props.type
			this.type = props.type
			var orderid = props.orderId
			var typeId = props.typeId
			var serveId = props.serveId
			var classifyId = props.classifyId
			if (type == undefined || type == null || type == '') {
				uni.hideLoading()
			} else {
				//获取购物券
				// uni.request({    
				// 	method: 'POST',
				// 	url: getApp().globalData.url + '/applet/order/findOrderInfoByOrderIdAndType',
				// 	data: {
				// 		// customerId: uni.getStorageSync('user').customerId,
				// 		 "orderId":Number(orderid),
				// 		  "typeId":Number(typeId),
				// 		  "classifyId":Number(classifyId),
				// 		   serveId:serveId
				// 	},
				// 	header: {
				// 	      "Content-Type": "application/x-www-form-urlencoded" //如果为空，加上头部接收     
				// 	     },
				// 	success: (res) => {
				// 		console.log(res,'changeList')
				// 		this.changeList = res.data.result
				// 		console.log(res,this.changeList)
				// 		uni.hideLoading()
				// 	},fail:(err) => {
				// 		this.error()
				// 		uni.hideLoading()
				// 	}
				// })
				this.changeList = {
					consumptionState: '',
					ordPaymentMethod: '',
					giftOrderId: '',
					customizationId: '',
					appResult: {
						serveId: '',
						suggestPrice: 12
					},
					consumptionState: []
				}
			}
			//项目预约
			this.projectId = serveId
			this.projectname = props.serveName
			this.price = props.price
			this.giftTemplateId = props.giftTemplateId
			this.classificationId =Number(props.id) 
			// this.classificationId = 5
			let that = this;
			uni.getSystemInfo({
				success: function(res) {
					// console.log(res)
					let calc = res.windowHeight + 210;
					that.winHeight = calc;
				}
			});
			this.nowmonth = new Date().getMonth() + 1;
			this.nowday = new Date().getDate();
			this.nowyear = new Date().getFullYear()
			var h = new Date().getHours()
			h = h < 10 ? '0' + h : h;
			var m1 = new Date().getMinutes()
			m1 = m1 < 10 ? '0' + m1 : m1;
			var s = new Date().getSeconds()
			s = s < 10 ? '0' + s : s;
			this.nowtime = h+':'+m1+':'+s
			this.month = new Date().getMonth()+1;
			this.day = new Date().getDate();
			
			// if( props.month){
			// 	this.month = props.month;
			// 	this.day = props.day;
			// 	this.nowday = props.day
			// 	this.nowmonth = props.month
			// }
			 this.smDate = this.nowyear + '-' + this.nowmonth + '-' + this.nowday
			this.ways()
		},
		onShow() {
				
		},
		methods: {
			choosetime(e) {
				console.log()
				this.smDate = e.target.value
				// this.date = e.target.value.join('-')
				this.month = e.target.value.split('-')[1]
				this.day = e.target.value.split('-')[2]
				this.ways()
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year;
				} else if (type === 'end') {
					year = year + 1;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			// 获取排班信息
			ways() {


				this.cateItems = [{
					time: '09:00',
					cate_id:1,
					children: [{
						staffId: 1,
						staName: '张三',
						staPhoto: '../../static/banner/6.jpg',
					},{
						staffId: 2,
						staName: '李四',
						staPhoto: '../../static/banner/32.jpg',
					}]
				},{
					time: '10:00',
					cate_id:2,
					children: [{
						staffId: 1,
						staName: '张三',
						staPhoto: '../../static/banner/6.jpg',
					}]
				},{
					time: '11:00',
					cate_id:3,
					children: [{
						staffId: 1,
						staName: '张三',
						staPhoto: '../../static/banner/31.jpg',
					}]
				},{
					time: '12:00',
					cate_id:4,
					children: [{
						staffId: 1,
						staName: '张三',
						staPhoto: '../../static/banner/6.jpg',
					}]
				},{
					time: '13:00',
					cate_id:5,
					children: [{
						staffId: 1,
						staName: '张三',
						staPhoto: '../../static/banner/6.jpg',
					}]
				}]
				this.nowhour = this.cateItems[0].time
			},
			//一级分类点击
			tabtap(index) {
				this.curIndex = index;
				this.cuecityIndex = -1;
				this.nowhour = this.cateItems[index].time;
				console.log(this.nowhour)
			},
			craftmandetails(id) {
				uni.navigateTo({
					url: './craftmanDetails?id=' + id
				})
			},
			switchRightTab(it) {
				// 获取item项的id，和数组的下标值
				this.cuecityIndex = it;
				// console.log(this.cuecityIndex);
				this.staffId = this.cateItems[this.curIndex].children[it].staffId
				this.staffname = this.cateItems[this.curIndex].children[it].staName
				// console.log(it.child_id)
				// this.store = it.name;	
				this.ordertime = this.nowyear + '-' + this.month + '-' + this.day + ' ' + this.nowhour
				console.log(this.ordertime, '现在时间')
			},
			pay() {
				if (this.staffname == '') {
					this.error('请选择手艺人')
				} else {
					if (this.type == undefined || this.type == null || this.type == '') {
						uni.navigateTo({
							url: '/pages/orderPay/orderPay?price=' + this.price + '&staffId=' + this.staffId +
								'&projectId=' + this.projectId +
								'&projectname=' + this.projectname + '&staffname=' + this.staffname + '&time=' +
								this.ordertime
						})
						//下订单页面
					} else {
						if (this.changeList.consumptionState == 0) { //支付
							// 传递支付时间
							uni.showLoading({
								title: '加载中',
								mask: true
							})
							if (this.staffId == '-1') {
								this.staffId = null
							}
							uni.request({
								method: 'POST',
								url: getApp().globalData.url + '/applet/appoint/addSave',
								data: {
									mechanismId: Number(uni.getStorageSync('mechanismId')),
									storeId: Number(uni.getStorageSync('storeId')),
									staffId: this.staffId,
									projectId: this.changeList.appResult.serveId,
									// customerId: 51,
									customerId: uni.getStorageSync('user').customerId,
									appoMoney: this.changeList.appResult.suggestPrice,
									appoTime: this.ordertime,
								},
								success: (res) => {
									if (res.data.result == 'existence') {
										this.error('该时间已被预约，请换个时间')
										// uni.hideLoading()
									} else {
										console.log(res.data, '预约时间')
										var appointmentId = res.data.appointmentId
										var list = []
										if (this.staffId == '-1') {
											this.staffId = ''
										}
										var projectOrder = {}
										console.log("this.type:" + this.type)
										console.log("this.type:" + this.type)
										console.log("this.type:" + this.type)
										list.push({
											"staffId": this.staffId,
											"appointmentId": appointmentId,
											"serveId": this.changeList.appResult.serveId
										})
										if (this.type == 1) { //赠送 
											projectOrder = {
												"mechanismId": uni.getStorageSync('mechanismId'),
												"storeId": uni.getStorageSync('storeId'),
												"ordCustomerId": uni.getStorageSync('user').customerId,
												// "ordCustomerId": 51,
												// paymentCustomerId:51,
												"paymentCustomerId": uni.getStorageSync('user').customerId,
												"serveId": this.changeList.appResult.serveId,
												"ordState": 0,
												"consumptionState": this.changeList.consumptionState,
												"ordPaymentMethod": this.changeList.ordPaymentMethod,
												"ordAchievement": 0,
												"giftOrderId": this.changeList.giftOrderId
											}
										} else if (this.type == 2) { //美丽定制情况
											var id = this.changeList.customizationId
											projectOrder = {
												"mechanismId": uni.getStorageSync('mechanismId'),
												  "storeId":  uni.getStorageSync('storeId'),
												  "ordCustomerId": uni.getStorageSync('user').customerId,
												  // "ordCustomerId": 51,
												  // paymentCustomerId:51,
												  "paymentCustomerId": uni.getStorageSync('user').customerId,
												  "serveId": this.changeList.appResult.serveId,
												  "ordState": 0,
												  "consumptionState": this.changeList.consumptionState,
												  "ordPaymentMethod": this.changeList.ordPaymentMethod ,
												  "ordAchievement": 0,
												  "customizationId": id
											}
											
									}else if(this.type == 3) {
										//客户自己购买的礼包
											var id= this.giftTemplateId
											projectOrder = {
												"mechanismId": uni.getStorageSync('mechanismId'),
												"storeId":  uni.getStorageSync('storeId'),
												"ordCustomerId": uni.getStorageSync('user').customerId,
												// "ordCustomerId": 51,
												// paymentCustomerId:51,
												"paymentCustomerId": uni.getStorageSync('user').customerId,
												"serveId": this.changeList.appResult.serveId,
												"ordState": 0,
												"consumptionState": this.changeList.consumptionState,
												"ordPaymentMethod": this.changeList.ordPaymentMethod ,
												"ordAchievement": 0,
												"giftTemplateId": Number(id)
											}
											console.log(id,'giftTemplateId')
									}else if(this.type == 4) {
										//员工赠送给客户的礼包
											var id= this.giftTemplateId
											projectOrder = {
												"mechanismId": uni.getStorageSync('mechanismId'),
												"storeId":  uni.getStorageSync('storeId'),
												"ordCustomerId": uni.getStorageSync('user').customerId,
												// "ordCustomerId": 51,
												// paymentCustomerId:51,
												"paymentCustomerId": uni.getStorageSync('user').customerId,
												"serveId": this.changeList.appResult.serveId,
												"ordState": 0,
												"consumptionState": this.changeList.consumptionState,
												"ordPaymentMethod": this.changeList.ordPaymentMethod ,
												"consumptionType":1,
												"ordAchievement": 0,
												"giftTemplateId": Number(id),
												"clientGiveInfoId":this.changeList.clientGiveInfoId
											}
											console.log(id,'员工赠送给客户的礼包'+'giftTemplateId')
									}else if(this.type==5){
										//员工赠送给客户的项目 (非团购单)
										projectOrder = {
											"mechanismId": uni.getStorageSync('mechanismId'),
											"storeId":  uni.getStorageSync('storeId'),
											"ordCustomerId": uni.getStorageSync('user').customerId,
											"paymentCustomerId": uni.getStorageSync('user').customerId,
											"serveId": this.changeList.appResult.serveId,
											"ordState": 0,
											"consumptionState": this.changeList.consumptionState,
											"ordPaymentMethod": this.changeList.ordPaymentMethod ,
											"consumptionType":1,
											"ordAchievement": 0,
											"isGroupBuying":0,
											"clientGiveInfoId":this.changeList.clientGiveInfoId
										}
										console.log(id,'员工赠送给客户的项目 (非团购单)'+'giftTemplateId')
									}else if(this.type==6){
										//员工自己拼团购买的项目(团购单)
										projectOrder = {
											"mechanismId": uni.getStorageSync('mechanismId'),
											"storeId":  uni.getStorageSync('storeId'),
											"ordCustomerId": uni.getStorageSync('user').customerId,
											"paymentCustomerId": uni.getStorageSync('user').customerId,
											"serveId": this.changeList.appResult.serveId,
											"ordState": 0,
											"consumptionState": this.changeList.consumptionState,
											"ordPaymentMethod": this.changeList.ordPaymentMethod ,
											"consumptionType":1,
											"ordAchievement": 0,
											"isGroupBuying":1,
											"clientGiveInfoId":this.changeList.clientGiveInfoId
										}
										console.log(id,'员工自己拼团购买的项目(团购单)'+'giftTemplateId')
									}
									console.log("projectOrder:"+projectOrder)
										uni.request({    //获取购物券
											method: 'POST',
											url: getApp().globalData.url + '/applet/order/makeAppointUse',
											data: {
												"projectOrder": projectOrder,
												"projectOrderRelevance":list
											},
											header: {
											      "Content-Type": "application/json" //如果为空，加上头部接收     
											     },
											success: (res) => {
												console.log(res,'创建预约时间')
												if(res.data.result == 'success') {
													 this.showToast('预约成功')
													uni.hideLoading()
												}
												
											},fail:(err) => {
													this.error()
													uni.hideLoading()
												}
										})
								
							}
						},fail:(err) => {
							this.error()
							}
						})
					}
				}
				
			}
		
		},
		clearChoose() {
			this.cuecityIndex = -1;
		}
	}
};
</script>

<style scoped>
.page { 
	position: relative;
	width: 100%;
	height: 100%;
}
	
.container {
	height: auto;
	/* border-top: 2px solid #f1f1f1; */
}
/* 左侧栏 */

.nav_left {
	width: 30%;
	height: 100%;
	border-right: 1px solid rgba(229, 229, 229, 1);
}
.calender_icon {
	font-size: 25px;

}
.calender_data {
	font-size: 14px;
	margin: auto 0px;
	margin-left: 10px;

}
.calender {
		width: 100%;
		color: #fff;
		background-color: #FB4B5C;
		font-weight: bold;
		padding: 20px 0;
		padding-left: 10px;
}
.nav_left_items {
	 width: 55%;
    height: 56px;
    margin: 20px auto;
	color: rgba(166, 166, 166, 1);
	background-color: rgba(255, 255, 255, 1);
	border: 1px solid rgba(204, 204, 204, 1) ;
	/* padding: 26px 0 0 23px; */
	border-radius: 4px;
	font-size: 14px;
	line-height: 56px;
	text-align: center;
	position: relative;
}
.show_true {
	position: absolute;
	top: 16px;
    left: 16px;
}
.active{
	color: #FB4B5C;
	line-height: 40px;
	border: 1px solid #FB4B5C ;
}
/* 右侧 */
.nav_right_middle {
		position: absolute;
		top: 3px;
		left: 30%;
		width: 70%;
		height: 100%;

}
.craftman_main {
	display: flex;
	flex-direction: row; 
	width: 88%;
	flex-wrap:wrap;
}
.nav_right_text {
	height: 72px;
	color: rgba(80, 80, 80, 1);
	font-size: 16px;
	line-height: 72px;
	text-align: center;
	font-weight: bold;
}
.nav_right_items_city {
	width: 50%;
}
.nav_right_item {
	display: flex;
	flex-direction: column;
	margin-top: 32px;
	/* width: 50%; */
}
.craftman_src {
	width: 80px;
	height: 80px;
	border-radius: 4px;
	margin: 0 auto;
	position: relative;
	
}
.craftman_src image {
	width: 80px;
	height: 100%;
	border-radius: 4px;

}
.craftman_name {
	color: rgba(80, 80, 80, 1);
	font-size: 14px;
	text-align: left;
	font-weight: bold;
	margin: 0 auto;
	margin-top: 5px;
}
.show_man {
	width: 60%;
	height: 25px;
	color: rgba(255, 108, 144, 1);
	background-color: rgba(255, 255, 255, 1);
	border: 1px solid #FB4B5C;
	border-radius: 4px;
	font-size: 14px;
	line-height: 25px;
	text-align: center;
	margin: 0 auto;
	margin-top: 5px;
}
.choose {
		    width: 50%;
			height: 25px;
			color: rgba(255, 255, 255, 1);
			background-color:#FB4B5C;
			border-radius: 4px;
			font-size: 14px;
			line-height: 25px;
			text-align: center;
			position: absolute;
			bottom: -2px;
			left: 0px;
	}
.on {
	border: 1px solid #FB4B5C;
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
			height: 52px;
			color: #FB4B5C;
			background-color: #fff;
			font-size: 18px;
			line-height: 52px;
			text-align: center;
		}
		.buybtn {
			width: 50%;
			height: 52px;
			color: rgba(255, 255, 255, 1);
			background-color: #CA89FF;
			font-size: 18px;
			line-height: 52px;
			text-align: center;
		}
</style>
