import { ShapeFlags } from "./ShapeFlags";
const isString = (val) => typeof val === 'string'
const isObject = (val) => val !== null && typeof val === 'object'

export function isVNode(value){
    return value ? value.__v_isVNode === true : false
}
export const createVNode = (type,props,children = null)=>{
    const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT // 元素
    : isObject(type) // 组件对象
    ? ShapeFlags.STATEFUL_COMPONENT
    : typeof type === 'function'
    ? ShapeFlags.FUNCTIONAL_COMPONENT
    : 0;
    const vnode = { // 用来标识当前节点是一个虚拟节点
        __v_isVNode: true,
        type, // 元素/组件对象/文本
        props, // 当前节点的属性
        key: props && props['key'], // 当前节点的key
        el: null, // 当前节点对应的真实dom
        children, // 当前节点的子节点
        shapeFlag, // 当前节点的类型标识 1
        ref: props && props.ref, // 提取ref
    }
    console.log(vnode, "createVNode vnode");
    if(children){ // 如果存在子节点
        let type = 0;
        if(Array.isArray(children)){ // 如果子节点是数组
            type = ShapeFlags.ARRAY_CHILDREN; // 16
        }
        else if(isObject(children)){
            // 对象类型则是插槽
            type = ShapeFlags.SLOTS_CHILDREN;
        }
        else{ // 如果子节点是字符串
            children = String(children);
            type = ShapeFlags.TEXT_CHILDREN // 8
        }
        vnode.shapeFlag |= type
        // 如果shapeFlag为9 说明元素中包含一个文本
        // 如果shapeFlag为17 说明元素中有多个子节点
    }
    return vnode;
}
