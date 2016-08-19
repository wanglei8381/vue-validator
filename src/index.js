var validate = require('./validate');

//遇到对问题
//单选框多选框待校验

var validator = {};

validator.install = function (Vue, options) {


    var Vue = require('vue');
    var __uid = 0;
    Vue.directive('validator', {
        acceptStatement: true,
        bind: function () {
            if (options.autoHint) {
                this.__uid = '_' + __uid++;
                this.vm.$set('validationError.' + this.__uid, null);
                autoHint.call(this);
            }
        },
        update: function (value, oval) {
            if (oval === undefined) return;
            if (!this.vm.__validationModel) return;
            if (this.arg in this.vm.__validationModel) {
                var validationError = validate.call(this, this.vm.__validationModel[this.arg], value);
                this.vm.validationError[this.__uid] = validationError;
                if (validationError && typeof this.vm.$options.validate === 'function') {
                    this.vm.$options.validate.call(this.vm, validationError, this.el, value);
                }
            }

        },
        unbind: function () {
        }
    });


    Vue.prototype.$validate = function (model) {
        if (!model)return;
        this.__validationModel = model;
    }

    Vue.prototype.$isValid = function () {
        if (!this.__validationModel) {
            return true;
        }

        var pass = true;
        this._directives.forEach((dir)=> {
            if (dir.name === 'validator' && (dir.arg in this.__validationModel)) {
                if (this.__validationModel[dir.arg].type != 'remote') {
                    dir.update(dir.el.value, '');
                }
                var validationError = this.validationError[dir.__uid];
                if (validationError) {
                    pass = false;
                    if (validationError && typeof this.$options.validate === 'function') {
                        this.$options.validate.call(this, validationError, dir.el, dir.el.value);
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