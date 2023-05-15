<template>
	<view class="page">
			<view class="navigate_top">
				<view class="indextop_iconleft font" @click="backpage">
					<text>&#xe622;</text>
				</view>
				<view class="navigate_top_title">
					<text>分配顾客</text>  <!--   两个 -->
				</view>
			</view>
			<view class="mainpage">
				<scroll-view class="scroll-view_H" scroll-x="true">
					<view v-for="(item,index) in dateArr" :key="index" class="scroll-view-item_H flex_row" @click="selectDateEvent(index,item)"  >
						<view class="days" :class="{on:index==dateActive}">{{item}}</view>
					</view>
				</scroll-view>
						<swiper class="tab-content" :current="dateActive" duration="300" @change="switchTab" :style="{height:winHeight+'px'}">
									<!-- 客户档案 -->
								<swiper-item>
									<scroll-view scroll-y class="scoll-y" >
									<view v-for="(item,index1) in notallocation" :key="index1" class="serviceList flex_row" @click="chooseTab(item,index1)" :class="{choose:index1 == chooseindex}" >
												<view class="serviceSrc">
													<image :src="item.customersrc" mode="aspectFill"></image>
												</view>
												<view class="flex_column " style="width: 55%;padding-left: 10px;">
													<view style="margin: 10px 0;">
														{{item.name}} <text class="font" style="color: #f4ea2a;font-size: 20px; margin-left: 15px;" v-if="dateActive==5">&#xe672;</text>
													</view>
													<view >
														{{item. tel}}
													</view>
												</view>
												<view class="flex_column width" style="width: 50%;padding-top: 10px;">
													<view class="flex_row">
														<view class="status" >
															最近来店:{{item.time}}
														</view>
														
													</view>
												
													
												</view>
									</view>
										
									</scroll-view>
								</swiper-item>
								<swiper-item>
									<scroll-view scroll-y class="scoll-y" >
									<view v-for="(item,index1) in nowallocation" :key="index1" class="serviceList flex_row" @click="chooseTab(item,index1)" :class="{choose:index1 == chooseindex}">
												<view class="serviceSrc">
													<image :src="item.customersrc" mode="aspectFill"></image>
												</view>
												<view class="flex_column " style="width: 55%;padding-left: 10px;">
													<view style="margin: 10px 0;">
														{{item.name}} <text class="font" style="color: #f4ea2a;font-size: 20px; margin-left: 15px;" v-if="dateActive==5">&#xe672;</text>
													</view>
													<view >
														{{item. tel}}
													</view>
												</view>
												<view class="flex_column width" style="width: 50%;padding-top: 10px;">
													<view class="flex_row">
														<view class="status" >
															最近来店:{{item.time}}
														</view>
														
													</view>
													<view class="status" v-if="dateActive!=0">
														所属员工:{{item.staffname}}
													</view>
													
												</view>
									</view>
										
									</scroll-view>
								</swiper-item>
								<swiper-item>
									<scroll-view scroll-y class="scoll-y" >
									<view v-for="(item,index1) in otherallocation" :key="index1" class="serviceList flex_row" @click="chooseTab(item,index1)" :class="{choose:index1 == chooseindex}">
												<view class="serviceSrc">
													<image :src="item.customersrc" mode="aspectFill"></image>
												</view>
												<view class="flex_column " style="width: 55%;padding-left: 10px;">
													<view style="margin: 10px 0;">
														{{item.name}} <text class="font" style="color: #f4ea2a;font-size: 20px; margin-left: 15px;" v-if="dateActive==5">&#xe672;</text>
													</view>
													<view >
														{{item. tel}}
													</view>
												</view>
												<view class="flex_column width" style="width: 50%;padding-top: 10px;">
													<view class="flex_row">
														<view class="status" >
															最近来店:{{item.time}}
														</view>
														
													</view>
													<view class="status" v-if="dateActive!=0">
														所属员工:{{item.staffname}}
													</view>
													
												</view>
									</view>
										
									</scroll-view>
								</swiper-item>
								
							</swiper>
			</view>
			<!-- 下方按钮 -->
			<view class="bottom">
				<view class="show_price">
					删除配客
				</view>
				<view class="buybtn" >   <!-- 支付跳转传递礼包的价格 -->
					配客
				</view>
			</view>
	</view>
	
</template>
<script>
	export default {
		data() {
			return {
				chooseindex:0,  //列表被选择
				winHeight: "", //窗口高度
				currentTab: 0, //预设当前项的值
				scrollLeft: 0, //tab标题的滚动条位置
				dateActive:0,//选中的日期索引
				dateArr:['未分配','当前员工配客','其他员工配客 '],//日期数据
				notallocation:[
					{
						customersrc: 'https://7765-we-63574e-1258830969.tcb.qcloud.la/mingzi/man.jpg?sign=13cd306d8fac42cffcdff6364956af2d&t=1565946123',
						name:"李芳芬",
						tel:'13365666635',
						time:'2019-01-25'
						
					},
					{
						customersrc: 'https://7765-we-63574e-1258830969.tcb.qcloud.la/mingzi/man.jpg?sign=13cd306d8fac42cffcdff6364956af2d&t=1565946123',
						name:"李芳芬",
						tel:'13365666635',
						time:'2019-01-25'
						
					}
				],
				nowallocation:[
					{
						customersrc: 'https://7765-we-63574e-1258830969.tcb.qcloud.la/mingzi/man.jpg?sign=13cd306d8fac42cffcdff6364956af2d&t=1565946123',
						name:"李芳芬",
						tel:'13365666635',
						time:'2019-01-25',
						staffname:'王大锤'
						
					},
					{
						customersrc: 'https://7765-we-63574e-1258830969.tcb.qcloud.la/mingzi/man.jpg?sign=13cd306d8fac42cffcdff6364956af2d&t=1565946123',
						name:"李芳芬",
						tel:'13365666635',
						time:'2019-01-25',
						staffname:'王大锤'
						
					}
				],
				otherallocation:[
					{
						customersrc: 'https://7765-we-63574e-1258830969.tcb.qcloud.la/mingzi/man.jpg?sign=13cd306d8fac42cffcdff6364956af2d&t=1565946123',
						name:"李芳芬",
						tel:'13365666635',
						time:'2019-01-25',
						staffname:'星系'
						
					}
				],
			}
		},
		onLoad() {
			let that = this;
			//  高度自适应
			uni.getSystemInfo({
				success: function(res) {
					console.log(res)
					let calc = res.windowHeight + 210;
					that.winHeight = calc;
				}
			});
		},
		methods:{
			scroll: function(e) {
			            console.log(e)
			            this.old.scrollTop = e.detail.scrollTop
			        },
			// 滚动切换标签样式
						switchTab: function(e) {
							let that = this;
							this.dateActive = e.detail.current;
							this.chooseindex = 0;
							this.checkCor();
						},
						// 点击标题切换当前页时改变样式
						swichNav: function(e) {
							let cur = e.currentTarget.dataset.current;
							if (this.currentTab == cur) {
								return false;
							} else {
								this.currentTab = cur
							}
						},
						//判断当前滚动超过一屏时，设置tab标题滚动条。
						checkCor: function() {
							if (this.currentTab > 3) {
								//这里距离按实际计算
								this.scrollLeft = 300
							} else {
								this.scrollLeft = 0
							}
						},
			selectDateEvent(index,item){
				this.dateActive = index
				
			},
			backpage() {
				uni.navigateBack({
				    delta: 1,
				    animationType: 'pop-out',
				    animationDuration: 200
				});
			},
			chooseTab(item,index) {
				this.chooseindex = index;
			}
		}
	}
</script>


<style scoped>
	.mainpage {
		position: absolute;
		top: 70px;
		/* bottom: 50%; */
		width: 100%;
		height: 125%; /* 解决iPhone下滑弹出 */
		/* padding:  5%; */
	}
	.page {
			position: absolute;
			top: 0;
			width: 100%;
			height: 100%;
			background-color: #fff !important;
		}
	/* 顶部栏 */
			
			.navigate_top {
				display: flex;
				flex-direction: row;
				padding-top:var(--status-bar-height);  /* 获取手机信息顶部栏 */
				background-color: #1A81D1;   /* 主要色彩 */
				height: 70px;
				width: 100%;
				position: fixed;
				top: 0;
				z-index: 999;
			}
			.indextop_iconleft {
				position: relative;
				font-size: 20px;
				width: 25%;
				text-align: left;
				padding-left: 4%;
				margin: auto 0;
				color: #FFFFFF;
			}
			.navigate_top_title {
				width: 50%;
				margin: auto 0;
				text-align: center;
				font-size: 18px;
				color: #fff;
				font-weight: bold;
			}
			.indextop_iconright {
				font-size: 23px;
				width: 25%;
				padding-right: 1%;
				margin: auto 0;
				text-align: center;
				color: #FFFFFF;
				font-weight: bold;
			}
			/* 顶部栏end */
			.serviceSrc {
					width: 70px;
						height: 70px;
						border-radius: 36px;
					}
					
					 .serviceSrc  image{
						width: 70px;
						height: 70px;
						border-radius: 36px;
				}
				.serviceList {
					width: 100%;
					margin: 0 auto;
					padding: 15px 5%;
					background-color: #fff;
					border-bottom: 1px solid #e5e5e5;
					/* display: block; */
				}
				.status {
						/* font-weight: bold; */
						font-size: 13px;
						padding: 5px 0;
						/* text-align: center; */
				}
				.text {
					font-size: 14px;
					color: #505050;
					letter-spacing: 1px;
				}
			
				 .rank_text {
					 position: fixed;
					 top: 167px;
					 z-index: 9999;
					 left: 10px;
					 font-size: 16px;
					 font-weight: bold;
				 }
				 .serachIcon {
					 width: 80px !important;
					 height: 28px !important;
					 text-align: center !important;
					 line-height: 28px !important;
					 position: fixed;
					 top: 164px;
					 z-index: 9999;
					 right: 7px;
				 }
				
				 .scroll-view-item_H {
				  display: inline-block;
				  /* border: 1upx solid #aaa; */
				  text-align: center;
				  font-size: 28upx;
				  font-weight: 500;
				  /* padding: 15px; */
				  width: 33.3%;
				  margin: 15px 0;
				 }
				
				 .on {
					 font-weight: bold;
					 color: #0081FF;
				 }
				 .childon {
					background-color: #000000;
					font-size: 11px;
					color: #fff;
					border-radius: 10px;
					padding: 2px 10px;
					margin-top: 5px;
				
				 }
				
				 .tab-content {
					position: absolute;
					top: 50px;
					height: 120%;
					width: 100%; 
					border-top: 2px solid #e5e5e5;
				 }
				 
				 .header {
				 	padding: 80upx 90upx 60upx 90upx;
				 	box-sizing: border-box;
				 }
				 .choose {
					 border: 1px solid red;
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
							background-color: #a6a6a6;
							font-size: 17px;
							line-height: 50px;
							text-align: center;
						}
						.buybtn {
							width: 50%;
							height: 50px;
							color: #fff;
							background-color: #383838;
							font-size: 17px;
							line-height: 50px;
							text-align: center;
							border: 1px solid #1890ff;
						}
</style>
