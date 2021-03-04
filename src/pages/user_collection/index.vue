<template>
  <view class="main_wrap">
    <view class="collection_list">
      <view class="collection_item" v-for="(item, index) in 4" :key="item">
        <view class="header">
          <view class="user_nav_wrap" @click="handleUserDetailNavigate()">
            <image
              :src="
                'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLMjY9MagN4MH0Xzjmq25DCuvegEQSb1spjsaQjhpz4qsleVG6oBos9vFddeb246jO4s3QYPWGFfw/132'
              "
              mode="widthFix"
            />
            <text class="name">Dragon</text>
          </view>
          <text class="time">6天前</text>
        </view>

        <view class="middle" @click="handlePostDetailNavigate(item)">
          <view class="punch_img">
            <image
              :src="
                'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLMjY9MagN4MH0Xzjmq25DCuvegEQSb1spjsaQjhpz4qsleVG6oBos9vFddeb246jO4s3QYPWGFfw/132'
              "
              mode="aspectFill"
            />
          </view>
          <view class="content">
            <view class="description">
              内容
            </view>
            <view class="location">
              重庆 | 南岸
            </view>
          </view>
        </view>

        <view class="footer">
          <view class="cancel" @click="handleCancelCollection(item.id, index)">
            取消收藏
          </view>
          <view class="contact" v-if="item.user_info.openid != openid">
            私聊
          </view>
        </view>
      </view>
      <view class="has_more" v-if="!hasMore">...没有更多数据了</view>
    </view>
  </view>
</template>

<script>
let app = getApp()
import moment from 'moment'
// 设置时间为中文
moment.locale('zh-cn')
export default {
  data() {
    return {
      collectionList: [],
      imgBase: this.imgUrl,
      requestData: {
        user_id: app.globalData.openid,
        limit: 10,
        skip: 0,
        order: 'get',
      },
      hasMore: true,
      openid: app.globalData.openid,
    }
  },
  methods: {
    async getCollectionList() {
      let res = await this.request({
        url: this.baseUrl + 'index/User/collection',
        data: this.requestData,
      })

      // 判断是否还有更多数据
      if (res.length === 0) {
        this.hasMore = false
        uni.showToast({ title: '没有更多数据了...', icon: 'none' })
        return
      }

      res.forEach((v) => {
        v.fromNow = moment(v.publish_date).fromNow()
        let region = v.region.split(' ')
        v.location = region[1].slice(0, -1) + ' | ' + region[2].slice(0, -1)
        v.images = JSON.parse(v.images)
      })
      this.collectionList = [...this.collectionList, ...res]
      uni.stopPullDownRefresh()
    },

    // 跳转用户详情页
    handleUserDetailNavigate(user_id) {
      uni.navigateTo({
        url: `/pages/user_detail/index?user_id=${user_id}`,
      })
    },

    async handleCancelCollection(id, index) {},

    // 跳转帖子详情
    handlePostDetailNavigate(item) {},
  },

  onLoad() {
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f6f7f8',
    })
    // this.getCollectionList()
  },

  // 下拉刷新，清除数据
  onPullDownRefresh() {
    this.collectionList = []
    this.requestData.skip = 0
    this.hasMore = true
    this.getCollectionList()
  },

  // 触底翻页
  onReachBottom() {
    if (this.hasMore) {
      this.requestData.skip += this.requestData.limit
      this.getCollectionList()
    } else {
      uni.showToast({ title: '没有更多数据了...', icon: 'none' })
    }
  },
}
</script>

<style lang="scss" scoped>
.main_wrap {
  background: #f6f7f8;
  .collection_list {
    padding: 35rpx;
    .collection_item {
      background: #fff;
      box-shadow: 0 0 20rpx #eee;
      padding: 25rpx 25rpx 15rpx 25rpx;
      border-radius: 15rpx;
      margin: 30rpx 0;
      .header {
        height: 50rpx;
        .user_nav_wrap {
          float: left;
          image {
            width: 50rpx;
            height: 50rpx;
            border-radius: 50%;
            display: inline-block;
            vertical-align: middle;
          }
          .name {
            color: #333;
            font-size: 26rpx;
            margin-left: 10rpx;
            vertical-align: middle;
          }
        }
        .time {
          float: right;
          font-size: 24rpx;
          color: #888;
          height: 100%;
          display: flex;
          align-items: center;
        }
      }
      .middle {
        display: flex;
        height: 160rpx;
        margin: 25rpx 0 30rpx 0;
        width: 100%;
        .punch_img {
          flex: 4;
          image {
            height: 160rpx;
            width: 160rpx;
            border-radius: 10rpx;
          }
        }
        .content {
          flex: 11;
          padding-left: 25rpx;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          .description {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            font-size: 25rpx;
            color: #333;
          }
          .price {
            font-size: 25rpx;
            color: $redColor;
            margin-bottom: 5rpx;
            text {
              font-size: 35rpx;
            }
          }
          .location {
            font-size: 22rpx;
            color: #aaa;
          }
        }
      }
      .footer {
        display: flex;
        justify-content: flex-end;
        padding-top: 15rpx;
        border-top: 1px solid #f8f8f8;
        width: 100%;
        view {
          border: 1rpx solid #333;
          height: 50rpx;
          border-radius: 25rpx;
          margin-left: 25rpx;
          width: 150rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #444;
          font-size: 25rpx;
        }
        .cancel {
        }
        .contact {
          color: $redColor;
          border: 1rpx solid $redColor;
        }
      }
    }
    .has_more {
      text-align: center;
    }
  }
}
</style>
