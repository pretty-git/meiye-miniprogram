<template>
	<view class="body-view">
		<scroll-view class="top-menu-view" scroll-x="true" :scroll-left="scrollLeft">
			<block v-for="(menuTab, index) in classlist" :key="index">
				<view class="menu-one-view" v-bind:id="'tabNum' + index" @click="swichMenu(index)">
					<view :class="[currentTab == index ? 'menu-one-act' : 'menu-one']" style="display: flex;flex-direction: column;">
						
						<view class="menu-one-txt">{{ menuTab.classname }}</view>
						<!-- <view class="menu-one-bottom"> -->
					</view>
				</view>
			</block>
		</scroll-view>
		<mpopup  ref="mpopup" :isdistance="true"></mpopup>
		<swiper :current="currentTab" class="swiper-box-list" duration="300" @change="swiperChange">
			<swiper-item v-for="(menuTab, index) in classlist" :key="index">
				<mescroll-uni :down="downOption" @down="downCallback" @up="upCallback" :fixedTop='fixedTop'>
					<scroll-view class="swiper-one-list" scroll-y="true">
						<view class="recordlist" v-for="(item,index) in processlist" :key="index" @click="complaintsmore(item)">
							<view class=""  v-if="item.complainStatus == 1 && currentTab == 0">
									<!-- <view class="line"></view> -->
								<view class="recordlist_top">
									<view class="recordlist_id">
										订单号:{{item.complainSuggestId}}
									</view>
									<view class="recordlist_time">
										{{item.complainTime}}
									</view>
								</view>
								<view class="recordlist_text">
									描述:{{item.complainReasons}}
								</view>
								<view class="recordlist_bottom">
									<view class="recordlist_state" >
										处理中
									</view>
									<view class="describle">
										工作人员将会与您电话联系核实情况
									</view>
								</view>
							</view>
							<view class=""  v-if="item.complainStatus == 2 && currentTab == 1">
									<!-- <view class="line"></view> -->
								<view class="recordlist_top">
									<view class="recordlist_id">
										订单号:{{item.complainSuggestId}}
									</view>
									<view class="recordlist_time">
										{{item.complainTime}}
									</view>
								</view>
								<view class="recordlist_text">
									描述:{{item.complainReasons}}
								</view>
								<view class="recordlist_bottom">
									<view class="recordlist_state" >
										已处理
									</view>
									<view class="describle">
										工作人员将会与您电话联系核实情况
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</mescroll-uni>
			</swiper-item>
		</swiper>
	</view>
</template>
<script>
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	export default {
		components:{
			MescrollUni
		},
	data() {
		return {
			modalName: null,
			scrollLeft: 0,
			isClickChange: false,
			currentTab: 0,
			scrollHeight: 0,
			processlist:[],
			classlist: [
				{
					id: 0,
					classname: '处理中'
				},
				{
					id: 1,
					classname: '投诉记录'
				},
				
			]
		};
	},
	
	onLoad(props) {
		
	},
	
	methods: {
		getList() {
			uni.showLoading({
				title:'加载中',
				mask:true
			})
			uni.request({    //获取购物券
				method: 'POST',
				url: getApp().globalData.url + `/applet/suggest/list?pageNum=${1}&pageSize=${100}`,
				data: {
					customerId: uni.getStorageSync('user').customerId
				},
				success: (res) => {
					this.processlist = res.data.rows
					uni.hideLoading()
				},fail:(err) => {
					this.error()
					uni.hideLoading()
				}
			})
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
			this.getList()
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
		/*下拉刷新的回调 */
		downCallback(mescroll){
			
			mescroll.resetUpScroll(); 
		},
		/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
		upCallback(mescroll) {
			let pageNum = mescroll.num; // 页码, 默认从1开始
			let pageSize = mescroll.size; // 页长, 默认每页10条
			uni.request({
				method: 'POST',
				url: getApp().globalData.url + `/applet/suggest/list?pageNum=${pageNum}&pageSize=${100}`,
				data: {
					customerId: uni.getStorageSync('user').customerId
				},
				header: {
				    "Content-Type": "application/json" //如果为空，加上头部接收    
				},
				success: (res) => {
					console.log(res,'年费卡')
					// 接口返回的当前页数据列表 (数组)
					if(res.data.rows.length == 0 ) {
							uni.showToast({
								title:'查询无数据',
								icon:'none'
							})
						}else {
							let curPageData = res.data.rows;
							var totalPage = 0
						// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
							if(res.data.total % 10 == 0) {
								 totalPage =res.data.total / 10 ; 
							}else {
								 totalPage = Math.floor(res.data.total / 10)  + 1; 
							} 
							// 接口返回的总数据量(比如列表有26个数据,每页10条,共3页; 则totalSize值为26)
							let totalSize = res.data.total; 
							// 接口返回的是否有下一页 (true/false)
							if(totalPage == pageNum) {
								let hasNext = false;
							}else {
								let hasNext = true;
							}
							//设置列表数据
							if(mescroll.num == 1) this.processlist = []; //如果是第一页需手动置空列表
							this.processlist = this.processlist.concat(curPageData); //追加新数据
							mescroll.endBySize(curPageData.length, totalSize); 
							// 如果数据较复杂,可等到渲染完成之后再隐藏下拉加载状态: 如
							this.$nextTick(()=>{
								mescroll.endSuccess(curPageData.length)
							})
						}
				},
				fail: () => {
					// 失败隐藏下拉加载状态
					mescroll.endErr()
					uni.showToast({
						title:'网络加载失败',
						icon:'none'
					})
				}
			})
		},
		showModal(e) {
			this.modalName = e.currentTarget.dataset.target
		},
		hideModal(e) {
			this.modalName = null
		},
		alter_pernickname(e) {
			console.log(this.pernickname);
		},
		complaintsmore(item) {
			uni.navigateTo({
				url:'../me/complaintsmore?complainSuggestId=' + item.complainSuggestId
			})
		}
	}
};
</script>

<style scoped>
/* 顶部nav导航栏begin */

.line {
	width: 100%;
	height: 10px;
	background-color: #E5E5E5;
}
page {
	width: 100%;
	height: 100%;
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
	justify-content: center;
	
}

.body-view {
	display: flex;
	flex: 1;
	flex-direction: column;
	overflow: hidden;
	height: auto;
	position: absolute;
	top: 0px;
	bottom: 0px;
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
	/* height: auto; */
	background-color: #ffffff;
	height: auto;
}

.swiper-one-list {
	/* margin-top: 60px; */
	height: 100%;
	width: 100%;
	/* margin-bottom: 600px; */
	overflow: auto;
}
/* 顶部nav  end */
/* 第二页:投诉记录 */
.recordlist{
	width: 100%;
	/* height: 211px; */
	border-bottom: 1px solid #e5e5e5;
}
.recordlist_top {
	height: 55px;
	display: flex;
	flex-direction: row;
	line-height: 55px;
	color: rgba(128, 128, 128, 1);
	/* font-size: 14px; */
	/* font-weight: bold; */
	margin: 0 auto;
    width: 92%;
}
.recordlist_id {
	width: 50%;
	text-align: left;
	font-size: 16px;
	color: #000;
	padding-left: 3%;

}
.recordlist_time {
	width: 50%;
	text-align: right;
	padding-right: 3%;
}
.recordlist_text {
	width: 90%;
	background-color: #EEEEEE;
	font-size: 14px;
	padding: 10px 15px;
	text-overflow: ellipsis;
	overflow: hidden;
	margin: 0 auto;
	border-radius: 4px;
	color: #8D8D8D;

	
}
.recordlist_bottom {
	display: flex;
	flex-direction: row;
	width: 90%;
	height: 45px;
	line-height: 45px;
	margin: 0 auto;
	background-color: #fff;
	border-radius: 6px;
	font-size: 14px;
	padding-left: 15px;
}
.recordlist_state {
	width: 22%;
}
.describle {
	color: #000000;
	font-size: 14px;
	text-align: right;
}
</style>
