<template>
	<view class="bg">
		<!-- banner导航栏 begin -->
		<view class="banner_img">
			<image src="../../static/banner/5.jpg" mode="aspectFill"></image>
			<view class="banner_text">{{banner_text}}</view>
		</view>
		<!-- banner导航栏end -->
		<mescroll-uni :down="downOption" @down="downCallback" @up="upCallback" :fixedTop='fixedTop'>
			<view class="gift_car">
				<view v-for="(item,index) in giftlist" :key="index" class="gift" @click="bintap(item)">
					<view class="img_verticle">
						<image :src="item.giftImg" mode="aspectFill"></image>
						<view class="gift_purchase">立即抢购</view>
					</view>
					<view class="gift_mesage">
						<text class="giftname">{{ item.giftName }}</text>
						<view class="gift_include flex_row">
							<view class="flex_row nowrap">
								包含项目:
								<view class="" v-for="(items,index) in item.projectMiddles" :key="index">
									{{items.serveName}}
								</view>
								
							</view>
							....
						</view>
						
						<view class="price">
							<view class="gift_price">限时优惠:￥{{ item.giftPricing }}</view>
							<view class="gift_origin">￥{{ item.giftOriginalPrice }}</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni> 
		<!-- end -->
	</view>
</template>

<script>
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	export default {
			components: {
				MescrollUni
			},
		data() {
			return {
				downOption: {
					auto: false //是否在初始化后,自动执行下拉回调callback; 默认true
				},
				fixedTop:300,
				total:0,
				banner_text:'春节美丽定制活动开始啦！',
				giftlist: [],
				projectMiddles:[]
			}
		},
		onLoad() {
			/*下拉刷新的回调 */
			// this.downCallback()
		},
		onPullDownRefresh() {
		    console.log('refresh');
		    setTimeout(function () {
		        uni.stopPullDownRefresh();
		    }, 300);
		},
		methods: {
			bintap(item) {
				console.log(item.giftId)
				uni.navigateTo({
					url: '../giftdetails/giftdetails?giftId=' + item.giftId +'&giftPrice=' + item.giftPricing
				})
			},
			downCallback(mescroll){
				// 第2种: 下拉刷新和上拉加载调同样的接口, 那以上请求可删, 直接用mescroll.resetUpScroll()代替
				mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
	
			},
			upCallback(mescroll) {
				console.log(mescroll,'mescorll')
				// let pageNum = mescroll.num; // 页码, 默认从1开始
				// let pageSize = mescroll.size; // 页长, 默认每页10条
				// uni.request({
				// 	method:'POST',
				// 	url:getApp().globalData.url + '/applet/gift/findGiftList',
				// 	// url: getApp().globalData.url + '/applet/Gift/findGiftList',
				// 	data:{
				// 			storeId:uni.getStorageSync('storeId'),
				// 			pageNumber:pageNum,
				// 			pageCount:pageSize
				// 		},	
				// 	header: {
				// 	    "Content-Type": "application/json" //如果为空，加上头部接收 
				// 	},
				// 	success: (res) => {
						// 接口返回的当前页数据列表 (数组)
							this.giftlist = [{
								giftImg: '../../static/banner/22.jpg',
								giftName: '超级大礼包',
								giftPricing: 49.9,
								projectMiddles: [{
									projectPrice: 33.,
									serveName: "礼包1"
								},{
									projectPrice: 63,
									serveName: "礼包2"
								}]
							}]
							for (let i = 0; i < this.giftlist.length; i++) {
								this.giftlist[i].giftOriginalPrice = 0
								for(var j = 0 ; j < this.giftlist[i].projectMiddles.length;j++) {
									this.giftlist[i].giftOriginalPrice = this.giftlist[i].giftOriginalPrice + this.giftlist[i].projectMiddles[j].projectPrice
								}
							}
							console.log(this.giftlist,'`````礼包列表')
							// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
							// if(res.datatotalCount % 10 == 0) {
							// 	let totalPage =res.data.totalCount / 10 ; 
							// }else {
							// 	let totalPage =res.data.totalCount / 10 + 1; 
							// } 
							// // 接口返回的总数据量(比如列表有26个数据,每页10条,共3页; 则totalSize值为26)
							// let totalSize = res.data.totalCount; 
							// // 接口返回的是否有下一页 (true/false)
							// if(res.data.pageCount == pageNum) {
							// 	let hasNext = false;
							// }else {
							// 	let hasNext = true;
							// }
							// //设置列表数据
							// if(mescroll.num == 1) this.dataList = []; //如果是第一页需手动置空列表
							// this.dataList = this.dataList.concat(this.giftlist); //追加新数据
							
							// mescroll.endBySize(this.giftlist.length, totalSize); 
							
							
							// 如果数据较复杂,可等到渲染完成之后再隐藏下拉加载状态: 如
							this.$nextTick(()=>{
								mescroll.endSuccess(this.giftlist.length)
							})
						
						//giftlist.length必传的原因:
						// 1. 使配置的noMoreSize 和 empty生效
						// 2. 判断是否有下一页的首要依据: 
						//    当传的值小于page.size时(说明不满页了),则一定会认为无更多数据;
						//    比传入的totalPage, totalSize, hasNext具有更高的判断优先级;
						// 3. 当传的值等于page.size时,才会取totalPage, totalSize, hasNext判断是否有下一页
						// 传totalPage, totalSize, hasNext目的是避免方法四描述的小问题
					// },
					// fail: () => {
					// 	// 失败隐藏下拉加载状态
					// 		uni.showToast({
					// 			title:'网络请求超时,请重试',
					// 			icon:'none'
					// 		})
						// mescroll.endErr()
					// }
				// })
			},
		}
	}
</script>

<style scoped>
	.bg {
		/* position: absolute; */
		bottom: 0;
		top:0;
		background-color: #fff!important;
		width: 100%
	}
	.banner_img {
		width: 100%;
		height: 140px;
		position: relative;
	}
	.banner_img image {
		width: 100%;
		height: 140px;
	}
	.banner_text {
		position: absolute;
		color: rgba(255, 255, 255, 1);;
		font-size: 26px;
		width: 100%;
		height: 140px;
		/* float: left; */
		line-height: 140px;
		top: 0;
		text-align: center;
		font-weight: bold;
	}
	/* 礼包列表 */
	.gift_car {
		width: 100%;
		/* height: 82px; */
		overflow: hidden;
		/* overflow-x: scroll; */
		display: flex;
		flex-direction: column;
		margin-bottom: 20px;
		/* padding: 0 10px 0 0; */
	}
	
	.gift {
		width: 100%;
		/* padding-left: 10px; */
		position: relative;
		text-overflow: ellipsis; /*文字隐藏后添加省略号*/
		white-space: nowrap; /*强制不换行*/
		overflow: hidden;
		display: flex;
		background-color: #fff;
		flex-direction: row;
	}
	.img_verticle {
		width: 32%;
		display: flex;
		flex-direction: column;
		border-radius: 4px;
		margin: 16px 14px 13px 16px ;
	}
	.gift_mesage {
		width: 60%;
		display: flex;
		flex-direction: column;
		margin-top: 21px;
		position: relative;
	}
	.gift image {
		width: 100%;
		height: 82px;
	} 
	 .gift_purchase {
		width: 32%;
		height: 26px;
		line-height: 26px;
		position: absolute;
		bottom: 0px;
		color: rgba(255, 255, 255, 1);
		background-color: #FB4B5C;
		/* border-radius: 4px; */
		font-size: 14px;
		text-align: center;
	}
	.giftname {
		position: absolute;
		/* bottom: 42px; */
		color: rgba(80, 80, 80, 1);
		font-size: 13px;
		text-align: left;
		font-weight: bold;
	}
	.price {
		display: flex;
		flex-direction: row;
		position: absolute;
		bottom: 13px;
		width: 100%;
	}
	.gift_price {
		color: #FB4B5C;
		font-size: 15px;
		position: absolute;
	    bottom: -10px;
	}
	.gift_origin {
		color: rgba(166, 166, 166, 1);
		font-size: 14px;
		text-align: left;
		position: absolute;
		left: 60px;
		left: 141px;
		 bottom: -10px;
		text-decoration: line-through;
	} 
	.gift_include {
		position: absolute;
		bottom: 43px;
		color: rgba(166, 166, 166, 1);
		font-size: 12px;
		text-align: left;
		width: 80%;
	}
</style>
