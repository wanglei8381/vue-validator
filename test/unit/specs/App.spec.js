import Vue from 'vue'
import App from 'pages/home/src/App.vue'

describe('App.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(App)
    const vm = new Constructor().$mount()
    expect(vm.$el.textContent)
      .to.equal('this is template body')
  })
})
