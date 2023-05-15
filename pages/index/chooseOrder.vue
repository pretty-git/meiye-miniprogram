<template>
	<view>
		<form @submit="submits" report-submit='true'>
			<view class="top lr">
				<view class="image">
					<image :src="src" mode="aspectFill"></image>
				</view>
				<view class="name">
					{{name}}
				</view>
				<view class="label">
					{{pgJobName}}
				</view>
			</view>
			<checkbox-group @change="checkboxChange" class="radio-group" v-if="mustList.length">
				<label class="radio_click" v-for="(item,index) in mustList" :key="index">
					<view style="width: 80%;">
						<checkbox :value="item.serveId" :checked="item.checked" />
						<text style="margin-left: 10px;">{{item.serveName}}</text>
					</view>

					<view class="checkprice" style="width: 20%;">
						{{item.specialOffer}}元
					</view>
				</label>
			</checkbox-group>
			<view class="bottom">
				<view class="show_price">
					总价：{{allPrice1}}元
				</view>
				<button form-type="submit" type="default" size="mini" class="buybtn" @click="chooseTime">
					选择预约时间</button>
			</view>
		</form>
	</view>

</template>
<script>
	export default {
		data() {
			return {
				staffId: '',
				name: '托尼老师',
				pgJobName: '技术总监',
				src: '../../static/banner/31/jpg',
				allPrice: 0,
				allPrice1: 0,
				allPrice2: 0,
				projectId: '',
				mustList: [],
				userMsg: {},
				mechanismId: '',
				storeId: '',
				projectname: [],
			}
		},
		onLoad(props) {
			this.allPrice1 = 0;
			this.mustList = [{
				serveId: '1',
				serveName: '染发',
				checked: false,
				specialOffer: 199
			}, {
				serveId: '2',
				serveName: '打卷',
				checked: false,
				specialOffer: 99
			}, {
				serveId: '3',
				serveName: '拉直',
				checked: false,
				specialOffer: 299
			}]
			this.userMsg = uni.getStorageSync('user')
		},
		methods: {
			submits(e) {
				console.log(e.detail.formId);
			},
			checkboxChange: function(e) {
				console.log(e.mp.detail.value)
				var list = e.mp.detail.value;
				var all = 0
				var projectname = []
				for (var i = 0; i < list.length; i++) {
					for (var j = 0; j < this.mustList.length; j++) {
						if (this.mustList[j].serveId == Number(list[i])) {
							// console.log(this.mustList[j].suggestPrice,'22222')
							projectname.push(this.mustList[j].serveName)
							var a = Number(this.mustList[j].specialOffer);
							all += a;
						}
					}

				}
				this.projectname = projectname.join(",")
				this.projectId = list.join(",")
				this.allPrice1 = all;
				console.log(this.projectname, '1111111111')
				// this.allPrice = this.allPrice1 + this.allPrice2;
			},
			chooseTime() {
				// console.log((this.allPrice))
				var price = this.allPrice1;
				if (price == 0) {
					uni.showToast({
						title: '请选择项目',
						icon: 'none'
					})
				} else {
					uni.navigateTo({
						url: '../index/chooseTime'

					})
				}
			}
		}
	}
</script>


<style scoped>
	page {
		background-color: #F1F1F1;
	}

	.lr {
		padding: 0 17px;
	}

	.top {
		background-color: #FFFFFF;
		width: 100%;
		height: 55px;
		display: flex;
		flex-direction: row;
		line-height: 55px;
		margin: 14px 0;
	}

	.image {
		width: 44px;
		height: 44px;
		border-radius: 22px;
		margin-top: 5px;
	}

	.image image {
		width: 44px;
		height: 44px;
		border-radius: 22px;
	}

	.name {
		color: rgba(80, 80, 80, 1);
		font-size: 15px;
		font-weight: bold;
		margin-left: 12px;
		width: 54%;
	}

	.label {
		color: rgba(80, 80, 80, 1);
		font-size: 15px;
		margin-left: 20%;
		width: 100%;
	}

	/* 必选项 */
	.radio-group {
		background-color: #fff;
		width: 100%;
		margin: 10px 0;
	}

	.radio_click {
		display: flex;
		flex-direction: row;
		height: 55px;
		line-height: 55px;
		border-bottom: 1px solid #e8e8e8;
		margin: 0px 14px;

	}

	.price {
		font-size: 14px;
		width: 60%;
		text-align: right;
	}

	.checkprice {
		font-size: 14px;
		text-align: right;
		padding-right: 10px;
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
		width: 55%;
		height: 47px;
		color: #000;
		background-color: rgba(255, 255, 255, 1);
		font-size: 16px;
		line-height: 47px;
		text-align: center;
	}

	.buybtn {
		width: 45%;
		height: 47px;
		color: rgba(255, 255, 255, 1);
		background-color: #CA89FF;
		font-size: 16px;
		line-height: 47px;
		text-align: center;
	}

	form button {
		padding: 0;
	}

	form button::after {
		content: '';
		display: none;
	}
</style>