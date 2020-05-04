import Vue from "vue";

import SvgIcon from "./SvgIcon"
Vue.component('svg-icon', SvgIcon)



/**
 * 解析一次
 * require.context 读取指定目录的所有文件
 * 第一个：目录
 * 第二个：是否遍历子级目录
 * 第三个：定义遍历文件的规则
 */
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => {
    // console.log(requireContext.keys().map(requireContext))
    return requireContext.keys().map(requireContext);
}
requireAll(req)