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
			<swiper-item  v-for="(menuTab, index) in classlist" :key="index">
				<!-- 第一页未使用-->
				<scroll-view class="swiper-one-list" scroll-y="true">
					<view class="red_packet_list" v-for="(item,index) in red_packet_list" :key="index" :style="{border:currentTab==0?'1px solid #E94A59;':' 1px solid #D3D3D3'}">
						<view class="price_modle font" :style="{color:currentTab==0?'#E94A59':'#D3D3D3'}">
								&#xe634;
						</view>
						<view class="right_modle">
							<view class="name">
								{{item.name}}
							</view>
							<view class="usecase">
								{{item.usecase}}
							</view>
							<view class="time">
								{{item.begintime}}-{{item.endtime}}
							</view>
						</view>
						<view class="price" :style="{color:currentTab==0?'#E94A59':'#D3D3D3'}">
							￥{{item.price}}
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
			red_packet_list:[
				{
					src:'https://7765-we-63574e-1258830969.tcb.qcloud.la/mingzi/woman.jpg?sign=16bebc1b7ec40f07834f7488dd5a60dd&t=1565946345',
					price:'15',
					usecase:'满100.00可用',
					name:'欧巴洗发水购物券',
					begintime:'2019.02.19',
					endtime:'2019.05.23'
				}
			],
			finish_red_packet_list:[
				{
					src:'https://7765-we-63574e-1258830969.tcb.qcloud.la/mingzi/woman.jpg?sign=16bebc1b7ec40f07834f7488dd5a60dd&t=1565946345',
					price:'15',
					usecase:'满100.00可用',
					name:'欧巴洗发水购物券',
					begintime:'2019.02.19',
					endtime:'2019.05.23'
				}
			],
			expire_red_packet_list:[
				{
					src:'https://7765-we-63574e-1258830969.tcb.qcloud.la/mingzi/woman.jpg?sign=16bebc1b7ec40f07834f7488dd5a60dd&t=1565946345',
					price:'15',
					usecase:'满100.00可用',
					name:'欧巴洗发水购物券',
					begintime:'2019.02.19',
					endtime:'2019.05.23'
				},
				
			]
		};
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
		projectdetails(item) {
                uni.navigateTo({
                    url:'../giftdetails/projectdetail?id='+ item.id  + '&src=' + item.list_src  + '&name=' + item.list_name  + '&intro =' + item.list_intro  + '&price =' + item.list_price ,
					})			
		}
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
.color {
	color: #E94A59;
}
.fascolor {
	color: #D3D3D3;
}
.top-menu-view {
	display: flex;
	white-space: nowrap;
	width: 100%;
	background-color: #ffffff;
	height: 60px;
	/* 在这里设置导航条高度 */
	border-bottom: 2px solid #f1f1f1;
}

.top-menu-view .menu-one-view {
	display: inline-block;
	white-space: nowrap;
	/* height: 100%; */
	width: 33.3%;
	margin-top: 13px;
}

.top-menu-view .menu-one-view .menu-one {
	/* 在这里写 单个按钮样式 */
	/* margin: 12px 12px 18px 22px; */
	position: relative;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 50%;
	margin: 0 auto;
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
	/* margin: 12px 12px 18px 22px; */
	margin: 0 auto;
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
	width: 100%;
	height: auto;
	background-color: #ffffff;
}
.main_bac {
	top: 60px;
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
	height: 86px;
	display: flex;
	position: relative;
	flex-direction: row;
	margin: 10px 0;
	border: 1px solid #E94A59;
	border-radius: 5px;
}
.price_modle {
	height: 100%;
	width: 28%;
	font-size: 76px;
	color: #E94A59;
	vertical-align: middle;
	text-align: center;
}
.price_modle image {
	width: 100%;
	height: 100%;
}
.usecase {
	font-size: 12px;
	margin-top: 10px;
    color: rgba(166, 166, 166, 1);

}
.right_modle {
	margin-left: 12px;
}
.name {
	margin-top: 10px;
	color: rgba(80, 80, 80, 1);
	font-size: 12px;
	font-weight: bold;
}
.time {
	margin-top: 10px;
	color: rgba(166, 166, 166, 1);
	font-size: 12px;
}
.falseprice {
	position: absolute;
	right: 5%;
	top: 35%;
	color: #999;
	font-size: 15px;
	font-weight: bold;	
}
.price {
	position: absolute;
	right: 5%;
	top: 35%;
	font-size: 22px;
	font-weight: bold;
}/* 项目类别end */
</style>
