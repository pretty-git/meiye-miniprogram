<template>
	<view class="">
		<mescroll-uni :down="downOption" @down="downCallback" @up="upCallback" :fixedTop='fixedTop'>
			<view class="cu-bar bg-white search hei">
				<view class="search-form radius">
					<text class="cuIcon-search"></text>
					<input @focus="InputFocus" @blur="InputBlur" :adjust-position="false" type="text"
						placeholder="搜索商品名称" confirm-type="search"></input>
				</view>
			</view>
			<view class="" style="position: relative;">
				<scroll-view scroll-x :scroll-left="navScrollLeft" style="width: 100%;height: 100%;">
					<view class="scroller">
						<view class="scroller-wrapper">
							<view class="scroller-item" v-for="(item, index) in title" :key="index">{{ item }}</view>
						</view>
					</view>
					<view class="commentlist">
						<view class="comment" v-for="(item,index) in comList" :key="index">
							<view class="w nowrap">
								{{item.brandName}}
							</view>
							<view class="w nowrap">
								{{item.className}}
							</view>
							<view class="w nowrap">
								{{item.goodsName}}
							</view>
							<view class="w nowrap" v-if="item.goodsSize == null">
								暂无
							</view>
							<view class="w nowrap" v-else>
								{{item.goodsSize}}
							</view>
							<view class="w nowrap">
								￥{{item.goodsSellPrice}}
							</view>
							<view class="w nowrap" v-if="item.goodsInventory > 0">
								{{item.goodsInventory}}
							</view>
							<view class="w nowrap" v-else>
								0
							</view>
							<view class="add  cu-btn bg-gradual shadow-blur round" @click="add(item)">
								加入订单
							</view>
						</view>
					</view>
				</scroll-view>
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
				navScrollLeft: 0, // 导航滚动区的滚动距离
				navItemWidth: 100, // navitem 宽
				title: ['品牌', '类别', '名称', '规格', '单价', '库存量', '操作'],
				units: ['瓶', '袋', '盒'],
				comList: [],
				pageNum: '',
				pageSize: '',
				commentlist: [],
				downOption: {
					auto: false //是否在初始化后,自动执行下拉回调callback; 默认true
				},
				fixedTop: 300,
				type: "",
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
		onLoad() {
			this.commentlist = getApp().globalData.commentlist
		},
		methods: {

			/*下拉刷新的回调 */
			downCallback(mescroll) {
				console.log('上拉加载mescorll')
				let pageNum = mescroll.num; // 页码, 默认从1开始
				let pageSize = mescroll.size; // 页长, 默认每页10条
				uni.request({
					method: 'POST',
					url: getApp().globalData.url +
						`/applet/product/findBrandGoodsList?pageNum=${pageNum}&pageSize=${pageSize}`,
					data: {
						organizationId: uni.getStorageSync('mechanismId'),
						goodsName: '',
						storeId: uni.getStorageSync('storeId')
					},
					header: {
						"Content-Type": "application/json" //如果为空，加上头部接收 
					},
					success: () => {
						mescroll.endSuccess()
					},
					fail: () => {
						// 失败隐藏下拉加载状态
						uni.showToast({
							title: '网络请求超时,请重试',
							icon: 'none'
						})
						mescroll.endErr()
					}
				})
				mescroll.resetUpScroll();
				mescroll.endSuccess()
			},
			upCallback(mescroll) {
				let pageNum = mescroll.num; // 页码, 默认从1开始
				let pageSize = mescroll.size; // 页长, 默认每页10条
				uni.request({
					method: 'POST',
					method: 'POST',
					url: getApp().globalData.url +
						`/applet/product/findBrandGoodsList?pageNum=${pageNum}&pageSize=${pageSize}`,
					data: {
						organizationId: uni.getStorageSync('mechanismId'),
						goodsName: '',
						storeId: uni.getStorageSync('storeId')
					},
					header: {
						"Content-Type": "application/json" //如果为空，加上头部接收 
					},
					success: (res) => {
						console.log(res, '111111111')
						let curPageData = res.data.rows
						for (var i = 0; i < res.data.rows.length; i++) {
							curPageData[i].goodsSize = curPageData[i].goodsSize + this.units[Number(
								curPageData[i].goodsUnit) + 1]
						}
						let totalPage
						if (res.data.total % 10 == 0) {
							totalPage = res.data.total / 10;
						} else {
							totalPage = res.data.total / 10 + 1;
						}
						let totalSize = res.data.total;
						if (totalPage == pageNum) {
							let hasNext = false;
						} else {
							let hasNext = true;
						}
						if (mescroll.num == 1) this.comList = [];
						this.comList = this.comList.concat(curPageData);
						mescroll.endBySize(curPageData.length, totalSize);
						this.$nextTick(() => {
							mescroll.endSuccess(curPageData.length)
						})
						console.log(this.comList)
					},
					fail: () => {
						mescroll.endErr()
						uni.showToast({
							title: '网络加载失败',
							icon: 'none'
						})
					}
				})
			},
			add(item) {
				if (item.goodsInventory <= 0) {

					uni.showToast({
						title: '库存不足',
						icon: 'none'
					});

				} else {
					this.commentlist = uni.getStorageSync('sellproduct');
					if (this.booktype == 1) { //首页进去
						uni.navigateTo({
							url: '../admin/waitpay/waitpay?type=' + 1
						})
					} else {
						if (this.commentlist == '') {
							var list = []
						} else {
							var list = this.commentlist
						}

						// var list=new Array();
						var book = 0
						console.log(list, '1111111111111111')
						for (var i = 0; i < list.length; i++) {
							if (list[i].goodsId == item.goodsId) {
								list[i].number = list[i].number + 1
								list[i].price = list[i].price + list[i].originprice
								book = 1
								uni.showToast({
									title: '添加成功',
									icon: 'success',
									duration: 2000
								});
								uni.setStorageSync('sellproduct', list);
								console.log(list)
								return;
							}
						}
						if (book == 0) {
							list.push({
								name: item.goodsName,
								size: item.goodsSize,
								price: item.goodsSellPrice,
								number: 1,
								originprice: item.goodsSellPrice,
								goodsId: item.goodsId
							});

							console.log(list)
							uni.showToast({
								title: '添加成功',
								icon: 'success',
								duration: 2000
							});
							uni.setStorageSync('sellproduct', list);
						}
					}
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.hei {
		height: 75px;
	}

	.title {
		display: flex;
		flex-direction: row;
		width: 100%;
		background-color: #FFFFFF;
		font-size: 16px;
		padding: 15px 0;
		/* font-weight: 600; */
	}

	.title_name {
		/* width: 17%; */
		margin: 0 20px;
		text-align: center;
	}

	.comment {
		display: flex;
		flex-direction: row;
		background-color: #fff;
		margin: 5px 0;
		height: 60px;
		line-height: 60px;
		width: 700px;
	}

	.w {
		/* width: 17%; */
		width: 100px;
		text-align: center;
	}

	.add {
		font-size: 10px;
		margin: auto;
		width: 60px;
		padding: 0;
	}

	.bg-gradual {
		background-color: #FB4B5C;
		color: #fff;
	}

	.nav-area {
		width: 80%;
		height: 60rpx;

	}

	.scroller {
		height: 100%;
		width: 700px;
	}

	.scroller-wrapper {
		height: 60rpx;
		display: flex;
		flex-direction: row;
		position: relative;
	}

	.scroller-item {
		height: 100%;
		width: 100px;
		text-align: center;
	}
</style>