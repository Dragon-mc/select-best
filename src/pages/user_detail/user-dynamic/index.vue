<template>
  <view class="dynamic_wrap">
    <view class="dynamic_list">
      <view
        class="dynamic_item"
        v-for="(item, index) in dynamicList"
        :key="item.id"
      >
        <view class="top_info">
          <text class="time"> 3-04<!--{{item.format_time}}--> </text>
          <text class="dynamic_type">
            <template v-if="item.type == 1">发布了帖子</template>
            <template v-else-if="item.type == 2">查询了院校</template>
          </text>
          <text
            v-if="openid == item.user_id"
            class="iconfont icon-cha"
            @click="handleCancelDynamic(item.id, index)"
          ></text>
        </view>
        <view class="bottom_info">
          <view
            class="dynamic_description"
            :class="{ style2: item.type == 2 }"
            @click="handleDetailNavigate(item.type, item.dynamic_detail)"
          >
            <view class="img_wrap" v-if="item.type == 1">
              <image
                :src="
                  'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLMjY9MagN4MH0Xzjmq25DCuvegEQSb1spjsaQjhpz4qsleVG6oBos9vFddeb246jO4s3QYPWGFfw/132'
                "
                mode="widthFix"
              />
            </view>
            <view class="img_wrap_aspectFill" v-else>
              <template v-if="item.type == 1"
                ><image
                  :src="
                    'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLMjY9MagN4MH0Xzjmq25DCuvegEQSb1spjsaQjhpz4qsleVG6oBos9vFddeb246jO4s3QYPWGFfw/132'
                  "
                  mode="aspectFill"
              /></template>
              <template v-else
                ><image
                  :src="
                    'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLMjY9MagN4MH0Xzjmq25DCuvegEQSb1spjsaQjhpz4qsleVG6oBos9vFddeb246jO4s3QYPWGFfw/132'
                  "
                  mode="aspectFill"
              /></template>
            </view>
            <view class="right_info">
              <text class="title">
                <template v-if="item.type == 1"
                  >标题<!--{{
                  item.dynamic_detail.topic
                }}--></template
                >
                <template v-else
                  >内容<!--{{ item.dynamic_detail.content }}--></template
                >
              </text>
              <text class="content">
                <template v-if="item.type == 1">内容<!--{{
                  item.dynamic_detail.content
                }}--></template>
                <template v-else>重庆 | 沙坪坝<!--{{
                  item.dynamic_detail.format_region
                }}--></template>
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
let app = getApp()
export default {
  props: {
    dynamicList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      imgBase: this.imgUrl,
      openid: app.globalData.openid,
    }
  },
  methods: {
    // 跳转各自详情页
    handleDetailNavigate(type, item) {
      if (type == 1) {
        app.globalData.appointmentDetail = item
        uni.navigateTo({
          url: `/pages/appointment_detail/index`,
        })
      } else if (type == 2) {
        app.globalData.punchDetail = item
        uni.navigateTo({
          url: `/pages/punch_detail/index`,
        })
      }
    },

    async handleCancelDynamic(id, index) {
      let res = (
        await uni.showModal({
          title: '提示',
          content: '你确定删除这条动态吗？',
        })
      )[1]
      if (res.confirm) {
        let res = await this.request({
          url: this.baseUrl + 'index/dynamic/cancel',
          data: {
            id: id,
          },
        })
        uni.showToast({ title: res.msg, icon: 'none' })
        if (res.msg == '删除成功') {
          this.$emit('cancel', index)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.dynamic_wrap {
  padding: 40rpx;
  background: #fff;
  .dynamic_list {
    .dynamic_item {
      // padding: 20rpx 0;
      padding-bottom: 30rpx;
      .top_info {
        .time {
          font-size: 30rpx;
          color: #222;
          font-weight: 600;
          width: 100rpx;
          display: inline-block;
        }
        .dynamic_type {
          color: #222;
          font-size: 32rpx;
          font-weight: 600;
        }
        .icon-cha {
          font-size: 20rpx;
          float: right;
          margin-top: 11rpx;
        }
      }
      .bottom_info {
        margin-left: 100rpx;
        padding: 35rpx 0;
        .dynamic_description {
          display: flex;
          height: 120rpx;
          .img_wrap {
            display: flex;
            align-items: center;
            image {
              width: 80rpx;
              border-radius: 50%;
            }
          }
          .right_info {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            // padding-left: 25rpx;
            padding: 15rpx 0 15rpx 25rpx;
            width: 490rpx;
            text {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .title {
              font-size: 26rpx;
              color: #333;
            }
            .content {
              font-size: 22rpx;
              color: #888;
            }
          }
        }
        .style2 {
          background: #eee;
          border-radius: 10rpx;
          overflow: hidden;
          .img_wrap_aspectFill {
            image {
              height: 120rpx;
              width: 120rpx;
            }
          }
          .right_info {
            width: 450rpx;
          }
        }
      }
    }
  }
}
</style>
