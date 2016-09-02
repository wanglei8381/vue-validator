// vue-validator验证插件

// 验证规则
// default: 默认值
// type: 类型   string,number,integer,integer+,integer+0,integer-,regexp,remote,enum,以及自定义规则
// min: 数值的最小值
// max: 数值的最大值
// range: 数值范围
// minlength: 字符串最小长度
// maxlength: 字符串最大长度
// length: 字符串范围
// required: 必填
// enum: 枚举
// check: 检查函数
// render: 渲染函数
// msg: 错误提示信息
var rules = {
    default: null,
    type: 'string',
    min: null,
    max: null,
    range: [],
    minlength: 0,
    maxlength: null,
    length: [],
    required: false,
    enum: null,
    remote: null,
    check: null,
    msg: null
};
//新增规则容器
var stack = {};

/**
 * 验证规则：
 * 1：字段为空，使用默认值default代替
 * 2：是否是required字段
 * 3：使用type判断字段类型
 * 4: 使用check判断是否通过
 */
function validate(rule, value, cb) {
    if (isEmpty(value)) {
        value = rule.default;
    }
    if (isEmpty(value)) {
        if (rule.required) {
            return rule.msg && rule.msg.required;
        } else {
            return;
        }
    }

    var types = rule.type;
    if (types) {
        if (!isArray(types)) {
            types = [types];
        }
    } else {
        types = ['string'];
    }

    for (var i = 0, len = types.length; i < len; i++) {
        var type = types[i];
        if (isString(type)) {
            switch (type) {
                case 'string':
                    if (rule.minlength != null && value.length < rule.minlength) {
                        return rule.msg && rule.msg.minlength;
                    }
                    if (rule.maxlength != null && value.length > rule.maxlength) {
                        return rule.msg && rule.msg.maxlength;
                    }
                    if (isArray(rule.length) && (value.length < rule.length[0] || value.length > rule.length[1])) {
                        return rule.msg && rule.msg.length;
                    }
                    break;
                case 'number':
                    if (!/^\d+$/.test(value)) {
                        return rule.msg && rule.msg.number;
                    }
                    var result = validateNumber(rule, value);
                    if (result !== true) {
                        return result;
                    }
                    break;
                case 'integer':
                    if (!/^-?[1-9]\d*$/.test(value)) {
                        return rule.msg && rule.msg.integer;
                    }
                    var result = validateNumber(rule, value);
                    if (result !== true) {
                        return result;
                    }
                    break;
                case 'integer+':
                    if (!/^[1-9]\d*$/.test(value)) {
                        return rule.msg && rule.msg['integer+'];
                    }
                    var result = validateNumber(rule, value);
                    if (result !== true) {
                        return result;
                    }
                    break;
                case 'integer+0':
                    if (!/^0|[1-9]\d*$/.test(value)) {
                        return rule.msg && rule.msg['integer+0'];
                    }
                    var result = validateNumber(rule, value);
                    if (result !== true) {
                        return result;
                    }
                    break;
                case 'integer-':
                    if (!/^-[1-9]\d*$/.test(value)) {
                        return rule.msg && rule.msg['integer-'];
                    }
                    var result = validateNumber(rule, value);
                    if (result !== true) {
                        return result;
                    }
                    break;
                case 'remote':
                    if (isFunction(rule.remote) && isFunction(cb)) {
                        rule.remote.call(this, value, function (boo) {
                            boo ? cb() : cb(rule.msg && rule.msg.remote);
                        });
                    }
                    break;
                case 'enum':
                    if (isArray(rule.enum) && rule.enum.indexOf(value) === -1) {
                        return rule.msg && rule.msg.enum;
                    }
                    break;
                default:
                    if (type in stack) {
                        var res = stack[type].call(this, value);
                        if (!res) {
                            return rule.msg && rule.msg[type];
                        }
                    }
                    break;
            }
        } else if (isRegExp(type)) {
            if (!type.test(value)) {
                return rule.msg && rule.msg.regexp;
            }
        }
    }

    if (isFunction(rule.check)) {
        if (!rule.check.call(this, value)) {
            return rule.msg && rule.msg.check;
        }
    }

}

function addValidation(type, handle) {
    stack[type] = handle;
}

function validateNumber(rule, value) {
    value = +value;
    if (rule.min != null && value < rule.min) {
        return rule.msg && rule.msg.min;
    }
    if (rule.max != null && value > rule.max) {
        return rule.msg && rule.msg.max;
    }
    if (isArray(rule.range) && (value < rule.range[0] || value > rule.range[1])) {
        return rule.msg && rule.msg.range;
    }
    return true;
}

function isEmpty(obj) {
    if (obj == null) return true;
    if (typeof obj.length === 'number') return obj.length === 0;
    return false;
}

function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]'
}

function isString(obj) {
    return Object.prototype.toString.call(obj) === '[object String]'
}

function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
}

function isFunction(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]'
}

module.exports = validate;
validate.rules = rules;
validate.addValidation = addValidation;