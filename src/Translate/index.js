import React from 'react';
import { isArray } from '../utils';

/**
 * 获取定位值
 * @param {Boolean} queuing 是否在队列中
 * @param {Boolean} isCurrent 是否为当前显示元素
 * @param {Boolean} cover 是否覆盖
 * @return {string} 定位值
 */
const getPositionValue = (queuing, isCurrent, cover) => {
  if (queuing) {
    if (isCurrent || cover) {
      return 0;
    }
    return '-100%';
  }
  return '100%';
};

/**
 * 获取定位样式
 * @param {String} direction 移动方向
 * @param {Boolean} queuing 是否在队列中
 * @param {Boolean} isCurrent 是否为当前显示元素
 * @param {Boolean} cover 是否覆盖
 * @return {string} 定位样式
 */
const getPositionStyle = (direction, queuing, isCurrent, cover) => {
  const value = getPositionValue(queuing, isCurrent, cover);
  switch(direction) {
    case 'top':
    return {
      top: value,
      left: 0,
    };
    case 'bottom':
    return{
      bottom: value,
      left: 0,
    };
    case 'left':
    return{
      top: 0,
      left: value,
    };
    default:
    return{
      top: 0,
      right: value,
    };
  }
};

/**
 * 滑动组件
 */
export default function Translate(props) {
  const {
    className,
    style,
    direction="right",
    duration=0.5,
    queue=[],
    cover=true,
    offset: { left=0, right=0, top=0, bottom=0 }={},
  } = props;
  let { children } = props;
  children = isArray(children) ? children : [children];

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        top: -top,
        left: -left,
        paddingTop: top,
        paddingRight: right,
        paddingBottom: bottom,
        paddingLeft: left,
        width: '100%',
        height: '100%',
        boxSizing: 'content-box',
        ...style,
      }}
    >
      {children.map((item, i) => {
        const index = queue.indexOf(i);
        // 是否在队列中
        const queuing = index !== -1;
        // 是否为当前显示的元素
        const isCurrent = index === queue.length - 1;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              paddingTop: top,
              paddingRight: right,
              paddingBottom: bottom,
              paddingLeft: left,
              opacity: cover && queuing && !isCurrent ? '0' : '1',
              transition: `opacity ${duration}s, ${direction} ${duration}s`,
              zIndex: `${index+1}`,
              ...getPositionStyle(direction, queuing, isCurrent, cover),
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}
