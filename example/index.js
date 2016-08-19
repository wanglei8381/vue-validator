var vueValidator = require('../src');
var Vue = require('vue');
var model = require('./model');
Vue.use(vueValidator, {obo: 0});

vueValidator.addValidation('email', function (val) {
    return val == 1;
});

Vue.config.devtools = false;
var vm = new Vue({
    el: '#example',
    data: {
        title: 'a12345',
        desc: 'b1234567',
        score: 0,
        age: 10,
        status: 5,
        attr: 'c',
        a: {
            b: 'a.b',
            c: {
                d: 'd'
            }
        },
        email: '1',
        validationError: {a:''}//可加可不加,按照vue的规范最好加上
    },
    init: function () {
        this.$validate(model);
    },
    methods: {
        submit: function () {
            var isValid = this.$isValid();
            if (!isValid) {
                console.log('不通过');
            } else {
                console.log('通过');
            }
        }
    },
    validate: function (validationError, validationModel) {
        console.log(validationError);
    }
});
