<template>
	<view class="page"><uni-steps :data="data" direction="column" :active="active" class=".uni-steps"></uni-steps>
	</view>
</template>

<script>
	import uniSteps from '@/components/uni-steps/uni-steps1.vue';
	export default {
		components: {
			uniSteps
		},
		data() {
			return {
				active: 0,
				refundtime: '',
				data: [{
						title: '提交退款申请',
						desc: '2018-11-12 '
					},
					{
						title: '退款处理',
						desc: '2018-11-12'
					},
					{
						title: '预计到账时间',
						desc: '2018-11-13'
					},
					{
						title: '退款成功',
						desc: '2018-11-14'
					}
				]
			};
		},
		onLoad(props) {
			var myDate = new Date();
			var y = myDate.getFullYear()
			var m = myDate.getMonth() + 1;
			m = m < 10 ? '0' + m : m;
			var d = myDate.getDate() + 3;
			d = d < 10 ? ('0' + d) : d;
			var h = myDate.getHours()
			h = h < 10 ? '0' + h : h;
			var m1 = myDate.getMinutes()
			m1 = m1 < 10 ? '0' + m1 : m1;
			var s = myDate.getSeconds()
			s = s < 10 ? '0' + s : s;
			var time = y + '-' + m + '-' + d + ' ' + h + ':' + m1 + ':' + s;
			console.log(props);
			this.active = new Number(props.status) + 1;
			this.refundtime = props.refundtime;
			this.data[0].desc = props.refundtime;
			this.data[1].desc = props.refundtime;
			this.data[2].desc = time;
			this.data[3].desc = time;
		},
		methods: {}
	};
</script>

<style scoped>
	.page {
		position: absolute;
		top: 0;
		background-color: #fff;
		width: 100%;
		height: 100%;
	}

	.uni-steps {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative;
		padding-left: 30%;
		padding-top: 20%;
	}
</style>