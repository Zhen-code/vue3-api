import { reactive } from 'vue'
export function initProps(instance, rawProps) { // rawProps为h()的第二个参数，即props对象
  const props = {};
  const attrs = {};
  const options = instance.propsOptions || {}; // 获取组件用户的配置
  if (rawProps) {
    for (let key in rawProps) {
      const value = rawProps[key];
      if (key in options) {
        props[key] = value;
      } else {
        attrs[key] = value;
      }
    }
  }
  instance.props = reactive(props); // 这里应该用shallowReactive，遵循单向数据流原则
  instance.attrs = attrs;
}
