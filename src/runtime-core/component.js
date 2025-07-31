import { hasOwn } from './utils'
import { proxyRefs, reactive } from 'vue'
import { initProps } from './componentProps'
import { ShapeFlags } from './ShapeFlags'
import { isObject } from './h'
export let currentInstance = null;
export const setCurrentInstance = (instance) => (currentInstance = instance);
export const getCurrentInstance = () => currentInstance;
export const unsetCurrentInstance = () => (currentInstance = null);
export function createComponentInstance(vnode) {
  const instance = {  // 组件的实例
    vnode, // 虚拟节点对象（元素/组件）
    data: null,
    attrs: {},
    props: {},
    propsOptions: vnode.type.props,

    subTree: null, // vnode组件的虚拟节点   subTree渲染的组件内容
    slots: null, // 初始化插槽属性
    
    isMounted: false,
    update: null,
   
    proxy: null, // 实例代理
  };
  return instance;
}



const publicPropertiesMap = {
  $attrs: (i) => i.attrs,
  $slots: (i) => i.slots,
};
function initSlots(instance, children) {
  if (instance.vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    instance.slots = children;
  } else {
    instance.slots = {};
  }
}
const PublicInstanceProxyHandlers = {
  // target：当前组件实例
  get(target, key) {
    console.log('get', key);
    // debugger;
    const { data, props, setupState } = target; 
    if (data && hasOwn(data, key)) {
      return data[key];
    } else if (hasOwn(props, key)) {
      return props[key];
    }else if (setupState && hasOwn(setupState, key)) {
      // setup返回值做代理
      return setupState[key];
    }
    const publicGetter = publicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(target); // target就是当前组件实例
    }
  },
  set(target, key, value) {
    const { data, props, setupState } = target;
    if (data && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(props, key)) {
      console.warn(`Attempting to mutate prop "${key}". Props are readonly.`);
      return false;
    } else if (setupState && hasOwn(setupState, key)) {
      // setup返回值做代理
      setupState[key] = value;
    }
    return true;
  },
};
export function setupComponent(instance) {
  /**
   *   case 组件 vnode：
   *    基础vnode数据 包含：1.type(组件对象) 2. component:实例（包含响应式组件处理数据）
   */
  
  const { props, type, children  } = instance.vnode; 
  initProps(instance, props);
  initSlots(instance, children); // 初始化插槽

  let { setup } = type
   if (setup) {
    // 对setup做相应处理
    const setupContext = {
        attrs: instance.attrs,
        emit: (event, ...args) => {
            const eventName = `on${event[0].toUpperCase() + event.slice(1)}`;
            const handler = instance.vnode.props[eventName]; // 找到绑定的方法
            // 触发方法执行
            handler && handler(...args);
        },
    };
    setCurrentInstance(instance); // 在调用setup的时候保存当前实例
    const setupResult = setup(instance.props, setupContext);
    unsetCurrentInstance();
    // console.log(setupResult);
    if (typeof setupResult === 'function') { // 组件setup返回值是render函数
      instance.render = setupResult;
    } else if (isObject(setupResult)) {
      // setup返回值做代理
      instance.setupState = proxyRefs(setupResult); // 这里对返回值进行结构
    }
  }

  instance.proxy = new Proxy(instance, PublicInstanceProxyHandlers);
  // debugger
  const data = type.data;
  if (data) {
    if (typeof data !== 'function')
      return console.warn("The data option must be a function.");
      instance.data = reactive(data.call(instance.proxy));
  }
    if (!instance.render) {
    instance.render = type.render; // 组件setup没有render函数，使用默认的render函数
  }
}
