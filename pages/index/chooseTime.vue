<template>

	<view class="content">
		<form @submit="submits" report-submit='true'>
			<view class="container">
				<scroll-view class="scroll-view_H b-t b-b" scroll-x>
					<block v-for="(item,index) in dateArr" :key="index">
						<div class="flex-box" @click="selectDateEvent(index,item)"
							:style="{'border-bottom':index==dateActive ? '2px solid  #FB4B5C' : ''}">
							<view class="date-box">
								<text :style="{color:index==dateActive?selectedTabColor:'#333'}"
									style="font-weight: bold;">{{item.week}}</text>
								<text :style="{color:index==dateActive?selectedTabColor:'#333'}">{{item.date}}</text>
							</view>
						</div>
					</block>
				</scroll-view>
				<!-- 时间选项 -->
				<view class="time-box">
					<block v-for="(item,_index) in timeArr" :key="_index">
						<view class="item">
							<view class="item-box" :class="{'disable':item.disable,'active':_index==timeActive}"
								:style="{background:_index==timeActive?'#fff':'#fff'}"
								@click="selectTimeEvent(_index,item)">
								<text>{{item.time}}</text>
								<text class="all">{{item.disable?disableText:isdisableText}}</text>
							</view>
						</view>
					</block>
				</view>
			</view>
			<view class="tel">
				<view class="number" style="text-align: left;">
					预留手机号
				</view>
				<view class="number" style="text-align: right;padding-right: 5%;">
					{{tel}}
				</view>
				<!-- <text>您选中的时间:{{timeQuery}}</text> -->
			</view>
			<view class="bottom">
				<view class="show_price">
					预约时间:{{ordertime}}
				</view>
				<button form-type="submit" type="default" size="mini" class="buybtn" @click="changeTime()">
					{{type == '1'?'确认修改预约':'确认预约'}}
				</button>

			</view>
			<mpopup ref="mpopup" :isdistance="true"></mpopup>
		</form>
	</view>
</template>

<script>
	import {
		dateData,
		timeData,
		timeStamp
	} from '../../date.js'
	export default {

		data() {
			return {
				id: '',
				Y: '',
				name: '', //手艺人名字
				tel: '13305016633',
				timeQuery: '',
				staffId: '',
				shWorkTime: '',
				shClosingTime: '',
				shWorkTime1: '',
				shClosingTime1: '',
				schedulingList: [],
				appointmentList: [],
				ordertime: '暂无选择',
				dateArr: [], //日期数据
				timeArr: [], //时间数据
				dateActive: 0, //选中的日期索引
				timeActive: 0, //选中的时间索引
				oldTimeActive: 0,
				selectDate: '', //选择的日期数据
				selectTime: '', //选择的时间
				oldSelectTime: '',
				currentTimeStamp: '',
				currentTime: '',
				selectedTabColor: '#FB4B5C',
				//选中的时间颜色
				selectedItemColor: '#fff',
				//禁用显示的文本
				disableText: '已约满',
				isdisableText: '可预约',
				timeInterval: 1,
				appoTime: '',
				orderid: '',
				customerId: '',
				type: '',
				nowdata: '',
				user: {}
			};
		},

		onLoad(props) {
			console.log(props, 'props')
			var user = uni.getStorageSync('user')
			this.tel = user.cusPhone
			this.customerId = user.customerId //顾客ID
			this.type = 0 //判断是否是修改时间 1是修改
			this.user = {
				mechanismId: 1,
				projectId: 1,
				storeId: 1,
				projectname: '时尚大礼包',
				staffId: 1,
				staffname: '托尼老师',
				allPrice: 199,
				changeorderid: 1,
			}

			var myDate = new Date();
			var y = myDate.getFullYear()
			var m = myDate.getMonth() + 1;
			m = m < 10 ? '0' + m : m;
			var d = myDate.getDate();
			d = d < 10 ? ('0' + d) : d;
			var time = y + '-' + m + '-' + d;
			this.nowdata = time
			this.timeQuery = time
			this.setOnload()
		},
		onPullDownRefresh() {
			console.log('refresh');
			this.setOnload()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 500);
		},
		methods: {
			submits(e) {
				console.log(e.detail.formId);
			},
			setOnload() {
				console.log(res)

				const res = {
					appointmentList: [{
						appoTime: '2023-05-10 15:00:00'
					}], // 已经预约的时间
					occupyList: [{
						occTime: '2023-05-10 19:00:00'
					}], // 被占用的时间
					schedulingList: [{
						shWorkTime: '09:00:00',
						shClosingTime: '21:00:00',
						shInterval: 60
					}], // 排班时间
				}
				if (res.schedulingList.length == 0) {
					this.error('没有排班信息!')
					uni.hideLoading()
					this.dateArr = dateData()
					return;
				}

				// 得到时间排班

				var minstartTime = '24:00:00'
				var maxendTime = '00:00:00'
				var mintime = 99999
				for (var i = 0; i < res.schedulingList.length; i++) {
					if (res.schedulingList[i].shWorkTime < minstartTime) {
						minstartTime = res.schedulingList[i].shWorkTime
					}
					if (res.schedulingList[i].shClosingTime > maxendTime) {
						maxendTime = res.schedulingList[i].shClosingTime
					}
					if (res.schedulingList[i].shInterval < mintime) {
						mintime = res.schedulingList[i].shInterval
					}

				}

				this.timeInterval = mintime / 60
				this.dateArr = dateData()
				//获取时间数据
				this.timeArr = timeData(minstartTime, maxendTime, this.timeInterval)
				//当前时间戳
				this.timeArr = this.timeArr.splice(0, this.timeArr.length - 1)
				this.currentTimeStamp = Date.now()
				this.currentTime = timeStamp(this.currentTimeStamp).hour

				// 时间禁用逻辑
				for (var i = 0; i < this.timeArr.length; i++) {
					if (this.timeQuery == this.nowdata) {
						if (this.currentTime > this.timeArr[i].time) {
							this.timeArr[i].disable = 1 //判断当前时间大于时间选项则禁用
						}
					}
					for (var j = 0; j < res.appointmentList.length; j++) {
						let [date, time] = res.appointmentList[j].appoTime.split(' ')
						if (date == this.timeQuery && this.timeArr[i].time == time) {
							this.timeArr[i].disable = true
						}
					}
				}
				if (res.occupyList.length != 0) {
					for (var i = 0; i < this.timeArr.length; i++) {
						for (var j = 0; j < res.occupyList.length; j++) {
							let [date, time] = res.occupyList[j].occTime.split(' ')
							if (date == this.timeQuery && this.timeArr[i].time == time) {
								this.timeArr[i].disable = 1
							}
						}
					}
				}

				//默认选中的日期
				this.selectDate = `${this.dateArr[0]['date']}(${this.dateArr[0]['week']})`
				this.timeArr.some((item, index) => {
					this.selectTime = this.timeArr[index]['time'] //默认选中的时间  15:00
					this.ordertime = this.timeQuery + ' ' + this.selectTime
					this.oldSelectTime = this.timeArr[index]['time'] //存储选中的时间
					this.timeActive = index //选中的时间索引
					this.oldTimeActive = index
					return !item.disable
				})
				var count = 0
				for (var item of this.timeArr) {

					if (item.disable == 1) {
						count++;
					}
				}
				if (count == this.timeArr.length) {
					this.ordertime = this.timeQuery
					this.timeActive = -1
				}
				uni.hideLoading()
			},
			selectDateEvent(index, item) {
				this.timeArr = []
				this.timeQuery = item.date
				this.setOnload()
				this.dateActive = index
				this.selectDate = `${this.dateArr[index]['date']}`
				this.$emit('selectTime', `${this.selectDate}`)
			},
			changeTime() {
				uni.showLoading({
					title: '修改中',
					mask: true
				})
				const result = 'success'
				if (result == 'existence') {
					this.error('该时间已被预约，请换个时间')
				} else {
					this.showToast('修改成功')
					uni.reLaunch({
						url: "../myOrder/myOrder?index=" + 0
					});
				}
				uni.hideLoading()
			},
			selectTimeEvent(index, item) {
				if (item.disable) return
				this.timeActive = index
				this.selectTime = this.timeArr[index]['time']
				this.$emit('selectTime1', `${this.selectTime}`)
				this.ordertime = this.timeQuery + ' ' + item.time;
			},

			selectTimeEvent1(time) {
				this.ordertime = this.timeQuery + '-' + time;
			},
			chooseTime() {
				let price = this.user.allPrice;
				let tel = this.tel;
				if (this.ordertime == '暂无选择') {
					uni.showToast({
						title: '请选择时间',
						icon: 'none'
					})
				} else {
					uni.navigateTo({
						url: '/pages/orderPay/orderPay'
					})
				}

			}
		}
	};
</script>

<style lang="scss" scoped>
	@import './index.scss';

	page {
		height: 100%;
	}

	form button {
		padding: 0;
	}

	form button::after {
		content: '';
		display: none;
	}

	.content {
		text-align: center;
		height: 100%;
	}

	.tel {
		width: 100%;
		height: 50px;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: row;
		padding: 0 15px;
		margin-top: 10px;

	}

	.number {
		margin: auto 0;
		color: rgba(80, 80, 80, 1);
		font-size: 15px;
		width: 50%;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;

	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
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
		width: 70%;
		height: 47px;
		color: #505050;
		background-color: rgba(255, 255, 255, 1);
		font-size: 15px;
		line-height: 47px;
		text-align: center;
	}

	.buybtn {
		width: 30%;
		height: 47px;
		color: rgba(255, 255, 255, 1);
		background-color: #CA89FF;
		font-size: 15px;
		line-height: 47px;
		text-align: center;
	}

	// .disable{
	// 	background: #F1F3F6 !important;
	// 	color: #999 !important;
	// 	// border: 1px solid #EEEEEE;
	// }
	// .active{
	// 	// background: #0094D7;
	// 	color: #FB5D6B;
	// 	border: 1px solid #FB5D6B;
	// 	font-weight: bold;
	// }
</style>