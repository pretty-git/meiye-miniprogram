<template>
	<view class="container">
		<!-- tab栏 -->
		<scroll-view class="scroll-view_H b-t b-b" scroll-x>
			<block v-for="(item,index) in dateArr" :key="index">
				<div class="flex-box" @click="selectDateEvent(index,item)" :style="{'box-shadow':index==dateActive ? 'inset 0 -2px 0 0 ' + '#FB4B5C' : ''}">
					<view class="date-box">
						<text  :style="{color:index==dateActive?selectedTabColor:'#333'}" style="font-weight: bold;">{{item.week}}</text>
						<text  :style="{color:index==dateActive?selectedTabColor:'#333'}">{{item.date}}</text>
					</view>
				</div>
			</block>
		</scroll-view>
		<!-- 时间选项 -->
			<view class="time-box">
				<block v-for="(item,_index) in timeArr" :key="_index">
					<view class="item">
						<view class="item-box" :class="{'disable':item.disable,'active':_index==timeActive}" :style="{background:_index==timeActive?'#fff':'#fff'}"  @click="selectTimeEvent(_index,item)">
							<text>{{item.time}}</text>
							<text class="all" v-if="item.disable">{{disableText}}</text>
							<text class="all" v-else>{{isdisableText}}</text>
						</view>
					</view>
				</block>
			</view>
		
	</view>
</template>

<script>
import {dateData,timeData,timeStamp} from '../../date.js'
export default {
	props:{
		//开始时间选项
		startTime:{
			type:String,
			default:'10:00'
		},
		//结束时间选项
		endTime:{
			type:String,
			default:'21:00'
		},
		//时间间隔
		timeInterval:{
			type:[Number,String],
			default:1 //一小时 
		},
		//选中的tab颜色
		selectedTabColor:{
			type:String,
			default:'#FB4B5C'
		},
	   //选中的时间颜色
		selectedItemColor:{
			type:String,
			default:'#fff'
		},
		//禁用显示的文本
		disableText:{
			type:String,
			default:'已约满'
		},
		isdisableText:{
			type:String,
			default:'可预约'
		},
		
	},
	data(){
		return{
			dateArr:[],//日期数据
			timeArr:[],//时间数据
			dateActive:0,//选中的日期索引
			timeActive:0,//选中的时间索引
			oldTimeActive:0,
			selectDate:'',//选择的日期数据
			selectTime:'',//选择的时间
			oldSelectTime:'',
			currentTimeStamp:'',
			currentTime:'',
			time1:'',
			time2:''
		}
	},
	async created() {
		await this.getTime()
	},
	// watch: {
	// 	//时间和定位弹窗
	// 	startTime(newValue, oldValue) {
	// 		//进行相应操作...
	// 		console.log('开始时间', newValue);
	// 		this.time1 = newValue
	// 	},   
	// 	endTime(newValue, oldValue) {
	// 		//进行相应操作...
	// 		console.log('结束时间', newValue);
	// 		this.time2 = newValue
	// 	},   
			   
	// },
	methods:{
		getTime() {
			this.startTime = uni.getStorageSync('starttime');
			this.endTime = uni.getStorageSync('endtime');
			this.appoTime = uni.getStorageSync('appoTime');
			console.log(this.startTime,this.endTime,'1111111')
			console.log(this.startTime,this.endTime,'已预约时间' )
			
			this.dateArr = dateData()
			//获取时间数据
			this.timeArr = timeData(this.startTime,this.endTime,this.timeInterval)
			//当前时间戳
			this.currentTimeStamp = Date.now()
			this.currentTime = timeStamp(this.currentTimeStamp).hour 
			for(var i = 0; i< this.timeArr.length;i++) {
				for(var j = 0; j< this.appoTime.length;j++) {
					if(this.timeArr[i].time==this.appoTime[j]){
						  this.timeArr[i].disable = 1  //判断当前时间大于时间选项则禁用
					}
				}
			}
			//默认选中的日期
			this.selectDate = `${this.dateArr[0]['date']}(${this.dateArr[0]['week']})` 
			this.timeArr.some((item,index)=>{
				this.selectTime = this.timeArr[index]['time'] //默认选中的时间  15:00
				this.oldSelectTime = this.timeArr[index]['time'] //存储选中的时间
				this.timeActive = index  //选中的时间索引
				this.oldTimeActive = index
				return !item.disable
			})
		},
		selectDateEvent(index,item){
			this.dateArr = dateData()
			//获取时间数据
			console.log(this.startTime,this.endTime,'1111111')
			this.timeArr = timeData(this.startTime,this.endTime,this.timeInterval)
			//当前时间戳
			for(var i = 0; i< this.timeArr.length;i++) {
					this.timeArr[i].disable = 0
			}
			this.currentTimeStamp = Date.now()
			this.currentTime = timeStamp(this.currentTimeStamp).hour 
			for(var i = 0; i< this.timeArr.length;i++) {
				for(var j = 0; j< this.appoTime.length;j++) {
					if(this.timeArr[i].time==this.appoTime[j]){
						  this.timeArr[i].disable = 1  //判断当前时间大于时间选项则禁用
					}
				}
			}
			//默认选中的日期
			this.selectDate = `${this.dateArr[0]['date']}(${this.dateArr[0]['week']})` 
			this.timeArr.some((item,index)=>{
				this.selectTime = this.timeArr[index]['time'] //默认选中的时间  15:00
				this.oldSelectTime = this.timeArr[index]['time'] //存储选中的时间
				this.timeActive = index  //选中的时间索引
				this.oldTimeActive = index
				return !item.disable
			})
			
			this.dateActive = index
			this.selectDate = `${this.dateArr[index]['date']}`   //
			this.$emit('selectTime',`${this.selectDate}`)
		},
		selectTimeEvent(index,item){
			if(item.disable)return
			this.timeActive = index
			this.selectTime = this.timeArr[index]['time']
			this.$emit('selectTime1',`${this.selectTime}`)
		}		
	}
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
