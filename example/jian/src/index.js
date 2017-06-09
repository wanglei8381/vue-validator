/* eslint-disable */
import Vue from 'vue'
import App from './App.vue'

import vueValidator from '@/src'
var model = require('./model')
Vue.use(vueValidator, { autoHint: true, field: 'errs' })

vueValidator.addValidation('mobile', function (value) {
  return /^1\d{10}$/.test(value);
})

new Vue({
  el: '#app',
  render (h) {
    return <App></App>
  }
})
