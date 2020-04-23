import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/zh-TW'
import { VueCropper } from 'vue-cropper'

Vue.use(ElementUI, { locale });

Vue.component('vue-cropper', VueCropper);
Vue.component('cropper', require('./components/Cropper.vue').default);
Vue.component('img-cropper-upload', require('./components/ImgCropperUpload.vue').default);

new Vue({
  el: '#app',
  render: h => h(App)
})
