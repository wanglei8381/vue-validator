/* eslint-disable */
var model = {
  title: {
    required: true, minlength: 3, maxlength: 5,
    msg: { required: '必填', minlength: '最少3个字符', maxlength: '最多5个字符' }
  },
  city: { type: 'enum', enum: ['2', '3'], msg: { enum: '请选择一个' } },
  sex: {
    required: true,
    msg: { 'required': '必填' }
  },
  color: {
    required: true,
    msg: { 'required': '必填' }
  },
  mobile: {
    required: true,
    type: ['mobile', 'remote', 'XXX'],
    remote: function (val, ctx, cb) {
      setTimeout(function () {
        cb(false);
      }, 1000);
    },
    msg: { required: '必填', mobile: '手机格式不正确', remote: '手机号不存在', XXX: '' }
  },
  pwd: {
    required: true,
    length: [3, 10],
    msg: { required: '必填', length: '密码长度在3-10' }
  },
  repwd: {
    required: true,
    length: [3, 10],
    check: function (val) {
      return val === this.pwd
    },
    msg: { required: '必填', length: '密码长度在3-10', check: '两次密码不一致' }
  },
  more: {
    required: true,
    type: 'number',
    range: [1, 10],
    check: function (val) {
      return val % 2 === 0;
    },
    msg: { required: '必填', number: '不是数字', range: '1-10之间', check: '不是1-10之间对偶数' }
  }
}

module.exports = model;
