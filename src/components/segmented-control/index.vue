<template>
    <scroll-view scroll-x="" class="control_list">
        <view class="item_wrap" :style="{width: width}">
            <view
            class="control_item"
            v-for="(item, index) in values"
            :key="item"
            @click="handleControlClick(index)"
            >
                <text class="control_text" :class="{control_active: index===current}" :style="{color: index===current?activeColor:''}">{{item}}</text>
            </view>
            <view class="indicator" :style="{transform: 'translateX('+indicatorLeft+'px)', width: indicatorWidth+'px'}"></view>
        </view>
    </scroll-view>
</template>

<script>
export default {
    props: {
        values: {
            type: Array,
            default: []
        },
        current: {
            type: Number,
            default: 0
        },
        activeColor: {
            type: String,
            default: '#007aff'
        },
        width: {
            type: String,
            default: 'auto'
        }
    },
    data () {
        return {
            indicatorLeft: 0,
            indicatorWidth: 30
        }
    },
    methods: {
        // 点击切换选中
        handleControlClick (index) {
            if (index != this.current) {
                this.setItemSelectLine(index)
            }
            this.$emit('ClickItem', {currentIndex: index})
            
        },

        // 设置选中项目下的线条位置
        setItemSelectLine (index) {
            let scrollLeft = 0
            // 获取选中item的left的width并设置
            const query = uni.createSelectorQuery().in(this);
            // 获取当前滚动的距离
            query.select('.control_list').fields({
                scrollOffset: true
            }, data => {
                scrollLeft = data.scrollLeft
            })

            let control_text = query.selectAll('.control_text')
            control_text.fields({
                size: true,
                rect:true
            }, data => {
                this.indicatorLeft = data[index].left + scrollLeft
                this.indicatorWidth = data[index].width
            }).exec();
        }
    },
    mounted () {
        // 获取默认选中item的left的width并设置
        this.setItemSelectLine(this.current)
    },
    watch: {
        current () {
            // current改变时，获取选中item的left的width并设置
            this.setItemSelectLine(this.current)
        }
    }
}
</script>

<style lang="scss" scoped>
    .control_list {
        height: 100%;
        .item_wrap {
            display: flex;
            height: 100%;
            position: relative;
            .control_item {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                .control_text {
                    color: #888;
                    transition-duration: 0.5s;
                    vertical-align: bottom;
                }
                .control_active {
                    // color: #444;
                    font-size: 30rpx;
                    font-weight: bold;
                }
            }
        }
        .indicator {
            height: 6rpx;
            border-radius: 3rpx;
            width: 100rpx;
            background-color: $theme-color;
            position: absolute;
            bottom: 0;
            left: 0;
            transition-property: transform;
            transition-duration: 0.5s;
        }
        
    }
</style>