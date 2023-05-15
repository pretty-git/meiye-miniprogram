<template>
	<view class="body-view">
		<scroll-view class="top-menu-view" scroll-x="true" :scroll-left="scrollLeft">
			<block v-for="(menuTab, index) in classlist" :key="index">
				<view class="menu-one-view" v-bind:id="'tabNum' + index" @click="swichMenu(index)">
					<view :class="[currentTab == index ? 'menu-one-act' : 'menu-one']" style="display: flex;flex-direction: column;">
						<view class="menu-one-txt">{{ menuTab.classname }}</view>
						<!-- <view class="menu-one-bottom"> -->
					</view>
				</view>
			</block>
		</scroll-view>
		<swiper :current="currentTab" class="swiper-box-list" duration="300" @change="swiperChange">
			<swiper-item>
				<!-- 第一页个人档案-->
				<!-- 第一列 -->
				<view class="one">
					<view class="persrc">
						<view class="pertext">头像</view>
						<view class="persrcimage">
							<image :src="user.cusHeadPortrait" mode="aspectFill"></image>
						</view>
						<view class="font icon">&#xe604;</view>
					</view>
					<!-- 第二列 -->
					<view class="persrc">
						<view class="pertext">昵称</view>
						<view class="pernickname">{{ user.cusNickname }}</view>
						<view class="font icon">&#xe604;</view>
					</view>
					<!-- 真实姓名修改框 -->
					<view class="cu-modal" :class="modalName == 'Modal' ? 'show' : ''">
						<view class="alter">
							<view class="cu-bar bg-white justify-end">
								<input type="text" v-model="name" @change="alter_pertruename" />
							</view>
							<view class="alterbtn" @tap="update('name')">提交</view>
							<view class="alterbtn" @tap="hideModal()">取消</view>
						</view>
					</view>
					<!-- 第三列 -->
					<view class="persrc" @tap="showModal" data-target="Modal">
						<view class="pertext">真实姓名</view>
						<view class="pernickname">{{ user.cusName }}</view>
						<view class="font icon">&#xe604;</view>
					</view>
					<!-- 第四列 -->
					<view class="persrc">
						<view class="pertext">性别</view>
						<view class="pernickname">
							<text>{{user.cusSex==0?'未知':user.cusSex == 1?'男':'女'}} </text>
						</view>
						<view class="font icon">&#xe604;</view>
					</view>
					<!-- 第五列 -->
					<view class="persrc" @click="openDatetimePicker">
						<view class="pertext">生日</view>
						<view class="pernickname">{{user.cusBirthday|formatTime}}</view>
						<view class="font icon">&#xe604;</view>
					</view>
					<!-- 联系方式 -->
					<view class="cu-modal" :class="modalName == 'Modal3' ? 'show' : ''">
						<view class="alter">
							<view class="cu-bar bg-white justify-end">
								<input type="text" v-model="pertel" @change="alter_per" />
							</view>
							<view class="alterbtn" @tap="update('phone')">提交</view>
							<view class="alterbtn" @tap="hideModal()">取消</view>
						</view>
					</view>

					<!-- 第六列 -->
					<view class="persrc" data-target="Modal3" @tap="showModal">
						<view class="pertext">联系方式</view>
						<view class="pernickname">{{ user.cusPhone }}</view>
						<view class="font icon">&#xe604;</view>
					</view>
					<!-- 真实姓名修改框 -->
					<view class="cu-modal" :class="modalName == 'Modal1' ? 'show' : ''">
						<view class="alter">
							<view class="cu-bar bg-white justify-end">
								<input type="text" v-model="birthday" @change="alter_pertel" />
							</view>
							<view class="alterbtn" @tap="update('birthday')">提交</view>
							<view class="alterbtn" @tap="hideModal()">取消</view>
						</view>
					</view>
					<!-- 第七列 -->
					<view class="persrc" @click="complaints">
						<view class="pertext">投诉建议单</view>
						<view class="font icon">&#xe604;</view>
					</view>
				</view>
			</swiper-item>
			<!-- 生日修改器 -->
			<simple-datetime-picker ref="myPicker" @submit="handleSubmit" :start-year="1950" :end-year="2030" color="#488ee9"></simple-datetime-picker>
			<!-- 第二页美丽 archives是档案 -->
			<swiper-item>
				<mescroll-uni :down="downOption" @down="downCallback" @up="upCallback" :fixedTop='fixedTop'>
					<scroll-view class="swiper-one-list" scroll-y="true">
						<view class="" v-if="archiveslist.length == 0" style="text-align: center;margin: 20px 0;">
							暂无数据~
						</view>
						<view class="archives" v-for="(item, index) in archiveslist" :key="index" @click="personal_Archievs(item.orderId)">
							<view class="archivesimage">
								<image :src="item.stoLogoImg" mode="aspectFill"></image>
							</view>
							<view class="archivesright">
								<view class="archivesstorename">服务门店:{{ item.storeName }}</view>
								<view class="archivestime">服务时间:{{ item.createDate }}</view>
								<view class="archivescraftman">手艺人:{{ item.staffName }}</view>
							</view>
						</view>
					</scroll-view>
				</mescroll-uni>
			</swiper-item>
			<swiper-item>
				<!-- 第三页美丽定制 -->
				<scroll-view class="swiper-one-list" scroll-y="true">
					<view class="" v-if="customlist.length == 0" style="text-align: center;margin: 20px 0;">
						暂无数据~
					</view>
					<view v-for="(item, index) in customlist" :key="index" class="custom" @click="personalCustom(item.customizationId)">
						<view class="customname">{{ item.activeRule }}</view>
						<view class="customtime">{{ item.createTime }}</view>
						<view class="font icon">&#xe604;</view>
					</view>
				</scroll-view>
			</swiper-item>

			<!-- /* 第四页关联用户 */ -->
			<swiper-item>
				<scroll-view class="swiper-one-list" scroll-y="true">
					<view class="userlist" v-for="(item, index) in userlist" :key="index">
						<view class="usersrc">
							<image :src="item.src" mode="aspectFill"></image>
						</view>
						<view class="usermiddle">
							<view class="username">{{ item.name }}</view>
							<view class="usertime">{{ item.time }}</view>
						</view>
						<view class="userright">
							<view class="finish">已到账收益:{{ item.finish }}</view>
							<view class="will">即将到账收益:{{ item.will }}</view>
						</view>
						<view class="font icon1">&#xe604;</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>
<script>
	import simpleDatetimePicker from '../../components/buuug7-simple-datetime-picker/simple-datetime-picker.vue'
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	export default {
		components: {
			simpleDatetimePicker,
			MescrollUni
		},
		data() {
			return {
				downOption: {
					auto: false //是否在初始化后,自动执行下拉回调callback; 默认true
				},
				fixedTop: 300,
				type: "",
				total: 0,
				upOption: {
					use: true, // 是否启用上拉加载; 默认true
					auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无相关数据'
					}
				},
				birthday: "请完善生日信息",
				modalName: null,
				scrollLeft: 0,
				isClickChange: false,
				currentTab: 0,
				scrollHeight: 0,
				user: {},
				classlist: [{
						id: 0,
						classname: '个人档案'
					},
					{
						id: 1,
						classname: '美丽档案'
					},
					{
						id: 2,
						classname: '美丽定制'
					},
					{
						id: 3,
						classname: '关联用户'
					}
				],

				persrc: '',
				pernickname: '',
				pertruename: '',
				persex: '男',
				pertel: '',
				archiveslist: [],
				customlist: [],
				userlist: [],
				name: '',
				phone: ''
			};
		},

		onShow() {
			this.getAll()
		},
		filters: {
			formatTime(time) {
				var date = new Date(time)
				var seperator1 = '-'
				var year = date.getFullYear()
				var month = date.getMonth() + 1
				var strDate = date.getDate()
				var hour = date.getHours()
				var min = date.getMinutes()
				var second = date.getSeconds()
				if (month >= 1 && month <= 9) {
					month = '0' + month
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = '0' + strDate
				}
				if (hour >= 1 && hour <= 9) {
					hour = '0' + hour
				}
				if (min >= 0 && min <= 9) {
					min = '0' + min
				}
				if (second >= 1 && second <= 9) {
					second = '0' + second
				}
				var currentdate = year + seperator1 + month + seperator1 + strDate
				return currentdate
			}
		},
		methods: {
			getAll() {
				uni.request({
					url: getApp().globalData.url + `/applet/customer/selectBackstageCustomerByCustomerId/${uni.getStorageSync('user').customerId}`,
					method: 'GET',
					header: {
						"Content-Type": "application/json"
					},
					success: (res) => {
						console.log(res)
						this.user = res.data.data
					},
					fail: (err) => {
						uni.showToast({
							title: '网络请求超时,请重试',
							icon: 'none'
						})
					}
				})
			},
			update(val) {
				var data = {}
				if (val === 'name') {
					if (this.name === '') {
						uni.showToast({
							title: '请输入真实姓名!',
							icon: 'none'
						})
						return
					}
					data = {
						cusName: this.name,
						openId: uni.getStorageSync('openId')
					}
				} else {
					if (this.phone === '') {
						uni.showToast({
							title: '请输入手机号码!',
							icon: 'none'
						})
						return
					}
					data = {
						cusPhone: this.phone,
						openId: uni.getStorageSync('openId')
					}
				}
				this.updateData(data)
			},
			// 打开picker
			openDatetimePicker() {
				this.$refs.myPicker.show();
			},
			updateData(data) {
				//val  {}
				uni.request({
					url: getApp().globalData.url + '/applet/customer/editSave',
					method: 'POST',
					header: {
						"Content-Type": "application/json"
					},
					data: data,
					success: (res) => {
						if (res.data.result === 'success') {
							uni.showToast({
								title: '修改成功!',
								icon: 'none'
							})
							this.getAll()
							this.modalName = null;
						} else {
							uni.showToast({
								title: '修改失败!',
								icon: 'none'
							})
						}
					},
					fail: (err) => {
						uni.showToast({
							title: '网络请求超时,请重试',
							icon: 'none'
						})
					}
				})
			},
			// 关闭picker
			closeDatetimePicker() {
				this.$refs.myPicker.hide();
			},

			// 监听选择
			handleSubmit(e) {
				this.birthday = `${e.year}-${e.month}-${e.day}`;
				let data = {
					openId: uni.getStorageSync('openId'),
					cusBirthday: this.birthday
				}

				this.updateData(data)
			}, //修改生日


			BackPage() {
				if (getCurrentPages().length < 2 && 'undefined' !== typeof __wxConfig) {
					let url = '/' + __wxConfig.pages[0];
					return uni.redirectTo({
						url
					});
				}
				uni.navigateBack({
					delta: 1
				});
			},
			/*下拉刷新的回调 */
			downCallback(mescroll) {
				mescroll.resetUpScroll();
			},
			/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
			upCallback(mescroll) {
				let pageNum = mescroll.num; // 页码, 默认从1开始
				let pageSize = mescroll.size; // 页长, 默认每页10条
				uni.request({
					method: 'POST',
					url: getApp().globalData.url + '/applet/order/profileListView',
					data: {
						customerId: uni.getStorageSync('user').customerId,
						// customerId:51,
						pageNumber: pageNum,
						pageCount: pageSize
					},
					header: {
						"Content-Type": "application/x-www-form-urlencoded" //如果为空，加上头部接收     
					},
					success: (res) => {
						console.log(res, '年费卡')
						if (res.data.code == '查询无数据') {
							this.archiveslist = []
							mescroll.endErr()
							return;
						}
						// 接口返回的当前页数据列表 (数组)
						for (var i = 0; i < res.data.rows.length; i++) {
							res.data.rows[i].stoLogoImg = 'http://my.cloud.xmstruggle.com/' + res.data.rows[i].stoLogoImg
						}
						let curPageData = res.data.rows;
						// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
						if (res.data.total % 10 == 0) {
							let totalPage = res.data.total / 10;
						} else {
							let totalPage = res.data.total / 10 + 1;
						}
						// 接口返回的总数据量(比如列表有26个数据,每页10条,共3页; 则totalSize值为26)
						let totalSize = res.data.total;
						// 接口返回的是否有下一页 (true/false)
						if (res.data.pageCount == pageNum) {
							let hasNext = false;
						} else {
							let hasNext = true;
						}
						//设置列表数据
						if (mescroll.num == 1) this.archiveslist = []; //如果是第一页需手动置空列表
						this.archiveslist = this.archiveslist.concat(curPageData); //追加新数据

						mescroll.endBySize(curPageData.length, totalSize);


						// 如果数据较复杂,可等到渲染完成之后再隐藏下拉加载状态: 如
						this.$nextTick(() => {
							mescroll.endSuccess(curPageData.length)
						})

						//curPageData.length必传的原因:
						// 1. 使配置的noMoreSize 和 empty生效
						// 2. 判断是否有下一页的首要依据: 
						//    当传的值小于page.size时(说明不满页了),则一定会认为无更多数据;
						//    比传入的totalPage, totalSize, hasNext具有更高的判断优先级;
						// 3. 当传的值等于page.size时,才会取totalPage, totalSize, hasNext判断是否有下一页
						// 传totalPage, totalSize, hasNext目的是避免方法四描述的小问题
					},
					fail: () => {
						// 失败隐藏下拉加载状态
						mescroll.endErr()
						uni.showToast({
							title: '网络加载失败',
							icon: 'none'
						})
					}
				})
			},
			swichMenu(current) {
				// console.log(current,'11')
				//点击其中一个 menu
				if (this.currentTab == current) {
					return false;
				} else {
					this.currentTab = current;
					this.setScrollLeft(current);
				}
			},
			swiperChange(e) {
				let index = e.target.current;
				this.setScrollLeft(index);
				this.currentTab = index;
				console.log(index)
				var customerId = uni.getStorageSync('user').customerId
				// var customerId =  51
				if (index == 2) {
					uni.request({ //获取购物券GET
						method: 'GET',
						url: getApp().globalData.url + `/applet/customer/findCustomizationInfoByCustomerId/${customerId}`,
						success: (res) => {
							console.log(res)
							this.customlist = res.data
						},
						fail: (err) => {
							uni.showToast({
								title: '网络请求超时,请重试',
								icon: 'none'
							})
						}
					})
				} else if (index == 1) {
					uni.request({ //获取购物券
						method: 'POST',
						url: getApp().globalData.url + '/applet/order/profileListView',
						data: {
							customerId: uni.getStorageSync('user').customerId,
							pageNumber: 1,
							pageCount: 10
						},
						header: {
							"Content-Type": "application/x-www-form-urlencoded" //如果为空，加上头部接收     
						},
						success: (res) => {
							console.log(res)
							if (res.data.code == '查询无数据') {
								this.archiveslist = []
								return;
							}
							this.archiveslist = res.data.rows
						},
						fail: (err) => {
							uni.showToast({
								title: '网络请求超时,请重试',
								icon: 'none'
							})
						}
					})
				}
			},
			setScrollLeft: async function(tabIndex) {
				let leftWidthSum = 0;
				for (var i = 0; i <= tabIndex; i++) {
					let nowElement = await this.getWidth('tabNum' + i);
					leftWidthSum = leftWidthSum + nowElement.width;
				}
				let winWidth = uni.getSystemInfoSync().windowWidth;
				this.scrollLeft = leftWidthSum > winWidth ? leftWidthSum - winWidth : 0;
			},
			getWidth: function(id) {
				//得到元素的宽高
				return new Promise((res, rej) => {
					uni.createSelectorQuery()
						.select('#' + id)
						.fields({
								size: true,
								scrollOffset: true
							},
							data => {
								res(data);
							}
						)
						.exec();
				});
			},
			showModal(e) {
				this.name = this.user.cusName
				this.modalName = e.currentTarget.dataset.target;
			},
			showModal1(e) {
				console.log('show');
				this.modalName = e.currentTarget.dataset.target;
			},
			hideModal(e) {
				this.modalName = null;
			},
			alter_pertruename(e) {
				console.log(this.pertruename);
			},
			alter_per(e) {
				console.log(e)
				this.phone = e.detail.value
			},
			alter_pertel(e) {
				console.log(this.pertel);
			},
			complaints() {
				uni.navigateTo({
					url: '../me/complaints'
				});
			},
			personal_Archievs(id) {
				uni.navigateTo({
					url: '../me/personalArchives?orderId=' + id
				});
			},
			personalCustom(item) {
				getApp().globalData.customizationId = item
				uni.navigateTo({
					url: '../me/personalCustom'
				});
			}
		}
	};
</script>

<style scoped>
	/* 顶部nav导航栏begin */
	.menu-one-view image {
		width: 65px;
		height: 45px;
		border-radius: 23px;
	}

	page {
		width: 100%;
		height: 100%;
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: center;
		background: rgba(249, 249, 249, 1);
	}

	.body-view {
		display: flex;
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		height: 100%;
		width: 100%;
		/* 	position: absolute;
	top: 0; */
		background-color: #fff !important;

		align-items: flex-start;
		justify-content: center;
	}

	.top-menu-view {
		position: fixed;
		top: 0;
		display: flex;
		white-space: nowrap;
		width: 100%;
		background-color: #ffffff;
		height: 65px;
		z-index: 9999;
		/* 在这里设置导航条高度 */
		border-bottom: 2px solid #f1f1f1;
		padding-right: 15px;
	}

	.top-menu-view .menu-one-view {
		display: inline-block;
		white-space: nowrap;
		/* height: 100%; */
		width: 25%;
	}

	.top-menu-view .menu-one-view .menu-one {
		/* 在这里写 单个按钮样式 */
		margin: 0px 12px 18px 22px;
		position: relative;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 65px;
	}

	.top-menu-view .menu-one-view .menu-one .menu-one-txt {
		height: 38px;
		font-size: 30rpx;
		font-weight: 400;
		line-height: 38px;
		margin-top: 10px;
	}

	.top-menu-view .menu-one-view .menu-one .menu-one-bottom {
		position: absolute;
		bottom: 0;
		width: 100%;
	}

	.top-menu-view .menu-one-view .menu-one .menu-one-bottom .menu-one-bottom-color {
		width: 100%;
		height: 4upx;
	}

	.top-menu-view .menu-one-view .menu-one-act {
		/* 在这里写 单个按钮样式 */
		margin: 12px 12px 18px 22px;
		position: relative;
		height: 100%;
		width: 65px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom: 3px solid #E94A59;
	}

	.top-menu-view .menu-one-view .menu-one-act .menu-one-txt {
		height: 30px;
		font-size: 30upx;
		font-weight: 400;
		line-height: 40upx;
		margin-top: 10px;
	}

	.top-menu-view .menu-one-view .menu-one-act .menu-one-bottom {
		position: absolute;
		bottom: 0;
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.top-menu-view .menu-one-view .menu-one-act .menu-one-bottom .menu-one-bottom-color {
		width: 60%;
		height: 4upx;
		background: rgba(0, 170, 255, 1);
	}

	.swiper-box-list {
		flex: 1;
		width: 100%;
		height: 100%;
		background-color: #ffffff;
		position: absolute;
		top: 65px;
	}

	.swiper-one-list {
		/* margin-top: 60px; */
		height: 100%;
		width: 100%;
		/* margin-bottom: 600px; */
		overflow: auto;
	}

	/* 顶部nav  end */
	/* 第一页个人档案 */
	.one {
		width: 100%;
		padding: 0 20px;
	}

	.persrc {
		width: 100%;
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid #f1f1f1;
		line-height: 66px;
		padding: 7px 0;
	}

	.pertext {
		width: 25%;
		/* margin-left: 60%; */
		color: rgba(80, 80, 80, 1);
		font-size: 16px;
		position: relative;
	}

	.persrcimage {
		width: 60px;
		height: 60px;
		margin: auto 0;
		margin-left: 46%;
		border-radius: 34px;
	}

	.persrcimage image {
		width: 60px;
		height: 60px;
		border-radius: 34px;
	}

	.alter {
		position: relative;
		display: inline-block;
		vertical-align: middle;
		height: 18%;
		background-color: #fff;
		border-radius: 5px;
		width: 71%;
		overflow: hidden;
	}

	.alter input {
		border-bottom: 2px solid #e8e8e8;
		margin: 0 auto;
		margin-top: 20px;
	}

	.icon {
		font-size: 32px;
		position: absolute;
		right: 3%;
		color: rgba(153, 153, 153, 1);
	}

	.alterbtn {
		width: 40%;
		margin: 0 5%;
		height: 30px;
		float: left;
		color: rgba(255, 255, 255, 1);
		box-shadow: 3px 3px 4px rgba(204, 69, 59, 0.2);
		background-color: #e54d42;
		border-radius: 13px;
		font-size: 13px;
		line-height: 30px;
		margin-top: 25px;
	}

	.pernickname {
		color: rgba(154, 154, 154, 1);
		font-size: 15px;
		width: 60%;
		text-align: right;
	}

	/* 第二页美丽档案 */
	.archives {
		display: flex;
		flex-direction: row;
		width: 90%;
		margin: 0 auto;
		border-bottom: 1px solid #f1f1f1;
		height: 120px;
	}

	.archivesimage {
		width: 120px;
		height: 83px;
		border-radius: 1px;
		margin: auto 0;
	}

	.archivesstorename {
		font-weight: bold;
	}

	.archivesimage image {
		width: 120px;
		height: 83px;
		border-radius: 1px;
	}

	.archivesright {
		display: flex;
		flex-direction: column;
		width: 50%;
		text-align: left;
		color: rgba(80, 80, 80, 1);
		font-size: 14px;
		margin: auto 0;
		margin-left: 10%;
		letter-spacing: 1px;
	}

	.archivestime {
		margin: 6px 0;
	}

	/* 第三页美丽定制 */
	.custom {
		display: flex;
		flex-direction: row;
		height: 60px;
		line-height: 60px;
		border-bottom: 1px solid #f1f1f1;
		padding: 0 20px;
	}

	.customname {
		font-size: 14px;
		width: 50%;
		padding-left: 5%;
		text-align: left;
	}

	.customtime {
		color: rgba(166, 166, 166, 1);
		font-size: 14px;
		width: 40%;
		text-align: right;
	}

	/* 第四页关联用户 */
	.userlist {
		display: flex;
		flex-direction: row;
		height: 85px;
		/* line-height: 85px; */
		width: 90%;
		margin: 0 auto;
		border-bottom: 1px solid #f1f1f1;
	}

	.usersrc {
		margin: auto 0;
		width: 60px;
		height: 60px;
		border-radius: 36px;
	}

	.usersrc image {
		width: 60px;
		height: 60px;
		border-radius: 36px;
	}

	.usermiddle {
		margin: auto 0;
		width: 33%;
		letter-spacing: 1px;
		text-align: center;
	}

	.userright {
		letter-spacing: 1px;
		margin: auto 0;
		width: 44%;
	}

	.usertime {
		margin-top: 8px;
	}

	.will {
		margin-top: 5px;
	}

	.icon1 {
		margin: auto 0;
		font-size: 28px;
		text-align: right;
	}
</style>
