<template>
	<view class="content">
		<view class="navbar">
			<view v-for="(faitem, index) in menuTabs" :key="index" class="nav-item"
				:class="{ current: tabCurrentIndex === index }" @click="tabClick(index)">{{ faitem }}</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<!-- @change="changeTab" -->
			<!-- 待服务-->
			<swiper-item>
				<scroll-view class="list-scroll-content" scroll-y>
					<!-- @scrolltolower="loadData" -->
					<view class="" style="width: 100%;height: 50px;background-color: #fff;"></view>
					<view class="tis flex_column" v-if="noOrder == true && navList.length == 0">
						<view class="nomoreimage">
							<image :src="nomore" mode="aspectFill" class="nomore"></image>
						</view>
						<view class="" style="margin: auto;color: #a8a8a8;padding-top: 10px;">~暂无订单~</view>
					</view>
					<view v-for="(item, index) in navList" :key="index" class="order-item" v-if="item.typeId == 1">
						<view class="i-top b-b">
							<view class="id_image" v-if="item.projectOrderRelevanceLists[0].staPhoto != null">
								<image
									:src="'http://my.cloud.xmstruggle.com/' + item.projectOrderRelevanceLists[0].staPhoto"
									mode="aspectFill"></image>
							</view>
							<view class="id_image" v-else>
								<image
									src="https://6465-deke-796509-1300609047.tcb.qcloud.la/%E5%88%B0%E5%BA%97.png?sign=9e8c8664f3ec8c56971f92bf7edeb4ef&t=1575440489"
									mode="aspectFill"></image>
							</view>
							<text class="time">
								<text v-if="item.projectOrderRelevanceLists[0].staName == null">到店再选</text>
								<text v-else>
									{{ item.projectOrderRelevanceLists[0].staName }}
									<text v-if="item.endTime">于{{ item.endTime }}为您服务</text>
									<text v-else>将为你服务</text>
								</text>
							</text>
							<text class="condition">待服务</text>
						</view>
						<scroll-view v-if="item.projectOrderRelevanceLists.length > 1" class="goods-box" scroll-x
							@click="details(item.orderId, item.typeId, index)">
							<view v-for="(goodsItem, goodsIndex) in item.projectOrderRelevanceLists" :key="goodsIndex"
								class="goods-item">
								<image class="goods-img" :src="'http://my.cloud.xmstruggle.com/' + goodsItem.pictureId"
									mode="aspectFill"></image>
							</view>
						</scroll-view>
						<view v-if="item.projectOrderRelevanceLists.length == 1" class="goods-box-single"
							v-for="(goodsItem, goodsIndex) in item.projectOrderRelevanceLists" :key="goodsIndex"
							@click="details(item.orderId, item.typeId, index)">
							<image class="goods-img1" :src="'http://my.cloud.xmstruggle.com/' + goodsItem.pictureId"
								mode="aspectFill"></image>
							<view class="title">{{ goodsItem.serveName }}</view>
						</view>
						<view class="price-box">
							共
							<text class="num">{{ item.projectOrderRelevanceLists.length }}</text>
							个项目
							<view class="" v-if="item.consumptionState == 1" style="padding-left: 5px;">
								应付款：
								<text style="font-weight: bold;font-size:16px;">￥{{ item.ordAchievement }}</text>
							</view>
							<view class="" v-if="item.consumptionState == 0" style="padding-left: 5px;">
								实付款：
								<text style="font-weight: bold;font-size:16px;">￥{{ item.ordAchievement }}</text>
							</view>
						</view>
						<view class="projectclassify">
							<view class=" primary nowrap"
								v-if="item.paymentCustomerName == null || item.paymentCustomerName == ''">
								<text v-if="item.orderType == null">到店再选</text>
								<text v-else>{{ item.orderType }}</text>
							</view>
							<view class="nowrap" v-else>
								<image :src="item.cusHeadPortrait" mode="aspectFill"
									style="width: 30px;height: 30px;border-radius: 5px; margin:0 5px;"></image>
								{{ item.paymentCustomerName }}
								<view class="" style="padding-right:10px;" v-if="item.giftOrderId != null">送给我的项目</view>
							</view>
							<view class="action-box2 ">
								<!-- 1是未付款  -->
								<view class="action-btn11"
									@click="changOrderTime(item.projectOrderRelevanceLists[0].staffId, item.projectOrderRelevanceLists[0].appointmentId)"
									v-if="item.orderType != '店开单'">
									修改时间
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>

			<!-- 待使用 -->
			<swiper-item>
				<scroll-view class="list-scroll-content" scroll-y>
					<!-- @scrolltolower="loadData" -->
					<view class="" style="width: 100%;height: 50px;background-color: #fff;"></view>
					<view class="tis flex_column" v-if="noOrder == true && navList.length == 0">
						<view class="nomoreimage">
							<image :src="nomore" mode="aspectFill" class="nomore"></image>
						</view>
						<view class="" style="margin: auto;color: #a8a8a8;padding-top: 10px;">~暂无订单~</view>
					</view>
					<view v-for="(item, index) in navList" :key="index" class="order-item" v-if="item.typeId == 2">
						<view class="i-top b-b">
							<view class="font" style="font-size: 25px;padding-left: 5px;color: #CA89FF;">&#xe646;</view>
							<view class="time nowrap flex_row">
								可用门店:
								<view class="" v-for="(ite, int1) in item.storeNames" :key="int1"
									v-if="item.storeNames.length != 0">{{ ite }}、</view>
								<view class="" v-for="(ite, int1) in item.storeNames" :key="int1" v-else>暂无可用门店</view>
							</view>
							<text class="condition">待使用</text>
						</view>
						<view class="goods-box-single" @click="details(item.orderId, item.typeId, index)">
							<image class="goods-img1"
								:src="'http://my.cloud.xmstruggle.com/' + item.serverNameLists.pictureId"
								mode="aspectFill"></image>
							<view class="title">{{ item.serverNameLists.serveName?item.serverNameLists.serveName:'' }}
							</view>
						</view>
						<view class="price-box">
							共
							<text class="num">1</text>
							个项目 实付款：
							<view class="price" v-if="item.giftOrderId != null && item.giftTemplateId != null">
								￥{{ item.ordAchievement }}</view>
							<view class="" v-else>￥0</view>
						</view>
						<view class="projectclassify">
							<view class="itemcondition1 flex_row nowrap"
								:class="item.serverNameLists.isPresented == 1 ? 'width1' : 'width2'">
								<view class="id_image1"
									v-if="item.customizationId == null && item.giftTemplateId == null && item.giftOrderId != null">
									<image :src="item.cusHeadPortrait" mode="aspectFill"></image>
								</view>
								<view class=""
									v-if="item.customizationId == null && item.giftTemplateId == null && item.giftOrderId != null">
									{{ item.givenName }}
								</view>
								<view class="" style="padding-right: 10px;"
									v-if="item.customizationId == null && item.giftTemplateId == null && item.giftOrderId != null">
									送给我的项目
								</view>
								<view class="" v-if="item.inDate != 0">{{ item.inDate }}天后过期</view>
								<view class="" v-else>无限期</view>
							</view>
							<view class="action-box ">
								<!-- v-if="item.state == 2" -->
								<!-- 2是未付款  3是预约单 -->
								<button class="share_text" open-type="share"
									v-if="item.serverNameLists.isPresented == 1"
									@click="presentmethod(index)">转赠好友</button>
								<view class="action-btn" @click="chooseCraftman(index)">预约使用</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>

			<!-- 待结账 -->
			<swiper-item>
				<scroll-view class="list-scroll-content" scroll-y>
					<!-- @scrolltolower="loadData" -->
					<view class="" style="width: 100%;height: 50px;background-color: #fff;"></view>
					<view class="tis flex_column" v-if="noOrder == true && navList.length == 0">
						<view class="nomoreimage">
							<image :src="nomore" mode="aspectFill" class="nomore"></image>
						</view>
						<view class="" style="margin: auto;color: #a8a8a8;padding-top: 10px;">~暂无订单~</view>
					</view>
					<view v-for="(item, index) in navList" :key="index" class="order-item" v-if="tabCurrentIndex == 2"
						@click="notfinish(item.settleAccountsId)">
						<view class="i-top b-b">
							<view class="font" style="font-size: 25px;padding-left: 5px;color: #CA89FF;">&#xe646;</view>
							<view class="time nowrap flex_row">
								可用门店:
								<view class="" v-for="(ite, int1) in item.backstageStores" :key="int1">
									{{ ite.stoName }}、
								</view>
							</view>
							<text class="condition">待结账</text>
							<!-- <text class="state" :style="{ color: item.stateTipColor }">{{ item.stateTip }}</text -->
							<!-- 提示订单状况 -->
							<!-- <text v-if="item.state === 9" class="font deleteicon" @click="deleteOrder(index)">&#xe617;</text> -->
							<!-- 删除按钮 -->
						</view>
						<scroll-view v-if="item.projectOrderRelevanceLists.length > 1" class="goods-box" scroll-x>
							<view v-for="(goodsItem, goodsIndex) in item.projectOrderRelevanceLists" :key="goodsIndex"
								class="goods-item">
								<image class="goods-img" :src="'http://my.cloud.xmstruggle.com/' + goodsItem.pictureId"
									mode="aspectFill"></image>
							</view>
						</scroll-view>
						<view v-if="item.projectOrderRelevanceLists.length === 1" class="goods-box-single"
							v-for="(goodsItem, goodsIndex) in item.projectOrderRelevanceLists" :key="goodsIndex">
							<image class="goods-img1" :src="'http://my.cloud.xmstruggle.com/' + goodsItem.pictureId"
								mode="aspectFill"></image>
							<view class="title">{{ goodsItem.serveName }}</view>
						</view>

						<view class="price-box_pay">
							共
							<text class="num">{{ item.count }}</text>
							个项目 应付款：
							<view class="price">￥{{ item.totalMoney }}</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>

			<!-- 已完成 -->
			<swiper-item>
				<scroll-view class="list-scroll-content" scroll-y>
					<!-- @scrolltolower="loadData" -->
					<view class="" style="width: 100%;height: 50px;background-color: #fff;"></view>
					<view class="tis flex_column" v-if="noOrder == true && navList.length == 0">
						<view class="nomoreimage">
							<image :src="nomore" mode="aspectFill" class="nomore"></image>
						</view>
						<view class="" style="margin: auto;color: #a8a8a8;padding-top: 10px;">~暂无订单~</view>
					</view>
					<view v-for="(item, index) in navList" :key="index" class="order-item" v-if="item.typeId == 4">
						<view class="i-top b-b">
							<view class="id_image">
								<image
									:src="'http://my.cloud.xmstruggle.com/' + item.projectOrderRelevanceLists[0].staPhoto"
									mode="aspectFill"></image>
								<!-- 头像 -->
							</view>
							<text
								class="time">{{ item.projectOrderRelevanceLists[0].staName }}于{{ item.endTime }}已完成服务</text>
							<text class="condition">已完成</text>
							<!-- <text class="state" :style="{ color: item.stateTipColor }">{{ item.stateTip }}</text -->
							<!-- 提示订单状况 -->
							<!-- <text v-if="item.state === 9" class="font deleteicon" @click="deleteOrder(index)">&#xe617;</text> -->
							<!-- 删除按钮 -->
						</view>

						<scroll-view v-if="item.projectOrderRelevanceLists.length > 1" class="goods-box" scroll-x
							@click="details(item.orderId, item.typeId, index)">
							<view v-for="(goodsItem, goodsIndex) in item.projectOrderRelevanceLists" :key="goodsIndex"
								class="goods-item">
								<image class="goods-img" :src="'http://my.cloud.xmstruggle.com/' + goodsItem.pictureId"
									mode="aspectFill"></image>
							</view>
						</scroll-view>
						<view v-if="item.projectOrderRelevanceLists.length == 1" class="goods-box-single"
							v-for="(goodsItem, goodsIndex) in item.projectOrderRelevanceLists" :key="goodsIndex"
							@click="details(item.orderId, item.typeId, index)">
							<image class="goods-img1" :src="'http://my.cloud.xmstruggle.com/' + goodsItem.pictureId"
								mode="aspectFill"></image>
							<view class="title" v-if="goodsItem.serveName">{{ goodsItem.serveName }}</view>
							<view class="title" v-else>---</view>
						</view>

						<view class="price-box">
							共
							<text class="num">{{ item.projectOrderRelevanceLists.length }}</text>
							个项目 实付款：
							<view class="price">￥{{ item.ordAchievement }}</view>
						</view>
						<view class="projectclassify">
							<view class=" primary nowrap"
								v-if="item.paymentCustomerName == null || item.paymentCustomerName == '' || item.paymentCustomerName == undefined">
								{{ item.orderType }}
							</view>
							<view class="nowrap flex_row" v-else>
								<view class="id_image">
									<image :src="item.cusHeadPortrait" mode="aspectFill"
										v-if="item.paymentCustomerName != '礼包项目' && item.paymentCustomerName != '定制项目'" />
								</view>
								<view style="padding-left: 5px;">{{ item.paymentCustomerName }}</view>
								<view class="" style="padding-right: 10px;"
									v-if="item.paymentCustomerName != '礼包项目' && item.paymentCustomerName != '定制项目'">
									送给我的项目
								</view>
							</view>
							<view class="action-box ">
								<!-- v-if="item.state == 2" -->
								<!-- 2是未付款  3是预约单 -->
								<view class="action-btn" @click="evalute(item)"
									v-if="item.backstageEvaluates.length === 0">服务评价</view>
								<view class="action-btn" @click="cancelOrder(item)">再次购买</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>

			<!-- 已失效 -->
			<swiper-item>
				<scroll-view class="list-scroll-content" scroll-y>
					<!-- @scrolltolower="loadData" -->
					<view class="" style="width: 100%;height: 50px;background-color: #fff;"></view>
					<view class="tis flex_column" v-if="noOrder == true && navList.length == 0">
						<view class="nomoreimage">
							<image :src="nomore" mode="aspectFill" class="nomore"></image>
						</view>
						<view class="" style="margin: auto;color: #a8a8a8;padding-top: 10px;">~暂无订单~</view>
					</view>
					<view v-for="(item, index) in navList" :key="index" class="order-item" v-if="item.typeId == 5">
						<!-- 预约单 -->
						<view class="">
							<!-- <view class="" v-if="item.customizationId == null && item.giftTemplateId == null && item.giftOrderId == null"> -->
							<view class="i-top b-b">
								<view class="id_image" v-if="item.severNames[0].staPhoto != null">
									<image :src="'http://my.cloud.xmstruggle.com/' + item.severNames[0].staPhoto"
										mode="aspectFill"></image>
									<!-- 头像 -->
								</view>
								<view class="id_image" v-else>
									<image
										src="https://6465-deke-796509-1300609047.tcb.qcloud.la/%E5%88%B0%E5%BA%97.png?sign=9e8c8664f3ec8c56971f92bf7edeb4ef&t=1575440489"
										mode="aspectFill"></image>
									<!-- 头像 -->
								</view>
								<text class="time">
									<text v-if="item.severNames[0].staName == null">您可以重新预约时间或退款</text>
									<text v-else>{{ item.severNames[0].staName }}：您可以重新预约时间或退款</text>
								</text>
								<text class="condition">已失效</text>
								<!-- <text class="state" :style="{ color: item.stateTipColor }">{{ item.stateTip }}</text -->
								<!-- 提示订单状况 -->
								<!-- <text v-if="item.state === 9" class="font deleteicon" @click="deleteOrder(index)">&#xe617;</text> -->
								<!-- 删除按钮 -->
							</view>
							<!-- <view class="i-top b-b">
									<view class="id_image">
										<image :src="'http://my.cloud.xmstruggle.com/' +item.severNames[0].staPhoto" mode="aspectFill"></image>
									</view>
									<text class="time">{{ item.severNames[0].staName }}：您可以重新预约时间或退款</text>
									<text class="condition">已失效</text>
								</view> -->
							<scroll-view v-if="item.severNames.length > 1" class="goods-box" scroll-x
								@click="details(item.orderId, item.typeId, index)">
								<view v-for="(goodsItem, goodsIndex) in item.severNames" :key="goodsIndex"
									class="goods-item">
									<image class="goods-img"
										:src="'http://my.cloud.xmstruggle.com/' + goodsItem.pictureId"
										mode="aspectFill"></image>
								</view>
							</scroll-view>
							<view v-if="item.severNames.length == 1" class="goods-box-single"
								v-for="(goodsItem, goodsIndex) in item.severNames" :key="goodsIndex"
								@click="details(item.orderId, item.typeId, index)">
								<image class="goods-img1" :src="'http://my.cloud.xmstruggle.com/' + goodsItem.pictureId"
									mode="aspectFill"></image>
								<view class="title">{{ goodsItem.serveName }}</view>
							</view>
							<view class="price-box">
								共
								<text class="num">{{ item.severNames.length }}</text>
								个项目 实付款：
								<view class="price">￥{{ item.ordAchievement?item.ordAchievement:0 }}</view>
							</view>
							<view class="projectclassify">
								<view class="nowrap" style="width:100%"
									v-if="item.consumptionState == 0 || item.consumptionState == 1">重新预约时间后本单再次生效</view>
								<view class="nowrap" style="width:100%" v-if="item.consumptionState == 2">已申请退款</view>
								<view class="action-box2 ">
									<!-- 2是未付款  3是预约单 -->
									<text type="primary" @click="clickorRefund(item.orderId, item.consumptionState)"
										v-if="item.consumptionState == 0">退款</text>
									<view class="action-btn1" @click="changOrderTime(item.staffId, item.appointmentId)"
										v-if="item.consumptionState == 0 || item.consumptionState == 1 || item.consumptionState == 2">
										重新预约
									</view>
								</view>
							</view>
						</view>
						<!-- 预约单 -->
						<!-- 他人赠送 -->
						<view class=""
							v-if="item.customizationId == null && item.giftTemplateId == null && item.giftOrderId != null">
							<view class="i-top b-b">
								<view class="font" style="font-size: 25px;padding-left: 5px;color: #CA89FF;">&#xe646;
								</view>
								<text class="time">很遗憾项目未使用</text>
								<text class="condition">已失效</text>
							</view>
							<scroll-view v-if="item.severNames.length > 1" class="goods-box" scroll-x
								@click="details(item.giftOrderId, item.typeId, index)">
								<view v-for="(goodsItem, goodsIndex) in item.severNames" :key="goodsIndex"
									class="goods-item">
									<image class="goods-img"
										:src="'http://my.cloud.xmstruggle.com/' + goodsItem.pictureId"
										mode="aspectFill"></image>
								</view>
							</scroll-view>
							<view v-if="item.severNames.length == 1" class="goods-box-single"
								v-for="(goodsItem, goodsIndex) in item.severNames" :key="goodsIndex"
								@click="details(item.giftOrderId, item.typeId, index)">
								<image class="goods-img1" :src="'http://my.cloud.xmstruggle.com/' + goodsItem.pictureId"
									mode="aspectFill"></image>
								<view class="title">{{ goodsItem.serveName }}</view>
							</view>
							<view class="price-box">
								共
								<text class="num">{{ item.severNames.length }}</text>
								个项目 实付款：
								<view class="price">￥0</view>
							</view>
							<view class="projectclassify itemcondition1">
								<view class="id_image1" v-if="item.giftOrderId != null">
									<image :src="item.cusHeadPortrait" mode="aspectFill"></image>
								</view>
								<view class="" v-if="item.giftOrderId != null">{{ item.givenName }}</view>
								<view class="" style="padding-right: 10px;" v-if="item.giftOrderId != null">送给我的项目于
								</view>
								<view class="">{{ item.severNames[0].queryInvalid }}过期</view>
							</view>
						</view>
						<!-- 礼包项目过期 -->
						<view class=""
							v-if="item.customizationId == null && item.giftTemplateId != null && item.giftOrderId != null">
							<view class="i-top b-b">
								<view class="font" style="font-size: 25px;padding-left: 5px;color: #CA89FF;">&#xe646;
								</view>
								<text class="time">很遗憾项目未使用</text>
								<text class="condition">已失效</text>
							</view>
							<scroll-view v-if="item.severNames.length > 1" class="goods-box" scroll-x
								@click="details(item.orderId, item.typeId, index)">
								<view v-for="(goodsItem, goodsIndex) in item.severNames" :key="goodsIndex"
									class="goods-item">
									<image class="goods-img"
										:src="'http://my.cloud.xmstruggle.com/' + goodsItem.pictureId"
										mode="aspectFill"></image>
								</view>
							</scroll-view>
							<view v-if="item.severNames.length == 1" class="goods-box-single"
								v-for="(goodsItem, goodsIndex) in item.severNames" :key="goodsIndex"
								@click="details(item.orderId, item.typeId, index)">
								<image class="goods-img1" :src="'http://my.cloud.xmstruggle.com/' + goodsItem.pictureId"
									mode="aspectFill"></image>
								<view class="title">{{ goodsItem.serveName }}</view>
							</view>
							<view class="price-box">
								共
								<text class="num">{{ item.severNames.length }}</text>
								个项目 实付款：
								<view class="price">￥{{ item.ordAchievement }}</view>
							</view>
							<view class="projectclassify itemcondition1">
								<view class="">于{{ item.severNames[0].queryInvalid }}后过期</view>
							</view>
						</view>
						<!-- 美丽定制 -->
						<view class=""
							v-if="item.customizationId != null && item.giftTemplateId == null && item.giftOrderId == null">
							<view class="i-top b-b">
								<view class="font" style="font-size: 25px;padding-left: 5px;color: #CA89FF;">&#xe646;
								</view>
								<text class="time">很遗憾项目未使用</text>
								<text class="condition">已失效</text>
							</view>
							<scroll-view v-if="item.severNames.length > 1" class="goods-box" scroll-x
								@click="details(item.orderId, item.typeId, index)">
								<view v-for="(goodsItem, goodsIndex) in item.severNames" :key="goodsIndex"
									class="goods-item">
									<image class="goods-img"
										:src="'http://my.cloud.xmstruggle.com/' + goodsItem.pictureId"
										mode="aspectFill"></image>
								</view>
							</scroll-view>
							<view v-if="item.severNames.length == 1" class="goods-box-single"
								v-for="(goodsItem, goodsIndex) in item.severNames" :key="goodsIndex"
								@click="details(item.orderId, item.typeId, index)">
								<image class="goods-img1" :src="'http://my.cloud.xmstruggle.com/' + goodsItem.pictureId"
									mode="aspectFill"></image>
								<view class="title">{{ goodsItem.serveName }}</view>
							</view>
							<view class="price-box">
								共
								<text class="num">{{ item.severNames.length }}</text>
								个项目 实付款：
								<view class="price">￥{{ item.ordAchievement }}</view>
							</view>
							<view class="projectclassify itemcondition1">
								<view class="">于{{ item.severNames[0].queryInvalid }}后过期</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<!-- 已退款 -->
			<swiper-item>
				<scroll-view class="list-scroll-content" scroll-y>
					<!-- @scrolltolower="loadData" -->
					<view class="" style="width: 100%;height: 50px;background-color: #fff;"></view>
					<view class="tis flex_column" v-if="noOrder == true && navList.length == 0">
						<view class="nomoreimage">
							<image :src="nomore" mode="aspectFill" class="nomore"></image>
						</view>
						<view class="" style="margin: auto;color: #a8a8a8;padding-top: 10px;">~暂无订单~</view>
					</view>
					<view v-for="(item, index) in navList" :key="index" class="order-item" v-if="item.typeId == 6">
						<view class="i-top b-b">
							<view class="id_image">
								<image
									:src="'http://my.cloud.xmstruggle.com/' + item.projectOrderRelevanceLists[0].staPhoto"
									mode="aspectFill"></image>
								<!-- 头像 -->
							</view>

							<text class="time">{{ item.projectOrderRelevanceLists[0].staName }}:你可以重新下单</text>
							<text class="condition">订单关闭</text>
							<!-- <text class="state" :style="{ color: item.stateTipColor }">{{ item.stateTip }}</text -->
							<!-- 提示订单状况 -->
							<!-- <text v-if="item.state === 9" class="font deleteicon" @click="deleteOrder(index)">&#xe617;</text> -->
							<!-- 删除按钮 -->
						</view>

						<scroll-view v-if="item.projectOrderRelevanceLists.length > 1" class="goods-box" scroll-x
							@click="details(item.orderId, item.typeId, index)">
							<view v-for="(goodsItem, goodsIndex) in item.projectOrderRelevanceLists" :key="goodsIndex"
								class="goods-item">
								<image class="goods-img" :src="'http://my.cloud.xmstruggle.com/' + goodsItem.pictureId"
									mode="aspectFill"></image>
							</view>
						</scroll-view>
						<view v-if="item.projectOrderRelevanceLists.length == 1" class="goods-box-single"
							v-for="(goodsItem, goodsIndex) in item.projectOrderRelevanceLists" :key="goodsIndex"
							@click="details(item.orderId, item.typeId, index)">
							<image class="goods-img1" :src="'http://my.cloud.xmstruggle.com/' + goodsItem.pictureId"
								mode="aspectFill"></image>
							<view class="title">{{ goodsItem.serveName }}</view>
						</view>

						<view class="price-box">
							共
							<text class="num">{{ item.projectOrderRelevanceLists.length }}</text>
							个项目
							<view class="" v-if="item.consumptionState == 1" style="padding-left: 5px;">
								应付款：
								<text style="font-weight: bold;font-size:16px;">￥{{ item.ordAchievement }}</text>
							</view>
							<view class="" v-if="item.consumptionState == 0" style="padding-left: 5px;">
								实付款：
								<text style="font-weight: bold;font-size:16px;">￥{{ item.ordAchievement }}</text>
							</view>
						</view>
						<view class="projectclassify">
							<view v-if="item.condition.length == 1" class="itemcondition2 "
								v-for="(conditionItem, conditionIndex) in item.condition" :key="conditionIndex">
								<view class="id_image1" v-if="conditionItem.src != ''">
									<image :src="'http://my.cloud.xmstruggle.com/' + conditionItem.src"
										mode="aspectFill"></image>
								</view>
								<view class="nowrap" style="width:100%">{{ conditionItem.title }}</view>
							</view>

							<view class="action-box2 ">
								<!-- 2是未付款  3是预约单 -->
								<view class="action-btn1" @click="deleteorderId">删除订单</view>
								<!-- <view class="action-btn1 ">重新预约</view> -->
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<mpopup ref="mpopup" :isdistance="true"></mpopup>
		<tui-modal :show="modal8" @cancel="hide8" :custom="true">
			<view class="tui-modal-custom">
				<view class="tui-modal-custom-text">提示：</view>
				<view class="tui-modal-custom-text1">{{ sendCutomerName }}赠送给你了一个价值￥{{ price }}的{{ serverName }}大礼包
				</view>
				<view class="flex_row" style="width: 100%;">
					<view @click="asureClick8" class="botton" style="background-color: green;">接受</view>
					<view @click="handleClick8" class="botton" style="background-color: red;">拒绝</view>
				</view>
			</view>
		</tui-modal>
	</view>
</template>

<script>
	import tuiButton from '@/components/button/button';
	import tuiModal from '@/components/modal/modal';
	export default {
		components: {
			tuiButton,
			tuiModal
		},
		data() {
			return {
				modal2: false,
				tabCurrentIndex: 0,
				modal8: false,
				sendCutomerName: '',
				// 支付信息
				modalName: null,
				bussname: '名资美业',
				bankcard: '招商银行信用卡(6666)',
				menuTabs: ['待服务', '待使用', '待结账', '已完成', '已失效', '已退款'],
				navList: [],
				isService: 0,
				nomore: 'http://www.mescroll.com/img/mescroll-empty.png?v=1',
				noOrder: false,
				present: 0,
				serverName: '',
				price: 0,
				customerId: '',
				giftTemplateId: '',
				serveId: '',
				orderId: '',
				navibacktype: ''
			};
		},
		onLoad(props) {
			if (props.navibacktype) {
				this.navibacktype = props.navibacktype
			}
			if (uni.getStorageSync('openId') === '' || uni.getStorageSync('user') === null) {
				setTimeout(function() {
					uni.reLaunch({
							url: '/pages/empty/empty'
						},
						500
					);
				});
			} else {
				console.log(props.ifSend, '222222');
				if (!props.ifSend) {
					this.getAllList();
					// this.modal8 = true
				} else {
					(this.giftTemplateId = props.giftTemplateId), (this.serveId = props.serveId), (this.customerId = props
						.customerId);
					this.serverName = props.serverName;
					this.price = props.price;
					this.sendCutomerName = props.ifSend;
					this.modal8 = true;
				}
				this.tabCurrentIndex = props.index ? props.index : 0
				// if (!props.index) {
				// 	this.tabCurrentIndex = 0;
				// } else {
				// 	this.tabCurrentIndex = props.index;
				// }
			}
		},
		onUnload() {
			if (this.navibacktype) {
				uni.navigateBack({
					delta: 4
				})
			} else {
				uni.navigateBack({
					delta: 1
				})
			}
			uni.removeStorageSync('sellproduct');
			uni.removeStorageSync('paycarlist');
		},
		onPullDownRefresh() {
			console.log('refresh');
			this.getAllList()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			onShareAppMessage: function(res) {
				// 来自页面内的按钮的转发
				if (res.from == 'button') {
					console.log('button');
				}
				return {
					title: '礼包分享',
					path: '/pages/myOrder/myOrder?ifSend=' +
						uni.getStorageSync('user').cusName +
						'&price=' +
						this.navList[this.present].ordAchievement +
						'&serverName=' +
						this.navList[this.present].serverNameLists.serveName +
						'&customerId=' +
						uni.getStorageSync('user').customerId +
						'&giftTemplateId=' +
						this.navList[this.present].giftTemplateId +
						'&serveId=' +
						this.navList[this.present].serverNameLists.serveId
				};
				// 当分享出去的卡片被点击时，在页面的onLoad(options){}，options参数中接收
			},
			presentmethod(index) {
				console.log(index);
				this.present = index;
			},
			getAllList() {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uni.request({
					//获取购物券
					method: 'POST',
					url: getApp().globalData.url + '/applet/order/findOrderInfoByType',
					data: {
						customerId: uni.getStorageSync('user').customerId,
						// customerId: 51,
						storeId: uni.getStorageSync('storeId'),
						// "typeId":this.tabCurrentIndex + 1
						typeId: this.tabCurrentIndex + 1
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded' //如果为空，加上头部接收
					},
					success: res => {
						console.log(res.data, '待结账');
						if (res.data.length == 0) {
							this.noOrder = true;
							this.navList = [];
						} else {
							this.noOrder = false;
							for (var i = 0; i < res.data.length; i++) {
								if (res.data[i].typeId == 5) {
									var max = '2009-01-01 00:00:00';
									if (res.data[i].severNames != null) {
										for (var j = 0; j < res.data[i].severNames.length; j++) {
											if (res.data[i].severNames[j].queryInvalid > max) {
												max = res.data[i].severNames[j].queryInvalid;
											}
										}
										res.data[i].severNames[0].queryInvalid = max;
									}
								}
							}
							this.navList = res.data;
						}
						uni.hideLoading();
					},
					fail: err => {
						this.error();
						uni.hideLoading();
					}
				});
			},
			hide8() {
				this.modal8 = false;
			},
			asureClick8() {
				uni.request({
					//获取购物券
					method: 'POST',
					url: getApp().globalData.url + '/applet/order/presentProject',
					data: {
						customerId: this.customerId,
						giftTemplateId: this.giftTemplateId,
						serveId: this.serveId,
						cusId: uni.getStorageSync('user').customerId
					},
					header: {
						'Content-Type': 'application/json' //如果为空，加上头部接收
					},
					success: res => {
						console.log(res.data, '');
						uni.showToast({
							title: '领取成功'
						});
					},
					fail: err => {
						uni.showToast({
							title: '网络请求超时,请重试',
							icon: 'none'
						});
					}
				});
				this.getAllList();
				this.hide8();
			},
			handleClick8() {
				this.getAllList();
				this.hide8();
			},
			show8() {
				this.modal8 = true;
			},
			details(id, typeId, index) {
				if (typeId == 2) {
					if (this.navList[index].customizationId == null && this.navList[index].giftTemplateId == null && this
						.navList[index].giftOrderId != null) {
						var classifyId = 1;
					} else if (this.navList[index].clientGiveGiftId != null && this.navList[index].clientGiveInfoId !=
						null) {
						var classifyId = 3;
						id = this.navList[index].clientGiveInfoId;
					} else if (this.navList[index].clientGiveGiftId == null && this.navList[index].clientGiveInfoId !=
						null) {
						var classifyId = 3;
						id = this.navList[index].clientGiveInfoId;
					} else {
						var classifyId = 0;
					}
					if (this.navList[index].customizationId == null && this.navList[index].giftTemplateId == null && this
						.navList[index].giftOrderId != null) {
						id = this.navList[index].giftOrderId;
					}
					var serveId = this.navList[index].serverNameLists.serveId;
					console.log(id, typeId, index, classifyId, serveId);
					uni.navigateTo({
						url: '../myOrder/orderDetails?id=' +
							id +
							'&typeId=' +
							typeId +
							'&classifyId=' +
							classifyId +
							'&serverId=' +
							serveId +
							'&isPresented=' +
							this.navList[index].serverNameLists.isPresented
					});
				} else if (typeId == 1 || typeId == 6) {
					var classifyId = 0;
					uni.navigateTo({
						url: '../myOrder/orderDetails?id=' + id + '&typeId=' + typeId + '&classifyId=' + classifyId
					});
				} else if (typeId == 4) {
					if (this.navList[index].giftOrderId == null) {
						var classifyId = 0;
					} else {
						var classifyId = 1;
					}
					uni.navigateTo({
						url: '../myOrder/orderDetails?id=' + id + '&typeId=' + typeId + '&classifyId=' + classifyId
					});
				} else if (typeId == 5) {
					if (this.navList[index].customizationId == null && this.navList[index].giftTemplateId == null && this
						.navList[index].giftOrderId != null) {
						var classifyId = 1;
						uni.navigateTo({
							url: '../myOrder/orderDetails?id=' + id + '&typeId=' + typeId + '&classifyId=' +
								classifyId
						});
					} else if (this.navList[index].customizationId == null && this.navList[index].giftTemplateId == null &&
						this.navList[index].giftOrderId == null) {
						var classifyId = 0;
						uni.navigateTo({
							url: '../myOrder/orderDetails?id=' + id + '&typeId=' + typeId + '&classifyId=' +
								classifyId
						});
					} else if (this.navList[index].customizationId == null && this.navList[index].giftTemplateId != null &&
						this.navList[index].giftOrderId != null) {
						var classifyId = 0;
						var serveId = this.navList[index].severNames[0].serveId;
						uni.navigateTo({
							url: '../myOrder/orderDetails?id=' + id + '&typeId=' + typeId + '&classifyId=' +
								classifyId + '&serverId=' + serveId
						});
					} else if (this.navList[index].customizationId != null && this.navList[index].giftTemplateId == null &&
						this.navList[index].giftOrderId == null) {
						var classifyId = 0;
						var serveId = this.navList[index].severNames[0].serveId;
						uni.navigateTo({
							url: '../myOrder/orderDetails?id=' + id + '&typeId=' + typeId + '&classifyId=' +
								classifyId + '&serverId=' + serveId
						});
					}
				}
			},
			clickorRefund(a, b) {
				//是否退款
				var myDate = new Date();
				var y = myDate.getFullYear();
				var m = myDate.getMonth() + 1;
				m = m < 10 ? '0' + m : m;
				var d = myDate.getDate();
				d = d < 10 ? '0' + d : d;
				var h = myDate.getHours();
				h = h < 10 ? '0' + h : h;
				var m1 = myDate.getMinutes();
				m1 = m1 < 10 ? '0' + m1 : m1;
				var s = myDate.getSeconds();
				s = s < 10 ? '0' + s : s;
				var time = y + '-' + m + '-' + d + ' ' + h + ':' + m1 + ':' + s;
				this.modalName = null;
				console.log(a, b, '111111');
				uni.request({
					//获取购物券
					method: 'POST',
					url: getApp().globalData.url + '/applet/order/updateOrder',
					data: {
						orderId: a,
						refundInformation: '申请退款',
						updateTime: time,
						consumptionState: b
					},
					header: {
						'Content-Type': 'application/json' //如果为空，加上头部接收
					},
					success: res => {
						if (res.data.result == 'success') {
							uni.navigateTo({
								url: '../myOrder/refundStatus?status=0' + '&refundtime=' + time
							});
						}
					},
					fail: err => {
						uni.showToast({
							title: '网络请求超时,请重试',
							icon: 'none'
						});
					}
				});
			},
			//swiper 切换
			changeTab(e) {
				this.navList = [];
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				this.tabCurrentIndex = e.target.current;
				console.log(this.tabCurrentIndex);
				uni.request({
					//获取购物券
					method: 'POST',
					url: getApp().globalData.url + '/applet/order/findOrderInfoByType',
					data: {
						customerId: uni.getStorageSync('user').customerId,
						// customerId: 51,
						storeId: uni.getStorageSync('storeId'),
						typeId: this.tabCurrentIndex + 1
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded' //如果为空，加上头部接收
					},
					success: res => {
						console.log(res.data, 'heshaofeng01');
						if (res.data.length == 0) {
							this.noOrder = true;
							console.log(this.noOrder, 'he');
							this.navList = [];
							uni.hideLoading();
						} else {
							this.noOrder = false;
							for (var i = 0; i < res.data.length; i++) {
								if (res.data[i].typeId == 5) {
									var max = '2009-01-01 00:00:00';
									if (res.data[i].severNames != null) {
										for (var j = 0; j < res.data[i].severNames.length; j++) {
											if (res.data[i].severNames[j].queryInvalid > max) {
												max = res.data[i].severNames[j].queryInvalid;
											}
										}
										res.data[i].severNames[0].queryInvalid = max;
									}
								}
							}
							this.navList = res.data;
						}
						uni.hideLoading();
					},
					fail: err => {
						this.error();
						uni.hideLoading();
					}
				});

				// this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			showModal(e) {
				// this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null;
			},
			//删除订单
			payment(item) {
				uni.navigateTo({
					url: '../payment/payment'
				});
			},
			//取消订单
			notfinish(id) {
				uni.navigateTo({
					url: '../myOrder/statement?id=' + id
				});
				uni.removeStorageSync('sellproduct');
				uni.removeStorageSync('paycarlist');
				// uni.navigateTo({
				// 	url:'../myOrder/productstatement'
				// })
			},
			chooseCraftman(index) {
				var type;
				var classifyId;
				this.orderId = this.navList[index].orderId;
				if (this.navList[index].customizationId == null && this.navList[index].giftTemplateId != null && this
					.navList[index].giftOrderId != null) {
					//不是赠送
					type = 3;
					classifyId = 0;
				} else if (this.navList[index].customizationId == null && this.navList[index].giftTemplateId == null &&
					this.navList[index].giftOrderId != null) {
					type = 1;
					classifyId = 1;
				} else if (this.navList[index].customizationId != null && this.navList[index].giftTemplateId == null &&
					this.navList[index].giftOrderId == null) {
					type = 2;
					classifyId = 0;
				} else if (
					this.navList[index].customizationId == null &&
					this.navList[index].giftTemplateId != null &&
					this.navList[index].giftOrderId == null &&
					this.navList[index].clientGiveInfoId != null &&
					this.navList[index].clientGiveGiftId != null
				) {
					//这个主要是为了判断 员工赠送给客户的礼包项目信息
					type = 4;
					classifyId = 3;
					this.orderId = this.navList[index].clientGiveInfoId;
				} else if (
					this.navList[index].customizationId == null &&
					this.navList[index].giftTemplateId == null &&
					this.navList[index].giftOrderId == null &&
					this.navList[index].clientGiveInfoId != null &&
					this.navList[index].clientGiveGiftId == null
				) {
					//这个主要是为了判断员工赠送给客户的单个项目信息 或  客户自己拼团成功的项目
					if (this.navList[index].isGroupBuying == 0) {
						//非团购单
						type = 5;
					} else {
						//团购单
						type = 6;
					}
					classifyId = 3;
					this.orderId = this.navList[index].clientGiveInfoId;
				}
				// 1是赠送   2是美丽定制   3 是礼包
				console.log(type, '11111');
				uni.navigateTo({
					url: '../craftsman/craftsman?type=' +
						type +
						'&orderId=' +
						this.orderId +
						'&typeId=' +
						2 +
						'&serveId=' +
						this.navList[index].serverNameLists.serveId +
						'&classifyId=' +
						classifyId +
						'&giftTemplateId=' +
						this.navList[index].giftTemplateId
				});
			},
			changOrderTime(a, b) {
				//重新预约和修改时间
				console.log(a, b);
				uni.navigateTo({
					url: '../index/chooseTime?staffId=' + a + '&type=' + '1' + '&changeorderid=' + b
				});
			},
			evalute(item) {
				uni.navigateTo({
					url: '../myOrder/evaluate?item=' + encodeURIComponent(JSON.stringify(item))
				});
			}
			//订单状态文字和颜色
		}
	};
</script>

<style lang="scss">
	page,
	.content {
		/* // background: $page-color-base; */
		height: 100%;
	}

	.tui-modal-custom-text {
		width: 100%;
		text-align: center;
		margin: 10px 0;
	}

	.tui-modal-custom-text1 {
		width: 60%;
		text-align: left;
		margin: 10px auto;
	}

	.botton {
		width: 40%;
		padding: 5px 10px;
		color: #fff;
		text-align: center;
		border-radius: 39px;
		margin: 0 5%;
	}

	// 头部标题栏 begin
	.swiper-box {
		height: calc(100%);
	}

	.list-scroll-content {
		height: 100%;
	}

	.width1 {
		width: 50%;
	}

	.width2 {
		width: 75%;
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

	.share_text {
		font-size: 14px;
		border-radius: 20px;
		background-color: #fff;
		height: 31px;
		border: 1px solid #e5e5e5;
		width: 87px;
		line-height: 31px;
		margin: auto;
	}

	.navbar {
		display: flex;
		height: 50px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
		position: fixed;
		top: 0px;
		z-index: 999;
		width: 100%;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			// color: $font-color-dark;
			position: relative;
			width: 16%;
		}
	}

	.price {
		width: 25%;
		text-align: center;
	}

	.current {
		color: rgba(212, 48, 48, 1);
		border-bottom: 3px solid #e94a59;
	}

	.uni-swiper-item {
		height: auto;
	}

	.order-item {
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;
		padding-right: 20upx;
		position: relative;
		border-bottom: 10px solid rgba(239, 239, 239, 1);
	}

	.i-top {
		display: flex;
		align-items: center;
		height: 80upx;
		position: relative;
		width: 100%;
		margin-bottom: 10px;
	}

	.time {
		position: absolute;
		left: 40px;
		top: 12px;
		color: #505050;
		font-size: 13px;
		font-weight: bold;
		width: 70%;
	}

	.deleteicon {
		position: absolute;
		top: 10px;
		right: 10px;
	}

	.condition {
		position: absolute;
		top: 10px;
		right: 0px;
		text-align: center;
		width: 15%;
		color: rgba(212, 48, 48, 1);
	}

	// 头部标题栏 end
	.del-btn {
		padding: 10upx 0 10upx 36upx;
	}

	.id_image {
		width: 29px;
		height: 29px;
		border-radius: 4px;
	}

	.id_image image {
		width: 29px;
		height: 29px;
		border-radius: 4px;
	}

	.itemcondition .id_image1 {
		width: 29px;
		height: 29px;
		border-radius: 16px;
		margin-top: 2px;
		margin-right: 5px;
	}

	.itemcondition .id_image1 image {
		width: 29px;
		height: 29px;
		border-radius: 16px;
	}

	/* 多条商品 */
	.goods-box {
		height: 160upx;
		background-color: rgba(239, 239, 239, 1);
		// padding: 20upx 0;
		width: 100%;
		white-space: nowrap;
	}

	.goods-item {
		width: 108px;
		height: 70px;
		line-height: 70px;
		display: inline-block;
		margin-right: 12px;
		margin-top: 5px;
	}

	.goods-img {
		display: block;
		width: 108px;
		height: 70px;
		/* line-height: 70px; */
		border-radius: 6px;
	}

	.goods-box-single {
		display: flex;
		flex-direction: row;
		height: 160upx;
		background-color: rgba(239, 239, 239, 1);
		// padding: 20upx 0;
		width: 100%;
	}

	.title {
		color: rgba(80, 80, 80, 1);
		font-size: 14px;
		height: 160upx;
		line-height: 160upx;
		margin-left: 17px;
	}

	.goods-img1 {
		display: block;
		width: 108px;
		height: 70px;
		margin-top: 5px;
		/* line-height: 70px; */
		border-radius: 6px;
	}

	.price-box {
		display: flex;
		flex-direction: row;
		color: rgba(80, 80, 80, 1);
		font-size: 14px;
		border-bottom: 1px solid rgba(229, 229, 229, 1);
		height: 45px;
		line-height: 45px;
		padding-left: 40%;
	}

	.price-box_pay {
		display: flex;
		flex-direction: row;
		color: rgba(80, 80, 80, 1);
		font-size: 14px;
		height: 45px;
		line-height: 45px;
		padding-left: 45%;
	}

	.projectclassify {
		color: rgba(166, 166, 166, 1);
		font-size: 14px;
		height: 40px;
		line-height: 40px;
		display: flex;
		flex-direction: row;
		width: 100%;
		margin-top: 10px;
		margin-bottom: 5px;
		position: relative;
	}

	.action-btn_3 {
		width: 75px;
		height: 31px;
		color: #383838;
		background-color: white;
		border: 2px solid rgba(229, 229, 229, 1);
		border-radius: 14px;
		font-size: 14px;
		line-height: 29px;
		margin-top: 4px;
		// margin-left: 67%;
		text-align: center;
		position: absolute;
		right: 5%;
	}

	// 待使用
	.action-box {
		position: absolute;
		right: 1%;
		display: flex;
		flex-direction: row;
	}

	.itemcondition {
		font-size: 12px;
		width: 40%;
		display: flex;
		flex-direction: row;
		overflow: hidden;
	}

	.itemcondition1 {
		font-size: 12px;
		display: flex;
		flex-direction: row;
	}

	.itemcondition1 image {
		width: 29px;
		height: 29px;
		border-radius: 16px;
	}

	.action-btn {
		width: 66px;
		height: 31px;
		color: #383838;
		background-color: white;
		border: 2px solid rgba(229, 229, 229, 1);
		border-radius: 14px;
		font-size: 13px;
		line-height: 29px;
		margin-top: 4px;
		margin-left: 15px;
		text-align: center;
	}

	.action-box1 {
		width: 60%;
		display: flex;
		flex-direction: row;
	}

	.itemcondition2 {
		font-size: 12px;
		width: 60%;
		display: flex;
		flex-direction: row;
	}

	.itemcondition1 .id_image1 {
		width: 29px;
		height: 29px;
		border-radius: 16px;
		margin-top: 2px;
		margin-right: 5px;
	}

	.itemcondition2 .id_image1 {
		width: 29px;
		height: 29px;
		border-radius: 16px;
		margin-top: 2px;
		margin-right: 5px;
	}

	.itemcondition2 .id_image1 image {
		width: 29px;
		height: 29px;
		border-radius: 16px;
	}

	.action-box2 {
		position: absolute;
		right: 2%;
		display: flex;
		flex-direction: row;
	}

	.action-box2 text {
		color: rgba(212, 48, 48, 1);
	}

	.action-btn1 {
		width: 75px;
		height: 31px;
		color: #d43030;
		background-color: white;
		border: 1px solid #d43030;
		border-radius: 14px;
		font-size: 12px;
		line-height: 31px;
		margin-top: 4px;
		margin-left: 5px;
		text-align: center;
	}

	.action-btn11 {
		width: 75px;
		height: 31px;
		color: #000;
		background-color: white;
		border: 1px solid #a8a8a8;
		border-radius: 14px;
		font-size: 12px;
		line-height: 31px;
		margin-top: 4px;
		margin-left: 5px;
		text-align: center;
	}

	/* 支付层页面样式 */
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
		border-bottom: 1px solid #e8e8e8;
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

	.payprice {
		color: rgba(0, 0, 0, 1);
		font-size: 39px;
		margin: 0 auto;
	}

	.card {
		text-indent: 13px;
		color: rgba(128, 128, 128, 1);
		font-size: 17px;
	}

	.cu-btn1 {
		color: rgba(255, 255, 255, 1);
		box-shadow: 6upx 6upx 8upx rgba(114, 130, 138, 0.2);
		border-radius: 6px;
		font-size: 18px;
		height: 45px;
		width: 90%;
		margin: 0 auto;
		line-height: 45px;
		text-align: center;
		margin-top: 15px;
	}

	.primary {
		width: 40%;
	}
</style>