import { nodeOps } from "../runtime-dom/src/nodeOps"
import { patchProp } from "../runtime-dom/src/patchProp"
import { createRenderer } from "./index"
// 准备好所有渲染时所需要的的属性
const renderOptions = Object.assign({ patchProp }, nodeOps);

import {queueJob} from "./scheduler";
import {  ReactiveEffect } from "vue";
import { updateComponentPreRender } from './props'
import { invokeArrayFns } from './utils'
const { patch } = createRenderer(renderOptions)
export const setupRenderEffect = (instance, container, anchor) => {
  const { render } = instance;
  const componentUpdateFn = () => {
    // 区分是初始化 还是要更新
    if (!instance.isMounted) {
       const { bm, m } = instance;
      if (bm) {
        // beforeMount
        invokeArrayFns(bm);
      }
      // 初始化
      // console.log("render", render);
      const subTree = render.call(instance.proxy, instance.proxy); // 作为this，后续this会改
      // debugger;
      // console.log(subTree, 'subTree');
      patch(null, subTree, container, anchor); // 创造了subTree的真实节点并且插入了
      instance.subTree = subTree;
      instance.isMounted = true;
      if (m) {
        // mounted
        invokeArrayFns(m);
      }
    } else {
      /**
       * next：新vnode n2
       */
      let { next, bu, u } = instance;
       if (next) {
        updateComponentPreRender(instance, next);
      }
       if (bu) {
      // beforeUpdate
      invokeArrayFns(bu);
      }
      // 组件内部更新
      const subTree = render.call(instance.proxy, instance.proxy);
      patch(instance.subTree, subTree, container, anchor);
       if (u) {
      // updated
      invokeArrayFns(u);
      }
      instance.subTree = subTree;
    }
  };
  // 组件的异步更新
  const effect = new ReactiveEffect(componentUpdateFn, () => queueJob(update));
  // 我们将组件强制更新的逻辑保存到了组件的实例上，后续可以使用
  const update = (instance.update = () => effect.run());
  update();
};
