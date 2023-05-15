<template>
	<view class="bg">
		<mescroll-uni :down="downOption" @down="downCallback" @up="upCallback" :fixedTop='fixedTop'>
			<view class="vip_car">
				<view v-for="(car,index) in dataList" :key="index" class="car"
					@click="VIPcar_more(car.cardId,car.isOwner)">
					<view class="vip_car_bc">
						<text class="car_name">{{carclass}}</text>
						<text class="car_number">
							<text v-if="car.isOwner==0 || car.isOwner == undefined ">￥{{car.sellingPrice}}</text>
							<text v-if="car.isOwner==1">已拥有</text>
						</text>
						<view class="vipbacimage" v-if="!car.cardImg">
							<image src="../../static/gift/m.png" mode="aspectFill"></image>
						</view>
						<view class="vipbacimage" v-else>
							<image :src="car.cardImg" mode="aspectFill"></image>
						</view>
					</view>
					<view class="carname">
						{{car.cardName}}
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
				fixedTop: 100,
				type: "",
				dataList: [],
				total: 0,
				carclass: '',
				storeId: '',
				customerId: '',
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
			}
		},
		onLoad(props) {
			// this.type = 2
			this.storeId = uni.getStorageSync('storeId')
			// getApp().globalData.customerId
			this.customerId = uni.getStorageSync('user').customerId
			// this.customerId=51
			this.type = Number(props.index) //判断会员卡类型
			console.log(this.type, '11111111111111')
			// console.log(props)
			if (this.type == 1) {
				this.carclass = '储值卡'
			} else if (this.type == 2) {
				this.carclass = '年费卡'
			} else if (this.type == 3) {
				this.carclass = '项目卡'
			}
			this.dataList = [{
				cardId: 1,
				isOwner: true,
				cardImg: '',
				cardName: '超级优惠券'
			}]


		},
		methods: {
			// 加载更多模块
			VIPcar_more(id, isOwner) {
				uni.navigateTo({
					url: "../vipCarDetails/vipCarDetails?cardId=" + id + '&isOwner=' + isOwner
				})
			},
			/*下拉刷新的回调 */
			downCallback(mescroll) {
				mescroll.resetUpScroll();
				// 这里下拉接口刷新

			},
			/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
			upCallback(mescroll) {
				// 	let pageNum = mescroll.num; // 页码, 默认从1开始
				// 	let pageSize = mescroll.size; // 页长, 默认每页10条
				// 	uni.request({
				// 		method:'POST',
				// 		url: getApp().globalData.url + '/applet/card/findCardByStoreId',
				// 		data:{
				// 				storeId:this.storeId,
				// 				customerId:this.customerId,
				// 				 typeId:this.type,
				// 				 pageNumber:pageNum,
				// 				 pageCount:pageSize
				// 			},	
				// 		header: {
				// 		    "Content-Type": "application/json" //如果为空，加上头部接收 
				// 		},
				// 		success: (res) => {
				// 			console.log(res,'年费卡')
				// 			if(res.data.code == "查询无数据") {
				// 				uni.showToast({
				// 					title:'查询无数据',
				// 					icon:'none'
				// 				})
				// 				mescroll.endErr()
				// 				return 0;
				// 			}
				// 			// 接口返回的当前页数据列表 (数组)
				// 				let curPageData = res.data.rows; 
				// 				for(var i= 0 ; i < res.data.rows.length; i++ ) {
				// 					res.data.rows[i].cardImg = 'http://my.cloud.xmstruggle.com/' + res.data.rows[i].cardImg 
				// 				}
				// 				let totalPage = 0
				// 				// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
				// 				if(res.data.total % 10 == 0) {
				// 					 totalPage =res.data.total / 10 ; 
				// 				}else {
				// 					 totalPage =res.data.total / 10 + 1; 
				// 				} 
				// 				// 接口返回的总数据量(比如列表有26个数据,每页10条,共3页; 则totalSize值为26)
				// 				let totalSize = res.data.total; 
				// 				// 接口返回的是否有下一页 (true/false)
				// 				if(totalPage == pageNum) {
				// 					let hasNext = false;
				// 				}else {
				// 					let hasNext = true;
				// 				}
				// 				//设置列表数据
				// 				if(mescroll.num == 1) this.dataList = []; //如果是第一页需手动置空列表
				// 				this.dataList = this.dataList.concat(curPageData); //追加新数据

				// 				mescroll.endBySize(curPageData.length, totalSize); 


				// 				// 如果数据较复杂,可等到渲染完成之后再隐藏下拉加载状态: 如
				// 				this.$nextTick(()=>{
				// 					mescroll.endSuccess(curPageData.length)
				// 				})

				// 			//curPageData.length必传的原因:
				// 			// 1. 使配置的noMoreSize 和 empty生效
				// 			// 2. 判断是否有下一页的首要依据: 
				// 			//    当传的值小于page.size时(说明不满页了),则一定会认为无更多数据;
				// 			//    比传入的totalPage, totalSize, hasNext具有更高的判断优先级;
				// 			// 3. 当传的值等于page.size时,才会取totalPage, totalSize, hasNext判断是否有下一页
				// 			// 传totalPage, totalSize, hasNext目的是避免方法四描述的小问题
				// 		},
				// 		fail: () => {
				// 			// 失败隐藏下拉加载状态
				// 			mescroll.endErr()
				// 			uni.showToast({
				// 				title:'网络加载失败',
				// 				icon:'none'
				// 			})
				// 		}
				// 	})
				mescroll.endErr()
			},

		}
	}
</script>

<style scoped>
	.bg {
		background-color: #fff;
		width: 100%;
	}


	.vip_car {
		width: 95%;
		/* height: 100%; */
		overflow: hidden;
		overflow-x: scroll;
		display: flex;
		flex-wrap: wrap;
		margin: 0 auto;
	}

	.car {
		width: 48%;
		margin: 1%;
		/* margin: 0 10px 0 10px; */
	}

	.carname {
		margin: 10px 0;
		text-align: center;
		font-size: 16px;
		color: #847E80;
	}

	.vip_car_bc {
		width: 100%;
		height: 90px;
		color: #fff;
		background-color: #F074AD;
		border-radius: 5px;
		/* flex-wrap: wrap; */
		/* font-size: 11px; */
		/* margin: 5px 9px 5px 2px; */
		position: relative;
	}

	.car_name {
		position: absolute;
		left: 10%;
		top: 20%;
		font-size: 18px;
		/* font-family: 'Times New Roman'; */
	}

	.car_number {
		position: absolute;
		left: 10%;
		color: #FFCD61;
		bottom: 17%;
		font-weight: bold;
		font-size: 18px;
	}

	.vipbacimage {
		width: 52px;
		height: 60px;
		position: absolute;
		right: 5%;
		top: 10%;

	}

	.vipbacimage image {
		width: 52px;
		height: 60px;
		position: absolute;
		right: 5%;
		top: 10%;
	}
</style>