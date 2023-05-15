<template>
	<view style="background-color: #fff;">
		<view class="introduce_video"><txv-video vid="g0935ztfovr" playerid="txv1"></txv-video></view>
		<view class="introduce_text1">当前： {{ city }} - {{ store }}</view>
		<view class="introduce_text nowrap1" v-html="intro"></view>
		<!-- <view class="introduce_title">本店手艺人</view>
		<view class="introduce_man">
			<view class="introduce_man_icon flex_column" v-for="(item, index) in staffList" :key="index">
				<view class="introduce_man_src">
					<image :src="item.staPhoto" mode="aspectFill" class="introduce_man_src"></image>
				</view>
				<view class="introduce_man_name">{{ item.staNickName }}</view>
				<view class="introduce_man_job">{{ item.pgJobName }}</view>
				
			</view>
		</view> -->
		<view class="tel">
			<text class="tel_number" @click="call">电话：{{ stoPhone }}</text>
			<view class="tel_icon_circle"><text class="tel_icon">&#xe612;</text></view>
		</view>
		<view class="address">地址：{{ address }}</view>
		<view>
			<view class="page-body">
				<view class="page-section page-section-gap">
					<map style="width: 80%; height: 200px; margin: 0 30px 30px 30px;" :latitude="latitude"
						:longitude="longitude" :markers="covers" @click="goLocation"></map>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: '',
				title: 'map',
				latitude: '',
				longitude: '',
				covers: [{
					latitude: '',
					longitude: '',
					iconPath: '../../static/location.png',
					width: 30,
					height: 30,
					title: ''
				}],
				city: '',
				store: '',
				storeMesg: {},
				staffList: [],
				intro: '',
				stoPhone: '',
				address: ''
			};
		},
		onReady: function(res) {
			this.videoContext = uni.createVideoContext('myVideo');
		},
		onLoad(e) {
			// console.log(e,'ssssssssss')
			var storeId = Number(e.storeId);
			// console.log(storeId,'55555')
			// this.city = uni.getStorageSync('province');
			// console.log(this.city)
			// this.store = uni.getStorageSync('city');
			uni.request({
				method: 'GET',
				url: getApp().globalData.url + '/applet/store/storeIntroduce',
				data: {
					storeId: storeId
				},
				success: res => {
					// console.log(res.data,'门店信息')
					this.storeMesg = res.data.storeList;
					// this.staffList = res.data.staffList
					console.log(this.storeMesg, '门店信息');
					// console.log(this.staffList,'手艺人信息')
					this.src = 'http://my.cloud.xmstruggle.com/' + this.storeMesg.stoTrailerImg;
					this.city = this.storeMesg.stoCity;
					this.store = this.storeMesg.stoName;
					this.intro = this.storeMesg.stoIntroduce;
					for (let i = 0; i < this.staffList.length; i++) {
						this.staffList[i].staPhoto = 'http://my.cloud.xmstruggle.com/' + this.staffList[i]
							.staPhoto;
					}
					this.stoPhone = this.storeMesg.stoPhone;
					this.address = this.storeMesg.stoProvince + this.storeMesg.stoCity + this.storeMesg
						.stoCounty + this.storeMesg.stoAddress;
					var a = [];
					a = this.storeMesg.stoMap.split(',');
					this.latitude = Number(a[0]);
					this.longitude = Number(a[1]);
					this.covers[0].latitude = Number(a[0]);
					this.covers[0].longitude = Number(a[1]);
					this.covers[0].title = this.storeMesg.stoName;
				},
				fail: err => {
					uni.showToast({
						title: '网络请求超时,请重试',
						icon: 'none'
					});
				}
			});
		},
		methods: {
			videoErrorCallback: function(e) {
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				});
			},
			call() {
				uni.makePhoneCall({
					phoneNumber: this.stoPhone
				});
			},
			goLocation(e) {
				uni.openLocation({
					longitude: Number(this.covers[0].longitude),
					latitude: Number(this.covers[0].latitude),
					name: this.covers[0].title,
					address: this.storeMesg.stoAddress
				});
			}
		}
	};
</script>

<style scoped>
	.introduce_text {
		width: 90%;
		font-size: 14px;
		text-align: left;
		margin: 16px auto;
		color: rgba(85, 85, 85, 1);
	}

	.nowrap1 {
		word-break: break-word;
	}

	.introduce_text1 {
		width: 90%;
		font-weight: bold;
		font-size: 16px;
		text-align: left;
		margin: 16px auto;
	}

	.introduce_title {
		/* width: 82px; */
		height: 24px;
		color: rgba(80, 80, 80, 1);
		font-size: 17px;
		line-height: 24px;
		text-align: center;
		font-weight: bold;
		margin: 0 auto;
		/* margin-bottom: 11px; */
	}

	.introduce_man {
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.introduce_man_icon {
		width: 30%;
		height: 185px;
		margin: 8px 1.5%;
	}

	.introduce_man_src {
		width: 100%;
		border-radius: 3px;
		height: 130px;
	}

	.introduce_man_name {
		color: #383838;
		font-size: 15px;
		font-weight: bold;
		text-align: center;
		margin: 10px 0 0px;
	}

	.introduce_man_job {
		color: #fff;
		font-size: 12px;
		width: 80px;
		height: 20px;
		line-height: 20px;
		text-align: center;
		background-color: #fb4b5c;
		margin: 5px auto;
	}

	.tel {
		display: flex;
		flex-direction: row;
		height: 34px;
		line-height: 34px;
		margin-left: 27px;
		margin: 50px 0 25px 27px;
	}

	.tel_icon {
		font-family: iconfont;
		width: 20px;
		font-size: 20px;
		color: rgba(255, 255, 255, 1);
	}

	.tel_icon_circle {
		width: 34px;
		height: 34px;
		color: rgba(80, 80, 80, 1);
		background-color: rgba(67, 207, 124, 1);
		border-radius: 18px;
		font-size: 7px;
		text-align: center;
		line-height: 34px;
		margin-left: 18px;
	}

	.address {
		color: rgba(80, 80, 80, 1);
		font-size: 13px;
		line-height: 150%;
		text-align: left;
		margin: 0 0 25px 27px;
	}
</style>