import { currentInstance } from "./component";
export function provide(key, value) {
    if (!currentInstance) return;
    const parentProvides =
      currentInstance.parent && currentInstance.parent.provides;
    let provides = currentInstance.provides; // 获取当前实例的provides属性
    // 如果是同一个对象，就创建个新的，下次在调用provide不必重新创建
    // provides('a', 1);
    // provides('b', 2)
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(provides); // 创建一个新的provides来存储
    }
    // 父子组件provides合并
    provides[key] = value;
  }
  