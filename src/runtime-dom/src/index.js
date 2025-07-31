import { nodeOps } from "./nodeOps"
import { patchProp } from "./patchProp"
import { createRenderer } from "../../runtime-core/index"
// 准备好所有渲染时所需要的的属性
const renderOptions = Object.assign({ patchProp }, nodeOps);

export function render(vnode, container) { 
  // vnode是元素/组件类型对象
  return createRenderer(renderOptions).render(vnode, container);
}