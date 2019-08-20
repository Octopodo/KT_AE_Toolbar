import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import store from './store'
import KtDivider from './components/KtDivider'

// function toolbar_init(){
//   return new Promise((reject, resolve)=>{
//     new CSInterface().requestOpenExtension('com.kt.tools.server');
//   })
// }

// toolbar_init().then(()=>{
//   console.log("server launched")
// });

Vue.config.productionTip = false
Vue.component('kt-divider', KtDivider)
new Vue({
  components: {
    KtDivider
  },
  store,
  render: h => h(App)
}).$mount('#app');
console.log('vue init')

  

