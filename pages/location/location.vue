<template>
	<view class="page">
		<!-- 要判断店铺状态 -->

		<view class="present flex_row">
			<text class="font" style="color: #E94A59;font-size: 28px;margin-right: 5px;">&#xec3f;</text>
			当前:{{ city }}-{{ store }}
		</view>
		<!-- 索引列表 -->
		<!-- <scroll-view class="nav giftswiper" scroll-x> -->
		<view class="indexBar">
			<view class="indexBar-box" @touchstart="tStart" @touchend="tEnd" @touchmove.stop="tMove">
				<view class="indexBar-item" v-for="(item, index) in list" :key="index" :id="index" @touchstart="getCur"
					@touchend="setCur" :class="{ on: index == chooseit }" @click="choose(index)">
					{{ item.name }}
				</view>
			</view>
		</view>
		<!-- </scroll-view> -->
		<view class="" style="position: fixed;top: 150px;width: 100%;background-color: #fff;z-index: 999;">
			<view class="flex_row" style="background-color: #fff;flex-wrap: wrap;">
				<!-- 省 -->
				<view class="cu-item fachildren" v-for="(items, sub) in list[chooseit].lists" :key="sub">
					<view class="fastyle" :class="{ on1: sub == curIndex }" @click="choose1(sub)">{{ items.fa }}</view>
				</view>
			</view>
			<view class="flex_row" v-if="list[chooseit].lists[curIndex].child.length > 0"
				style="background-color: #fff;flex-wrap: wrap;">
				<!-- 市 -->
				<view v-for="(itm, index1) in list[chooseit].lists[curIndex].child" :key="index1" class="fachild">
					<view class="childstyle" :class="{ on2: index1 == cuecityIndex }" @click="choose2(index1)">
						{{ itm.name }}</view>
				</view>
			</view>
		</view>

		<!-- 分区 -->
		<scroll-view scroll-y class="indexes" :scroll-into-view="'indexes-' + listCurID"
			:style="[{ height: CustomBar }]" :scroll-with-animation="true" :enable-back-to-top="true">
			<!-- <block v-for="(item,index) in childlist" :key="index"> -->
			<view :class="'indexItem-' + item.cate_name" :id="'indexes-' + item.cate_name" :data-index="item.cate_name">
				<!-- <view class="padding">{{item.cate_name}}</view> -->

				<view class="" v-if="list[chooseit].lists[curIndex].child.length > 0" style="margin-top: 10px;">
					<view v-for="(item, index) in list[chooseit].lists[curIndex].child[cuecityIndex].storechild"
						:key="index" class="flex_row" style="padding: 10px 0;border-bottom: 1px solid #E5E5E5;">
						<view class=" " style="width: 20%;">
							<view class="font storeicon">&#xe646;</view>
						</view>
						<view class="flex_column" style="width: 60%;">
							<view class="flex_row" style="margin: 10px 0;font-size: 18px;">
								<view class="nowrap" style="width: 50%;font-size: 15px;text-align: left;">
									{{ item.storename }}</view>
								<view class="" style="width: 50%;font-size: 14px;text-align: center;">距离
									{{ item.instance }}</view>
							</view>
							<view class="address nowrap">{{ item.sotoreaddress }}</view>
						</view>
						<view class="golabel">
							<view class="golabelit" @click="golocation(item)">Go</view>
						</view>
					</view>
				</view>
			</view>
			<mpopup ref="mpopup" :isdistance="true"></mpopup>
			<!-- </block> -->
		</scroll-view>
	</view>
</template>

<script>
	var amapFile = require('../../amap-wx.js');
	import Citys from '../../citys.js';
	import QQMapWX from '../../qqmap-wx-jssdk.js';
	var qqmapsdk = new QQMapWX({
		key: 'CWSBZ-MS3KO-2ZKWF-SHUHD-PNU7V-QHFNG' // 必填
	});
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: '',
				hidden: true,
				listCurID: '',
				list: [{
						name: 'A',
						lists: [{
								fa: '安徽省',
								child: []
							},
							{
								fa: '澳门特别行政区',
								child: []
							}
						]
					},
					{
						name: 'B',
						lists: [{
							fa: '北京市',
							child: []
						}]
					},
					{
						name: 'C',
						lists: [{
							fa: '重庆市',
							child: []
						}]
					},

					{
						name: 'F',
						lists: [{
							fa: '福建省',
							child: []
						}]
					},
					{
						name: 'G',
						lists: [{
								fa: '广东省',
								child: []
							},
							{
								fa: '广西壮族自治区',
								child: []
							},
							{
								fa: '贵州省',
								child: []
							},
							{
								fa: '甘肃省',
								child: []
							}
						]
					},
					{
						name: 'H',
						lists: [{
								fa: '河北省',
								child: []
							},
							{
								fa: '黑龙江省',
								child: []
							},
							{
								fa: '河南省',
								child: []
							},
							{
								fa: '湖北省',
								child: []
							},
							{
								fa: '湖南省',
								child: []
							},
							{
								fa: '海南省',
								child: []
							}
						]
					},
					{
						name: 'J',
						lists: [{
								fa: '吉林省',
								child: []
							},
							{
								fa: '江苏省',
								child: []
							},
							{
								fa: '江西省',
								child: []
							}
						]
					},

					{
						name: 'L',
						lists: [{
							fa: '辽宁省',
							child: []
						}]
					},

					{
						name: 'N',
						lists: [{
								fa: '内蒙古自治区',
								child: []
							},
							{
								fa: '宁夏回族自治区',
								child: []
							}
						]
					},

					{
						name: 'Q',
						lists: [{
							fa: '青海省',
							child: []
						}]
					},

					{
						name: 'S',
						lists: [{
								fa: '山西省',
								child: []
							},
							{
								fa: '上海市',
								child: []
							},
							{
								fa: '山东省',
								child: []
							},
							{
								fa: '四川省',
								child: []
							},
							{
								fa: '陕西省',
								child: []
							}
						]
					},
					{
						name: 'T',
						lists: [{
								fa: '天津市',
								child: []
							},
							{
								fa: '台湾省',
								child: []
							}
						]
					},

					{
						name: 'X',
						lists: [{
								fa: '西藏自治区',
								child: []
							},
							{
								fa: '新疆维吾尔自治区',
								child: []
							},
							{
								fa: '香港特别行政区',
								child: []
							}
						]
					},
					{
						name: 'Y',
						lists: [{
							fa: '云南省',
							child: []
						}]
					},
					{
						name: 'Z',
						lists: [{
							fa: '浙江省',
							child: []
						}]
					}
				],
				listCur: '',
				chooseit: 0,
				// 索引
				city: '', //默认定位自己当前的位置
				store: '',
				curIndex: 0,
				cuecityIndex: 0,
				cuestoreIndex: 0,
				start: '',
				end: '',
				distance: 0,
				dataList: []
			};
		},
		onLoad() {
			var that = this;
			uni.getSystemInfo({
				success: function(res) {
					console.log(res.windowHeight);
					that.CustomBar = res.windowHeight - 280 + 'px';
				}
			});
			this.start = uni.getStorageSync('getLocation'); //开始的经纬度
			this.city = uni.getStorageSync('province');
			for (var i = 0; i < this.list.length; i++) {
				for (var j = 0; j < this.list[i].lists.length; j++) {
					if (this.city == this.list[i].lists[j].fa) {
						this.chooseit = i;
					}
				}
			}
			this.store = uni.getStorageSync('city');
			uni.request({
				method: 'POST',
				url: getApp().globalData.url + '/applet/store/list',
				header: {
					'Content-Type': 'application/json' //如果为空，加上头部接收
				},
				success: res => {
					this.dataList = res.data.data;
					// for(var item of res.data.rows)
					this.getList();
				},
				fail: err => {
					this.error();
					uni.hideLoading();
				}
			});
		}, //索引
		onReady() {
			let that = this;
			uni.createSelectorQuery()
				.select('.indexBar-box')
				.boundingClientRect(function(res) {
					that.boxTop = res.top;
				})
				.exec();
			uni.createSelectorQuery()
				.select('.indexes')
				.boundingClientRect(function(res) {
					that.barTop = res.top;
				})
				.exec();
		}, //索引
		methods: {
			golocation(item) {
				uni.setStorageSync('storeId', item.children_id);
				uni.setStorageSync('mechanismId', item.stoMechanism);
				uni.switchTab({
					url: '/pages/index/index'
				});
				console.log(item);
				uni.setStorageSync('locationname', item.storename);
			},
			getList() {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				var ress = this.dataList;
				for (var i = 0; i < this.dataList.length; i++) {
					// console.log(this.dataList[i])
					if (this.dataList[i].stoProvince == this.list[this.chooseit].lists[this.curIndex].fa) {
						var distance = 0;
						console.log(this.dataList[i].stoCity, '3');
						var stoCity = this.dataList[i].stoCity;
						var stoName = this.dataList[i].stoName;
						var stoAddress = this.dataList[i].stoAddress;
						var storeId = this.dataList[i].storeId;
						var stoMechanism = this.dataList[i].stoMechanism;
						var that = this;
						that.totalDistance(that.start, that.dataList[i].stoMap, stoCity, stoName, stoAddress, storeId,
							stoMechanism);
					}
				}
				uni.hideLoading();
			},
			totalDistance(start, end, stoCity, stoName, stoAddress, storeId, stoMechanism) {
				var list = [];
				var that = this;
				uni.request({
					method: 'GET',
					url: 'https://apis.map.qq.com/ws/distance/v1/?mode=' + 'walking' + '&from=' + start + '&to=' +
						end + '&key=' + 'KRMBZ-FDXK6-25VSB-EIG5J-7U7LT-Z4B4T',
					header: {
						'Content-Type': 'application/json' //如果为空，加上头部接收
					},
					success: res => {
						var distance = Math.floor(res.data.result.elements[0].distance / 1000) + 'km';
						// if(that.list[that.chooseit].lists[that.curIndex].child.length>0) { // 有城市
						var book = 0;
						for (var k = 0; k < that.list[that.chooseit].lists[that.curIndex].child.length; k++) {
							// var list = []
							if (stoCity == that.list[that.chooseit].lists[that.curIndex].child[k].name) {
								var list = that.list[that.chooseit].lists[that.curIndex].child[k].storechild;
								// var list = []
								list.push({
									children_id: storeId,
									stoMechanism: stoMechanism,
									instance: distance,
									storename: stoName,
									sotoreaddress: stoAddress
								});
								// list门店数组
								that.list[that.chooseit].lists[that.curIndex].child[k].storechild = list;
								book = 1;
								return;
							}
						}
						if (book == 0) {
							var list = [];
							list.push({
								children_id: storeId,
								instance: distance,
								stoMechanism: stoMechanism,
								storename: stoName,
								sotoreaddress: stoAddress
							});
							var lists = {
								name: stoCity,
								storechild: list
							};
							that.list[that.chooseit].lists[that.curIndex].child.push(lists);
						}
					}
				});
			},
			// 索引
			getCur(e) {
				this.hidden = false;
				this.listCur = this.list[e.target.id].name;
			},
			setCur(e) {
				this.hidden = true;
				this.listCur = this.listCur;
			},
			//滑动选择Item
			tMove(e) {
				let y = e.touches[0].clientY,
					offsettop = this.boxTop,
					that = this;
				//判断选择区域,只有在选择区才会生效
				if (y > offsettop) {
					let num = parseInt((y - offsettop) / 20);
					this.listCur = that.list[num].name;
				}
			},

			//触发全部开始选择
			tStart() {
				this.hidden = false;
			},

			//触发结束选择
			tEnd() {
				this.hidden = true;
				this.listCurID = this.listCur;
			},
			indexSelect(e) {
				let that = this;
				let barHeight = this.barHeight;
				let list = this.list;
				let scrollY = Math.ceil((list.length * e.detail.y) / barHeight);
				for (let i = 0; i < list.length; i++) {
					if (scrollY < i + 1) {
						that.listCur = list[i].name;
						that.movableY = i * 20;
						return false;
					}
				}
			},
			choose(index) {
				this.chooseit = index;
				this.curIndex = 0;
				this.cuecityIndex = 0;
				for (var item of this.list[this.chooseit].lists[this.curIndex].child) {
					item.storechild = [];
				}
				this.getList();
			},
			choose1(sub) {
				this.cuecityIndex = 0;
				this.curIndex = sub;
			},
			choose2(sub) {
				this.cuecityIndex = sub;
			}
		}
	};
</script>

<style scoped>
	.on {
		background-color: #fff;
		border: 1px solid #e5e5e5;
		color: red !important;
	}

	.on1 {
		font-weight: bold;
		color: #fb4b5c;
	}

	.on2 {
		color: #fff !important;
		background-color: #fb4b5c !important;
	}

	.indexes {
		position: absolute;
		top: 250px;
		height: 100%;
		background-color: #fff;
	}

	.indexBar {
		width: 100%;
		display: flex;
		padding: 5px 0 10px;
		position: fixed;
		top: 50px;
		background-color: #fff;
		z-index: 999;
	}

	.indexBar .indexBar-box {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		width: 100%;
	}

	.indexBar-item {
		font-size: 30rpx;
		width: 35px;
		height: 35px;
		line-height: 35px;
		margin: 5px;
		color: #a1a1a1;
		border: 1px solid #e5e5e5;
		text-align: center;
	}

	movable-view.indexBar-item::before {
		content: '';
		display: block;
		position: absolute;
		left: 0;
		top: 10upx;
		height: 20upx;
		width: 4upx;
		background-color: #f37b1d;
	}

	.indexToast {
		position: fixed;
		top: 0;
		right: 80upx;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		width: 100upx;
		height: 100upx;
		border-radius: 10upx;
		margin: auto;
		color: #fff;
		line-height: 100upx;
		text-align: center;
		font-size: 48upx;
	}

	.present {
		width: 100%;
		height: 50px;
		line-height: 50px;
		color: rgba(80, 80, 80, 1);
		font-size: 16px;
		text-align: left;
		letter-spacing: 1px;
		font-weight: bold;
		/* padding-top: 3%; */
		padding-left: 6%;
		position: fixed;
		top: 0px;
		background-color: #fff;
		z-index: 999;
	}

	/* 索引 */
	.page {
		background-color: #fff;
		position: absolute;
		bottom: 0px;
		top: 0px;
		width: 100%;
		height: 100%;
	}

	.fachildren {
		width: 25%;
		text-align: center;
		margin: 5px 0;
	}

	.fastyle {
		font-size: 18px;
	}

	.fachild {
		width: 25%;
	}

	.childstyle {
		color: #888;
		background-color: #fff;
		border-radius: 5px;
		width: 60px;
		height: 30px;
		text-align: center;
		line-height: 30px;
		border: 1px solid #e5e5e5;
		margin: 5px auto;
	}

	.storeicon {
		font-size: 28px;
		color: #469deb;
		text-align: center;
		margin-top: 20px;
	}

	.golabel {
		width: 20%;
	}

	.golabelit {
		width: 50px;
		height: 25px;
		border-radius: 10px;
		background-color: #fb4b5c;
		color: #fff;
		text-align: center;
		margin-top: 10px;
		line-height: 25px;
	}

	.address {
		word-break: break-word;
		width: 80%;
		font-size: 14px;
		color: #808080;
		/* margin-top: 5px; */
	}
</style>