import Vue from 'vue'
import App from './App'
import Json from './Json' 
import x2js from 'x2js' //xml数据处理插件
import mpopup from './components/xuan-popup/xuan-popup.vue'
Vue.component('mpopup', mpopup)
const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
// Vue.component('cu-custom',cuCustom)
const json = type=>{
	//模拟异步请求数据
	return new Promise(resolve=>{
		setTimeout(()=>{
			resolve(Json[type]);
		}, 500)
	})
}
Vue.prototype.showToast = function(title){
	this.$refs.mpopup.open({
		type:'success',
		content:title,
		timeout:2000,
	});
}
Vue.prototype.error = function(title){
	if(!title) {
		title = '网络请求加载失败'
	}
	this.$refs.mpopup.open({
		type:'err',
		content:title,
		timeout:2000,
	});
}
const prePage = ()=>{
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}
Vue.config.productionTip = false
Vue.prototype.$api = {msg, json, prePage};

App.mpType = 'app'
Vue.prototype.url = 'http://192:168.0.23'
Vue.prototype.$x2js = new x2js()

const app = new Vue({
    ...App
})
app.$mount()
