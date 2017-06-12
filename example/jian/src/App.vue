<template>
  <ul id="example">
    <li>title: <input v-validator:title="title" data-key="title2" type="text" v-model="title"></li>
    <li>city:
      <select v-validator:city="city" v-model="city">
        <option value="1">请选择</option>
        <option value="2">北京</option>
        <option value="3">上海</option>
      </select>
    </li>
    <li>sex:
      <label><input type="radio" name="sex" v-model="sex" value="1">男</label>
      <label><input v-validator:sex="sex" type="radio" name="sex" v-model="sex" value="2">女</label>
    </li>
    <li>color:
      <label><input type="checkbox" v-model="colors" value="红">红</label>
      <label><input type="checkbox" v-model="colors" value="黄">黄</label>
      <label><input type="checkbox" v-model="colors" value="白">白</label>
      <label><input v-validator:color="colors.length" type="checkbox" v-model="colors" value="黑">黑</label>
    </li>
    <li>mobile:
      <label><input v-validator:mobile="mobile" type="text" v-model="mobile"></label>
    </li>
    <li>密码:
      <label><input v-validator:pwd="pwd" type="text" v-model="pwd"></label>
    </li>
    <li>确认密码:
      <label><input v-validator:repwd="repwd" type="text" v-model="repwd"></label>
    </li>
    <li>复杂的验证:
      <label><input v-validator:more="more" type="text" v-model="more"></label>
    </li>
    <li>
      <button @click="submit" type="button">SUBMIT</button>
      <button @click="check" type="button">CHECK</button>
    </li>
  </ul>
</template>
<script type="text/babel">
  import model from './model'
  export default{
    data () {
      return {
        title: '',
        city: 1,
        sex: null,
        colors: [],
        mobile: '',
        pwd: '',
        repwd: '',
        more: ''
      }
    },
    methods: {
      submit: function () {
        this.$isValid().then(() => {
          console.log('--->通过')
        }).catch(() => {
          console.log('--->没通过')
        })
      },
      check: function () {
        this.$validate('number', '11').then(() => {
          console.log('number----OK')
        }).catch((err) => {
          console.log('number', err)
        })

        this.$validate('mobile', '18210695143').then(() => {
          console.log('mobile----OK')
        }).catch((err) => {
          console.log('mobile', err)
        })
      }
    },

    beforeCreate () {
      this.$initValidate(model)
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  #example li {
    margin-top 30px
  }
</style>
