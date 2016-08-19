var model = {
    title: {required: true, minlength: 3, maxlength: 5, msg: {minlength: 'minlength', maxlength: 'maxlength'}},
    desc: {required: true, length: [5, 7], msg: {length: 'length'}},
    score: {
        required: true,
        type: 'integer+0',
        min: 0,
        max: 100,
        msg: {'integer+0': 'integer+0', min: 'min', max: 'max'}
    },
    age: {required: true, type: 'number', range: [22, 32], msg: {range: 'range'}},
    status: {required: true, type: 'enum', enum: ['1', '2', '3'], msg: {enum: 'enum', required: 'required'}},
    attr: {
        check: function (value) {
            return true
        }, msg: {check: 'check'}
    },
    'a.b': {required: true, minlength: 3, maxlength: 5, msg: {minlength: 'minlength', maxlength: 'maxlength'}},
    'a.c.d': {required: true, minlength: 0, maxlength: 5, msg: {minlength: 'minlength', maxlength: 'maxlength'}},
    'a.c.e': {required: true, minlength: 3, maxlength: 5, msg: {minlength: 'minlength', maxlength: 'maxlength'}},
    'email': {required: true, type: 'email', msg: {email: 'email'}}
}

module.exports = model;