import Vue from 'vue'
import App from './App'
// import request from '@/static/utils/request'

Vue.config.productionTip = false

// Vue.prototype.request = request
Vue.prototype.showHasMoreToast = () => {
  uni.showToast({ title: '没有更多数据了', icon: 'none' })
}

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
