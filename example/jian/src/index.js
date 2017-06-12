/* eslint-disable */
import Vue from 'vue'
import App from './App.vue'

import vueValidator from '@/src'
var model = require('./model')
Vue.use(vueValidator, {
  autoHint: true,
  field: 'errors',
  messages: {
    required: '必填',
    mobile: '手机格式不正确',
    remote: '手机号不存在',
    enum: '请选择一个'
  }
})

vueValidator.addValidation('mobile', function (value) {
  return /^1\d{10}$/.test(value);
})

new Vue({
  el: '#app',
  render (h) {
    return <App></App>
  }
})
