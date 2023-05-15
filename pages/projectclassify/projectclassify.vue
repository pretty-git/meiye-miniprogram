<template>
	<view class="body-view">
		<view class="container999" @touchstart="refreshStart" @touchmove="refreshMove" @touchend="refreshEnd">
			<refresh ref="refresh" @isRefresh='isRefresh'></refresh>
			<view class='nav'>
				<!-- 导航栏 agents导航栏标题 -->
				<navTabs ref="navTab" :tabTitle="classlist" @changeTab='changeTab'></navTabs>
			</view>
			<mpopup ref="mpopup" :isdistance="true"></mpopup>
			<!-- swiper切换 swiper-item表示一页 scroll-view表示滚动视窗 -->
			<swiper style="min-height: 95vh;" :current="currentTab" @change="swiperTab">
				<swiper-item v-for="(listItem,listIndex) in classlist" :key="listIndex">
					<scroll-view style="height: 100%;" :scroll-y="true" scroll-with-animation :scroll-into-view="toView"
						@scrolltolower="lower1">
						<view :id="'top' + listIndex " style="width: 100%;height: 180upx;"></view>
						<view class='content'>
							<view v-for="(item,index) in dataList" :key="item.serveId" class=" bottom list"
								style="padding:30upx 0;" @click="projectdetails(item)">
								<view class="list_img">
									<image :src="item.pictureId" mode="aspectFill"></image>
								</view>
								<view class="list_message">
									<view class="list_name">{{ item.serveName }}</view>
									<view class="list_intro">{{ item.serverSlogan }}</view>
									<view class="list_price">￥{{ item.specialOffer }}</view>

								</view>
							</view>
						</view>
						<view class='noCard box2' v-if="dataList.length===0">
							暂无信息
						</view>
						<view style="width: 100%;height: 100upx;opacity:0;"></view>
					</scroll-view>
				</swiper-item>
			</swiper>

		</view>
	</view>
</template>
<script>
	const util = require('@/util/util.js');
	import refresh from '@/components/refresh.vue';
	import navTabs from '@/components/navTabs.vue';
	import tabBar4 from '@/components/tabBar4.vue';
	export default {
		components: {
			refresh,
			navTabs,
			tabBar4
		},
		data() {
			return {
				pages: [1, 1, 1, 1, 1, 1], //第几个swiper的第几页
				tabTitle: ['选择一', '选择二', '选择一', '选择二', '选择一', '选择二'], //导航栏格式 --导航栏组件
				list: [1, 2, 3, 4, 5, 6],
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				scrollLeft: 0,
				isClickChange: false,
				currentTab: 0,
				id: '',
				pageNumber: 1,
				scrollHeight: 0,
				classlist: [],
				dataList: [],
				classificationId: ''
			};
		},
		onLoad: function(props) {
			console.log(props, 'shhhh')
			this.classificationId = props.classificationId
			// this.currentTab = props.curIndex
			this.getClass()

		},
		methods: {
			getClass() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let storeId = uni.getStorageSync('storeId')
				let level = 2
				let classificationId = this.classificationId
				// uni.request({
				// 	method: 'GET',
				// 	url: getApp().globalData.url + `/applet/store/selectTwo/${classificationId}`,
				// 	header: {
				// 		"Content-Type": "application/x-www-form-urlencoded" //如果为空，加上头部接收
				// 	},
				// 	success: (res) => {
				// console.log(res.data, '二级分类')
				// if (res.data.result.length == 0) {
				// 	uni.showToast({
				// 		title: '暂无分类数据',
				// 		icon: 'none'
				// 	})
				// 	uni.hideLoading()
				// 	return;
				// }
				this.classlist = [{
						claName: '一次性',
						classificationId: 1,
					},
					{
						claName: '大礼包',
						classificationId: 2
					}
				]
				this.id = this.classlist[this.currentTab].classificationId
				this.getData()
				uni.hideLoading()
				// 	},
				// 	fail: (err) => {
				// 		this.error()
				// 		uni.hideLoading()
				// 	}
				// })
			},
			getData() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				// uni.request({
				// 	method: 'POST',
				// 	url: getApp().globalData.url + '/applet/project/findProjectByProjectClassList',
				// 	data: {
				// 		serveClassId: this.id,
				// 		pageCount: 10,
				// 		pageNumber: this.pageNumber,
				// 		storeId: uni.getStorageSync('storeId'),
				// 		userId: uni.getStorageSync('user').customerId
				// 	},
				// 	header: {
				// 		"Content-Type": "application/json" //如果为空，加上头部接收     
				// 	},
				// 	success: (res) => {

				// if(res.data.result.pageData.length === 0 ){
				// 	uni.showToast({
				// 		icon: 'none',
				// 		title: '没有数据了'
				// 	})
				// }else{
				// 	uni.showToast({
				// 		icon: 'success',
				// 		title: '加载成功'
				// 	})
				// }
				// console.log(res.data.result.pageData)

				this.dataList = this.dataList.concat([{
					pictureId: '../../static/banner/31.jpg',
					serveName: '项目1',
					serverSlogan: '性价比最高',
					specialOffer: 111
				}]);
				uni.hideLoading()
				// 	},
				// 	fail: (err) => {
				// 		this.error()
				// 		uni.hideLoading()
				// 	}
				// })
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
			changeTab(index) {
				this.currentTab = index
			},
			swiperTab: function(e) {
				this.dataList = []
				var index = e.detail.current //获取索引
				this.id = this.classlist[index].classificationId
				this.pageNumber = 1
				this.getData()
				if (this.tabTitle.length <= 5) {
					this.$refs.navTab.navClick(index)
				} else {
					this.$refs.navTab.longClick(index)
				}
			},
			// 加载更多 util.throttle为防抖函数
			lower1: util.throttle(function(e) {
				this.pageNumber = this.pageNumber + 1
				this.getData()
				console.log('下一页')
				// console.log(`加载${this.currentTab}`)//currentTab表示当前所在页数 根据当前所在页数发起请求并带上page页数

				// uni.showLoading({
				// 	title: '加载中',
				// 	mask:true
				// })
				// this.isRequest().then((res)=>{
				// 	console.log(res,'加载后的数据')
				// 	let tempList = this.dataList
				// 	tempList = tempList.concat(res)
				// 	this.dataList = tempList
				// 	this.$forceUpdate() //二维数组，开启强制渲染
				// })
			}, 300),
			// 刷新touch监听
			// isRequest(pages) {
			// 	console.log('刷新1')
			// 	return new Promise((resolve, reject) => {
			// 		this.pages[this.currentTab]++
			// 		var that = this
			// 		setTimeout(() => {
			// 			uni.hideLoading()
			// 			// 请求加载新的数据
			// 			let newData = [
			// 				{
			// 					id: 3,
			// 					src: 'https://7765-we-63574e-1258830969.tcb.qcloud.la/mingzi/class6.jpg?sign=1b57cd828c2df7a42ab584cfc108d107&t=1565945935',
			// 					list_name: '手部美白护理',
			// 					list_intro: '女人的第二张脸，双手跳动的小音符',
			// 					list_time: '60分钟',
			// 					list_price: '158'
			// 				},
			// 			]
			// 			resolve(newData)
			// 		}, 1000)
			// 	})
			// },

			refreshStart(e) {
				this.$refs.refresh.refreshStart(e);
			},
			refreshMove(e) {
				this.$refs.refresh.refreshMove(e);
			},
			refreshEnd(e) {
				this.$refs.refresh.refreshEnd(e);
			},
			isRefresh() {
				console.log('刷新2')
				this.dataList = []
				this.pageNumber = 1
				this.getData()
				// uni.showToast({
				// 	icon: 'success',
				// 	title: '刷新成功'
				// })
				// uni.hideLoading()
			},
			projectdetails(item) {
				console.log(item, 'item')
				// uni.navigateTo({
				// 	url: '../giftdetails/projectdetail?serveId=' + item.serveId + '&src=' + item.pictureId + '&name=' + item.serveName +
				// 		'&intro=' + item.serverSlogan + '&price=' + item.specialOffer + '&classificationId=' + this.id,
				// })
				uni.navigateTo({
					url: '../giftdetails/projectdetail?serveId=' + item.serveId + '&classificationId=' + this.id,
				})
			}
		}
	};
</script>

<style scoped>
	.box2 {
		text-align: center;
		padding-top: 100upx;
	}

	.container999 {
		width: 100vw;
		font-size: 28upx;
		min-height: 100vh;
		overflow: hidden;
		color: #6B8082;
		position: relative;
		background-color: #f6f6f6;
	}

	.nav {
		position: fixed;
		left: 0;
		/* top: 50upx; */
		color: white;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		font-size: 24upx;
		z-index: 996;
		background-color: #F1F1F1;
	}

	.bottom {
		border-bottom: 2upx solid #E5E5E5;
	}

	.list {
		width: 100%;
		display: flex;
		flex-direction: row;
		margin: 22px 27px 0 18px;
	}

	.list_img {
		width: 30%;
		height: 80px;
		border-radius: 2px;
		margin-right: 16px;
	}

	.list_img image {
		width: 100%;
		height: 80px;
		border-radius: 2px;
	}

	.list_message {
		display: flex;
		flex-direction: column;
		word-break: break-all;
		word-wrap: break-word;
		position: relative;
		/* width: ; */
	}

	.list_name {
		color: rgba(80, 80, 80, 1);
		font-size: 16px;
		text-align: left;
		font-weight: bold;
		margin-bottom: 7px;
	}

	.list_intro {
		color: rgba(166, 166, 166, 1);
		font-size: 14px;
		text-align: left;
		margin-top: 18px;
		width: 220px;
		height: 30px;
		overflow: hidden;

		text-overflow: ellipsis;

		white-space: nowrap;
	}

	.list_message_bottom {
		display: flex;
		flex-direction: row;
	}

	.list_time {
		color: #FB5968;
		font-size: 14px;
		text-align: left;
	}

	.list_price {
		margin-left: 60%;
		color: #FB5968;
		font-size: 16px;
		position: absolute;
		top: 2px;
		right: 10%;
	}

	/* 项目类别end */
</style>