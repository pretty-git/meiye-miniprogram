<template>
	<view>
		<view class="topimage">
			<image :src="list.goodsImg" mode="aspectFill"></image>
		</view>
		<view class="" style="background-color: #fff;">
			<view class="price">
				￥{{list.goodsSellPrice}}
			</view>
			<view class="name">
				{{list.goodsName}}
			</view>
			<view class="size">
				规格：{{list.goodsSize}}{{list.goodsUnit}}
			</view>
			<mpopup ref="mpopup" :isdistance="true"></mpopup>
			<!-- <view class="storename size">
			门店：{{}}
		</view> -->
			<view class="more">
				详细介绍
			</view>
			<view class="text" v-html="list.goodsDetails">
			</view>
			<view class="" style="width: 100%;background-color: #fff;height: 60px;">

			</view>
			<view class="bottom_btn">
				<view class="co" @click="scan">
					<view class="font icon">
						&#xe63c;
					</view>

					<view class="">
						继续扫商品
					</view>
				</view>
				<view class="co" style="position: relative;" @click="shopCart">
					<view class="font icon">
						&#xe60a;
					</view>
					<view class="number_btn" v-if="number!=0">
						{{number}} <!-- 商品数量 -->
					</view>
					<view class="">
						购物袋
					</view>
				</view>
				<view style="display: flex;flex-direction: row; width: 190px; position: relative;">
					<view class="combtn left" @click="addComment(list.goodsId)">
						放进购物袋
					</view>
					<view class="combtn right" @click="buyIt">
						立即购买
					</view>
				</view>

			</view>
		</view>

	</view>

</template>
<script>
	export default {
		data() {
			return {
				number: 0,
				// image:'https://7765-we-63574e-1258830969.tcb.qcloud.la/mingzi/gift1.jpg?sign=8278679fec4c039afd9db9a6900a84bf&t=1565945992',
				list: {},
				units: ['瓶', '袋', '盒'],
			}
		},
		onLoad(props) {
			console.log(props)
			uni.showLoading({
				title: '加载中'
			});
			uni.request({
				method: 'GET',
				// url: getApp().globalData.url + `/applet/store/list?pageNum=${this.curPage}&pageSize=${this.perPage}`,
				// url: getApp().globalData.url + `/applet/product/findBrandGoodsList?pageNum=${this.pageNum}&pageSize=${this.pageSize}`,
				url: getApp().globalData.url + `/applet/product/findBrandGoodsId/${props.id}`,
				header: {
					"Content-Type": "application/json" //如果为空，加上头部接收
				},
				success: (res) => {
					if (res.statusCode == 200) {
						uni.hideLoading();
						this.list = res.data.result
						this.list.goodsImg = 'http://my.cloud.xmstruggle.com/' + res.data.result.goodsImg
						this.list.goodsUnit = this.units[Number(this.list.goodsUnit) + 1]
						uni.hideLoading()
					} else {
						this.error()
						uni.hideLoading()
					}
					console.log(res, 'ssssssssss')

				},
				fail: (err) => {
					this.error()
					uni.hideLoading()
				}
			})
		},
		onShow() {
			this.number = uni.getStorageSync('shoppingcart').length;
		},
		methods: {
			shopCart() {
				uni.navigateTo({
					url: "../me/shoppingBag"
				})
			},
			addComment(id) {
				console.log(id)
				uni.showToast({
					title: '添加成功',
					icon: 'success'
				})
				// id:1,img:'',name:'',spec:'500ml',price:127.5,number:1},
				var shoppinglist = uni.getStorageSync('shoppingcart')
				if (shoppinglist.length > 0) {
					if (shoppinglist.length > 20) {
						uni.showToast({
							title: '购物车满啦',
							icon: 'none'
						})
					} else {
						var book = 0
						for (var i = 0; i < shoppinglist.length; i++) {
							if (shoppinglist[i].goodsId == this.list.goodsId) {
								console.log('1111')
								shoppinglist[i].number = shoppinglist[i].number + 1
								book = 1
								this.number = shoppinglist.length
								uni.setStorageSync('shoppingcart', shoppinglist)
								return;
							}
						}
						if (book == 0) {
							var unit = this.list.goodsSize + this.list.goodsUnit
							shoppinglist.push({
								goodsId: this.list.goodsId,
								img: this.list.goodsImg,
								name: this.list.goodsName,
								spec: unit,
								price: this.list.goodsSellPrice,
								number: 1,
								originprice: this.list.goodsSellPrice,
								shoppingTrolleyId: '',
								selected: false
							})
							this.number = shoppinglist.length
							uni.setStorageSync('shoppingcart', shoppinglist)
						}
					}
				} else {
					shoppinglist = []
					var unit = this.list.goodsSize + this.list.goodsUnit
					shoppinglist.push({
						goodsId: this.list.goodsId,
						img: this.list.goodsImg,
						name: this.list.goodsName,
						spec: unit,
						price: this.list.goodsSellPrice,
						number: 1,
						originprice: this.list.goodsSellPrice,
						shoppingTrolleyId: '',
						selected: false
					})
					this.number = shoppinglist.length
					uni.setStorageSync('shoppingcart', shoppinglist)
				}
				var list = uni.getStorageSync('shoppingcart');
				var commlist = [];
				for (var i = 0; i < list.length; i++) {
					commlist.push({
						goodsId: list[i].goodsId,
						goodsNum: list[i].number,
						customerId: uni.getStorageSync('user').customerId,
						storeId: uni.getStorageSync('storeId')
					});
				}
				if (commlist.length != 0) {
					uni.request({
						method: 'POST',
						url: getApp().globalData.url + '/applet/shoppingtrolley/insertShoppingTrolleyBatch',
						data: commlist,
						header: {
							'Content-Type': 'application/json' //如果为空，加上头部接收
						},
						success: res => {},
						fail: err => {
							uni.showToast({
								title: '网络请求超时,请重试',
								icon: 'none'
							});
						}
					});
				}
				console.log(shoppinglist)

			}, //添加商品后改变购物车数组，传给后台
			buyIt() {

			}, //立即购买是直接付款生成购物小票？
			scan() {
				uni.scanCode({
					success: function(res) {
						uni.navigateTo({
							url: "../myOrder/commodity?id=" + res.result
						})
					}
				});
			},
		}
	}
</script>


<style scoped>
	page {
		background-color: #fff;
	}

	.co {
		display: flex;
		flex-direction: column;
		width: 23%;
		text-align: center;
	}

	.topimage {
		width: 100%;
		height: 225px;

	}

	.topimage image {
		width: 100%;
		height: 225px;
	}

	.price {
		color: rgba(212, 48, 48, 1);
		font-size: 18px;
		font-weight: bold;
		padding-left: 14px;
		margin: 10px 0;
	}

	.text {
		width: 90%;
		white-space: normal;
		margin: 0 auto;
		line-height: 48upx;
		letter-spacing: 2upx;
		font-size: 28upx;
	}

	.name {
		color: rgba(80, 80, 80, 1);
		font-size: 16px;
		font-weight: bold;
		padding-left: 14px;
		margin: 10px 0;
	}

	.size {
		color: rgba(80, 80, 80, 1);
		font-size: 14px;
		padding-left: 14px;
		margin: 10px 0;
	}

	.more {
		width: 100%;
		text-align: left;
		color: #000;
		margin: 20px 0;
		margin-left: 13px;
		font-weight: bold;
		font-size: 16px;

	}

	.image {
		width: 100%;
		height: 150px;
	}

	.image image {
		width: 100%;
		height: 150px;
	}

	.image1 {
		width: 90%;
		margin: 0 auto;
		height: 150px;
	}

	.image1 image {
		width: 100%;
		height: 150px;
	}

	.introtext {
		margin: 14px 21px;
		color: rgba(80, 80, 80, 1);
		letter-spacing: 1px;
	}

	.bottom_btn {
		position: fixed;
		bottom: 0px;
		height: 57px;
		width: 100%;
		display: flex;
		flex-direction: row;
		background-color: #F5F5F5;
	}

	.icon {
		font-size: 28px;
		color: rgba(128, 128, 128, 1);
	}

	.number_btn {
		position: absolute;
		top: 0px;
		left: 52%;
		z-index: 99999;
		width: 19px;
		height: 19px;
		color: rgba(255, 255, 255, 1);
		background-color: rgba(212, 48, 48, 1);
		border-radius: 10px;
		font-size: 14px;
		line-height: 19pxs;
		text-align: center;
	}

	.combtn {
		width: 50%;
		height: 38px;
		color: rgba(255, 255, 255, 1);
		background-color: #FB4B5C;
		font-size: 14px;
		line-height: 38px;
		text-align: center;
	}

	.left {
		/* position: absolute;
		left: 10px; */
		border-top-left-radius: 19px;
		border-bottom-left-radius: 19px;
		border-right: 1px solid #fff;
		margin: auto 0;
	}

	.right {
		/* position: absolute;
		right: 10px; */
		border-top-right-radius: 19px;
		border-bottom-right-radius: 19px;
		margin: auto 0;
	}
</style>