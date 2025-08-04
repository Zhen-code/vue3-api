import { hasOwn } from './utils'
export const hasPropsChanged = (prevProps = {}, nextProps = {}) => {
  // debugger
  if(!nextProps && Object.keys(prevProps).length !== 0) return true;
  if(!nextProps && Object.keys(prevProps).length == 0) return false;
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key]) {
      return true;
    }
  }
  return false;
};
export function updateProps(instance, prevProps, nextProps) {
  const { type: {props: propsOptions} } = instance.vnode;
  instance.propsOptions = propsOptions || {}
  if (hasPropsChanged(prevProps, nextProps)) {
    // 比较前后属性是否一致
    for (const key in nextProps) {
      // 循环props
      if(hasOwn(propsOptions, key)) {
        instance.props[key] = nextProps[key]; // 响应式属性更新后会重新渲染
      }else{
        instance.attrs[key] = nextProps[key]; // 非响应式属性更新不会重新渲染
      }
    }
    for (const key in instance.props) {
      // 循环props
      if (!(key in propsOptions)) {
        delete instance.props[key];
      }
    }
    for (const key in instance.attrs) {
      // 循环props
      if (!(key in nextProps)) {
        delete instance.attrs[key];
      }
    }
  }
}

export const shouldUpdateComponent = (n1, n2) => {
  const { props: prevProps, children: prevChildren } = n1;
  const { props: nextProps, children: nextChildren } = n2;

  if (prevChildren || nextChildren) return true;

  if (prevProps === nextProps) return false;
  // debugger;
  return hasPropsChanged(prevProps, nextProps);
};

export function updateComponentPreRender(instance, next) {
  console.log("updateComponentPreRender");
  instance.next = null;
  instance.vnode = next;
  // debugger;
  updateProps(instance, instance.props, next.props || {});
  instance.slots = {};
  instance.slots = next.children
  // Object.assign(instance.slots, next.children); // 渲染前要更新插槽
  // console.log(instance, next);
}
