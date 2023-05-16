
let dataList = [{
				stoProvince: '上海市',
				stoCity: '嘉定区',
				stoName: '上海1店',
				storeId:1,
				stoMap: "31.23942430553564, 121.32068864117035",
				stoAddress: '万达1店'
			},{
				stoProvince: '上海市',
				storeId:2,
				stoCity: '杨浦区',
				stoName: '上海2店',
				stoMap: "31.301350820550038, 121.5132819123358",
				stoAddress: '万达2店'
			}]
var start = ''
var storeId = ''
var stoAddress = ''
let count = 0
let city = ''
let provin = ''
var stoName = ''
var mechanismId = ''
var max = 9999999999999999
/**
 * 计算经纬度之间的距离
 * @param {Object} lat1
 * @param {Object} lng1
 * @param {Object} lat2
 * @param {Object} lng2
 */
function getDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = lat1 * Math.PI / 180.0;
  var radLat2 = lat2 * Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
  s = s *6378.137 ;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s;
}
function getlocation() {
	uni.authorize({
		scope: 'scope.userLocation',
		success() {
			uni.getLocation({
				success: res => {
					location = `${res.longitude},${res.latitude}`
					uni.request({
						url: `https://restapi.amap.com/v3/geocode/regeo?key=c917407618fa20567d47ae5de6405fda&location=${res.longitude},${res.latitude}`,
						success(res) {
							console.log(res.data.regeocode.addressComponent, '城市')
							const {
								province,
								district,
								streetNumber
							} = res.data.regeocode.addressComponent
							start = streetNumber.location //开始的经纬度
							uni.setStorageSync('getLocation', `${start.split(',')[1]},${start.split(',')[0]}`); //经度
							uni.setStorageSync('province', province);
							city = district
							provin = province
							uni.setStorageSync('city', district);
							// 寻找最近的门店
							var book = 0
							getcount(book)
							uni.hideLoading()
						}
					})
				}
			})
		}
	})
};

function getcount(i) {
	// debugger
	if (i == dataList.length) {
		console.log('结束')
		if (count == 0) {
			uni.setStorageSync('location', dataList[0].stoAddress)
			uni.setStorageSync('locationname', dataList[0].stoName)
			uni.setStorageSync('storeId', dataList[0].storeId)
			uni.setStorageSync('mechanismId', dataList[0].stoMechanism)
			this.error('你附近没有门店哦,请手动选择')
		} else {
			uni.setStorageSync('mechanismId', mechanismId)
			uni.setStorageSync('location', stoAddress)
			uni.setStorageSync('locationname', stoName)
			uni.setStorageSync('storeId', storeId)
		}
		return
	}

	if (dataList[i].stoProvince == provin && dataList[i].stoCity == city) { //先选择同一个市的
		var that = this
		const distance = getDistance(start[1],start[0], dataList[i].stoMap[1],dataList[i].stoMap[0]);
		console.log(distance)
		if (distance < max) {
			max = distance
			stoAddress = dataList[i].stoAddress
			storeId = dataList[i].storeId
			stoName = dataList[i].stoName
			mechanismId = dataList[i].stoMechanism
		}
		count++;
		i++;
		getcount(i) //递归
	} else {
		i++;
		getcount(i)
	}

}
module.exports = {
	getlocation: getlocation
}