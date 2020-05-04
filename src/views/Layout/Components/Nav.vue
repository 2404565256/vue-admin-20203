<template>
  <div id="nav-wrap">
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="#344a5f"
      text-color="#fff"
      active-text-color="#fff"
      router
    >
      <template v-for="(item,index) in routers">
        <el-submenu v-if="!item.hidden" :key="item.id" :index="index+''">
          <template slot="title">
            <svg-icon :iconClass="item.meta.icon" :class="item.meta.icon" />
            <span slot="title">{{item.meta.name}}</span>
          </template>

          <el-menu-item
            v-for="item2 in item.children"
            :key="item2.id"
            :index="item2.path"
          >{{item2.meta.name}}</el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import {
  reactive,
  ref,
  isRef,
  toRefs,
  onMounted,
  computed
} from "@vue/composition-api";

export default {
  name: "navMenu",
  setup(props, { root }) {
    /**
     * data 数据
     */
    // const isCollapse = ref(false);
    const routers = reactive(root.$router.options.routes);

    /**
     * computed监听
     */
    const isCollapse = computed(() => root.$store.state.app.isCollapse);

    /**
     * 函数
     */

    // console.log(root.$store.isCollapse);

    return {
      isCollapse,
      routers
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/config.scss";
#nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: $navMenu;
  height: 100vh;
  background-color: #344a5f;
  @include webkit(transition, all 0.3s ease 0s);
}
.open {
  #nav-wrap {
    width: $navMenu;
  }
}
.close {
  #nav-wrap {
    width: $navMenuMin;
    
  }
}
</style>
