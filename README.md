# vue-lite-validator

## Install
npm install vue-lite-validator

## Use
import validator from 'vue-lite-validator'
Vue.use(validator, options)

> options:

  autoHint: 是否自动引入错误提示（在元素后面追加错误dom节点，引入错误样式，比较简单的错误提示），默认false
  field: 验证插件默认会在vue组件上添加一个属性，用于保存错误对象信息，默认是errors

> addValidation: 添加一个通用的规则

  添加一个规则,如
  ```javascript
  addValidation('mobile', function (value, ctx) {
    return /^1\d{10}$/.test(value);
  })
  ```

> 第一步：编写验证规则model

例子：
```javascript
  export default {
    title: {
      required: true,
      minlength: 3,
      maxlength: 5,
      msg: {required: '必填', minlength: '最少3个字符', maxlength: '最多5个字符'}
    },
    city: {
      type: 'enum', 
      enum: ['2', '3'], 
      msg: {enum: '请选择一个'}
    },
    mobile: {
      required: true,
      type: ['mobile', 'remote'],
      remote: function (val, ctx, cb) {
        setTimeout(function () {
            cb(false);
        }, 1000);
      },
      msg: {required: '必填', mobile: '手机格式不正确', remote: '手机号不存在'}
    },
    num: {
      required: true,
      type: 'number',
      range: [1, 10],
      check: function (val) {
        return val % 2 === 0;
      },
      msg: { required: '必填', number: '不是数字', range: '1-10之间', check: '不是1-10之间对偶数' }
    }
  }
  ```
  
> 第二步：初始化验证规则

在vue组件中，初始化规则

如：
```
beforeCreate () {
  this.$initValidate(model)
}
```
> 第三步：在模版中使用

如：
```html
<input
v-model="title"
v-validator:title="title" 
>
// 或
<input 
v-model="title"
v-validator:title="title" 
key="title">
// 或
<input 
v-model="title"
v-validator:title="{value:title, key:'title'}" 
>
```

> 第四步：错误处理

如果设置autoHint为true，会自动错误提示，因为样式比较单一，一般不满足需求。

插件在vue组件的data中添加一个errors属性，保存错误信息，可以自己设置错误提示
errors的key的可以这样设置如下：
```
1. 在dom节点上添加key属性，如：<input v-model="title" v-validator:title="title" key="title">
2. 指令的值为普通对象，如：<input v-model="title" v-validator:title="{value:title, key:'title'}">
3. 如果不设置，默认会取指令的arg作为key,如：<input v-model="title" v-validator:title="title">
```

## model验证规则

> key

属性key作为指令的arg，将验证规则绑定在一起

> 规则

1. default: 默认值，当value为空时取值
2. required: 是否必填，默认false
3. type: 
