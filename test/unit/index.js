import Vue from 'vue'
import 'babel-polyfill'
Vue.config.productionTip = false

// 测试用例
const testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)
