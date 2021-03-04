<template>
  <view class="main_wrap">
    <view class="segmented_control">
      <segmented-control
        :values="items.map((v) => v.name + '(' + v.num + ')')"
        :current="current"
        @ClickItem="handleClickItem"
        active-color="#444"
        width="100vw"
      ></segmented-control>
    </view>
    <view class="content">
      <view class="attention" v-if="current === 0">
        <relation-list
          :list="relationList.attention"
          @clickAttention="handleAttention"
          @userDetailNavigate="handleUserDetailNavigate"
          :hasMore="attentionHasMore"
        ></relation-list>
      </view>
      <view class="fans" v-else>
        <relation-list
          :list="relationList.fans"
          @clickAttention="handleAttention"
          @userDetailNavigate="handleUserDetailNavigate"
          :hasMore="fansHasMore"
        ></relation-list>
      </view>
    </view>
  </view>
</template>

<script>
import segmentedControl from '@/components/segmented-control/index'
import relationList from './relation-list/index'
let app = getApp()
import moment from 'moment'
// 设置时间为中文
moment.locale('zh-cn')
export default {
  data() {
    return {
      items: [
        { name: '我的关注', num: 0 },
        { name: '我的粉丝', num: 0 },
      ],
      current: 0,
      relationList: { attention: [], fans: [] },
      user_id: '',
      attentionRequest: {},
      fansRequest: {},
      attentionHasMore: true,
      fansHasMore: true,
    }
  },
  methods: {
    handleClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex
      }
    },

    // 处理关注点击
    async handleAttention(index) {
      // 判断当前分段器的选项
      let nowTab = 'attention'
      if (this.current === 1) nowTab = 'fans'
      let nowTabInfo = this.relationList[nowTab][index]
      // 判断是关注还是取消关注，取消则弹出提示
      if (nowTabInfo.isAttention) {
        let res = (
          await uni.showActionSheet({
            itemList: ['确定不再关注TA了么?', '确定'],
          })
        )[1]

        if (res.tapIndex === 1) {
          this.relationList[nowTab][index].isAttention = !nowTabInfo.isAttention
          // 此时isAttention 状态为改变后的
          this.setAttentionUser(nowTabInfo.isAttention, nowTabInfo.openid)
        }
      } else {
        this.relationList[nowTab][index].isAttention = !nowTabInfo.isAttention
        this.setAttentionUser(nowTabInfo.isAttention, nowTabInfo.openid)
      }
    },
    async setAttentionUser(isAttention, passive_id) {
      let res = await this.request({
        url: this.baseUrl + 'index/User/attention',
        data: {
          active_id: app.globalData.openid,
          passive_id: passive_id,
          isAttention: isAttention,
          order: 'set',
        },
      })
      uni.showToast({ title: res.msg, icon: 'none' })
    },

    // 获取关注列表
    async getAttentionList() {
      let res = await this.request({
        url: this.baseUrl + 'index/User/attention',
        data: this.attentionRequest,
      })

      if (res.attention.length == 0) {
        this.attentionHasMore = false
        uni.showToast({ title: '没有更多数据了...', icon: 'none' })
        return
      }

      this.items[0].num = res.count
      res.attention.forEach((v) => (v.fromNow = moment(v.join_time).fromNow()))
      this.relationList.attention = [
        ...this.relationList.attention,
        ...res.attention,
      ]
      uni.stopPullDownRefresh()
    },

    // 获取粉丝列表
    async getFansList() {
      let res = await this.request({
        url: this.baseUrl + 'index/User/attention',
        data: this.fansRequest,
      })

      if (res.fans.length == 0) {
        this.fansHasMore = false
        uni.showToast({ title: '没有更多数据了...', icon: 'none' })
        return
      }

      this.items[1].num = res.count
      res.fans.forEach((v) => (v.fromNow = moment(v.join_time).fromNow()))
      this.relationList.fans = [...this.relationList.fans, ...res.fans]
      uni.stopPullDownRefresh()
    },

    // 处理用户详情跳转
    handleUserDetailNavigate(user_id) {
      uni.navigateTo({
        url: `/pages/user_detail/index?user_id=${user_id}`,
      })
    },
  },
  onLoad(options) {
    this.user_id = options.user_id

    this.attentionRequest = {
      user_id: options.user_id,
      visitor_id: app.globalData.openid,
      limit: 15,
      skip: 0,
      order: 'getAttention',
    }

    this.fansRequest = {
      user_id: options.user_id,
      visitor_id: app.globalData.openid,
      limit: 15,
      skip: 0,
      order: 'getFans',
    }

    // this.getAttentionList()
    // this.getFansList()
    this.current = options.current
    if (options.user_id != app.globalData.openid) {
      // 如果不是自己访问此页面
      this.items.forEach((v) => (v.name = v.name.replace('我', 'TA')))
    }
  },
  onPullDownRefresh() {
    this.attentionRequest.skip = 0
    this.relationList.attention = []
    this.fansRequest.skip = 0
    this.relationList.fans = []
    this.attentionHasMore = true
    this.fansHasMore = true
    this.getAttentionList()
    this.getFansList()
  },
  onReachBottom() {
    if (this.current == 0) {
      if (this.attentionHasMore) {
        this.attentionRequest.skip += this.attentionRequest.limit
        this.getRelationList()
      } else {
        uni.showToast({ title: '没有更多数据了...', icon: 'none' })
      }
    } else {
      if (this.fansHasMore) {
        this.fansRequest.skip += this.fansRequest.limit
        this.getFansList()
      } else {
        uni.showToast({ title: '没有更多数据了...', icon: 'none' })
      }
    }
  },
  components: {
    segmentedControl,
    relationList,
  },
}
</script>

<style lang="scss" scoped>
.main_wrap {
  background: #f6f7f8;
  min-height: 100vh;
  .segmented_control {
    background: #fff;
    border-bottom: 1px solid #eee;
    height: 90rpx;
    position: fixed;
    width: 100%;
  }
  .content {
    padding-top: 90rpx;
  }
}
</style>
