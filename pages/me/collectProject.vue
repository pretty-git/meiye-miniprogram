<template>
	<view class="bg">
		<mescroll-uni :down="downOption" @down="downCallback" @up="upCallback" :fixedTop='fixedTop'>
			<view class="tis flex_column" v-if="noMoerData == true && list.length == 0">
				<view class="nomoreimage">
					<image :src="nomore" mode="aspectFill" class="nomore"></image>
				</view>
				<view class="" style="margin: auto;color: #a8a8a8;padding-top: 10px;">
					~暂无数据~
				</view>
			</view>
			<view class="list" v-for="(item, index) in list" :key="index" @click="projectdetails(item)">
			<view class="list_img"><image :src="'http://my.cloud.xmstruggle.com/'+item.projectImg" mode="aspectFill"></image></view>
			<view class="list_message">
				<view class="list_name">{{ item.serveName }}</view>
				<!-- <view class="list_intro">{{ item.serverParticulars }}</view> -->
				<view class="list_message_bottom">
					<view class="list_price">￥{{ item.specialOffer }}</view>
				</view>
			</view>
		</view>
	</mescroll-uni>
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
				list: [],
				nomore:'http://www.mescroll.com/img/mescroll-empty.png?v=1',
				noMoerData:false,
			}
		},
		methods:{
			/*下拉刷新的回调 */
			downCallback(mescroll){
				// 第1种: 请求具体接口
				console.log('上拉加载mescorll')
				let pageNum = mescroll.num; // 页码, 默认从1开始
				let pageSize = mescroll.size; // 页长, 默认每页10条
				uni.request({
					method:'GET',
					url: getApp().globalData.url + `/applet/project/selectProjectConcernList/${uni.getStorageSync('storeId')}/${uni.getStorageSync('user').customerId}?pageNum=${pageNum}&pageSize=${pageSize}`,
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
				// /${uni.getStorageSync('storeId')}/${uni.getStorageSync('user').customerId}&pageNum=${1}&pageSize=${10}
				uni.request({
					method:'GET',
					url: getApp().globalData.url + `/applet/project/selectProjectConcernList/${uni.getStorageSync('storeId')}/${uni.getStorageSync('user').customerId}?pageNum=${pageNum}&pageSize=${pageSize}`,	
					header: {
					    "Content-Type": "application/json" //如果为空，加上头部接收 
					},
					success: (res) => {
						console.log(res)
						// 接口返回的当前页数据列表 (数组)
							let curPageData = res.data.rows; 
							// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
							var totalPage ='' 
							if(res.data.total % 10 == 0) {
								 totalPage =res.data.total / 10 ; 
							}else {
								 totalPage =res.data.total / 10 + 1; 
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
							if(mescroll.num == 1) this.list = []; //如果是第一页需手动置空列表
							this.list = this.list.concat(curPageData); //追加新数据
							
							mescroll.endBySize(curPageData.length, totalSize); 
							// 如果数据较复杂,可等到渲染完成之后再隐藏下拉加载状态: 如
							this.$nextTick(()=>{
								mescroll.endSuccess(curPageData.length)
							})
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
			projectdetails(item) {
			        uni.navigateTo({
			            url:'../giftdetails/projectdetail?serveId='+ item.projectId  
				})			
			}
		}
	}
</script>

<style>
	.bg {
	 background-color: #fff!important;
	 width: 100%;
	 height: 100%;
	 margin-bottom: 30px;

	}
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
	.list {
		width: 100%;
		display: flex;
		flex-direction: row;
		margin: 22px 27px 0 18px;
	}
	.list_img {
		width: 35%;
		height: 90px;
		border-radius: 2px;
		margin-right: 16px;
	}
	.list_img image {
		width: 100%;
		height: 90px;
		border-radius: 2px;
	}
	.list_message {
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
		margin-bottom: 7px;
	}
	.list_intro {
		color: rgba(166, 166, 166, 1);
		font-size: 14px;
		text-align: left;
		margin-bottom: 13px;
		width: 90%;
		height: 30px;
	}
	.list_message_bottom {
		display: flex;
		flex-direction: row;
	}
	.list_time {
		color: #FB5D6B;
		font-size: 14px;
		text-align: left;
	}
	.list_price {
		margin-left: 45%;
		color: #FB5D6B;
		font-size: 16px;
		font-weight: bold;
	}
	/* 项目类别end */
</style>
