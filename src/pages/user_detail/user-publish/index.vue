<template>
  <view class="publish_wrap">
    <view
      class="discovery_item"
      @click="handleNavigatePostDetail(item)"
      v-for="item in publishList"
      :key="item.id"
    >
      <view class="user_info_wrap">
        <view class="user_info">
          <image
            class="head_img"
            :src="
              'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLMjY9MagN4MH0Xzjmq25DCuvegEQSb1spjsaQjhpz4qsleVG6oBos9vFddeb246jO4s3QYPWGFfw/132'
            "
            mode="widthFix"
          />
          <view class="name">Dragon<!--{{ item.user_info.nickName }}--></view>
        </view>
        <view class="fromNow">2天前<!--{{ item.fromNow }}--></view>
      </view>
      <view class="title">
        这是发布的标题<!--{{ item.title }}-->
      </view>
      <view class="content">
        这是发布的内容<!--{{ item.content }}-->
      </view>
    </view>
  </view>
</template>

<script>
let app = getApp()
export default {
  props: {
    publishList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {}
  },
  methods: {
    handleNavigatePostDetail(item) {
      app.globalData.appointmentDetail = item
      uni.navigateTo({
        url: `/pages/appointment_detail/index`,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.publish_wrap {
  padding: 0 0 35rpx 0;
  .discovery_item {
    background: #fff;
    padding: 25rpx;
    margin: 35rpx 35rpx 0 35rpx;
    border-radius: 45rpx 45rpx 25rpx 25rpx;
    box-shadow: 0 0 50rpx #eee;
    z-index: 5;
    .user_info_wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .user_info {
        display: flex;
        align-items: center;
        .head_img {
          width: 50rpx;
          height: 50rpx;
          border-radius: 50%;
        }
        .name {
          margin-left: 25rpx;
          font-weight: bold;
          font-size: 25rpx;
        }
      }
      .fromNow {
        float: right;
        font-size: 24rpx;
      }
    }
    .title {
      padding: 10rpx 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #555;
    }
    .content {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      line-clamp: 3;
      -webkit-box-orient: vertical;
      color: #333;
    }
  }
}
</style>
