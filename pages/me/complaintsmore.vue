<template>
	<view class="mainpage">
		<!-- <button class="cu-btn bg-green shadow" @tap="BasicsSteps">下一步</button> -->
		<view class="bg-white padding back">
			<uni-steps :data="[{ title: '提交申请' }, { title: '核实处理' }, { title: '完成' }]" :active='active' class="steps">
				
			</uni-steps></view>
		<!-- 处理状态 -->
		<view class="recordlist_bottom">
			<view class="font" style="font-size: 28px;padding-right: 10px;">
				&#xe615;
			</view>
			<view class="recordlist_state">{{list.complainStatus == 1?'处理中':'已完成'}} </view>
			<view class="describle">{{ describle }}</view>
		</view>
		<!-- 问题描述 -->
		<view class="describle_modle">
			<view class="describle_main">
				<view style="color: rgba(80, 80, 80, 1);font-size: 16px;text-align: left;font-weight: bold;">
					问题描述
				</view>
				<view class="time">投诉时间: {{ list.complainTime }}</view>
				<view class="icon font">&#xe604;</view>
			</view>

			<view class="" style="width: 90%;">{{ list.complainReasons }}</view>
		</view>
		<!-- 投诉的项目 -->
		<view class="bottom">
			<view class="id">订单号 {{ list.complainSuggestId }}</view>
			<view class="middle">
				<view class="flex_row">
					<view class="font" style="font-size: 28px;padding-left: 18px;margin: auto 0;">
						&#xe63d;
					</view>
					<view class="title">手艺人</view>
				</view>
				
				<view class="" >
					<view class="middle_one" v-for="(item,index) in list.backstageOrder.projectOrderRelevanceLists" :key="index" @click="craftman_details(item.staffId)">
						<view class="craftman_icon" >
							<image :src="'http://my.cloud.xmstruggle.com/' + list.backstageOrder.projectOrderRelevanceLists[0].staPhoto" mode="aspectFill" >
							</image>
						</view>
						<view style="width: 68%;" class="nowrap">{{ list.backstageOrder.projectOrderRelevanceLists[0].staName }} 期待下次为你服务</view>
						<view class="icon font">&#xe604;</view>
					</view>
				</view>
				<view class="middle_two" @click="location">
					<view class="map_icon font">&#xe61d;</view>
					<view  v-if="list.backstageOrder.backstageStores.length==1" class="location nowrap">
						<view>{{list.backstageOrder.backstageStores[0].stoProvince}}{{list.backstageOrder.backstageStores[0].stoCity}}{{list.backstageOrder.backstageStores[0].stoCounty}}{{list.backstageOrder.backstageStores[0].stoAddress}} </view> 	
					</view>
					<view  class="location nowrap" v-if="list.backstageOrder.backstageStores.length == 0">
						暂无可用门店
					</view>
					<view  class="location nowrap" v-if="list.backstageOrder.backstageStores.length > 0" v-for="(item,index) in list.backstageOrder.backstageStores" :key="index">
						{{item.stoAddress}}、
					</view>
					<view class="icon font">&#xe604;</view>
				</view>
				<view class="bottom_pro" >
					<view class="flex_row">
						<view class="font" style="font-size: 28px;padding-left: 18px;">
							&#xe619;
						</view>
						<view class="title">手艺人</view>
					</view>
					<view class="project" v-for="(item,index) in list.backstageOrder.projectOrderRelevanceLists" :key="index" @click="projectdetails(item.serveId,item.serveClassId)">
						<image :src="'http://my.cloud.xmstruggle.com/' + item.staPhoto" mode="aspectFill"></image>
						<view class="project_name">{{ item.serveName }}</view>
						<view class="project_price">￥{{ item.suggestPrice }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import uniSteps from '@/components/uni-steps/uni-steps.vue';
export default {
	components: { uniSteps },
	data() {
		return {
			list:{},
			active:2,
			basics: 0,
			num: 0,
			scroll: 0,
			state: '处理中',
			describle: '工作人员将会与您电话联系核实情况',
			time: '2019-02-22 12:35',
			describle_text: '把我的头发弄得太难看了把我的头发弄得太难看了发弄得太难看',
			id: '213656413155',
			craftman_icon: 'https://7765-we-63574e-1258830969.tcb.qcloud.la/mingzi/man.jpg?sign=13cd306d8fac42cffcdff6364956af2d&t=1565946123',
			craftman_name: '托尼老师',
			map: '厦门市思明区演武路15号大学城商场二楼SM广场',
			project_name: '洗剪吹',
			project_time: '60分钟',
			project_price: '158',
			projectrc: 'https://7765-we-63574e-1258830969.tcb.qcloud.la/mingzi/man.jpg?sign=13cd306d8fac42cffcdff6364956af2d&t=1565946123'
		};
	},
	onLoad(props) {
			uni.request({    //获取购物券
				method: 'GET',
				url: getApp().globalData.url + `/applet/suggest/edit/${props.complainSuggestId}`,
				success: (res) => {
					console.log(res)
					this.list = res.data.complainSuggest
					if(this.list.complainStatus == 1) {
						this.active = 1
					}else {
						this.active = 2
					}
					console.log(this.list)
				},fail:(err) => {
					uni.showToast({
						title:'网络请求超时,请重试',
						icon:'none'
					})
				}
			})
		},
	methods: {
		NumSteps() {
			this.num = this.num == this.numList.length - 1 ? 0 : this.num + 1;
		},
		BasicsSteps() {
			this.basics = this.basics == this.basicsList.length - 1 ? 0 : this.basics + 1;
		},
		craftman_details(item) {
			uni.navigateTo({
				url: '../craftsman/craftmanDetails?id=' + item
			});
		},
		projectdetails(serveId,classificationId) {
			uni.navigateTo({
				url: '../giftdetails/projectdetail?classificationId=' + classificationId + '&serveId=' + serveId
			});
		}
	}
};
</script>

<style scoped>
	
.mainpage {
	height: 100%;
}

.steps {
	padding-left: 0;
}
.back {
	background-color: #FAA0E8;
	height: 140px;
}
.recordlist_bottom {
	display: flex;
	flex-direction: row;
	width: 90%;
	height: 53px;
	line-height: 53px;
	margin: 0 auto;
	background-color: #f5f5f5;
	border-radius: 6px;
	font-size: 14px;
	padding-left: 10px;
	border-radius: 4px;
	position: absolute;
	top: 110px;
	box-shadow: 1px 1px 1px 1px #FCE7F7;
	left: 5%;

}
.recordlist_state {
	width: 16%;
}
.describle {
	color: rgba(166, 166, 166, 1);
	font-size: 14px;
	text-align: right;
}
/* 问题描述模块 */
.describle_modle {
	width: 90%;
	background-color: #fff;
	font-size: 14px;
	padding-left: 15px;
	border-radius: 4px;
	margin: 50px auto 20px;
}
.describle_main {
	height: 52px;
	line-height: 52px;
	display: flex;
	flex-direction: row;
}
.time {
	color: rgba(166, 166, 166, 1);
	font-size: 14px;
	width: 70%;
	text-align: center;
}
.icon {
	font-size: 30px;
	color: rgba(153, 153, 153, 1);
}
/* 投诉的项目 */
.bottom {
	width: 90%;
	height: 320px;
	margin: 0 auto;
	border-radius: 4px;
	background-color: #fff;
	margin: 20px auto;
}
.craftman_icon {
	width: 44px;
	height: 44px;
	margin: auto 16px;
	border-radius: 50%;
}
.craftman_icon image {
	width: 44px;
	height: 44px;
	border-radius: 4px;
}
.project {
	width: 90px;
	height: 62px;
	border-radius: 4px;
	margin:16px;
}
.project image {
	width: 90px;
	height: 62px;
	border-radius: 4px;
}
.id {
	height: 41px;
	line-height: 41px;
	padding: 0 12px;
	color: rgba(166, 166, 166, 1);
	border-bottom: 1px solid #f1f1f1;
}
.title {
	color: rgba(80, 80, 80, 1);
	font-size: 16px;
	font-weight: bold;
	padding-left: 16px;
	height: 40px;
	line-height: 40px;
	margin: auto 0;
}
.middle_one {
	display: flex;
	flex-direction: row;
	height: 60px;
	line-height: 60px;
	color: rgba(80, 80, 80, 1);
}
.middle_two {
	display: flex;
	flex-direction: row;
	height: 60px;
	line-height: 60px;
	padding-left: 16px;
}
.map_icon {
	font-size: 30px;
	color: rgba(56, 56, 56, 1);
	margin-right: 10px;
}
.location {
	width: 77%;
}
.project {
	position: relative;
	width: 100%;
}
.project_name {
	position: absolute;
	top: 0px;
	left: 30%;
}
.project_time {
	position: absolute;
	bottom: 5%;
	left: 30%;
	color: rgba(166, 166, 166, 1);
}
.project_price {
	color: rgba(255, 108, 144, 1);
	position: absolute;
	bottom: 5%;
	left: 50%;
}
</style>
