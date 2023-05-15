<template>
	<view>
		<view class="tis flex_column" v-if="noMoerData == true && receiptList.length == 0">
			<view class="nomoreimage">
				<image :src="nomore" mode="aspectFill" class="nomore"></image>
			</view>
			<view class="" style="margin: auto;color: #a8a8a8;padding-top: 10px;">
				~暂无数据~
			</view>
		</view>
		<view v-for="(item,index) in receiptList" :key="index" class="receiptList">
			<view class="top">
				<view class="icon font">
					&#xe646;
				</view>
				<view class="storeName" style="width: 50%;margin: auto 0;padding-left: 10px;">
					{{item.storeName}}
				</view>
				<view class="time" style="width: 40%;text-align: right;">
					{{item.createTime}}
				</view>
			</view>
			<view v-for="(itemchild,id) in item.backstageSaleOrders" :key="id" class="itemchild">
				<view class="image">
					<image :src="itemchild.goodsImg" mode="aspectFill"></image>
				</view>
				<view style="margin-left: 18px;color: rgba(80, 80, 80, 1);font-size: 13px;width: 55%;">
					<view class="goodsname">
						{{itemchild.goodsName}}
					</view>
					<view class="goodssize">
						{{itemchild.goodsSize}}
					</view>
				</view>
				<view style="font-size: 13px;color: #808080;padding-right: 15px;">
					<view class="goodsprice">
						￥{{itemchild.goodsSellPrice}}
					</view>
					<view class="goodsnumber font" style="text-align: right;">
						<text style="font-size: 10px;">&#xe62f;</text>{{itemchild.saleQuantity}}
					</view>
				</view>
			</view>
			<view class="bottom">
				<view class="bottom_all">
					共计{{item.backstageSaleOrders.length}}件商品 合计：￥{{item.ordAchievement}}
				</view>
			</view>
		</view>
	</view>
	
</template>
<script>
	export default {
		data() {
			return {
				receiptList:[],
				units: [ '瓶','袋','盒' ],
				noMoerData:false,
				nomore:'http://www.mescroll.com/img/mescroll-empty.png?v=1'
			}
		},
		onLoad() {
			if(uni.getStorageSync('user').customerId == undefined ) {
					// 为空不请求
					uni.showToast({
						title:'暂无授权信息',
						icon:'none'
					})
				this.noMoerData = true
			}else {
				uni.request({
					method: 'POST',
					url: getApp().globalData.url + `/applet/order/shoppingReceipt`,
					data:{
						storeId: uni.getStorageSync('storeId'),
						customerId:uni.getStorageSync('user').customerId
					},
					header: {
						"Content-Type": "application/x-www-form-urlencoded" //如果为空，加上头部接收
					},
					success: (res) => {
						console.log(res,'ssssssssss')
						if(res.data.length == 0) {
							this.noMoerData = true
							this.receiptList = []
						}else {
							this.noMoerData = false
								for(var i = 0; i < res.data.length; i++) {
								for(var j = 0; j < res.data[i].backstageSaleOrders.length; j++) {
									res.data[i].backstageSaleOrders[j].goodsImg = 'http://my.cloud.xmstruggle.com/' + res.data[i].backstageSaleOrders[j].goodsImg
									// res.data[i].backstageSaleOrders[j].goodsUnit  = this.units[Number(res.data[i].backstageSaleOrders[j].goodsUnit )+1]
									res.data[i].backstageSaleOrders[j].goodsSize  = res.data[i].backstageSaleOrders[j].goodsSize + 
																					res.data[i].backstageSaleOrders[j].goodsUnit
								}
							}
							this.receiptList = res.data
						}
						
						
						
					},fail:(err) => {
							uni.showToast({
								title:'网络请求超时,请重试',
								icon:'none'
							})
						}
				})
			}
		},
		methods:{
			
		}
	}
</script>
 

<style scoped>
	page {
		background-color: #F1F1F1;
	}
	.receiptList {
		width: 90%;
		margin: 0px auto;
		background-color: #fff;
		padding-left: 10px;
		border-radius: 5px;
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
	.top {
		height: 60px;
		display: flex;
		flex-direction: row;
	}
	.icon {
		margin: auto 0;
		color: #E94A59;
		font-size: 28px;
		margin-right: 5px;
	}
	.name {
		margin: auto 0;
		color: rgba(80, 80, 80, 1);
		font-size: 14px;
		width: 55%;
		font-weight: bold;
	}
	.time {
		margin: auto 0;
		color: rgba(80, 80, 80, 1);
		font-size: 13px;
	}
	.itemchild {
		display: flex;
		flex-direction: row;
		margin: 10px 0;
		width: 100%;
	}
	.image {
		width: 75px;
		height: 64px;
	}
	.image image {
		width: 75px;
		height: 64px;
	}
	.goodssize {
		margin-top: 20px;
		color: #888888;
	}
	.bottom {
		width: 100%;
		height: 40px;
		lighting-color: 40px;
		text-align: right;
		padding-right: 10px;
	}
</style>
