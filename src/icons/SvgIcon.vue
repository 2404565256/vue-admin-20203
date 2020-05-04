<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
import { ref, computed, onMounted } from "@vue/composition-api";

export default {
  name: "svgIcom",
  props: {
    iconClass: {
      type: String,
      default: ""
    },
    className: {
      type: String,
      default: ""
    }
  },
  setup(props) {
    // console.log(props.iconClass);
    // console.log(props.className);

    const iconName = computed(() => `#icon-${props.iconClass}`);

    const svgClass = computed(() => {
      if (props.className) {
        return `#icon-${props.className}`;
      } else {
        return `svg-icon`;
      }
    });

    const msg = ref("777");
    return {
      msg,
      iconName,
      svgClass
    };
  }
};
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>