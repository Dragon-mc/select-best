<template>
  <view class="user_wrap">
    <view class="user_info_wrap">
      <view class="login_bg" v-if="!hasUserInfo">
        <view class="login">
          <button
            open-type="getUserInfo"
            lang="zh_CN"
            @getuserinfo="getUserInfo"
          >
            立即登录
          </button>
        </view>
      </view>
      <view class="user_info" @click="handleUserDetailNavigate" v-else>
        <view class="head_wrap">
          <image :src="userInfo.avatarUrl" mode="widthFix" />
        </view>
        <view class="user_description">
          <view class="info_wrap">
            <view class="name">Dragon</view>
            <view class="join_time">来到这里15天</view>
          </view>
          <view class="arrow"> <view></view> </view>
        </view>
      </view>
      <view class="user_relation">
        <view
          class="relation_item"
          v-for="item in relationList"
          :key="item.id"
          @click="handleRelationNavigate(item.id)"
        >
          <view class="num">{{ item.num }}</view>
          <view class="name">{{ item.name }}</view>
        </view>
      </view>
    </view>
    <view class="data_manage">
      <view class="title">数据</view>
      <view class="data_wrap">
        <view class="data_item">
          我发布的
        </view>
        <view class="data_item" @click="handleFeedbackNavigate">
          用户反馈
        </view>
      </view>
    </view>
    <view class="setup">
      <view class="title">设置</view>
      <view class="info">
        <view class="contact block">
          用户协议
        </view>
        <view class="checkUpdate block">
          检查更新
        </view>
        <view class="identify block">
          身份认证
        </view>
        <view class="profile block">
          账户资料
        </view>
      </view>
    </view>
    <view class="share">
      推荐应用
      <button open-type="share"></button>
    </view>
  </view>
</template>

<script>
let app = getApp()
export default {
  data() {
    return {
      relationList: [
        { id: 0, name: '收藏', num: 0 },
        { id: 1, name: '关注', num: 0 },
        { id: 2, name: '粉丝', num: 0 },
        { id: 3, name: '历史', num: 0 },
      ],
      userInfo: {},
      hasUserInfo: false,
    }
  },
  methods: {
    // 第一排联系页面的跳转
    handleRelationNavigate(index) {
      // if (!this.hasUserInfo) return;
      switch (index) {
        case 0:
          // 收藏
          uni.navigateTo({ url: '/pages/user_collection/index' })
          break
        case 1:
          // 关注
          uni.navigateTo({
            url: `/pages/user_relation/index?current=0&user_id=${app.globalData.openid}`,
          })
          break
        case 2:
          uni.navigateTo({
            url: `/pages/user_relation/index?current=1&user_id=${app.globalData.openid}`,
          })
          // 粉丝
          break
        case 3:
          // 历史
          uni.navigateTo({ url: '/pages/user_history/index' })
          break
      }
    },

    // 获取user界面展示信息
    async getUserAllList(user_id) {},

    // 点击按钮，获取用户信息
    getUserInfo(e) {
      if (!e.detail.userInfo) {
        uni.showToast({ title: '授权失败！', icon: 'none' })
        return
      }
      let userInfo = e.detail.userInfo
      app.globalData.userInfo = userInfo
      this.userInfo = userInfo
      this.hasUserInfo = true

      this.getUserAllList(app.globalData.openid)

      this.setUserInfo(userInfo)
    },

    // 保存用户信息
    async setUserInfo(userInfo) {},

    // 跳转用户详情页
    handleUserDetailNavigate() {
      uni.navigateTo({
        url: `/pages/user_detail/index?user_id=${app.globalData.openid}`,
      })
    },
    // 跳转反馈页
    handleFeedbackNavigate() {
      if (!this.hasUserInfo) {
        uni.showToast({ title: '请登录后操作！', icon: 'none' })
        return
      }
      uni.navigateTo({
        url: `/pages/user_feedback/index?user_id=${app.globalData.openid}`,
      })
    },
  },

  onLoad() {
    if (app.globalData.userInfo) {
      this.userInfo = app.globalData.userInfo
      this.hasUserInfo = true
    } else if (uni.canIUse('button.open-type.getUserInfo')) {
      app.globalData.userInfoReadyCallback = (res) => {
        this.userInfo = res.userInfo
        this.hasUserInfo = true
      }
    }
  },

  onShow() {
    // 用回调解决初次调用这个界面，openid还没有接收到的情况
    if (!app.globalData.openid) {
      app.globalData.openidReady = (openid) => {
        this.openid = openid
        this.getUserAllList(openid)
      }
    } else {
      this.getUserAllList(app.globalData.openid)
    }
  },
  onPullDownRefresh() {
    this.getUserAllList(app.globalData.openid)
  },
}
</script>

<style lang="scss" scoped>
.user_wrap {
  min-height: 100vh;
  background: #f6f7f8;
  padding: 35rpx;
  .user_info_wrap {
    background: #fff;
    border-radius: 25rpx;
    box-shadow: 0 0 50rpx #eee;
    .login_bg {
      background: var(--themeColor);
      display: flex;
      justify-content: center;
      .login {
        height: 300rpx;
        button {
          background: #fff;
          font-size: 30rpx;
          width: 220rpx;
          padding: 15rpx 20rpx;
          top: 30%;
        }
      }
    }
    .user_info {
      display: flex;
      padding: 25rpx 0 20rpx 0;
      .head_wrap {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        image {
          width: 80%;
          border-radius: 50%;
        }
      }
      .user_description {
        flex: 4;
        display: flex;
        .info_wrap {
          flex: 5;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          padding-left: 20rpx;
          .name {
            font-size: 35rpx;
            color: #555;
            font-weight: bold;
          }
          .join_time {
            font-size: 22rpx;
            color: #aaa;
          }
        }
        .arrow {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding-right: 20rpx;
          view {
            border-top: 2rpx solid #888;
            border-right: 2rpx solid #888;
            width: 18rpx;
            height: 18rpx;
            transform: rotate(45deg);
          }
        }
      }
    }
    .user_relation {
      display: flex;
      padding: 25rpx 0;
      .relation_item {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .num {
          font-weight: bold;
          font-size: 32rpx;
        }
        .name {
          font-size: 24rpx;
          color: #aaa;
          margin-top: 5rpx;
        }
      }
    }
  }

  .data_manage {
    background: #fff;
    border-radius: 25rpx;
    margin-top: 30rpx;
    .title {
      border-bottom: 1rpx solid #eee;
      margin: 0 25rpx;
      padding: 25rpx 0;
      font-weight: bold;
    }
    .data_wrap {
      .data_item {
        padding: 20rpx 0;
        margin: 0 30rpx;
        font-size: 25rpx;
        border-bottom: 1rpx solid #eee;
      }
    }
  }

  .setup {
    background: #fff;
    margin-top: 30rpx;
    border-radius: 25rpx;
    .title {
      padding: 25rpx 0;
      margin: 0 25rpx;
      font-weight: bold;
      border-bottom: 1rpx solid #eee;
    }
    .info {
      .block {
        padding: 20rpx 0;
        margin: 0 30rpx;
        border-bottom: 1rpx solid #eee;
        font-size: 25rpx;
        position: relative;
        button {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          opacity: 0;
        }
      }
      .about {
        border: 0;
      }
    }
  }

  .share {
    background: #fff;
    margin-top: 30rpx;
    border-radius: 25rpx;
    padding: 20rpx 30rpx;
    font-size: 25rpx;
    position: relative;
    button {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      opacity: 0;
    }
  }
}
</style>
