<template>
	<view class="bg">
		<view v-for="(item,index) in storeList" :key="index" class="list">
			<view class="font icon1"  >
				&#xe646;
			</view>
			<view class="name">
				{{item.name}}
			</view>
			<view class="icon">
				进店
			</view>
		</view>
	</view>
	
</template>
<script>
	export default {
		data() {
			return {
				storeList:[
					{
						src:'https://7765-we-63574e-1258830969.tcb.qcloud.la/mingzi/store1.jpg?sign=19b3a1c5421f62791392718118e81119&t=1565946224',
						name:'名资美业厦大店'
					},
					{
						src:'https://7765-we-63574e-1258830969.tcb.qcloud.la/mingzi/store1.jpg?sign=19b3a1c5421f62791392718118e81119&t=1565946224',
						name:'名资美业厦大店'
					},
					{
						src:'https://7765-we-63574e-1258830969.tcb.qcloud.la/mingzi/store1.jpg?sign=19b3a1c5421f62791392718118e81119&t=1565946224',
						name:'名资美业厦大店'
					},
					
				]
			}
		},
		methods:{
			
		}
	}
</script>


<style scoped>
	/* page {
		background-color: green !important;
	} */
	.bg {
	  background-color: #fff!important;
	  width: 100%;
	  height: 100%;
	  /* margin-bottom: 30px; */
	  
	}
	.list {
		width: 90%;
		margin: 0px auto;
		/* margin: 10px 0; */
		display: flex;
		flex-direction: row;
		height: 100px;
		line-height: 100px;
		border-bottom: 1px solid #f1f1f1;
		/* margin: 20px 0; */
	}
	.image {
		width: 67px;
		height: 67px;
		border-radius: 34px;
		margin: auto 0;
	}
	.image image {
		width: 67px;
		height: 67px;
		border-radius: 34px;
	}
	.name {
		color: rgba(80, 80, 80, 1);
		font-size: 14px;
		width: 65%;
		/* padding-left: 20px; */
	}
	.icon {
		width: 75px;
		height: 33px;
		color: #000;
		border: 1px solid #E5E5E5;
		border-radius: 16px;
		font-size: 14px;
		text-align: center;
		margin: auto 0;
		line-height: 33px;


	}
	.icon1 {
		font-size: 30px;
		color:#469DEB ;
		padding: 0 5%;
	}
</style>
