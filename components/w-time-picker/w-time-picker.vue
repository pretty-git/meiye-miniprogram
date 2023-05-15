<template>
	<view class="w-time-picker" :class="{'show':showTimePicker}">
		<view class="w-time-days">
			<scroll-view scroll-x>
				<view class="w-time-scroll">
					<view class="w-time-day" :style="{'color':tabIndex==index?theme:'#333','border-color':tabIndex==index?theme:'#ddd'}" 
					v-for="(day,index) in dayList" :key="index" @tap="toggleIndex(day,index)">
						<view class="w-time-week">{{day.week}}</view>
						<view class="w-time-date">{{day.month}}/{{day.day}}</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="w-time-body">
			<scroll-view scroll-y class="w-time-list-scroll">
				<view class="w-time-list">
					<view class="w-time-item" :style="{'color':itemIndex==index?theme:'#333','border-color':itemIndex==index?theme:'#ddd'}"
					 :class="{'w-time-item-active':!item.disabled}" v-for="(item,index) in timeList" :key="index" @tap="toggleItem(item,index)">{{item.label}}</view>
				</view>
			</scroll-view>
		</view>
		<view class="tel">
			<view class="number" style="text-align: left;">
				预留手机号
			</view>
			<view class="number" style="text-align: right;padding-right: 5%;">
				13305016633
			</view>
		</view>
		<view class="w-time-footer">
			<view class="w-time-cancel w-time-btn" >预约时间:{{ordertime}}</view>
			<view class="w-time-sure w-time-btn" :style="{'background-color':theme}" @tap="submit">确认预约</view>
		</view>
	</view>
</template>

<script>
	let _this=null;
	export default {
		props:{
			afterDays:{
				type:[String,Number],
				default:7
			},
			startHour:{
				type:[String,Number],
				default:7
			},
			endHour:{
				type:[String,Number],
				default:22
			},
			step:{
				type:[String,Number],
				default:30
			},
			afterHours:{
				type:[String,Number],
				default:2
			},
			theme:{
				type:String,
				default:"#f5a200"
			},
			// tel:{
			// 	type:Number,
			// 	default:"13305016633"
			// }
		},
		data() {
			return {
				dayList:[],
				timeList:[],
				tabIndex:0,
				itemIndex:-1,
				showTimePicker:true,
				time:"",
				orderyear:'',
				ordertime:''
			}
		},
		created(){
			this.startHour =uni.getStorageSync('starttime');
			this.endHour = uni.getStorageSync('endtime');
			this.step = uni.getStorageSync('step');
			console.log(this.dayList)
			_this=this;
			_this.initPicker();
			_this.initHours();
			
		},
		methods:{
			
			submit(){
				if(_this.time!=""){
					let tabItem=_this.dayList[_this.tabIndex];
					let result=tabItem.year+"-"+tabItem.month+"-"+tabItem.day+" "+_this.time.label+":00";
					_this.$emit("confirm",result);
					_this.showTimePicker=false;
				}
			},
			toggleIndex(item,index){
				this.orderyear = item.year + '-'+ item.month + '-' + item.day;
				console.log(item,index,'11111111111111')
				_this.tabIndex=index;
				_this.itemIndex=-1;
				_this.initHours(!item.isToday);
			},
			toggleItem(item,index){
				if(!item.disabled){
					_this.itemIndex=index;
					_this.time=item;
				}
				
				this.ordertime = this.orderyear +' ' + item.label
				console.log(item,'5566699')
			},
			forMatNumber(n){
				return n<10?'0'+n:n
			},
			initHours(flag){
				this.orderyear = this.dayList[0].year + '-'+ this.dayList[0].month + '-' + this.dayList[0].day;
				let aDate=new Date();
				let curHour=aDate.getHours();
				_this.timeList=[];
				for(let j=_this.startHour*1;j<=_this.endHour*1;j++){
					for(let k=0;k<60;k+=_this.step*1){
						if(flag){
							_this.timeList.push({
								label:_this.forMatNumber(j)+":"+_this.forMatNumber(k),
								disabled:false
							});
						}else{
							_this.timeList.push({
								label:_this.forMatNumber(j)+":"+_this.forMatNumber(k),
								disabled:curHour+_this.afterHours<j?false:true
							});
						}
					}
				};
			},
			initPicker(){
				let aDate=new Date();
				let weekList=["周日","周一","周二","周三","周四","周五","周六"];
				_this.dayList.push({
					year:aDate.getFullYear(),
					month:_this.forMatNumber(aDate.getMonth()+1),
					day:_this.forMatNumber(aDate.getDate()),
					week:weekList[aDate.getDay()],
					isToday:true
				})
				for(let i=1;i<_this.afterDays*1;i++){
					aDate.setDate(aDate.getDate()+1);
					_this.dayList.push({
						year:aDate.getFullYear(),
						month:_this.forMatNumber(aDate.getMonth()+1),
						day:_this.forMatNumber(aDate.getDate()),
						week:weekList[aDate.getDay()],
						isToday:false
					})
				};
			}
		}
	}
</script>

<style lang="scss">
	.w-time-picker.show{
		transform: translate3d(0,0,0);
	}
	.w-time-picker{
		position: fixed;
		left:0;
		top:0;
		width: 100%;
		height: 100%;
		z-index: 9999;
		background-color:#f5f5f5;
		display: flex;
		flex-direction: column;
		transform: translate3d(100%,0,0);
		transition: all 0.3s ease;
		.tel {
			width: 100%;
			height: 50px;
			background-color: #FFFFFF;
			display: flex;
			flex-direction: row;
			padding: 0 15px;
			margin-top: 10px;
			
		}
		.number {
			margin: auto 0;
			color: rgba(80, 80, 80, 1);
			font-size: 15px;
			width: 50%;
		}
		.logo {
			height: 200upx;
			width: 200upx;
			margin-top: 200upx;
			
		}
		
		.title {
			font-size: 36upx;
			color: #8f8f94;
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
				width: 70%;
				height: 47px;
				color: #505050;
				background-color: rgba(255, 255, 255, 1);
				font-size: 15px;
				line-height: 47px;
				text-align: center;
			}
			.buybtn {
				width: 30%;
				height: 47px;
				color: rgba(255, 255, 255, 1);
				background-color: #CA89FF;
				font-size: 15px;
				line-height: 47px;
				text-align: center;
			}
		.w-time-days{
			overflow: hidden;
			padding:20upx 0;
			background-color: #fff;
			.w-time-scroll{
				white-space: nowrap;
			}
			.w-time-day{
				display: inline-block;
				width: 120upx;
				text-align: center;
				border:solid 1px #ddd;
				margin:0 20upx;
				border-radius: 6upx;
				padding:10upx 0;
				color:#333;
				.w-time-week{
					font-size: 28upx;
					line-height: 1;
				}
				.w-time-date{
					font-size: 24upx;
					line-height: 1;
					margin-top: 10upx;
				}
			}
			.w-time-day-active{
				color:#f00;
				border-color:#f00;
			}
		}
		.w-time-body{
			flex:1;
			overflow: hidden;
			.w-time-list-scroll{
				height: 100%;
			}
			.w-time-list{
				display: flex;
				flex-wrap: wrap;
				padding:20upx 10upx;
			}
			.w-time-item{
				width: 120upx;
				height: 64upx;
				line-height: 64upx;
				margin:0 10upx 20upx;
				text-align: center;
				border:solid 1px #ddd;
				border-radius: 6upx;
				font-size: 28upx;
				transition: all 0.3s ease;
			}
			.w-time-item-active{
				background-color: #fff;
			}
		}
		.w-time-footer{
			height: 88upx;
			display: flex;
			background-color: #fff;
			.w-time-btn{
				flex:1;
				text-align: center;
				line-height: 88upx;
				font-size: 30upx;
			}
			.w-time-sure{
				background-color: #f00;
				color:#fff;
			}
		}
	}
</style>
