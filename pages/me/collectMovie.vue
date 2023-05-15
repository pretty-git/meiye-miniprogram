<template>
	<view style="width: 100%;display: flex;flex-wrap: wrap;" class="bg">
		<mescroll-uni :down="downOption" @down="downCallback" @up="upCallback" :fixedTop='fixedTop'>
		<view style="width: 100%;display: flex;flex-wrap: wrap;" >
			<view v-for="(item,index) in movielist" :key="index" class="list" >
			<!-- 	<view class="Recent" v-if="item.whetherRecent">
					最近关注
				</view> -->
				<view class="" v-if="item.category == 0" @click="movieDetails(item.videoId)">
					<view class="image">
						<image :src="item.videoImg" mode="aspectFill"></image>
					</view>
					<view class="title nowrap">
							{{item.videoName}}
					</view>
					<view class="classify">
						{{item.claName}}
					</view>
				</view>
				<view class="" v-if="item.category == 1" @click="textdetails(item.videoId)">
					<view class="image">
						<image :src="item.videoImg" mode="aspectFill"></image>
					</view>
					<view class="title nowrap">
							{{item.videoName}}
					</view>
					<view class="classify">
							{{item.claName}}
					</view>
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
				downOption: {
					auto: false //是否在初始化后,自动执行下拉回调callback; 默认true
				},
				fixedTop:300,
				movielist:[]
			}
		},
		onLoad() {
			if(uni.getStorageSync('user').customerId == undefined) {
				uni.showToast({
					title:'请先授权登录',
					icon:'none'
				})
			}else {
				// 	uni.request({
				// 	method: 'POST',
				// 	url: getApp().globalData.url + '/applet/video/findRecordByCusId',
				// 	data: {
				// 		customerId: uni.getStorageSync('user').customerId
				// 	},
				// 	header: {
				// 		"Content-Type": "application/json" //如果为空，加上头部接收     
				// 	},
				// 	success: (res) => {
				// 		this.movielist = res.data
				// 		for(var i = 0;i < res.data.length;i++) {
				// 				this.movielist[i].videoImg = 'http://my.cloud.xmstruggle.com/' +  this.movielist[i].videoImg
							
				// 		}
				// 		console.log(this.movielist,'1111111111')
				// 	}
				// })
			}
		},
		methods:{
			movieDetails(id) {
						uni.navigateTo({
						url:"../learn/movieDetails?id=" + id
					})
			},
			textdetails(id) {
						uni.navigateTo({
						url:"../learn/textdetails?id=" + id
					})
			},
			downCallback(mescroll){
				// 第1种: 请求具体接口
				// uni.showToast({
				// 	title:'刷新成功',
				// 	icon:'success'
				// })
				let pageNum = mescroll.num; // 页码, 默认从1开始
				let pageSize = mescroll.size; // 页长, 默认每页10条
				uni.request({
					method:'POST',
					url: getApp().globalData.url + `/applet/video/findRecordByCusId?pageNum=${pageNum}&pageSize=${pageSize}`,
					data:{
							 customerId: uni.getStorageSync('user').customerId
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
				console.log(mescroll,'mescorll')
				let pageNum = mescroll.num; // 页码, 默认从1开始
				let pageSize = mescroll.size; // 页长, 默认每页10条
				uni.request({
					method:'POST',
					url: getApp().globalData.url + `/applet/video/findRecordByCusId?pageNum=${pageNum}&pageSize=${pageSize}`,
					data:{
							 customerId: uni.getStorageSync('user').customerId
						},	
					header: {
					    "Content-Type": "application/json" //如果为空，加上头部接收 
					},
					success: (res) => {
						// 接口返回的当前页数据列表 (数组)
							console.log(res.data,'下拉刷新','')
							let curPageData = res.data.rows; 
							// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
							if(res.data.total % 10 == 0) {
								let totalPage =res.data.total / 10 ; 
							}else {
								let totalPage =res.data.total / 10 + 1; 
							} 
							// 接口返回的总数据量(比如列表有26个数据,每页10条,共3页; 则totalSize值为26)
							let totalSize = res.data.total; 
							// 接口返回的是否有下一页 (true/false)
							if(res.data.pageCount == pageNum) {
								let hasNext = false;
							}else {
								let hasNext = true;
							}
							//设置列表数据
							if(mescroll.num == 1) this.movielist = []; //如果是第一页需手动置空列表
							this.movielist = this.movielist.concat(curPageData); //追加新数据
							for(var i = 0;i < this.movielist.length;i++) {
									this.movielist[i].videoImg = 'http://my.cloud.xmstruggle.com/' +  this.movielist[i].videoImg
							}
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
							uni.showToast({
								title:'网络请求超时,请重试',
								icon:'none'
							})
						mescroll.endErr()
					}
				})
			},
		}
	}
</script>


<style scoped>
	page {
		background-color: #fff;
	}
	.bg {
	 background-color: #fff!important;
	 width: 100%;
	 padding-top: 10px;
	 height: 100%;
	padding-bottom: 30px;

	}
	.list {
	width: 44%;
	/* margin: 15px 15px 0 15px; */
	position: relative;
	margin: 10px 3%;

	}
	.Recent {
		z-index: 1;
		width: 75px;
		height: 30px;
		color: rgba(255, 255, 255, 1);
		background-color: #FB4B5C;
		font-size: 13px;
		line-height: 30px;
		text-align: center;
		position: absolute;
		top:0px;
		left:0px;
	}
	.image {
		width: 100%;
		height: 170px;

	}
	.image image {
	width: 100%;
	height: 170px;

	}
	.title {
		color: rgba(0, 0, 0, 1);
		font-size: 16px;
		margin: 4px 0;
		font-weight: bold;
	}
	.classify {
		color: #FB4B5C;
		font-size: 14px;
		margin: 5px 0;
	}
</style>
