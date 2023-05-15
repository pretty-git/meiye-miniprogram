<template>
	<view class="main_bac" :style="{height:winHeight+'px'}">
		<view class="top">
			<view class="integral"><text>{{integral}}</text></view>
			<view class="btn">
				<text>可用余额（元</text>）
			</view>
		</view>
		<view class="midlle">
			<view class="yesday">  <!-- 昨日收益 -->
				<view class="price">
					{{yesprice}}
				</view>
				<view class="title">
					昨日收益（元）
				</view>
			</view>
			<view class="history">
				<view class="price">
					{{hisprice}}
				</view>
				<view class="title">
					历史收益（元）
				</view>
			</view>
		</view>
		<!-- <view class="balance">
			<view class="icon font">
					&#xe6a9;
			</view>
			<view class="text">
				银行卡
			</view>
			<view class="icon1 font">
				&#xe604;
			</view>
		</view> -->
		<view class="line">
		</view>
		<!-- 明细模块 -->
		<view class="bottom1">
			<view class="bottom_title" >
				<view class="font" style="font-size: 42px;color: #539ED6;margin-left: 8%" >
					&#xe631;
				</view>
				<view style="font-size:19px ;margin-left: 5px;font-weight: bold;">明细</view>
			</view>
		</view>
		<view  style="margin-top: 8px;background-color: #fff;">
			<view class="balance_list" v-for="(item,index) in balance_list" :key="index">
				<view class="name up">
					{{item.title}}
				</view>
				<view class="time down">
					{{item.time}}
				</view>
				<view class="income up">
					+{{item.income}}
				</view>
				<view class="balance1 down">
					{{item.balance}}  <!-- 推销的产品的价格 -->
				</view>
			</view>
		</view>
		<!-- 两个按钮 -->
		<view class="bottom">
			<view class="show_price" @tap="showModal" data-target="Modal">
				<text class="font btn-bt">&#xe61b;</text>充值
			</view>
			<view class="buybtn" @click="withdraw">   <!-- 支付跳转传递礼包的价格 -->
				<text class="font btn-bt">&#xe61c;</text>提现
			</view>
		</view>
		<!-- 充值窗口 -->
		<view class="cu-modal" :class="modalName=='Modal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">零钱充值</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<text class="font monicon">&#xe645;</text>
					<text class="montext">充值金额</text><input type="text" >
				</view>
				<view class="nextBtn">
					下一步
				</view>
			</view>
		</view>
	</view>
	
</template>
<script>
	export default {
		data() {
			return {
				inputShowed:true,
				modalName: null,
				integral:'128.00',  //总积分
				yesprice:'8.00', //昨日收益
				hisprice:'36.00', //历史收益
				winHeight:'',
				balance_list:[
					{
						time:'2019-02-25',
						title:'OBA洗发水推广收益',
						income:'5.00',    //获利多少
						balance:'128.00'    //推销的产品的价格
					},
					{
						time:'2019-02-25',
						title:'OBA洗发水推广收益',
						income:'5.00',
						balance:'128.00'
					},
					{
						time:'2019-02-25',
						title:'OBA洗发水推广收益',
						income:'5.00',
						balance:'128.00'
					},
					{
						time:'2019-02-25',
						title:'OBA洗发水推广收益',
						income:'5.00',
						balance:'128.00'
					},
					{
						time:'2019-02-25',
						title:'OBA洗发水推广收益',
						income:'5.00',
						balance:'128.00'
					},
					{
						time:'2019-02-25',
						title:'OBA洗发水推广收益',
						income:'5.00',
						balance:'128.00'
					},
					
				]
			}
		},
		onLoad() {
			let that = this;
			//  高度自适应
			uni.getSystemInfo({
				success: function(res) {
					console.log(res)
					let calc = res.windowHeight + 210;
					that.winHeight = calc;
				}
			});
		},
		methods:{
			showModal(e) {
				// this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
		}
	}
</script>


<style scoped>
	/* 模态框 */
	.cu-bar .action>text[class*="cuIcon-"],
	.cu-bar .action>view[class*="cuIcon-"] {
		font-size: 50upx;
	}
	.cu-dialog {
		top: -130px;
		height: 250px;
	}
	.montext {
		position: absolute;
		top: 0px;
		left: 25px;
	}
	.monicon {
		position: absolute;
		top: 30px;
		left: 26px;
		font-size: 28px;
		font-weight: 900;
	}
	.padding-xl {
		height: 25%;
		position: relative;
		/* border-bottom: */
		margin: 10% 0%;
	}
	input {
		font-size:24px;
		font-weight: bold;
		border-bottom: 1px solid #E2E1E1;
		height: 45px;
	}
	.cu-dialog {
		position: relative;
	}
	.nextBtn {
		position: absolute;
		bottom: 10%;
		width: 80%;
		background-color:#07C160;
		color: #FFFFFF;
		height: 40px;
		margin: 0 10%;
		font-size: 15px;
		line-height: 40px;
		border-radius: 4px;
	}
	.main_bac {
		background-color: #FFFFFF;
		position: absolute;
		top: 0px;
		width: 100%;
		height: 100%;
		bottom: 0%;
		/* margin-bottom: 36%; */

	}
	.top {
			width: 100%;
			height: 133px;
			color: #fff;
			background-image: linear-gradient(180deg,#CA89FF, #A86CF0);
			font-size: 14px;
			position: relative;
		}
		.integral {
			font-size: 36px;
			text-align: center;
			font-weight: bold;
			padding-top: 4%;
		}
		.btn {
			text-align: center;
			font-size: 15px;
		}
		.midlle {
			position: absolute;
			width: 85%;
			top: 100px;
			background-color: #fff;
			box-shadow: 0.5px 1px 0.5px 1px #D6DDF3;
			border-radius: 10px;
			height: 84px;
			left: 8%;
			display: flex;
		}
		.yesday {
			width: 50%;
			/* margin: 0 auto; */
			text-align: center;
			}
			.price {
				font-size: 18px;
				color: rgba(80, 80, 80, 1);
				margin-top: 17px;
				text-align: center;
			}
			.title {
				opacity: 0.63;
				color: rgba(80, 80, 80, 1);
				font-size: 14px;
				margin-top: 10px;
				text-align: center;
			}
		.history {
			width: 50%;
			text-align: center;
		}
		.icon {
			font-size: 35px;
			color: rgba(153, 153, 153, 1);
			margin-left: 16px;
		}
		.icon1 {
			font-size: 25px;
			color: rgba(153, 153, 153, 1);
			margin-left: 60%;
		}
		.balance {
			display: flex;
			height: 50px;
			line-height: 50px;
			flex-direction: row;
			
		}
		
		.text {
			color: rgba(80, 80, 80, 1);
			font-size: 14px;
			margin-left: 11px;
		}
		.line {
			width: 100%;
			height: 75px;
			background-color: #fff;
		}
		.bottom_title {
			display: flex;
			flex-direction: row;
			/* border-bottom: 1px solid #F1F1F1; */
			height: 40px;
			line-height: 40px;
		}
		.balance_list {
			width: 90%;
			margin: 0 auto;
			height: 70px;
			position: relative;
			border-bottom: 1px solid #E8E8E8;
		}
		.up {
			color: rgba(80, 80, 80, 1);
			font-size: 14px;
			position: absolute;
			top: 17%;
		}
		.down {
			color: rgba(166, 166, 166, 1);
			font-size: 14px;
			position: absolute;
			bottom: 10%;
		}
		.name,
		.time {
			left: 5%;
		}
		.income,
		.balance1 {
			right: 5%;
		}
		/* 两个按钮 */
		.bottom {
			display: flex;
			flex-direction: row;
			position: fixed;
			bottom: 0;
			top: auto;
			left: 0px;
			width: 100%;
			}
			.show_price {
				width: 50%;
				height: 52px;
				color: #000000;
				background-color: #fff;
				font-size: 18px;
				line-height: 52px;
				text-align: center;
			}
			.buybtn {
				width: 50%;
				height: 52px;
				color: #fff;
				background-color: #CA89FF;
				font-size: 17px;
				line-height: 52px;
				text-align: center;
			}
			.btn-bt {
				font-size: 21px;
				margin-right: 5px;
			}
</style>
