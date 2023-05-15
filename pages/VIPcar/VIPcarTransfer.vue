<template>
	<view class="main">
		<!-- 第一张卡是自己的 -->
		<view class="vip_car_bc" style="margin-top: 20px;" @click="turnCarDetails"> <!-- 点击跳转回自己卡片的详情页面 -->
			<view class="vip_car_circle"><!-- 小圆圈 --></view>
			<text class="car_name">{{carname}}</text>
			<text class="time">{{time}}</text>
			<text class="car_number">{{ carnumber }}</text>
			<text class="car_class">{{ carclass }}</text>
			<text
				style="position: absolute;right: 6%;bottom: 10%;color: rgba(255, 255, 255, 1);font-size: 14px;">余额：{{price}}元</text>
			<!-- 剩余次数 -->
		</view>
		<!-- 搜索框 -->
		<!-- /* 搜索栏begin */ -->
		<view class="cu-bar bg-white search" style="margin: 10px 0;">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="搜索需要转出的卡号" confirm-type="search"
					placeholder-style="color:#8E8E8E"></input>
			</view>
			<view class="action">
				<button class="cu-btn bg-gradual shadow-blur  font">
					搜索 </button>
			</view>
		</view>
		<!-- /* 搜索栏end */ -->
		<!-- 可转账的列表 -->
		<view class="transferlist" v-for="(item, index) in transferlist" :key="index">
			<view class="vip_car_bc">
				<view class="vip_car_circle"><!-- 小圆圈 --></view>
				<text class="car_name">{{item.carname}}</text>
				<text class="time">{{item.time}}</text>
				<text class="car_number">{{ item.carnumber }}</text>
				<text class="car_class">{{item.carclass }}</text>
				<text class="residul">余额：{{item.price}}元</text> <!-- 剩余次数 -->
				<text class="usename">持有人：{{item.usename}}</text>
			</view>
		</view>


	</view>

</template>

<script>
	export default {
		data() {
			return {
				// 第一张自己的卡的属性值
				carname: '100元储值卡',
				carclass: '洗剪吹项目卡',
				carnumber: 'No:123456',
				price: '5000',
				time: '59天后过期',
				// 列表可以转账的卡
				transferlist: [{
						carname: '洗剪吹项目卡',
						carclass: '项目卡',
						usename: '王大锤',
						carnumber: 'No:123456',
						price: '15000',
						time: '59天后过期'
					},
					{
						carname: '洗剪吹项目卡',
						carclass: '会费卡',
						usename: '王大锤',
						carnumber: 'No:123457',
						price: '2000',
						time: '59天后过期'
					},
					{
						carname: '洗剪吹项目卡',
						carclass: '特惠会员卡',
						carnumber: 'No:123458',
						usename: '王大锤',
						price: '15000',
						time: '59天后过期'
					},
					{
						carname: '洗剪吹项目卡',
						carclass: '会费卡',
						carnumber: 'No:123450',
						price: '15000',
						usename: '王大锤',
						time: '59天后过期'
					},
					{
						carname: '洗剪吹项目卡',
						carclass: '特惠会员卡',
						carnumber: 'No:123459',
						price: '15000',
						usename: '王大锤',
						time: '59天后过期'
					}
				]
			}
		},
		methods: {
			vipcardetails() {
				uni.navigateTo({
					url: "../vipCarDetails/vipCarDetails"
				})
			}
		}
	}
</script>

<style scoped>
	/* 卡片模块 */
	.vip_car_bc {
		width: 90%;
		margin: 0 auto;
		margin-bottom: 20px;
		height: 161px;
		color: rgba(80, 80, 80, 1);
		background-color: #FAA0E8;
		border-radius: 6px;
		position: relative;

	}

	.vip_car_circle {
		width: 39px;
		height: 39px;
		position: absolute;
		left: 4%;
		top: 10%;
		background-color: #fff;
		-webkit-box-shadow: rgba(255, 255, 255, 1) solid 1px;
		box-shadow: rgba(255, 255, 255, 1) solid 1px;
		border-radius: 50%;
		text-align: center;

	}

	.car_name {
		position: absolute;
		top: 37%;
		left: 27%;
		color: #fff;
		font-size: 25px;
		font-weight: bold;

	}

	.bg-gradual {
		background-color: #FB4B5C;
		color: #fff;
	}

	.car_number {
		position: absolute;
		left: 5%;
		bottom: 9%;
		color: #fff;
		font-size: 14px;

	}

	.car_class {
		position: absolute;
		left: 20%;
		top: 15%;
		color: #fff;
		font-size: 16px;
		font-weight: bold;

	}

	.time {
		position: absolute;
		top: 14%;
		right: 6%;
		color: rgba(255, 255, 255, 1);
		font-size: 14px;

	}

	.residul {
		position: absolute;
		right: 6%;
		bottom: 20%;
		color: rgba(255, 255, 255, 1);
		font-size: 14px;
	}

	.usename {
		position: absolute;
		right: 6%;
		bottom: 5%;
		color: rgba(255, 255, 255, 1);
		font-size: 14px;
	}
</style>