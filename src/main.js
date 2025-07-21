import { createApp } from 'vue'
import App from './App.vue'
// import ColorUI from './packages/index'
import {
    createRenderer,
    // h,
    // render,
  } from "@vue/runtime-dom/dist/runtime-dom.esm-browser.js";
import { render } from "@/runtime-dom/src/index.js";
import { h } from "@/runtime-core/h.js";
  const renderer = createRenderer({
    createElement(element) {
      return document.createElement(element);
    },
    setElementText(el, text) {
      el.innerHTML = text;
    },
    insert(el, container) {
      container.appendChild(el);
    },
  });
  // 自定义渲染器
//   renderer.render(h("h1", "hello world"), document.getElementById("app"));
const container = document.getElementById("app")
// render(h('div',[
//     h('li', { key: 'a' }, 'a'),
//     h('li', { key: 'b' }, 'b'),
//     h('li', { key: 'c' }, 'c'),
//     h('li', { key: 'd' }, 'd'),
//     h('li', { key: 'e' }, 'e')
// ]), container)
// render(h('div',[
//     h('li', { key: 'a' }, 'a'),
//     h('li', { key: 'd' }, 'b'),
//     h('li', { key: 'b' }, 'c'),
//     h('li', { key: 'c' }, 'd'),
//     h('li', { key: 'e' }, 'e')
// ]), container)
// 组件
const VueComponent = {
  data() {
    return { age: 13 };
  },
  render() {
    return h("p", [h(Text, "I'm Jiang sir"), h("span", this.age)]);
  },
};
debugger;
render(h(VueComponent), container)
// const {type} = h(VueComponent)
// console.log(type.render()); 
// createApp(App).mount('#app')
