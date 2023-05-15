<template>
	<view class="bg">
			<view style="width: 100%;padding-top: 10px;">
				<view class="tis flex_column" v-if="noMoerData == true">
					<view class="nomoreimage">
						<image :src="nomore" mode="aspectFill" class="nomore"></image>
					</view>
					<view class="" style="margin: auto;color: #a8a8a8;padding-top: 10px;">
						~暂无数据~
					</view>
				</view>
				<mescroll-uni :down="downOption" @down="downCallback" @up="upCallback" :fixedTop='fixedTop'>
			<view class="craftman_line" v-for="(item, index ) in craftlist" :key="index"  @click="craftman_details(item.staffId)">
				<view class="craftman_left">
					<view class="craftman_icon">  <!-- 头像 -->
						<image :src="'http://my.cloud.xmstruggle.com/' + item.staPhoto" mode="aspectFill"></image> 
					</view>
					<view class="craftman_left_explain" @click="craftmanDetails">  <!-- 人物解释 -->
							<view class="craftman_left_top">
									<view class="craftman_name">   <!-- 人物名字 -->
										{{item.staName}}
									</view>
									<view class="craftman_label">
										{{item.pgJobName}}   <!-- 人物标签 -->
									</view>
								<!-- 	<view class="whetherRecent" v-if="item.whetherRecent">
										最近服务过我
									</view> -->
							</view>
							<view  class="craftman_left_star"><!-- 任务评分展示 -->
								<view v-for="n in item.starLevel" >  
									<text class="craftman_left_star_icon">&#xe616;</text>
								</view>
								<view v-for="n in 5-item.starLevel">  
									<text class="craftman_left_star_icon">&#xe60b;</text>
								</view>
							</view>
							
							<!-- <view class="craftman_left_bottom">
								<view  v-for="label in item.craftman_left_bottom_label_list" :key="label"> 
									<view class="craftman_left_bottom_label">{{label}}</view> 
								</view>
							</view> -->
					</view>
				</view>
				
			</view>
			</mescroll-uni>
		</view>
		<!-- 本店手艺人模块  end -->
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
				type:"",
				dataList: [],
				total:0,
				carclass:'',
				craftman_left_star:0,
				storeId:'',
				customerId:'',
				upOption: {
						use: true, // 是否启用上拉加载; 默认true
						auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
						page: {
							num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
							size: 10 // 每页数据的数量,默认10
						},
						noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
						empty: {
							tip: '暂无相关数据'
						}
					},
				craftlist:[],
				nomore:'http://www.mescroll.com/img/mescroll-empty.png?v=1',
				noMoerData:false,
			}
		},
		onLoad() {
			uni.showLoading({
			 title: '加载中...',
			 mask: true
			})
			setTimeout(function () {
			    uni.hideLoading();
			   }, 500);
		},
		methods:{
			/*下拉刷新的回调 */
			downCallback(mescroll){
				// 第1种: 请求具体接口
				console.log('上拉加载mescorll')
				let pageNum = mescroll.num; // 页码, 默认从1开始
				let pageSize = mescroll.size; // 页长, 默认每页10条
				uni.request({
					method:'POST',
					url: getApp().globalData.url + `/applet/customer/FollowList`,
					data:{
						customerId:uni.getStorageSync('user').customerId,
						pageNumber:pageNum,
						pageCount:pageSize
					},
					header: {
					    "Content-Type": "application/json" //如果为空，加上头部接收 
					},
					success: () => {
						// 成功隐藏下拉加载状态
						mescroll.endSuccess()
					},
					fail: () => {
						// 失败隐藏下拉加载状态
							uni.showToast({
								title:'网络请求超时,请重试',
								icon:'none'
							})
						mescroll.endErr()
					}
				})
				// 第2种: 下拉刷新和上拉加载调同样的接口, 那以上请求可删, 直接用mescroll.resetUpScroll()代替
				mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				// 第3种: 下拉刷新什么也不处理, 可直接调用或者延时一会调用 mescroll.endSuccess() 结束即可
				mescroll.endSuccess()
			},
			/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
			upCallback(mescroll) {
				let pageNum = mescroll.num; // 页码, 默认从1开始
				let pageSize = mescroll.size; // 页长, 默认每页10条
				uni.request({
					method:'POST',
					url: getApp().globalData.url + `/applet/customer/FollowList`,
					data:{
						customerId:uni.getStorageSync('user').customerId,
						pageNumber:pageNum,
						pageCount:pageSize
					},	
					header: {
					    "Content-Type": "application/json" //如果为空，加上头部接收 
					},
					success: (res) => {
						console.log(res,'年费卡')
						// 接口返回的当前页数据列表 (数组)
							let curPageData = res.data.rows; 
							for(var i= 0 ; i < res.data.rows.length; i++ ) {
								res.data.rows[i].cardImg = 'http://my.cloud.xmstruggle.com/' + res.data.rows[i].cardImg 
							}
							// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
							if(res.data.totalCount % 10 == 0) {
								let totalPage =res.data.totalCount / 10 ; 
							}else {
								let totalPage =res.data.totalCount / 10 + 1; 
							} 
							// 接口返回的总数据量(比如列表有26个数据,每页10条,共3页; 则totalSize值为26)
							let totalSize = res.data.totalCount; 
							// 接口返回的是否有下一页 (true/false)
							if(res.data.pageCount == pageNum) {
								let hasNext = false;
							}else {
								let hasNext = true;
							}
							//设置列表数据
							if(mescroll.num == 1) this.craftlist = []; //如果是第一页需手动置空列表
							this.craftlist = this.craftlist.concat(curPageData); //追加新数据
							
							mescroll.endBySize(curPageData.length, totalSize); 
							
							
							// 如果数据较复杂,可等到渲染完成之后再隐藏下拉加载状态: 如
							this.$nextTick(()=>{
								mescroll.endSuccess(curPageData.length)
							})
						
						//curPageData.length必传的原因:
						// 1. 使配置的noMoreSize 和 empty生效
						// 2. 判断是否有下一页的首要依据: 
						//    当传的值小于page.size时(说明不满页了),则一定会认为无更多数据;
						//    比传入的totalPage, totalSize, hasNext具有更高的判断优先级;
						// 3. 当传的值等于page.size时,才会取totalPage, totalSize, hasNext判断是否有下一页
						// 传totalPage, totalSize, hasNext目的是避免方法四描述的小问题
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
			craftman_details(item) {
				uni.navigateTo({
					url:'../craftsman/craftmanDetails?id=' + item
				})
			}
		}
	}
</script>


<style scoped>
	page {
		background-color: #fff;
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
	 /* <!-- 本店手艺人模块	begin --> */
	.bg {
	 background-color: #fff!important;
	 width: 100%;
	 height: 100%;
	 /* margin-bottom: 30px; */

	}
	.craftman {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 50px;
	}
	
	.craft_icon {
		font-family: iconfont;
		font-size: 36px;
		color: rgba(56, 56, 56, 1);
		line-height: 50px;
		margin-left: 20px;
	}
	.whetherRecent {
		color: rgba(166, 166, 166, 1);
		font-size: 12px;
		margin-left: 7px;
	}
	.craft_icon_text {
		/* margin-left: 6px; */
		color: rgba(80, 80, 80, 1);
		font-size: 18px;
		/* display: block; */
		font-weight: bold;
		/* margin-bottom: 20px; */
		margin-left: 6px;
		line-height: 56px;
	}
	.craftman_line {
	    padding:11px 19px 22px 16px;
		position: relative;
	  }
	.craftman_left {
	      display:flex;
	      flex-direction: row;
	  }
	  .craftman_icon {
	      width: 90px;
	      height: 80px;
	      border-radius: 4px;
	    }
	    .craftman_icon image {
	     width: 90px;
	     height: 80px;
	     border-radius: 4px;
		  margin-right: 15px;
	    } 
		.craftman_left_explain {
			display: flex;
			flex-direction: column;
			margin-left: 20px;
		}
		.craftman_left_top {
				display: flex;
				flex-direction: row;
				margin-bottom: 8px;
		}
		.craftman_name {
				color: rgba(80, 80, 80, 1);
				font-size: 13px;
				text-align: left;
				font-weight: bold;
		}
		.craftman_label {
			/* width: 38px; */
			padding: 0 5px;
			height: 19px;
			color: rgba(255, 255, 255, 1);
			background-color: #FB4B5C;
			border-radius: 4px;
			font-size: 12px;
			line-height: 19px;
			text-align: center;
			margin-left: 10px;
			}
		.craftman_left_star {
			font-size: 15px;
			color: rgba(255, 141, 26, 1);
			display: flex;
			flex-direction: row;
			margin-bottom: 5px;
		}
		.craftman_left_star_icon {
			font-family: iconfont;
			font-size: 12px;
			margin: 0 2px;
		}
		.craftman_left_bottom {
			display: flex;
			flex-direction: row;
			margin-top: 5px;
		}
		.craftman_left_bottom_label {
			width: 66px;
			height: 25px;
			color: rgba(80, 80, 80, 1);
			border: 1px solid #e5e5e5;
			border-radius: 12px;
			font-size: 11px;
			line-height: 25px;
			margin-right: 7px;
			text-align: center;
		}
		.order_icon {
			position: absolute;
			width: 64px;
			height: 32px;
			bottom: 0rpx;
			right: 0px;
			color: rgba(255, 255, 255, 1);
			background-color: rgba(227, 60, 100, 1);
			box-shadow: 6upx 6upx 8upx rgba(199, 50, 134, 0.2);
			border-radius: 16px;
			font-size: 13px;
			text-align: center;
			line-height: 32px;
	}
	/*<!-- 本店手艺人模块  end --> */
</style>
