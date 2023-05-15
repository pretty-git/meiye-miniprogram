<template>
	<view class="main">
		<view class="top">
			<view class="top_left_img">
				<image :src="craftMan.src" mode="aspectFill"></image>
			</view>
			<view class="top_middle_text">
				<view class="top_middle_text_title">{{craftMan.name}}</view>
				<view class="top_middle_text_label">{{craftMan.label}}</view>
				<view class="top_middle_text_all">{{craftMan.allnumber}}</view>
				<view class="top_middle_text_all_text">
					累计单数
				</view>
				<view class="top_middle_text_month">{{craftMan.monthnumber}}</view>
				<view class="top_middle_text_month_text">
					月接单数
				</view>
			</view>
			<view class="top_right">
				<view class="top_right_care font" @click="ifCare">
					{{ifcare? '&#xe609;' : '&#xe630;'}}
				</view>
				<view class="top_right_care_text">
					关心
				</view>

				<button class="" open-type="share">
					<view class="top_right_share font">
						&#xe633;
					</view>
					<view class="top_right_share_text">
						分享
					</view>
				</button>

			</view>
		</view> <!-- top上半部分 -->
		<!-- 服务项目部分 -->
		<view class="middle">
			<view class="middle_title">
				<view class="middle_icon font">
					&#xe642;
				</view>
				<view class="middle_title_text">
					服务项目
				</view>
			</view>
			<scroll-view class="goods-box " scroll-x>
				<view v-for="(goodsItem, goodsIndex) in goodsList" :key="goodsItem.id" class="goods-item"
					@click="goods_box_project(goodsItem)">
					<image class="goods-img" :src="goodsItem.src" mode="aspectFill"></image>
					<view class="flex_row nowrap">
						<view class="goods-name">{{goodsItem.serveName}}</view>
						<view class="goods-price">￥{{goodsItem.specialOffer}}</view>
					</view>

				</view>
			</scroll-view>
		</view>
		<!-- 顾客评价 -->
		<view class="middle_customer">
			<view class="middle_title">
				<view class="middle_icon1 font">
					&#xe621;
				</view>
				<view class="middle_title_text1">
					顾客评价
				</view>
			</view>
			<view class="est">
				<text style="margin-right: 10px;">综合评分</text>
				<view class="craftman_left_star"><!-- 任务评分展示 -->
					<view v-for="(item,index) in craftMan.star" :key="`$-${item}{index}`">
						<text class="craftman_left_star_icon">&#xe616;</text>
					</view>
					<view v-for="(item,index) in 5-craftMan.star" :key="`${index}-${item}`">
						<text class="craftman_left_star_icon">&#xe60b;</text>
					</view>
				</view>
			</view>
			<!-- 顾客评论 -->
			<view v-for="(item,index) in labeLlist" :key="index" class="" style="margin: 15px 0;">
				<view class="flex_row">
					<view class="font manicon">
						&#xe6ae;
					</view>
					<view class="" style="margin: auto 10px;">
						{{item.cusName}}
					</view>
					<view class="" style="margin: auto 0;font-size: 12px; color: #999;">
						{{item.evaEvaluationTime}}
					</view>
				</view>

				<view class="" style="margin-left: 33px;word-break: break-all;width: 80%;">
					{{item.evaDetails}}
				</view>
			</view>

		</view>
		<!-- 个人简历 -->
		<view class="middle_title2">
			<view style="display: flex;flex-direction: row;">
				<view class="middle_icon2 font">
					&#xe618;
				</view>
				<view class="middle_title_text2">
					个人简历
				</view>
			</view>
			<view class="" v-if="!staIntroduce"
				style="width: 100%;margin: 10px 0;text-align: center;font-size: 14px;color: #A8A8A8;">
				暂无介绍~
			</view>
			<view class="middle_title2_imgae" v-html="staIntroduce">
			</view>
		</view>
		<!-- 作品展示 -->
		<view class="middle_title2">
			<view style="display: flex;flex-direction: row;">
				<view class="middle_icon2 font">
					&#xe64c;
				</view>
				<view class="middle_title_text2">
					作品展示
				</view>
			</view>
			<view class="works_show">
				<view class="" v-if="works_show_list.length == 0"
					style="width: 100%;margin: 10px 0;text-align: center;font-size: 14px;color: #A8A8A8;">
					暂无作品展示~
				</view>
				<view class="works_show_list" v-for="(item, index) in works_show_list" :key="index">
					<view class="works_show_list1">
						<image :src="item.workPath" mode="aspectFill"></image>
					</view>
				</view>
			</view>
		</view>
		<mpopup ref="mpopup" :isdistance="true"></mpopup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ifcare: false, //是否被关心
				craftMan: {},
				staIntroduce: '', // 介绍
				labeLlist: [],
				goodsList: [],
				staffId: 0,
				followStaffId: 0,
				works_show_list: [] //作品展示
			}
		},
		onLoad(props) {
			this.craftMan = {
				name: '托尼老师',
				label: '高级总监',
				allnumber: 1009,
				monthnumber: 99,
				src: "../../static/banner/32.jpg",
				star: 4,
			}
			this.goodsList = [{
				serveName: '时尚短发',
				specialOffer: '33',
				src: '../../static/banner/33.jpg',
				id: 1
			}, {
				serveName: '时尚卷发',
				specialOffer: '63',
				src: '../../static/banner/43.jpg',
				id: 2
			}]

			this.labeLlist = [{
				cusName: '小张',
				evaEvaluationTime: '2022-10-10',
				evaDetails: '必须好评'
			}]
			this.works_show_list = [{
				workPath: '../../static/banner/311.jpg'
			}, {
				workPath: '../../static/banner/AA.jpg'
			}]
			this.staIntroduce = `从业时尚圈十余年，你想要的发型描述一下，几乎百分百还原`
			this.ifcare = true
			// uni.showLoading({
			//  title: '加载中...',
			//  mask: true
			// })
			// setTimeout(function () {
			//     uni.hideLoading();
			//    }, 500);
			// console.log(props)
			// this.staffId = props.id
			// uni.request({
			// 	method:'GET',
			// 	url: getApp().globalData.url + `/applet/store/stoStaffDetail/${props.id}`,
			// 	success: (res) => {
			// 		// 成功隐藏下拉加载状态
			// 		console.log(res.data,'礼包项目')	
			// 		this.src= 'http://my.cloud.xmstruggle.com/' + res.data.staInfo.staPhoto
			// 		this.name = res.data.staInfo.staName
			// 		this.label = res.data.staInfo.pgJobName
			// 		this.allnumber = res.data.totalNumber
			// 		// this.resume = 
			// 		if(res.data.starLevel == '' || res.data.starLevel == null || res.data.starLevel == undefined) {
			// 			this.star = 0
			// 		}else {
			// 			this.star = res.data.starLevel//星星数
			// 		}
			// 		this.monthnumber= res.data.monthNumber
			// 		this.goodsList = res.data.serveList
			// 		this.labeLlist = res.data.evaluateList
			// 		this.works_show_list = res.data.staffWorkShowList
			// 		this.staIntroduce = res.data.staInfo.staIntroduce
			// 	},fail:(err) => {
			// 		this.error()
			// 		uni.hideLoading()
			// 	}
			// })
			// uni.request({
			// 	method:'POST',
			// 	url: getApp().globalData.url + `/applet/customer/FollowList`,
			// 	data:{
			// 		staffId:Number(this.staffId),
			// 		customerId:uni.getStorageSync('user').customerId
			// 	},
			// 	success: (res) => {
			// 		// 成功隐藏下拉加载状态
			// 		console.log(res.data,'111')
			// 		if(res.data.rows.length>0) {
			// 			this.followStaffId = res.data.rows[0].followStaffId
			// 			this.ifcare = true
			// 		}else {
			// 			this.ifcare = false
			// 		}

			// 	},fail:(err) => {
			// 		this.error()
			// 		uni.hideLoading()
			// 	}
			// })
		},
		methods: {
			ifCare() {

				this.ifcare = !this.ifcare;
			},
			onShareAppMessage: function(res) {
				if (res.from === 'button') {
					// 来自页面内转发按钮
					console.log(res.target)
				}
				return {
					title: '礼包分享',
					path: '/pages/craftsman/craftmanDetails'
				}
				// 当分享出去的卡片被点击时，在页面的onLoad(options){}，options参数中接收
			},
			goods_box_project(item) {
				uni.navigateTo({
					url: '../giftdetails/projectdetail?classificationId=' + item.serveClassId + '&serveId=' + item
						.serveId
				})
			}
		}
	}
</script>

<style scoped>
	page {
		background-color: #fff !important;
	}

	button::after {

		border: none;

	}

	button {
		padding: 0px;
		line-height: 26px;
		background-color: #fff;
		width: 100%;
		text-align: right;
		font-size: 14px;
		margin: auto 0;
		display: flex;
		flex-direction: row;
		margin-top: 40px;

	}

	.main {
		width: 100%;
		padding: 0 22px;
		height: 100%;
		padding-top: 7px;

	}

	/* 头像模块 */
	.top {
		width: 100%;
		height: 113px;
		margin: 29px 0 20px 0;
		position: relative;
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid #F1F1F1;
	}

	.top_left_img {
		width: 88px;
		height: 88px;
		border-radius: 45px;
	}

	.top_left_img image {

		height: 88px;
		border-radius: 45px;
	}

	.top_middle_text {
		width: 60%;
		height: 100%;
		position: relative;
	}

	.top_middle_text_title {
		position: absolute;
		top: 6px;
		left: 8%;
		color: rgba(80, 80, 80, 1);
		font-size: 18px;
		text-align: left;
		font-weight: bold;
	}

	.top_middle_text_label {
		height: 25px;
		padding: 0 5px;
		color: rgba(255, 255, 255, 1);
		background-color: #fb4b5c;
		border-radius: 5px;
		font-size: 14px;
		line-height: 25px;
		position: absolute;
		top: 6px;
		left: 56%;
		text-align: center;

	}

	.top_middle_text_all {
		position: absolute;
		bottom: 46%;
		left: 14%;
		font-size: 14px;
	}

	.top_middle_text_all_text {
		position: absolute;
		bottom: 21%;
		left: 10%;
	}

	.top_middle_text_month {
		position: absolute;
		bottom: 46%;
		right: 29%;
		font-size: 14px;
	}

	.top_middle_text_month_text {
		position: absolute;
		bottom: 21%;
		right: 18%;
	}

	.top_right {
		width: 20%;
		height: 100%;
		position: relative;
		margin-top: 3%;

	}

	.top_right_care {
		position: absolute;
		top: 0%;
		left: 0%;
		color: red;
		font-size: 26px;
	}

	.top_right_care_text {
		position: absolute;
		top: 4%;
		right: 0%;
	}

	.top_right_share {
		font-size: 26px;
		color: red;
	}

	.top_right_share_text {
		width: 100%;
	}

	/* 服务项目 */
	.middle {
		width: 100%;
		/* height: 170px; */
		position: relative;
		padding-bottom: 20px;

	}

	.middle_icon {
		font-size: 30px;
		color: #313333;

	}

	.middle_title_text {
		position: absolute;
		top: 5px;
		left: 11%;
		color: rgba(80, 80, 80, 1);
		font-size: 16px;
		font-weight: bold;
	}

	.goods-box {
		width: 100%;
		text-align: center;
		white-space: nowrap;

	}

	.goods-item {
		display: inline-block;
		margin-right: 19px;
		margin-top: 18px;
		/* border-radius: 28px; */
	}

	.goods-img {
		display: block;
		width: 140px;
		height: 80px;
		border-radius: 4px;

	}

	.goods-name {
		margin-top: 10px;
		color: rgba(80, 80, 80, 1);
	}

	.goods-price {
		margin-top: 10px;
		color: #808080;
		padding-left: 5px;
	}

	/* 顾客评价 */
	.middle_customer {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.craftman_left_star {
		font-size: 15px;
		color: rgba(255, 141, 26, 1);
		display: flex;
		flex-direction: row;
		margin-bottom: 5px;
	}

	.craftman_left_star_icon {
		font-family: iconfont;
		font-size: 15px;
		margin: 0 2px;
	}

	.est {
		display: flex;
		flex-direction: row;
		margin: 10px 0;
	}

	.middle_icon1 {
		font-size: 27px;
		color: #313333;

	}

	.middle_title_text1 {
		position: absolute;
		top: 5px;
		left: 11%;
		color: rgba(80, 80, 80, 1);
		font-size: 16px;
		font-weight: bold;
	}

	.labeLlist {
		margin: 4px;
	}

	.labeLlist_text {
		padding: 0 15px;
		height: 36px;
		color: rgba(153, 164, 189, 1);
		border: 1px solid rgba(56, 56, 56, 1);
		border-radius: 18px;
		font-size: 14px;
		line-height: 36px;
		text-align: center;
	}

	/* 个人简历 */
	.middle_title2 {
		/* height: 250px; */
		width: 100%;
		line-height: 20px;
		position: relative;
		padding: 10px 0;
	}

	.middle_icon2 {
		font-size: 30px;
		margin-right: 5px;
		color: #313333;
		;
		font-weight: bold;
	}

	.middle_title_text2 {
		/* position: absolute;
			top: 8px;
			left: 10%; */
		color: rgba(80, 80, 80, 1);
		font-size: 16px;
		font-weight: bold;
	}

	.middle_title2_imgae {
		width: 100%;
		margin: 15px 0;
	}

	/* 作品展示 */
	.works_show {
		display: flex;
		flex-direction: row;
		width: 100%;
		flex-wrap: wrap;
		margin-bottom: 30px;
		margin-top: 10px;
	}

	.works_show_list {
		width: 29.3%;
		height: 135px;
		margin: 10px 6px;
	}

	.works_show_list1 {
		width: 100%;
		height: 135px;
		margin: 10px 6px;
	}

	.works_show_list1 image {
		width: 100%;
		height: 135px;
	}

	.manicon {
		font-size: 25px;
		color: #FB4142;

	}
</style>