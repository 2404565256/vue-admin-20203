import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./router/premit";

Vue.use(ElementUI);
Vue.use(VueCompositionApi);

// 自定义全局组件
import './icons'


Vue.config.productionTip = false;

// runtime模式
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
