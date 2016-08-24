var model = {
    title: {
        required: true, minlength: 3, maxlength: 5,
        msg: {required: '必填', minlength: '最少3个字符', maxlength: '最多5个字符'}
    },
    city: {type: 'enum', enum: ['2', '3'], msg: {enum: '请选择一个'}},
    sex: {
        required: true,
        msg: {'required': '必填'}
    },
    color: {
        required: true,
        msg: {'required': '必填'}
    },
    mobile: {
        required: true, type: 'remote',
        remote: function (val, cb) {
            setTimeout(function () {
                cb(false);
            }, 1000);
        },
        msg: {required: '必填', remote: '手机号不存在'}
    },
    number: {
        type: 'number',
        msg: {number: '请输入数字'}
    },
    more: {
        required: true,
        type: ['number', 'mobile'],
        range: [3, 1000000000000],
        msg: {required: '必填', number: '不是数字', range: '3-1000000000000之间', mobile: '不是手机号'}
    }
}

module.exports = model;