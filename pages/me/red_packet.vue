<template>
	<view class="body-view">
		<scroll-view class="top-menu-view" scroll-x="true" :scroll-left="scrollLeft">
			<block v-for="(menuTab, index) in classlist" :key="index">
				<view class="menu-one-view" v-bind:id="'tabNum' + index" @click="swichMenu(index)">
					<view :class="[currentTab == index ? 'menu-one-act' : 'menu-one']" style="display: flex;flex-direction: column;">
						<view class="menu-one-txt">{{ menuTab }}</view>
						<!-- <view class="menu-one-bottom"> -->
					</view>
				</view>
			</block>
		</scroll-view>
		<swiper :current="currentTab" class="swiper-box-list main_bac" duration="300" @change="swiperChange">
			<swiper-item >
				<!-- 第一页-->
				<scroll-view class="swiper-one-list" scroll-y="true" >
					<view class="red_packet_list" v-for="(item,index) in red_packet_list" :key="index"  
					:style="{border:'1px solid #E94A59;'}" v-if="item.isState == 0">
						<view class="price_modle font" >
								&#xe62b;
						</view>
						<view class=""  >
							<view class="price">
								￥{{item.redPacketMoney}}
							</view>
							<view class="usecase">
								满{{item.redPacketSill}}可用
							</view>
						</view>
						<view class="right_modle">
							<view class="name">
								{{item.redPacketName}}
							</view>
							<view class="time flex_column" v-if="item.validStartTime != null">
								<view>{{item.validStartTime}}-</view>
								<view>{{item.validEndTime}}</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
				<swiper-item >
					<!-- 第一页-->
					<scroll-view class="swiper-one-list" scroll-y="true" >
						<view class="red_packet_list" v-for="(item,index) in red_packet_list" :key="index"  
						:style="{border:'1px solid #a8a8a8;'}" v-if="item.isState == 1">
							<view class="price_modle font" >
									&#xe62b;
							</view>
							<view class=""  >
								<view class="price">
									￥{{item.redPacketMoney}}
								</view>
								<view class="usecase">
									满{{item.redPacketSill}}可用
								</view>
							</view>
							<view class="right_modle">
								<view class="name">
									{{item.redPacketName}}
								</view>
								<view class="time flex_column" v-if="item.validStartTime != null">
									<view>{{item.validStartTime}}-</view>
									<view>{{item.validEndTime}}</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item >
					<!-- 第一页-->
					<scroll-view class="swiper-one-list" scroll-y="true" >
						<view class="red_packet_list" v-for="(item,index) in red_packet_list" :key="index"  
						:style="{border:'1px solid #a8a8a8;'}" v-if="item.isState == 2">
							<view class="price_modle font" >
									&#xe62b;
							</view>
							<view class=""  >
								<view class="price">
									￥{{item.redPacketMoney}}
								</view>
								<view class="usecase">
									满{{item.redPacketSill}}可用
								</view>
							</view>
							<view class="right_modle">
								<view class="name">
									{{item.redPacketName}}
								</view>
								<view class="time flex_column" v-if="item.validStartTime != null">
									<view>{{item.validStartTime}}-</view>
									<view>{{item.validEndTime}}</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
			
			
		</swiper>
	</view>
</template>
<script>
export default {
	data() {
		return {
			StatusBar: this.StatusBar,
			CustomBar: this.CustomBar,
			scrollLeft: 0,
			isClickChange: false,
			currentTab: 0,
			scrollHeight: 0,
			classlist: ['未使用','已使用','已过期'],
			red_packet_list:[]
		};
	},
	onLoad() {
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
		var time = y + '-' + m + '-' + d  +' ' + h + ':' + m1 + ':' + s;
		console.log(time)
		uni.request({    //获取购物券
			method: 'GET',
			url: getApp().globalData.url + `/applet/redpacket/selectAppletRedPacketByUserId/${uni.getStorageSync('user').customerId}/${uni.getStorageSync('storeId')}`,
			header: {
				"Content-Type": "application/json" //如果为空，加上头部接收     
			},
			success: (res) => {
				res.data.result.forEach((value)=>{
					if(value.validEndTime < time) {
						value.isState = 2
					}
					value.validEndTime = value.validEndTime.split(' ')[0]
					value.validStartTime = value.validStartTime.split(' ')[0]
				})
				this.red_packet_list = res.data.result
			},fail:(err) => {
						uni.showToast({
							title:'网络请求超时,请重试',
							icon:'none'
						})
					}
		})	
	},
	methods: {
		BackPage() {
			if (getCurrentPages().length < 2 && 'undefined' !== typeof __wxConfig) {
				let url = '/' + __wxConfig.pages[0];
				return uni.redirectTo({ url });
			}
			uni.navigateBack({
				delta: 1
			});
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
					.fields(
						{
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
	}
};
</script>

<style scoped>
/* 顶部nav导航栏begin */
.menu-one-view image {
	width: 65px;
	height: 45px;
	border-radius: 23px;
}
page {
	width: 100%;
	height: 100%;
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
	justify-content: center;
	background: rgba(249, 249, 249, 1);
}

.body-view {
	display: flex;
	flex: 1;
	flex-direction: column;
	overflow: hidden;
	height: 100%;
	width: 100%;
	align-items: flex-start;
	justify-content: center;
}

.top-menu-view {
	display: flex;
	white-space: nowrap;
	width: 100%;
	background-color: #ffffff;
	height: 65px;
	/* 在这里设置导航条高度 */
	border-bottom: 2px solid #f1f1f1;
}
.price_modle {
	height: 100%;
	width: 28%;
	font-size: 70px;
	color: #E94A59;
	vertical-align: middle;
	text-align: center;
}
.top-menu-view .menu-one-view {
	display: inline-block;
	white-space: nowrap;
	/* height: 100%; */
	width: 33.3%;
}

.top-menu-view .menu-one-view .menu-one {
	/* 在这里写 单个按钮样式 */
	margin: 12px 12px 18px 22px;
	position: relative;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 50%;
}

.top-menu-view .menu-one-view .menu-one .menu-one-txt {
	height: 40upx;
	font-size: 30upx;
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
	margin: 12px 12px 18px 22px;
	position: relative;
	height: 100%;
	width: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	/* border-bottom: 5px solid rgba(153, 153, 153, 1); */
}

.top-menu-view .menu-one-view .menu-one-act .menu-one-txt {
	height: 30px;
	font-size: 30upx;
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
	flex: 1;
	/* width: 100%; */

	/* background-color: #ffffff; */
}
.main_bac {
	top: 60px;
	height: auto;
	background-color: #FFFFFF;
	position: absolute;
	width: 100%;
	bottom: 0;
	top: 65px;
}
.swiper-one-list {
	/* margin-top: 60px; */
	height: 100%;
	width: 100%;
	/* margin-bottom: 600px; */
	overflow: auto;
	padding: 0 22px;
}
/* 顶部nav  end */
/* 项目类别begin */
.red_packet_list {
	width: 100%;
	height: 75px;
	display: flex;
	flex-direction: row;
	margin: 10px 0;
	border-radius: 5px;
}

.expire_price_modle {
	background-color: #999;
	color: #fff;
	width: 28%;
	text-align: center;
}
.price {
	margin-top: 13px;
}
.usecase {
	font-size: 12px;
	margin-top: 10px;
}
.right_modle {
	margin-left: 12px;
	position: relative;
	width: 35%;
}
.name {
	position: absolute;
	top: 21%;
	left: 5%;
	/* margin-top: 32%; */
	color: rgba(80, 80, 80, 1);
	font-size: 12px;
	font-weight: bold;
}
.time {
	position: absolute;
	bottom: 8%;
	left: 5%;
	color: rgba(166, 166, 166, 1);
	font-size: 12px;
}
/* 项目类别end */
</style>
