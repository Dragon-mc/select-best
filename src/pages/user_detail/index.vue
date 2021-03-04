<template>
  <view class="user_wrap">
    <view class="user_info_wrap">
      <view class="top_bg">
        <image
          :src="
            'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLMjY9MagN4MH0Xzjmq25DCuvegEQSb1spjsaQjhpz4qsleVG6oBos9vFddeb246jO4s3QYPWGFfw/132'
          "
          mode="aspectFill"
        />
        <view class="mask"></view>
      </view>
      <view class="user_info">
        <view class="user_img">
          <image
            :src="
              'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLMjY9MagN4MH0Xzjmq25DCuvegEQSb1spjsaQjhpz4qsleVG6oBos9vFddeb246jO4s3QYPWGFfw/132'
            "
          />
          <view
            class="user_attention"
            @click="handleAttention"
            :class="{ has_attention: isAttention }"
            v-if="userInfo.openid != openid && isLogin"
          >
            <template v-if="isAttention"> 已关注 </template>
            <template v-else> <text>+</text>关注 </template>
          </view>
        </view>
        <view class="name">
          Dragon
        </view>
        <view class="last_time"> 5天前来过 </view>
        <view class="relation">
          <text class="attention" @click="handleUserRelationNavigate(0)"
            ><text class="distinct">1</text>关注</text
          >
          <text class="fans" @click="handleUserRelationNavigate(1)"
            ><text class="distinct">2</text>粉丝</text
          >
        </view>
        <view class="introduction">
          加入择良{10天了}了...
        </view>
      </view>
    </view>
    <view class="segmented_control">
      <segmented-control
        :values="items.map((v) => v.name + ' ' + v.num)"
        :current="current"
        @ClickItem="handleClickItem"
        active-color="#444"
        width="100vw"
      ></segmented-control>
    </view>
    <swiper
      class="segment_slider"
      :current="current"
      @change="handleSliderChange"
      :style="{ height: swiperHeight ? swiperHeight + 'rpx' : 'auto' }"
    >
      <swiper-item class="publish" :class="{ current: current === 0 }">
        <user-publish :publishList="publishList"></user-publish>
      </swiper-item>
      <swiper-item class="dynamic" :class="{ current: current === 1 }">
        <user-dynamic
          :dynamicList="dynamicList"
          @cancel="handleCancelDynamic"
        ></user-dynamic>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import segmentedControl from '@/components/segmented-control/index'
import userPublish from './user-publish/index'
import userDynamic from './user-dynamic/index'
let app = getApp()
import moment from 'moment'
// 设置时间为中文
moment.locale('zh-cn')
export default {
  data() {
    return {
      items: [
        { name: '发布', num: 0 },
        { name: '动态', num: 0 },
      ],
      current: 0,
      userInfo: { attention_count: 0, fans_count: 0 },
      openid: app.globalData.openid,
      isAttention: false,
      // 发布信息
      publishList: [1, 2],
      publishRequest: {
        user_id: '',
        visitor_id: app.globalData.openid,
        limit: 10,
        skip: 0,
        order: 'user_detail_date',
      },
      publishHasMore: true,
      // 动态信息
      dynamicList: [{type: 1}, {type: 2}],
      dynamicRequest: {
        user_id: '',
        visitor_id: app.globalData.openid,
        limit: 10,
        skip: 0,
        order: 'user_detail_dynamic',
      },
      dynamicHasMore: true,

      swiperHeight: 0,
      isLogin: !!app.globalData.userInfo,
    }
  },
  methods: {
    handleClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex
      }
    },

    // 当滑动改变选中
    handleSliderChange(e) {
      this.current = e.detail.current
    },

    // 跳转用户关注页面
    handleUserRelationNavigate(index) {
      uni.navigateTo({
        url: `/pages/user_relation/index?current=${index}&user_id=${this.userInfo.openid}`,
      })
    },

    // 获取用户详情信息
    async getUserDetail(user_id) {
      let res = await this.request({
        url: this.baseUrl + 'index/User/user',
        data: {
          user_id: user_id,
          visitor_id: app.globalData.openid,
          order: 'user_detail',
        },
      })
      // this.getPublishList()
      // this.getDynamicList()

      // 设置关注状态
      this.isAttention = res.userInfo.isAttention
      // 计算加入和最后一次登录时间
      res.userInfo.join_fromNow = moment(res.userInfo.join_time).fromNow(true)
      res.userInfo.last_fromNow = moment(res.userInfo.last_time).fromNow()
      this.userInfo = res.userInfo

      uni.stopPullDownRefresh()
    },

    // 获取打卡信息
    async getPublishList() {},
    // 获取动态信息
    async getDynamicList() {},

    // 当访问其他人信息时，点击关注按钮
    async handleAttention() {
      if (this.isAttention) {
        let res = (
          await uni.showModal({
            content: '确定要取消关注吗',
          })
        )[1]
        if (res.confirm) {
          this.isAttention = !this.isAttention
          this.setAttentionUser()
        }
      } else {
        this.isAttention = !this.isAttention
        this.setAttentionUser()
      }
    },
    async setAttentionUser() {
      let res = await this.request({
        url: this.baseUrl + 'index/User/attention',
        data: {
          active_id: app.globalData.openid,
          passive_id: this.userInfo.openid,
          isAttention: this.isAttention,
          order: 'set',
        },
      })
      uni.showToast({ title: res.msg, icon: 'none' })
    },

    // 改变收藏状态
    handleChangeCollection(index) {
      this.punchList[index].isCollect = !this.punchList[index].isCollect
    },

    // 处理动态删除
    handleCancelDynamic(e) {
      this.dynamicList.splice(e, 1)
    },
  },
  onLoad(options) {
    this.user_id = options.user_id
    // this.getUserDetail(options.user_id)
  },
  watch: {
    current() {
      switch (this.current) {
        case 0:
          this.swiperHeight = Math.ceil(this.publishList.length) * 353 + 70
          return
        case 1:
          this.swiperHeight = Math.ceil(this.dynamicList.length) * 260 + 70
          return
      }
    },
  },
  components: {
    segmentedControl,
    userPublish,
    userDynamic,
  },
  onPullDownRefresh() {
    // 清空发布信息
    this.publishRequest.skip = 0
    this.publishHasMore = true
    this.publishList = []
    // 清空动态信息
    this.dynamicRequest.skip = 0
    this.dynamicHasMore = true
    this.dynamicList = []
    // 重新获取数据
    this.getUserDetail(this.user_id)
  },
  onReachBottom() {
    switch (this.current) {
      case 0:
        // 加载发布数据
        if (this.dateHasMore) {
          this.dateRequest.skip += this.dateRequest.limit
          this.getPublishList()
        } else {
          this.showHasMoreToast()
        }
        break
      case 1:
        // 加载动态数据
        if (this.dynamicHasMore) {
          this.dynamicRequest.skip += this.dynamicRequest.limit
          this.getDynamicList()
        } else {
          this.showHasMoreToast()
        }
        break
    }
  },
}
</script>

<style lang="scss" scoped>
.user_wrap {
  .user_info_wrap {
    color: #fff;
    padding: 50rpx 40rpx;
    position: relative;
    overflow: hidden;
    .top_bg {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      image {
        height: 100%;
        filter: blur(10px);
      }
      .mask {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: rgba(0, 0, 0, 0.4);
      }
    }
    .user_info {
      position: relative;
      .user_img {
        display: flex;
        justify-content: space-between;
        align-items: center;
        image {
          width: 150rpx;
          height: 150rpx;
          border-radius: 50%;
        }
        .user_attention {
          background: $redColor;
          height: 60rpx;
          width: 150rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 30rpx;
          font-weight: bold;
          text {
            margin-right: 10rpx;
          }
        }
        .has_attention {
          background: #999;
        }
      }
      .name {
        padding: 25rpx 0;
        font-size: 40rpx;
      }
      .last_time {
        font-size: 25rpx;
      }
      .relation {
        font-size: 25rpx;
        padding: 25rpx 0;
        .distinct {
          font-size: 28rpx;
          font-weight: bold;
          margin-right: 10rpx;
        }
        .attention {
          padding-right: 35rpx;
        }
      }
    }
  }
  .segmented_control {
    height: 90rpx;
    background: #fff;
  }
  .segment_slider {
    // height: 100vh;
  }
}
</style>
