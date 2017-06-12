import validate from './validate'
import { addValidation } from './buildinRule'
import { isObject } from './util'
import { disposeMessages } from './config'

const validator = {}

validator.install = function (Vue, options = {}) {
  if (options.autoHint) {
    // 引入错误提示的css
    require('./style.styl')
  }

  let { field = 'errors' } = options

  disposeMessages(options.messages)

  let uid = 0

  // 错误缓存对象
  const cache = {}

  // 给vue实例添加errors属性
  Vue.mixin({
    data () {
      return {
        [field]: {}
      }
    }
  })

  Vue.directive('validator', {
    inserted: function (el, binding, vnode) {
      const vm = vnode.context
      const errorCache = cache[vm._uid] = cache[vm._uid] || {}
      let id = uid++
      el._erruid = id

      // 对错误对象设置属性
      // 默认先从value取key
      // 如果不存在从dom节点获取key作为属性
      // 如果还不存在用指令的arg作为参数，如果存在多个这样的arg会新的会覆盖久的
      // 建议都设置一个key
      let value = binding.value
      let key
      let _isObject = false
      if (isObject(value)) {
        _isObject = true
        key = value.key
        value = value.value
      }
      if (!key) {
        key = el.getAttribute('data-key')
      }
      if (!key) {
        key = binding.arg
      }
      Vue.set(vm[field], key, '')

      // 设置一份上下文, 用于通信
      const context = errorCache[id] = {
        // errors的key
        key: key,
        // 当前绑定的节点
        target: el,
        // 验证通过
        pass: false,
        // 错误信息
        msg: null,
        // 保存的值
        value: value,
        // 原始数据
        data: binding.value,
        oldValue: value,
        // value是对象
        isObject: _isObject,
        // 验证规则
        rule: binding.arg,
        // 验证函数
        check: function () {
          this.pass = !this.msg
          vm.errors[key] = this.msg

          // 对错误进行展示
          if (options.autoHint) {
            if (this.msg) {
              this.msgEl.innerHTML = this.msg
              this.el.style.display = null
            } else {
              this.msgEl.innerHTML = ''
              this.el.style.display = 'none'
            }
          }
        }
      }

      if (options.autoHint) {
        context.el = autoHint.call(this, el)
        context.msgEl = context.el.querySelector('.err-tip-msg')
      }
    },
    update: function (el, binding, vnode) {
      const vm = vnode.context
      if (!vm.__validationModel) return

      const errorCache = cache[vm._uid]
      const context = errorCache[el._erruid]
      context.value = context.isObject ? binding.value.value : binding.value
      context.oldValue = context.isObject ? binding.oldValue.value : binding.oldValue
      context.data = binding.value
      // 刚进页面和值没有更改不进行校验
      if (context.value === context.oldValue) return

      // 验证规则
      var validationModel = vm.__validationModel[binding.arg]

      if (validationModel) {
        validate.call(vm, validationModel, context, function (validationError) {
          context.msg = validationError
          context.check()
        })
      }
    },
    unbind: function (el, binding, vnode) {
      cache[vnode.context._uid][el._erruid] = null
    }
  })

  // 验证一个规则
  Vue.prototype.$validate = function (ruleName, value, cb) {
    if (!this.__validationModel || !(ruleName in this.__validationModel)) {
      cb()
    } else {
      validate.call(this, this.__validationModel[ruleName], { value: value }, cb)
    }
  }

  // 初始化验证规则
  // 不执行该方法,则不会进行验证
  Vue.prototype.$initValidate = function (model) {
    if (model) {
      this.__validationModel = model
    }
  }

  // 验证所有规则是否通过,返回true:通过,false:不通过
  // 不对remote规则异步校验,需要手动调用$validate验证一个规则
  Vue.prototype.$isValid = function () {
    if (!this.__validationModel) {
      return true
    }

    var pass = true
    var errorCache = cache[this._uid]

    for (var key in errorCache) {
      var errorObj = errorCache[key]

      // 验证规则
      var validationModel = this.__validationModel[errorObj.rule]

      if (validationModel) {
        validate.call(this, validationModel, errorObj, function (validationError) {
          errorObj.msg = validationError
          errorObj.check()
        })
      }

      if (!errorObj.pass) {
        pass = false
      }
    }

    return pass
  }
}

// 自动提示
function autoHint (el) {
  var hint = document.createElement('div')
  hint.setAttribute('class', 'err-tip-wrap')
  hint.innerHTML = '<div class="err-tip"><div class="err-tip-msg"></div></div>'
  hint.style.display = 'none'
  before(hint, el)
  return hint
}

function before (el, target) {
  target.parentNode.insertBefore(el, target)
}

validator.addValidation = addValidation

export default validator
