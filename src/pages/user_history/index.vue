<template>
  <view class="history_wrap">
    <view class="history_list" v-for="(item, index) in 5" :key="index">
      <view class="time"><!--{{ Object.keys(item)[0] }}-->今天</view>
      <view class="history_item" v-for="(item1, index1) in 4" :key="item1.id">
        <!-- item[Object.keys(item)[0]] -->
        <view
          class="nav_wrap"
          @click="handlePunchDetailNavigate(index, index1)"
        >
          <view class="img_wrap">
            <image
              :src="
                'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLMjY9MagN4MH0Xzjmq25DCuvegEQSb1spjsaQjhpz4qsleVG6oBos9vFddeb246jO4s3QYPWGFfw/132'
              "
              mode="aspectFill"
            />
          </view>
          <view class="info">
            <view class="content">
              内容
            </view>
            <view class="region">
              重庆 | 南岸
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import moment from 'moment'
// 设置时间为中文
moment.locale('zh-cn')
let app = getApp()
export default {
  data() {
    return {
      historyList: [],
      imgBase: this.imgUrl,
    }
  },
  methods: {
    async getHistoryList(id) {
      let res = await this.request({
        url: this.baseUrl + 'index/User/history',
        data: {
          user_id: app.globalData.openid,
          order: 'get',
        },
      })

      // this.historyList = res
      let sectionList = [{}]
      let len = 0

      res.forEach((v, i) => {
        v.images = JSON.parse(v.images)
        let region = v.region.split(' ')
        v.location = region[1].slice(0, -1) + ' | ' + region[2].slice(0, -1)

        let formatTime = moment(v.history_time).format('YYYY-MM-DD')
        if (formatTime === moment().format('YYYY-MM-DD')) {
          v.history_time = '今天'
        } else if (
          formatTime ===
          moment()
            .subtract(1, 'days')
            .format('YYYY-MM-DD')
        ) {
          v.history_time = '昨天'
        } else {
          v.history_time = formatTime
        }
        if (!sectionList[len][v.history_time]) {
          if (i != 0) {
            len++
            sectionList[len] = {}
          }
          sectionList[len][v.history_time] = []
        }
        sectionList[len][v.history_time].push(v)
      })

      this.historyList = sectionList
    },

    handlePunchDetailNavigate(index, index1) {
      let item_info = this.historyList[index][
        Object.keys(this.historyList[index])[0]
      ][index1]
      app.globalData.punchDetail = item_info
      uni.navigateTo({ url: '/pages/punch_detail/index' })
    },
  },
  onLoad(options) {
    // this.getHistoryList(options.user_id)
  },
  components: {},
}
</script>

<style lang="scss" scoped>
.history_wrap {
  background: #f6f7f8;
  min-height: 100vh;
  padding: 30rpx;
  .time {
    padding: 20rpx 0 15rpx 0;
    color: #333;
    font-size: 26rpx;
  }
  .history_list {
    background: #fff;
    border-radius: 15rpx;
    padding: 0 30rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 0 20rpx #ddd;
    .history_item {
      &:nth-child(n):not(:last-child) {
        border-bottom: 1rpx solid #eee;
      }
      .nav_wrap {
        display: flex;
        padding: 30rpx 0;
        .img_wrap {
          width: 150rpx;
          height: 150rpx;
          image {
            height: 100%;
            border-radius: 10rpx;
          }
        }
        .info {
          height: 150rpx;
          padding-left: 30rpx;
          width: 480rpx;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          .content {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            font-size: 24rpx;
            color: #333;
          }
          .region {
            font-size: 22rpx;
            color: #aaa;
          }
        }
      }
    }
  }
}
</style>
