<template>
  <ul>
    <li v-validator:title="title" data-key="name">title</li>
    <li v-validator:city="city">city</li>
    <li v-validator:color="color">color</li>
    <li v-validator:mobile="mobile">mobile</li>
    <li v-validator:num="num">number</li>
    <li v-validator:money="money">buildinRule</li>
    <li v-validator:ip="ip">ip</li>
    <li v-validator:idcard="idcard">idcard</li>
  </ul>
</template>
<script type="text/babel">
  import model from './model'
  export default{
    data () {
      return {
        title: '',
        city: '1',
        color: '',
        mobile: '',
        num: '',
        money: '',
        ip: '',
        idcard: ''
      }
    },

    beforeCreate () {
      this.$initValidate(model)
    }
  }
</script>
