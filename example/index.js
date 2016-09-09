var vueValidator = require('../src');
var Vue = require('vue');
var model = require('./model');
Vue.use(vueValidator, {autoHint: true});

vueValidator.addValidation('XXX', function (val) {
    return val == 1;
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
        more: '',
        validationError: {}//可加可不加,按照vue的规范最好加上
    },
    computed: {
        color(){
            //多选框值
            let arr = ['a', 'b', 'c', 'd'];
            let color = [];
            this.colors.forEach((boo, idx)=> {
                if (boo) {
                    color.push(arr[idx]);
                }
            });
            return color;
        }
    },
    init: function () {
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
            console.log('$validate--->', this.$validate('number', '11'));
            this.$validate('mobile', '18210695143', function (err) {
                console.log(err);
            });
        }
    },
    validate: function (error, value, uid, el) {
        //error: 错误信息
        //value: 元素的值
        //uid: 错误的ID,通过this.validationError[uid]
        //el: 指令绑定的元素
    }
});
