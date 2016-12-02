var vueValidator = require('../src');
var Vue = require('vue');
var model = require('./model');
Vue.use(vueValidator, {autoHint: true});

vueValidator.addValidation('mobile', function (value) {
    return /^1\d{10}$/.test(value);
});

Vue.config.devtools = false;
var vm = new Vue({
    el: '#example',
    data: {
        title: '',
        city: 1,
        sex: null,
        colors: [],
        mobile: '',
        pwd: '',
        repwd: '',
        more: ''
    },
    beforeCreate: function () {
        this.$initValidate(model);
    },
    methods: {
        submit: function () {
            var isValid = this.$isValid();
            this.$validate('mobile', '18210695143', function (err) {
                console.log(err);
            });
            console.log(JSON.stringify(this.$data));
            if (!isValid) {
                console.log('不通过');
            } else {
                console.log('通过');
            }
        },
        check: function () {
            this.$validate('number', '11', function (err) {
                console.log('$validate--->', err);
            });
            this.$validate('mobile', '18210695143', function (err) {
                console.log(err);
            });
        }
    },
    validate: function (error, value, uid, el) {
        //error: 错误信息
        //value: 元素的值
        //el: 指令绑定的元素
    }
});
