import { createApp, ref, reactive } from 'vue'
import App from './App.vue'
// import ColorUI from './packages/index'
import {
    createRenderer,
    // h,
    // render,
  } from "@vue/runtime-dom/dist/runtime-dom.esm-browser.js";
import { render } from "@/runtime-dom/src/index.js";
import { h } from "@/runtime-core/h.js";
import { onBeforeMount, onMounted } from "@/runtime-core/apiLifecycle"
import { provide } from "@/runtime-core/Provide"
import { inject } from "@/runtime-core/Inject"
import {KeepAliveImpl as KeepAlive} from "@/runtime-core/KeepAlive"
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
  // data() {
  //   return { age: 13 };
  // },
  // props: {
  //   address: String,
  // },
  setup(props, ctx) {
    // const refKey = ref(1)
    // const handleClick = () => {
    //   ctx.emit("myEvent");
    //   // console.log('click');
    // }; 
    // return () => h("p", 
    // [h("span", { onClick: handleClick }, refKey.value)]);
    // debugger
    onBeforeMount(()=> console.log('beforeMount'))
    onMounted(()=> console.log('mounted'))
    return{}
  },
  // render() {
    // return h("p", 
    // [h("span", this.a)]); // h(Text, "I'm Jiang sir"),
  // },
  render() {
    return h('div', [
      h("div", [this.$slots.header()]), // 获取插槽渲染
      h("div", [this.$slots?.body ? this.$slots?.body():'']),
      h("div", [this.$slots.footer()]),
    ]);
  },
};
// const VueComponent1 = {
//   data() {
//     return { age: 13 };
//   },
//   props: {
//     address: String,
//     newProp: String,
//   },
//   render() {
//     return h("p", 
//     [h("span", this.$attrs?.a)]); // h(Text, "I'm Jiang sir"),
//   },
// };
// render(h(VueComponent, { 
//   address: "霍营", a: 1, b: 2,
//   onMyEvent: () => {
//     alert(1000);
//   }, 
// }), container)
// const domVal = ref(null)
// render(h(VueComponent, {key: 'a', ref: domVal }, {
//   // 渲染组件时传递对应的插槽属性
//   header: () => h("p", "头"),
//   body: () => h("p", "体"),
//   footer: () => h("p", "尾"),
// }), container)
// console.log(domVal.value);
// render(h(VueComponent, {key: 'b'}, {
//   // 渲染组件时传递对应的插槽属性
//   header: () => h("p", "头"),
//   // body: () => h("p", "体"),
//   footer: () => h("p", "尾"),
// }), container)
// debugger;
// VueComponent.props = { newProp: String }
// render(h(VueComponent, { address: "霍营", a: 2, b: 2 }), container)
// const {type} = h(VueComponent)
// console.log(type.render()); 
// createApp(App).mount('#app')
// const functionalComponent = (props) => {
//   return h("div", "hello" + props.name);
// };

// render(h(functionalComponent, { name: "jiang" }), container);


// const My = {
//   setup() {
//     const name = inject("name");
//     return { name };
//   },
//   render() {
//     return h("div", this.name);
//   },
// };
// const VueComponent1 = {
//   setup() {
//     const state = reactive({ name: "mrs jiang" });
//     provide("name", state.name);
//     // setTimeout(() => {
//     //   state.name = "jw";
//     // }, 1000);
//     return () => h(My, { name: 'child' });
//   },
// };
// render(h(VueComponent1, {name: 'parent'}), container);


// 1.组件
const My1 = {
  name: "My1",
  setup() {
    onMounted(() => {
      console.log("my1 mounted");
    });
    return () => h("h1", "my1");
  },
};
// 2.组件
const My2 = {
  name: "My2",
  setup() {
    onMounted(() => {
      console.log("my2 mounted");
    });
    return () => h("h1", "my2");
  },
};
// keepAlive会对渲染的组件进行缓存
// debugger
render(
  h(KeepAlive, null, {
    default: () => h(My1), // 缓存1
  }),
  container
);
setTimeout(() => {
  debugger
  render(
    h(KeepAlive, null, {
      default: () => h(My2), // 缓存2
    }),
    container
  );
}, 1000);
// setTimeout(() => {
//   render(
//     h(KeepAlive, null, {
//       default: () => h(My1), // 复用1
//     }),
//     container
//   );
// }, 2000);


