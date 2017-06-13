/* eslint-disable */
export default {
  title: {
    required: true, minlength: 2, maxlength: 7, length: [4, 5],
    msg: { minlength: '最少2个字符', maxlength: '最多7个字符', length: '长度4-5' }
  },
  city: { type: 'enum', enum: ['2', '3'] },
  color: {
    type: /^color/,
    msg: { regexp: '以color开头' }
  },
  mobile: {
    required: true,
    type: ['mobile', 'remote'],
    remote: function (val, ctx, cb) {
      setTimeout(function () {
        cb(val === '13033333333')
      }, 0)
    },
    msg: { required: '必填', mobile: '手机格式不正确', remote: '手机号不存在' }
  },
  num: {
    required: true,
    type: 'number',
    min: 0,
    max: 20,
    range: [1, 10],
    check: function (val) {
      return val % 2 === 0;
    },
    msg: {
      required: '必填',
      number: '不是数字',
      min: '最小值0',
      max: '最大值20',
      range: '1-10之间',
      check: '不是1-10之间对偶数'
    }
  },
  money: {
    type: 'money',
    msg: { money: 'money' }
  },
  ip: {
    type: 'ip',
    msg: { ip: 'ip' }
  },
  idcard: {
    type: 'idcard',
    msg: { idcard: 'idcard' }
  }
}
