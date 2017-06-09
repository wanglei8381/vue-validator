import {
  isRegExp,
  isString,
  isArray,
  isFunction,
  isEmpty,
  isNumber
} from './util'

import { rules } from './buildinRule'

/**
 * 验证规则：
 * 1：字段为空，使用默认值default代替
 * 2：是否是required字段
 * 3：使用type判断字段类型
 * 4: 使用check判断是否通过
 */
function validate (rule, ctx, cb) {
  let {
    msg = {},
    required,
    type,
    minlength,
    maxlength,
    min,
    max
  } = rule

  let { value } = ctx

  if (isEmpty(value)) {
    value = rule.default
  }

  if (isEmpty(value)) {
    if (required) {
      return cb(msg.required)
    } else {
      return cb()
    }
  }

  // 验证类型，默认是string
  let types = type
  if (types) {
    if (!isArray(types)) {
      types = [types]
    }
  } else {
    types = ['string']
  }

  for (let i = 0, len = types.length; i < len; i++) {
    let type = types[i]
    if (isString(type)) {
      switch (type) {
        case 'string':
          value = String(value)
          if (isNumber(minlength) && value.length < minlength) {
            return cb(msg.minlength)
          }

          if (isNumber(maxlength) && value.length > maxlength) {
            return cb(msg.maxlength)
          }

          if (isArray(rule.length) && (value.length < rule.length[0] || value.length > rule.length[1])) {
            return cb(rule.msg && rule.msg.length)
          }
          break
        case 'number':
          value = Number(value)
          if (!value) {
            return cb(msg.number)
          }
          if (isNumber(min) && value < min) {
            return cb(msg.min)
          }
          if (isNumber(max) && value > max) {
            return cb(msg.max)
          }
          if (isArray(rule.range) && (value < rule.range[0] || value > rule.range[1])) {
            return cb(msg.range)
          }
          break
        case 'remote':
          if (isFunction(rule.remote)) {
            rule.remote.call(this, value, ctx, function (boo) {
              boo ? cb() : cb(msg.remote)
            })
          }
          break
        case 'enum':
          if (isArray(rule.enum) && rule.enum.indexOf(value) === -1) {
            return cb(msg.enum)
          }
          break
        default:
          if (type in rules) {
            var res = rules[type].call(this, value, ctx)
            if (!res) {
              return cb(rule.msg && rule.msg[type])
            }
          }
          break
      }
    } else if (isRegExp(type)) {
      if (!type.test(value)) {
        return cb(msg.regexp)
      }
    }
  }

  if (isFunction(rule.check)) {
    if (!rule.check.call(this, value, ctx)) {
      return cb(msg.check)
    }
  }

  cb()
}

export default validate
