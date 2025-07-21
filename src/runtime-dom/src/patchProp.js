export const patchProp = (el, key, prevValue, nextValue) => {
    if (key === "class") {
      patchClass(el, nextValue);
    } else if (key === "style") {
      patchStyle(el, prevValue, nextValue);
    } else if (/^on[^a-z]/.test(key)) {
      patchEvent(el, key, nextValue);
    } else {
      patchAttr(el, key, nextValue);
    }
  };
  
  function patchClass(el, value) {
    // 根据最新值设置类名
    if (value == null) {
      el.removeAttribute("class");
    } else {
      el.className = value;
    }
  }
  function patchStyle(el, prev, next) {
    // 更新style
    const style = el.style;
    for (const key in next) {
      // 用最新的直接覆盖
      style[key] = next[key];
    }
    if (prev) {
      for (const key in prev) {
        // 老的有新的没有删除
        if (next[key] == null) {
          style[key] = null;
        }
      }
    }
  }
  function createInvoker(initialValue) {
    const invoker = (e) => invoker.value(e);
    invoker.value = initialValue;
    return invoker;
  }
  function patchEvent(el, rawName, nextValue) {
    // 更新事件
    const invokers = el._vei || (el._vei = {});
    const exisitingInvoker = invokers[rawName]; // 是否缓存过
  
    if (nextValue && exisitingInvoker) {
      exisitingInvoker.value = nextValue;
    } else {
      const name = rawName.slice(2).toLowerCase(); // 转化事件是小写的
      if (nextValue) {
        // 缓存函数
        const invoker = (invokers[rawName] = createInvoker(nextValue));
        el.addEventListener(name, invoker);
      } else if (exisitingInvoker) {
        el.removeEventListener(name, exisitingInvoker);
        invokers[rawName] = undefined;
      }
    }
  }
  function patchAttr(el, key, value) {
    // 更新属性
    if (value == null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }
  
  
  
  