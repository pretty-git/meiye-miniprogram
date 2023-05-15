<template>
	<view class="">
	<view>
		<view class="goods-list">
			<view class="tis flex_column" v-if="goodsList.length==0">
				<view class="nomoreimage">
					<image :src="nomore" mode="aspectFill" class="nomore"></image>
				</view>
				<view class="" style="margin: auto;color: #a8a8a8;padding-top: 10px;">
					~购物车是空的哦~
				</view>
			</view>
            <view class="row" v-for="(row,index) in goodsList" :key="index" >
				
				<!-- 商品 -->
				<view class="carrier" :class="[theIndex==index?'open':oldIndex==index?'close':'']">
					<!-- checkbox -->
					<view class="checkbox-box" @tap="selected(index)">
						<view class="checkbox">
							<view :class="[row.selected?'on':'']"></view>
						</view>
					</view>
					<!-- 商品信息 -->
					<view class="goods-info" @tap="toGoods(row.goodsId)">
						<view class="img">
							<image :src="row.img" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="title">{{row.name}}</view>
							<view class="spec">{{row.spec}}</view>
							<view class="price-number">
								<view class="cartprice">￥{{row.price}}</view>
								<view class="number">
									<view class="sub" @tap.stop="sub(index)">
										<view class="icon jian font">&#xe644;</view>
									</view>
									<view class="input">
										<input type="number" v-model="row.number" @input="sum($event,index)" />
									</view>
									<view class="add"  @tap.stop="add(index)">
										<view class="icon jia font">&#xe641;</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
        </view>
		<!-- 脚部菜单 -->
		<view class="footer" :style="{bottom:footerbottom}">
			<view class="checkbox-box" @tap="allSelect">
				<view class="checkbox">
					<view :class="[isAllselected?'on':'']"></view>
				</view>
				<view class="text">全选</view>
			</view>
			<view class="delBtn" @tap="deleteList" v-if="selectedList.length>0">删除</view>
			<view class="settlement">
				<view class="sum">合计:<view class="money">￥{{sumPrice}}</view></view>
				<view class="btn" @click="saveall">结算({{selectedList.length}})</view>
			</view>
		</view>
	</view>

	</view>
</template>

<script>

	export default {
		data() {
			return {
				modalName: null,
				bussname:'名资美业',
				price:'￥789.00',
				bankcard:'招商银行信用卡(6666)',
				// 支付层
				sumPrice:'0.00',
				headerPosition:"fixed",
				headerTop:null,
				statusTop:null,
				showHeader:true,
				selectedList:[],
				isAllselected:false,
				goodsList:[],
				//控制滑动效果
				theIndex:null,
				oldIndex:null,
				isStop:false,
				nomore:'http://www.mescroll.com/img/mescroll-empty.png?v=1'
			}
		},
		onPageScroll(e){
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop>=0?"fixed":"absolute";
			this.headerTop = e.scrollTop>=0?null:0;
			this.statusTop = e.scrollTop>=0?null:-this.statusHeight+'px';
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
		    setTimeout(function () {
		        uni.stopPullDownRefresh();
		    }, 500);
			this.goodsList = uni.getStorageSync('shoppingcart');
		},
		onShow() {
			this.goodsList = uni.getStorageSync('shoppingcart');
			this.selectedList = []
		},
		onLoad() {
			
			//兼容H5下结算条位置
			// #ifdef H5
				this.footerbottom = document.getElementsByTagName('uni-tabbar')[0].offsetHeight+'px';
			// #endif
			// #ifdef APP-PLUS
			this.showHeader = false;
			this.statusHeight = plus.navigator.getStatusbarHeight();
			// #endif
			
		},
		onUnload() {
			console.log('销毁')
			uni.switchTab({
				url:'../me/me'
			})
		},
		methods: { 
			// 支付层
			 saveall() {
				 
				 if(this.selectedList.length<1){
				 	uni.showToast({
				 		title:'请选择商品结算',
				 		icon:'none'
				 	});
				 	return ;
				 }
				 else {        //结算后删除对应商品缓存
					var shoppingbagList = []
					var list = this.selectedList
					for(var i = 0; i < list.length; i++) {
						for(var j = 0; j < this.goodsList.length; j++) {
							if(list[i] == this.goodsList[j].goodsId) {
								shoppingbagList.push(this.goodsList[j])
							}
						}
					}
					console.log(shoppingbagList)
					uni.setStorageSync('productOrder',shoppingbagList)
					uni.navigateTo({
						url:'../myOrder/productstatement'
					})
				 }
				
			},
			hideModal(e) {
				this.modalName = null
			},
			//加入商品 参数 goods:商品数据
			// joinGoods(goods){
			// 	let len = this.goodsList.length;
			// 	let isFind = false;//是否找到ID一样的商品
			// 	for(let i=0;i<len;i++){
			// 		let row = this.goodsList[i];
			// 		if(row.shoppingTrolleyId==goods.shoppingTrolleyId )
			// 		{	//找到商品一样的商品
			// 			this.goodsList[i].number++;//数量自增
			// 			isFind = true;//找到一样的商品
			// 			break;//跳出循环
			// 		}
			// 	}
			// 	if(!isFind){
			// 		//没有找到一样的商品，新增一行到购物车商品列表头部
			// 		this.goodsList[i].unshift(goods);
			// 	}
			// 	uni.setStorageSync('shoppingcart',this.goodsList)
			// },
			//控制左滑删除效果-begin
			
			//商品跳转
			toGoods(e){
				console.log(e)
				uni.navigateTo({
					url: '../myOrder/commodity?id=' + e 
				});
			},
			// 删除商品s
			deleteList(){
				this.goodsList.forEach((item, index)=>{
					if(this.selectedList.includes(item.goodsId)) {
						if(item.shoppingTrolleyId) {
							uni.request({
								method: 'get',
								url: getApp().globalData.url + `/applet/shoppingtrolley/delShoppingTrolley/${item.shoppingTrolleyId}`,
								success: res => {
								},
								fail: (err) => {
									uni.showToast({
										title: '网络请求超时,请重试',
										icon: 'none'
									})
								}
							});
						}
						this.goodsList.splice(index, 1);
						
					}
				})
				uni.setStorageSync('shoppingcart',this.goodsList)	
				
			},
			// 选中商品
			selected(index){
				this.goodsList[index].selected = !this.goodsList[index].selected
				let i = this.selectedList.indexOf(this.goodsList[index].goodsId);
				i>-1?this.selectedList.splice(i, 1):this.selectedList.push(this.goodsList[index].goodsId);
				this.isAllselected = this.selectedList.length == this.goodsList.length;
				this.sum();
			},
			//全选
			allSelect(){
				let len = this.goodsList.length;
				let arr = [];
				for(let i=0;i<len;i++){
					this.goodsList[i].selected = this.isAllselected? false : true;
					arr.push(this.goodsList[i].goodsId);
				}
				this.selectedList = this.isAllselected?[]:arr;
				this.isAllselected = this.isAllselected||this.goodsList.length==0?false : true;
				this.sum();
				console.log(this.selectedList,'全选')
			},
			// 减少数量
			sub(index){
				if(this.goodsList[index].number<=1){
					return;
				}
				this.goodsList[index].number--;
				this.sum();
				uni.setStorageSync('shoppingcart',this.goodsList)
			},
			// 增加数量
			add(index){
				this.goodsList[index].number++;
				this.sum();
				uni.setStorageSync('shoppingcart',this.goodsList)
			},
			// 合计
			sum(e,index){
				this.sumPrice=0;
				let len = this.goodsList.length;
				for(let i=0;i<len;i++){
					if(this.goodsList[i].selected) {
						if(e && i==index){
							this.sumPrice = this.sumPrice + (e.detail.value*this.goodsList[i].price);
						}else{
							this.sumPrice = this.sumPrice + (this.goodsList[i].number*this.goodsList[i].price);
						}
					}
				}
				this.sumPrice = this.sumPrice.toFixed(2);
			},
			
			
		}
	}
</script>
<style lang="scss">
	page{position: relative;background-color: #f1f1f1;}
	.checkbox-box{
		display: flex;
		align-items: center;
		.checkbox{
				width: 35upx;
				height: 35upx;
				border-radius: 100%;
				border: solid 2upx #f06c7a;
				display: flex;
				justify-content: center;
				align-items: center;
			.on{
				width: 35rpx;
				height: 35rpx;
				border-radius: 100%;
				background-color: #f06c7a;
				border: 2px solid #fff;

			}
		}
		.text{
			font-size: 28upx;
			margin-left: 16upx;
		}
	}
	
.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		background-color: #fff;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height);//覆盖样式
		/*  #endif  */
	}
	.nomoreimage {
		width: 150px;
		height: 150px;
		margin: auto;
	}
	.nomore {
		width: 150px;
		height: 150px;
		
	}
	.header{
		width: 92%;
		padding: 0 4%;
		height: 100upx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #fff;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */
		.title{
			font-size: 36upx;
		}
		
	}
	.place{
		
		background-color: #ffffff;
		height: 100upx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}
	.goods-list{
		width: 100%;
		padding: 20upx 0 120upx 0;
		.tis{
			width: 100%;
		}
		.row{
			width: calc(92%);
			height: calc(22vw + 40upx); 
			margin: 20upx auto;
			
			border-radius: 15upx;
			box-shadow: 0upx 5upx 20upx rgba(0,0,0,0.1);
			display: flex;
			align-items: center;
			position: relative;
			overflow: hidden;
			z-index: 4;
			border: 0;
			.menu{
				.icon{
					color: #fff;
					// font-size: 25upx;
				}
				position: absolute;
				width: 30%;
				height: 100%;
				right: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: red;
				color: #fff;
				z-index: 2;
			}
			.carrier{
				@keyframes showMenu {
					0% {transform: translateX(0);}100% {transform: translateX(-30%);}
				}
				@keyframes closeMenu {
					0% {transform: translateX(-30%);}100% {transform: translateX(0);}
				}
				&.open{
					animation: showMenu 0.25s linear both;
				}
				&.close{
					animation: closeMenu 0.15s linear both;
				}
				background-color: #fff;
				.checkbox-box{
					padding-left: 20upx;
					flex-shrink: 0;
					height: 22vw;
					margin-right: 20upx;
				}
				position: absolute;
				width: 100%;
				padding: 0 0;
				height: 100%;
				z-index: 3;
				display: flex;
				align-items: center;

				.goods-info{
					width: 100%;
					display: flex;
					padding-right: 20upx;
					.img{
						width: 22vw;
						height: 22vw;
						border-radius: 10upx;
						overflow: hidden;
						flex-shrink: 0;
						margin-right: 10upx;
						image{
							width: 22vw;
							height: 22vw;
						}
					}
					.info{
						width: 100%;
						height: 22vw;
						overflow: hidden;
						display: flex;
						flex-wrap: wrap;
						position: relative;
						padding-left: 10px;
						.title{
							width: 100%;
							font-size: 28upx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							// text-align: justify;
							overflow: hidden;
							color: rgba(80, 80, 80, 1);
							font-weight: bold;
						}
						.spec{
							font-size: 20upx;
							color: #a7a7a7;
							display: flex;
							margin-bottom: 20px;
						}
						.price-number{
							position: absolute;
							width: 100%;
							bottom: 0upx;
							display: flex;
							justify-content: space-between;
							align-items: flex-end;
							font-size: 28upx;
							height: 60upx;
							.cartprice{
								color: #f06c7a;
							}
							.number{
								display: flex;
								justify-content: center;
								align-items: flex-end;
								padding-right: 10px;
								.input{
									width: 60upx;
									height: 60upx;
									margin: 0 10upx;
									background-color: #f3f3f3;
									input{
										width: 60upx;
										height: 60upx;
										display: flex;
										justify-content: center;
										align-items: center;
										text-align: center;
										font-size: 26upx;
									}
								}
								.sub ,.add{
									
									.icon{
										font-size: 22upx;
										width: 45upx;
										height: 45upx;
										font-weight: bold;
										display: flex;
										justify-content: center;
										align-items: center;
										
									}
								}
							}
						}
					}
				}
			}
		}
	}
	.footer{
		width: 100%;
		background-color: #fbfbfb;
		height: 100upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28upx;
		position: fixed;
		bottom: 0upx;
		z-index: 5;
		padding-left: 5%;
		.delBtn{
			border: solid 1upx #f06c7a;
			color: #f06c7a;
			padding: 0 30upx;
			height: 50upx;
			border-radius: 30upx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.settlement{
			width: 60%;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.sum{
				width: 50%;
				font-size: 28upx;
				margin-right: 10upx;
				display: flex;
				justify-content: flex-end;
				.money{
					font-weight: 600;
				}
			}
			.btn{
				padding: 0 19px;
				height: 52px;
				letter-spacing: 2px;
				background-color: #FB4B5C;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
	/* 支付层页面样式 */
	.cu-dialog {
			height: 270px;
			background-color: #fff;
		}
	.icon1 {
		font-family: iconfont;
		font-size: 29px;
		margin-right: 5px;
	}
	.bg-white {
		width: 100%;
		height: 50%;
	}
	.cu-bar .action2 {
		    font-size: 25px;
			position: absolute;
			left: 16px;
			top: 9px;
	}
	.password {
		position: absolute;
		top: 13px;
		right: 10px;
		color: rgba(153, 153, 153, 1);
		font-size: 16px;
	}
	.bg-white {
		height: 16px;
		/* border-bottom: 1px solid #e8e8e8; */
	}
	.padding-xl {
		width: 100%;
		height: 110px;
	}
	.busname {
		color: rgba(102, 102, 102, 1);
		font-size: 18px;
		margin: 0 auto;
	}
	.price {
		color: rgba(0, 0, 0, 1);
		font-size: 39px;
		margin-top: 20px;
	}
	.card {
		text-indent: 13px;
		color: rgba(128, 128, 128, 1);
		font-size: 17px;
	}
	.cu-btn1 {
		color: #ffffff;
		-webkit-box-shadow: 6rpx 6rpx 8rpx rgba(114, 130, 138, 0.2);
		box-shadow: 6rpx 6rpx 8rpx rgba(114, 130, 138, 0.2);
		border-radius: 6px;
		font-size: 18px;
		height: 45px;
		width: 90%;
		margin: 0 auto;
		line-height: 45px;
		text-align: center;
		margin-top: 35px;	
	}
</style>
