import { getCurrentInstance } from "./component";
import {  onMounted,  onUpdated  } from "./apiLifecycle"
import { ShapeFlags } from './ShapeFlags'
import { isVNode } from './createVNode'
import { toRaw, markRaw } from 'vue'
export const KeepAliveImpl = {
    // keepAlive本身没有任何功能
    __isKeepAlive: true,
    props: {
        include: [String, RegExp, Array],
        exclude: [String, RegExp, Array],
        max: [String, Number],
    },
    setup(props, {slots}) {
      
        const keys = new Set(); // 缓存的key
        const cache = new Map(); // 缓存key对应的虚拟节点
        const instance = getCurrentInstance();
        let pendingCacheKey = null;
        
        const cacheSubtree = () => {
            cache.set(pendingCacheKey, instance.subTree);
        };
        onMounted(cacheSubtree);
        onUpdated(cacheSubtree); // 在更新时进行重新缓存
      return (proxy) => {
        let vnode;
        // if(this.isMounted === true) {
        //     vnode = this.slots?.default() || null;
        // }else{
        //     vnode = slots.default();
        // }
        
        vnode = proxy?.$slots?.default();
        const max = props.max || 2;
        debugger;
        if (
            !isVNode(vnode) ||
            !(vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT)
          ) {
            return vnode;
          }
          const comp = vnode.type; // 拿到组件
          // 获取组件的key
            const key = vnode.key == null ? comp : vnode.key;
            const cacheVNode = cache.get(key);
            pendingCacheKey = key;
            // if (cacheVNode) {
            // } else {
            //   keys.add(key);
            // }
            // 标识组件
            vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE;
            let { createElement, move, unmount: _unmount } = instance.ctx.renderer;
            const storageContainer = createElement("div"); // 缓存盒子
            instance.ctx.activate = (vnode, container, anchor) => {
                
              // 激活则移动到容器中
                move(vnode, container, anchor);
            };
            instance.ctx.deactivate = (vnode) => {
                // 卸载则移动到缓存盒子中
                move(vnode, storageContainer, null);
            };
            function resetShapeFlag(vnode) {
                let shapeFlag = vnode.shapeFlag;
                if (shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE) {
                  shapeFlag -= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE;
                }
                if (shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE) {
                  shapeFlag -= ShapeFlags.COMPONENT_KEPT_ALIVE;
                }
                vnode.shapeFlag = shapeFlag;
              }
            function unmount(vnode) {
                resetShapeFlag(vnode);
                _unmount(vnode, instance);
              }
              function pruneCacheEntry(key) {
                const cached = cache.get(key);
                unmount(cached);
                cache.delete(key);
                keys.delete(key);
              }
              if(cacheVNode) {
                // 缓存中有
                vnode.component = cacheVNode.component; // 复用组件，并且标识不需要真正的创建
                vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE;
                 
              }else{
                    // make this key the freshest
                    keys.add(key);
                    cache.set(key, vnode)
                    if(max && keys.size > max) {
                        // prune oldest entry
                        pruneCacheEntry(keys.values().next().value);
                    }
                }
            return vnode;  
      };
    },
  };

  
  
  export const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
  