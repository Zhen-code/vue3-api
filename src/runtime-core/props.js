export const hasPropsChanged = (prevProps = {}, nextProps = {}) => {
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
  if (hasPropsChanged(prevProps, nextProps)) {
    // 比较前后属性是否一致
    for (const key in nextProps) {
      // 循环props
      instance.props[key] = nextProps[key]; // 响应式属性更新后会重新渲染
    }
    for (const key in instance.props) {
      // 循环props
      if (!(key in nextProps)) {
        delete instance.props[key];
      }
    }
  }
}

export const shouldUpdateComponent = (n1, n2) => {
  const { props: prevProps, children: prevChildren } = n1;
  const { props: nextProps, children: nextChildren } = n2;

  if (prevChildren || nextChildren) return true;

  if (prevProps === nextProps) return false;
  return hasPropsChanged(prevProps, nextProps);
};

export function updateComponentPreRender(instance, next) {
  instance.next = null;
  instance.vnode = next;
  updateProps(instance, instance.props, next.props);
  Object.assign(instance.slots, next.children); // 渲染前要更新插槽
}
