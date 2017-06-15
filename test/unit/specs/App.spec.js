/* eslint-disable no-unused-expressions */
import Vue from 'vue'
import vueValidator from '@/src'
import App from './App.vue'

let options = {
  autoHint: true,
  field: 'errors',
  messages: {
    required: '必填',
    mobile: '手机格式不正确',
    remote: '手机号不存在',
    enum: '请选择一个',
    check: '检查失败'
  }
}

Vue.use(vueValidator, options)

function hasKey (obj, key) {
  return obj.hasOwnProperty(key)
}

function next (fn) {
  setTimeout(fn, 0)
}

const Constructor = Vue.extend(App)
const vm = new Constructor().$mount()

describe('vue-lite-validator', () => {
  it('vm存在errors属性', () => {
    expect(hasKey(vm, 'errors'))
      .to.be.true
  })

  it('errors存在name属性', () => {
    expect(hasKey(vm.errors, 'name'))
      .to.be.true
  })

  vm.$isValid().then(() => {
  }).catch(() => {
  })

  it('rule[required]', (done) => {
    expect(vm.errors.name)
      .to.equal('必填')

    vm.title = '1234'

    next(() => {
      expect(vm.errors.name)
        .to.equal(undefined)
      done()
    })
  })

  it('rule[minlength]', (done) => {
    vm.title = '1'

    next(() => {
      expect(vm.errors.name)
        .to.equal('最少2个字符')
      done()
    })
  })

  it('rule[maxlength]', (done) => {
    vm.title = '12345678'

    next(() => {
      expect(vm.errors.name)
        .to.equal('最多7个字符')
      done()
    })
  })

  it('rule[length]', (done) => {
    vm.title = '123'

    next(() => {
      expect(vm.errors.name)
        .to.equal('长度4-5')

      vm.title = '123456'

      next(() => {
        expect(vm.errors.name)
          .to.equal('长度4-5')

        done()
      })
    })
  })

  it('rule[enum]', (done) => {
    vm.city = '4'

    next(() => {
      expect(vm.errors.city)
        .to.equal('请选择一个')

      vm.city = '2'
      next(() => {
        expect(vm.errors.city)
          .to.equal(undefined)
        done()
      })
    })
  })

  it('rule[number]', (done) => {
    vm.num = 'number'

    next(() => {
      expect(vm.errors.num)
        .to.equal('不是数字')
      done()
    })
  })

  it('rule[mix]', (done) => {
    vm.num = -1

    next(() => {
      expect(vm.errors.num)
        .to.equal('最小值0')
      done()
    })
  })

  it('rule[max]', (done) => {
    vm.num = 21

    next(() => {
      expect(vm.errors.num)
        .to.equal('最大值20')
      done()
    })
  })

  it('rule[range]', (done) => {
    vm.num = 11

    next(() => {
      expect(vm.errors.num)
        .to.equal('1-10之间')

      vm.num = 0
      next(() => {
        expect(vm.errors.num)
          .to.equal('1-10之间')
        done()
      })
    })
  })

  it('rule[mobile]', (done) => {
    vm.mobile = 11

    next(() => {
      expect(vm.errors.mobile)
        .to.equal('手机格式不正确')

      done()
    })
  })

  it('rule[remote]', (done) => {
    vm.mobile = '18210695141'

    setTimeout(() => {
      expect(vm.errors.mobile)
        .to.equal('手机号不存在')

      done()
    }, 10)
  })

  it('rule[check]', (done) => {
    vm.num = 1

    next(() => {
      expect(vm.errors.num)
        .to.equal('不是1-10之间对偶数')

      done()
    })
  })

  it('rule[regex]', (done) => {
    vm.color = 'colo'

    next(() => {
      expect(vm.errors.color)
        .to.equal('以color开头')

      done()
    })
  })

  it('rule[money]', (done) => {
    vm.money = 'aaa'

    next(() => {
      expect(vm.errors.money)
        .to.equal('money')

      done()
    })
  })

  it('rule[ip]', (done) => {
    vm.ip = 127

    next(() => {
      expect(vm.errors.ip)
        .to.equal('ip')

      done()
    })
  })

  it('rule[idcard]', (done) => {
    vm.idcard = 341222111122223344

    next(() => {
      expect(vm.errors.idcard)
        .to.equal('idcard')

      done()
    })
  })

  it('rule[doVerify:false]', (done) => {
    vm.$validate('before', false).then(done).catch(done)
  })

  it('rule[doVerify:true]', (done) => {
    vm.$validate('before', true).then(done).catch((err) => {
      expect(err.message)
        .to.equal('doVerify')
      done()
    })
  })

  it('not init validator', (done) => {
    const vm2 = new Vue({
      render () {
        return <h1></h1>
      }
    }).$mount()

    vm2.$isValid().then(done).catch(done)
  })

  it('$isValid: rule not exist', (done) => {
    options.autoHint = false
    new Vue({
      data: {
        title: ''
      },

      render () {
        const directives = [
          { name: 'validator', value: this.title, arg: 'title' }
        ]
        return <h1 {...{ directives }} ></h1>
      },

      beforeCreate () {
        this.$initValidate({})
      },

      mounted () {
        this.$isValid().then(done).catch(done)
      }
    }).$mount()
  })

  it('$isValid: all rules pass', (done) => {
    options.autoHint = false
    new Vue({
      data: {
        title: 'abc'
      },

      render () {
        const directives = [
          { name: 'validator', value: this.title, arg: 'title' }
        ]
        return <h1 {...{ directives }} ></h1>
      },

      beforeCreate () {
        this.$initValidate({
          title: {}
        })
      },

      mounted () {
        this.$isValid().then(done).catch(done)
      }
    }).$mount()
  })

  it('$validate: rule not exist', (done) => {
    vm.$validate('mobile2', '18210695333').then(done).catch(done)
  })

  it('$validate: ok', (done) => {
    vm.$validate('mobile', '13033333333').then(done).catch(done)
  })

  it('destroy', (done) => {
    var uid = vm._uid
    vm.$destroy()

    next(() => {
      expect(Object.keys(Vue.errorCache[uid]).length === 0)
        .to.be.true

      done()
    })
  })
})
