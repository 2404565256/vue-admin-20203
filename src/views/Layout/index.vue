<template>
  <div id="layout" :class="[menuStatus ? 'close' : 'open']">
    <LayoutHeader />
    <LayoutNav />
    <LayoutMain />
  </div>
</template>

<script>
import LayoutHeader from "./Components/Header";
import LayoutNav from "./Components/Nav";
import LayoutMain from "./Components/Main";
import { reactive, ref, onMounted, computed } from "@vue/composition-api";

export default {
  name: "layout",
  components: {
    LayoutHeader,
    LayoutNav,
    LayoutMain
  },
  setup(props, { root }) {
    const menuStatus = computed(() => root.$store.state.app.isCollapse);

    /**
     * 生命周期
     */
    // 挂载完成后
    onMounted(() => {
      // console.log(process.env.VUE_APP_ABC);
    });

    return { menuStatus };
  }
};
</script>

<style lang="scss" scoped>
</style>
