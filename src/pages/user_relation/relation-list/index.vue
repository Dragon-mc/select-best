<template>
  <view class="relation_list">
    <view class="relation_item" v-for="(item, index) in 4" :key="item.id">
      <view class="left_wrap" @click="handleUserDetailNavigate(item.openid)">
        <view class="img_wrap">
          <image :src="'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLMjY9MagN4MH0Xzjmq25DCuvegEQSb1spjsaQjhpz4qsleVG6oBos9vFddeb246jO4s3QYPWGFfw/132'" mode="widthFix" />
        </view>
        <view class="desc_wrap">
          <view class="name">
            Dragon
          </view>
          <view class="desc"> <!--{{ item.fromNow }}-->3天前加入择良 </view>
        </view>
      </view>
      <view class="status" @click="handleAttention(index)">
        <template v-if="item.isAttention">
          <text class="iconfont icon-yiguanzhu"></text>
          <text>已关注</text>
        </template>
        <template v-else>
          <text class="iconfont icon-guanzhu"></text>
          <text class="attention_text">关注TA</text>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: [],
    },
  },
  methods: {
    // 触发关注按钮事件
    handleAttention(index) {
      this.$emit('clickAttention', index)
    },

    // 触发跳转用户详情事件
    handleUserDetailNavigate(user_id) {
      this.$emit('userDetailNavigate', user_id)
    },
  },
}
</script>

<style lang="scss" scoped>
.relation_list {
  background: #fff;
  .relation_item {
    display: flex;
    padding: 40rpx 35rpx;
    border-bottom: 1px solid #eee;
    .left_wrap {
      display: flex;
      .img_wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        image {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
        }
      }
      .desc_wrap {
        padding-left: 35rpx;
        padding-right: 10rpx;
        width: 525rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .name {
          color: #444;
          font-weight: bold;
          font-size: 30rpx;
        }
        .desc {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 26rpx;
          color: #888;
        }
      }
    }
    .status {
      font-size: 23rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      .iconfont {
        font-size: 45rpx;
      }
      .icon-guanzhu {
        color: rgb(235, 68, 80);
      }
      .attention_text {
        color: rgb(235, 68, 80);
      }
    }
  }
}
</style>
