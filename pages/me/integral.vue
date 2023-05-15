<template>
	<view class="main_bac">
		<view class="top">
				<view class="integral"><text style="font-size: 30px;padding-right: 5px;">{{integral}} </text>积分</view>
		</view>
		<view class=" flex_row" style="margin: 20px 0;">
			<text style="color: #5396C9; font-size: 30px;margin: 0 15px;" class="font">&#xe650;</text>
			<text style="font-size: 16px; font-weight: bold; margin: auto 0;">积分明细</text>
		</view>
		<view class="list">
			<view class="integrallist" v-for="(item,index) in list" :key="index">
				<view class="title">
					{{item.serveName}}
				</view>
				<view class="time">
					{{item.creationTime}}
				</view>
				<view class="number">  <!-- 多少积分 -->
					+{{item.integral}}
				</view>
			</view>
		</view>
		<view style="width: 100%;height: 50px;line-height: 50px;text-align: center;font-size: 14px;color: #e8e8e8;" v-if="iffinish">
			---- 加载完毕 ----
		</view>
	</view>
	
</template>
<script>
	export default {
		data() {
			return {
				integral:0,  //总积分
				list:[],
				pageNumber:1,
				iffinish:false
			}
		},
		onLoad() {
			this.getList()
		},
		onReachBottom() {
			if(!this.iffinish)
				this.getList()
		},
		methods:{
			getList() {
				uni.request({
					url: getApp().globalData.url +`/applet/resistance/selectClientIntegralById/${uni.getStorageSync('user').customerId}?pageNumber=` + this.pageNumber + '&pageCount=' + 10,
					method: 'post',
					header: {
						"Content-Type": "application/json" //如果为空，加上头部接收
					},	
					success: (res) => {
						this.list =this.list.concat( res.data.data.clientIntegralVos.pageData)
						this.integral = res.data.data.sumIntrgral
						if(res.data.data.clientIntegralVos.totalCount == this.list.length) {
							this.iffinish = true
							this.pageNumber = 1
						}else {
							this.iffinish = false
							this.pageNumber++;
						}
					}
				})
			}
		}
	}
</script>


<style scoped>
	.main_bac {
		background-color: #fff!important;
		position: absolute;
		top: 0;
		
		width: 100%;
		
	}
	.top {
			width: 100%;
			height: 174px;
			background-color: #CA89FF;
			position: relative;
		}
		.integral {
			margin: 0 auto;
			width: 100%;
			line-height: 174px;
			text-align: center;
			/* display: flex; */
			color: rgba(255, 255, 255, 1);
			font-size: 20px;
		/* 	padding-left: 10px;
			padding-top: 45px; */
		}
		.btn {
			width: 30%;
			height: 40px;
			margin: 0 auto;
			margin-top: 15px;
			color: rgba(255, 255, 255, 1);
			background-color: rgba(255, 195, 0, 1);
			box-shadow: rgba(204, 204, 204, 1) solid 1px;
			border-radius: 21px;
			font-size: 14px;
			line-height: 40px;
			text-align: center;
		}
		.integrallist {
			width: 100%;
			height: 60px;
			position: relative;
			padding-left: 17px;
			/* line-height: 50px; */
			border-bottom: 1px solid rgba(229, 229, 229, 1);
		}
		.title {
			color: rgba(80, 80, 80, 1);
			font-size: 16px;
			margin-top: 13px;
		}
		.time {
			color: rgba(166, 166, 166, 1);
			font-size: 14px;
			margin-top: 8px;
		}
		.number {
			position: absolute;
			top: 23%;
			right: 9%;
			color: rgba(255, 130, 160, 1);
			font-size: 18px;
			font-weight: bold;
		}
</style>
