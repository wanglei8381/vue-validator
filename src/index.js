var validate = require('./validate');
require('./commonRule')(validate);

var validator = {};

validator.install = function (Vue, options) {

    options = options || {};
    if (options.autoHint) {
        //引入错误提示的css
        require('./style.css');
    }
    var uid = 0;
    //错误缓存对象
    var cache = {};
    Vue.directive('validator', {
        inserted: function (el, binding, vnode) {
            var errorCache = cache[vnode.context._uid] = cache[vnode.context._uid] || {};
            var key = uid++;
            el._erruid = key;
            var errObj = errorCache[key] = {
                srcEl: el,
                pass: false,//验证通过
                msg: null,//错误信息
                value: null,//保存的值
                rule: binding.arg,//验证规则
                check: function () {//验证函数
                    this.pass = !this.msg;
                    //对错误进行展示
                    if (this.el) {
                        if (this.msg) {
                            this.msgEl.innerHTML = this.msg;
                            this.el.style.display = null;
                        } else {
                            this.msgEl.innerHTML = '';
                            this.el.style.display = 'none';
                        }
                    }
                }
            };
            if (options.autoHint) {
                errObj.el = autoHint.call(this, el);
                errObj.msgEl = errObj.el.querySelector('.err-tip-msg');
            }
        },
        update: function (el, binding, vnode) {
            var errorCache = cache[vnode.context._uid];
            var errorObj = errorCache[el._erruid];
            errorObj.value = binding.value;
            // 刚进页面和值没有更改不进行校验
            if (binding.value === binding.oldValue) return;

            var vm = vnode.context;

            if (!vm.__validationModel) return;

            //验证规则
            var validationModel = vm.__validationModel[binding.arg];

            if (validationModel) {
                validate.call(vm, validationModel, binding.value, function (validationError) {

                    errorObj.msg = validationError;
                    errorObj.check();
                    if (validationError && typeof vm.$options.validate === 'function') {
                        vm.$options.validate.call(vm, validationError, el);
                    }
                });
            }
        },
        unbind: function (el, binding, vnode) {
            cache[vnode.context._uid][el._erruid] = null;
        }
    });

    //验证一个规则
    Vue.prototype.$validate = function (ruleName, value, cb) {
        if (!this.__validationModel || !(ruleName in this.__validationModel)) {
            cb();
        } else {
            validate.call(this, this.__validationModel[ruleName], value, cb);
        }
    }

    //初始化验证规则
    //不执行该方法,则不会进行验证
    Vue.prototype.$initValidate = function (model) {
        if (model) {
            this.__validationModel = model;
        }
    }

    //验证所有规则是否通过,返回true:通过,false:不通过
    //对remote规则异步校验,不会阻止后续操作
    Vue.prototype.$isValid = function () {
        if (!this.__validationModel) {
            return true;
        }

        var pass = true;
        var errorCache = cache[this._uid];

        for (var key in errorCache) {
            var errorObj = errorCache[key];


            //验证规则
            var validationModel = this.__validationModel[errorObj.rule];

            if (validationModel) {
                validate.call(this, validationModel, errorObj.value, function (validationError) {
                    errorObj.msg = validationError;
                    errorObj.check();
                });
            }

            if (!errorObj.pass) {
                pass = false;
                // break;
            }
        }

        return pass;
    }
}

//自动提示
function autoHint(el) {
    var hint = document.createElement('div');
    hint.setAttribute('class', 'err-tip-wrap');
    hint.innerHTML = '<div class="err-tip"><div class="err-tip-msg"></div></div>';
    hint.style.display = 'none';
    before(hint, el);
    return hint;
}

function before(el, target) {
    target.parentNode.insertBefore(el, target)
}

function after(el, target) {
    if (target.nextSibling) {
        before(el, target.nextSibling)
    } else {
        target.parentNode.appendChild(el)
    }
}

validator.addValidation = validate.addValidation;
module.exports = validator;