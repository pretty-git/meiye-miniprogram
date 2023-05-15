<template>
		<view class="">
			<view class="top">
				<view class="text">
					服务前
				</view>
				<view class="share font">
						&#xe633;
				</view>
				<view class="text">
					分享
				</view>
			</view>
			<scroll-view class="scroll-view_H" scroll-x="true">
				<view class="scroll-view-item_H" v-for="(item,index) in dataList" v-if="item.isBefore == 1" :key="index">
					<image :src="'http://my.cloud.xmstruggle.com/' + item.workPath" mode="aspectFill"></image>
				</view>
			</scroll-view>
			<view class="text after">
				服务后
			</view>
			<scroll-view class="scroll-view_H" scroll-x="true">
				<view class="scroll-view-item_H" v-for="(item,index) in dataList" v-if="item.isBefore == 2" :key="index">
					<image :src="'http://my.cloud.xmstruggle.com/' + item.workPath" mode="aspectFill"></image>
				</view>
			</scroll-view>
			
		</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList:[]
			}
		},
		onLoad(props) {
			uni.request({    //获取购物券
				method: 'POST',
				url: getApp().globalData.url + `/applet/order/profileDetailView`,
				data:{
					orderId:props.orderId
				},
				header: {
					"Content-Type": "application/x-www-form-urlencoded" //如果为空，加上头部接收     
				},
				success: (res) => {
					console.log(res.data)
					this.dataList = res.data
				},fail:(err) => {
					uni.showToast({
						title:'网络请求超时,请重试',
						icon:'none'
					})
				}
			})
		},
		methods:{
			
		}
	}
</script>

<style scoped>
	.top {
		height: 50px;
		display: flex;
		flex-direction: row;
		margin-top: 10px;
		padding: 0 20px;
		background-color: #fff;
	}
	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
	}
	.text {
		font-weight: bold;
		margin: auto 0;
		font-size: 15px;
		color: rgba(80, 80, 80, 1);
	}
	.share {
		font-size: 25px;
		width: 70%;
		text-align: right;
		margin: auto 0;
		color: rgba(212, 48, 48, 1);
		margin-right: 10px;
	}
	.scroll-view-item_H {
		display: inline-block;
		width: 40%;
		height: 300upx;
		margin: 0 10px;
	}
	.scroll-view-item_H  image{
		width: 100%;
		height: 100%;
	}
	.after {
		width: 100%;
		padding: 15px 20px 30px 20px;
		height: 50px;
		background-color: #fff;
	}
</style>
