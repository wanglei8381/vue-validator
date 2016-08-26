var validate = require('./validate');
require('./commonRule')(validate);

//遇到对问题
//单选框多选框待校验

var validator = {};

validator.install = function (Vue, options) {

    options = options || {};
    if (options.autoHint) {
        //引入错误提示的css
        require('./style.styl');
    }
    var __uid = 0;
    Vue.directive('validator', {
        acceptStatement: true,
        bind: function () {
            this.__uid = '_' + __uid++;
            this.vm.$set('validationError.' + this.__uid, null);
            if (options.autoHint) {
                autoHint.call(this);
            }
        },
        update: function (value, oval) {
            //刚进页面不进行校验
            if (oval === undefined) return;
            if (!this.vm.__validationModel) return;
            if (this.arg in this.vm.__validationModel) {
                var validationError = validate.call(this, this.vm.__validationModel[this.arg], value, (err)=> {
                    this.vm.validationError[this.__uid] = err;
                });
                this.vm.validationError[this.__uid] = validationError;
                if (validationError && typeof this.vm.$options.validate === 'function') {
                    this.vm.$options.validate.call(this.vm, validationError, value, this.__uid, this.el);
                }
            }

        },
        unbind: function () {
        }
    });

    //验证一个规则
    Vue.prototype.$validate = function (ruleName, value, cb) {
        if (!this.__validationModel || !(ruleName in this.__validationModel)) return true;
        return validate.call(this, this.__validationModel[ruleName], value, cb);
    }

    //初始化验证
    //不执行该方法,则不会进行验证
    Vue.prototype.$initValidate = function (model) {
        if (!model)return;
        this.__validationModel = model;
    }

    //验证所有规则是否通过,返回true:通过,false:不通过
    //对remote规则异步校验,不会阻止后续操作
    Vue.prototype.$isValid = function () {
        if (!this.__validationModel) {
            return true;
        }

        var pass = true;
        this._directives.forEach((dir)=> {
            if (dir.name === 'validator' && (dir.arg in this.__validationModel)) {
                //手动触发校验
                dir.update(dir._watcher.value, '');
                var validationError = this.validationError[dir.__uid];
                if (validationError) {
                    pass = false;
                    if (validationError && typeof this.$options.validate === 'function') {
                        this.$options.validate.call(this, validationError, dir._watcher.value, dir.__uid, dir.el);
                    }
                }
            }
        });

        return pass;
    }
}

//自动提示
function autoHint() {
    var hint = document.createElement('div');
    // hint.setAttribute('v-show', 'validationError.' + this.__uid);
    hint.setAttribute('class', 'err-tip-wrap');
    hint.innerHTML = '<div class="err-tip"><div class="err-tip-msg">{{validationError.' + this.__uid + '}}</div></div>';
    before(hint, this.el);
    this.vm.$compile(hint);
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

function getStyle(ele, pseudo) {
    return window.getComputedStyle(ele, pseudo);
}
function getVal(attr) {
    return getPropertyValue(attr).call(this);
}

validator.addValidation = validate.addValidation;
module.exports = validator;