
	<template>
		<view class="body-view bg">
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
				<swiper-item>
					<!-- 第一页美学堂足迹-->
					<scroll-view class="swiper-one-list" scroll-y="true">
						<view class="tis flex_column" v-if="noMoerData == true">
							<view class="nomoreimage">
								<image :src="nomore" mode="aspectFill" class="nomore"></image>
							</view>
							<view class="" style="margin: auto;color: #a8a8a8;padding-top: 10px;">
								~暂无数据~
							</view>
						</view>
						<view class="list" v-for="(item, index) in movielist" :key="index" @click="moviedetails(item.id)">
								<view class="list_img"><image :src="item.src" mode="aspectFill"></image></view>
								<view class="list_message">
									<view class="movie_name">{{ item.title }}</view>
									<view class="movie_intro">{{ item.classify }}</view>
								</view>
							</view>
					</scroll-view>
				</swiper-item>
					<!-- 美约会足迹 -->
				<swiper-item>
					<scroll-view class="swiper-one-list" scroll-y="true">
					<view class="tis flex_column" v-if="noMoerData1 == true">
						<view class="nomoreimage">
							<image :src="nomore" mode="aspectFill" class="nomore"></image>
						</view>
						<view class="" style="margin: auto;color: #a8a8a8;padding-top: 10px;">
							~暂无数据~
						</view>
					</view>
					<view class="list" v-for="(item, index) in list" :key="index" @click="projectdetails(item)">
							<view class="list_img1"><image :src="item.src" mode="aspectFill"></image></view>
							<view class="list_message">
								<view class="list_name">{{ item.list_name }}</view>
								<view class="list_intro">{{ item.list_intro }}</view>
								<view class="list_message_bottom">
									<view class="list_price">￥{{ item.list_price }}</view>
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
				classlist: [ '美学堂足迹','美约会足迹'],
				movielist:[],
				noMoerData:false,
				noMoerData1:false,
				list: [],
				nomore:'http://www.mescroll.com/img/mescroll-empty.png?v=1'
			};
		},
		onLoad() {
			this.movielist = uni.getStorageSync('learnList')
			if(this.movielist.length == 0) {
				this.noMoerData = true
				console.log(this.noMoerData,'1111111111')
			}else {
				this.noMoerData = false
			}
			this.list = uni.getStorageSync('projectList')
			if(this.list.length == 0) {
				this.noMoerData1 = true
			}else {
				this.noMoerData1 = false
			}
		},
		methods: {
			
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
			},
			moviedetails(item) {
					  uni.navigateTo({
						url:"../learn/textdetails?id=" + id
					  })		
			},
		}
	};
	</script>
	
	<style scoped>
	/* 顶部nav导航栏begin */
	.bg {
		background-color: #fff!important;
		width: 100%;
		height: 100%;
	}
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
		/* background: rgba(249, 249, 249, 1); */
	}
	.nomoreimage {
		width: 150px;
		height: 150px;
		margin: auto;
	}
	.nomore {
		width: 150px;
		height: 150px;
		
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
		height: 60px;
		/* 在这里设置导航条高度 */
		padding-right: 15px;
		border-bottom: 1px solid #DEDEDE;
		z-index: 999;
	}
	
	.top-menu-view .menu-one-view {
		display: inline-block;
		white-space: nowrap;
		/* height: 100%; */
		width: 50%;
	}
	
	.top-menu-view .menu-one-view .menu-one {
		/* 在这里写 单个按钮样式 */
		margin: 12px 12px 18px 22px;
		position: relative;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.top-menu-view .menu-one-view .menu-one .menu-one-txt {
		height: 40upx;
		font-size: 18px;
		font-weight: bold;;
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
		display: flex;
		align-items: center;
		justify-content: center;
		/* border-bottom: 3px solid rgba(129, 129, 129, 1); */
	}
	
	.top-menu-view .menu-one-view .menu-one-act .menu-one-txt {
		height: 30px;
		color: rgba(80, 80, 80, 1);
		font-size: 18px;
		font-weight: bold;
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
		/* height: 600px; */
		background-color: #ffffff;
		
	}
	.main_bac {
		top: 60px;
		height: auto;
		background-color: #FFFFFF;
		position: absolute;
		width: 100%;
		bottom: 0;
	}
	.swiper-one-list {
		/* margin-top: 60px; */
		height: 100%;
		width: 100%;
		/* margin-bottom: 600px; */
		overflow: auto;
	}
	/* 顶部nav  end */
	/* 项目类别begin */
	.list {
		width: 100%;
		display: flex;
		flex-direction: row;
		margin: 22px 27px 0 18px;
	}
	.list_img {
		width: 35%;
		height: 75px;
		border-radius: 4px;
		margin-right: 16px;

	}
	.list_img image {
		width: 100%;
		height: 75px;
		border-radius: 4px;

	}
	.list_img1 {
		width: 35%;
		height: 85px;
		border-radius: 4px;
		margin-right: 16px;
	
	}
	.list_img1 image {
		width: 100%;
		height: 85px;
		border-radius: 4px;
	
	}
	.list_message {
		width: 55%;
		position: relative;
		display: flex;
		flex-direction: column;
		word-break: break-all;
		word-wrap: break-word;
		/* width: ; */
	}
	.list_name {
		color: rgba(80, 80, 80, 1);
		font-size: 16px;
		text-align: left;
		font-weight: bold;
		margin-top: 8px;
	}
	.list_intro {
		color: rgba(166, 166, 166, 1);
		font-size: 14px;
		text-align: left;
		margin-top: 20px;
		width: 90%;
		height: 30px;
	}
	.list_message_bottom {
		position: absolute;
		right: 5%;
		top: 8px;
	}
	.list_time {
		color: #EE4141;
		font-size: 14px;
		text-align: left;
	}
	.list_price {
			color: #EE4141;
			font-size: 16px;

	}
	.movie_name {
		font-size: 15px;
		text-align: left;
		/* font-weight: bold; */
		margin: 7px 0 20px 0;
	}
	.movie_intro {
		font-size: 13px;
		color: #EE4141;
		}
	/* 项目类别end */
	</style>
	