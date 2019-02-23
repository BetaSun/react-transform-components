import React, { PureComponent } from 'react';
import { isArray } from '../utils';

/**
 * 可以旋转的组件
 */
export default class Rotate extends PureComponent {
  state={
    // 当前显示的是否是正面
    isFront: true,
    // 背面的元素索引
    backIndex: 1,
  }

  componentDidUpdate({ frontIndex: prevFrontIndex }) {
    const { frontIndex } = this.props;
    if (frontIndex !== prevFrontIndex) {
      this.setState(({ isFront }) => ({
        isFront: !isFront,
        backIndex: prevFrontIndex,
      }));
    }
  }

  render() {
    const { style, className, duration=1, frontIndex=0, axis='y' } = this.props;
    let { children } = this.props;
    const { isFront, backIndex } = this.state;
    children = isArray(children) ? children : [children];

    return (
      <div
        className={className}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transform: `rotate${axis.toUpperCase()}(${isFront ? 0 : 180}deg)`,
          transition: `transform ${duration}s`,
          ...style,
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, width: '100%', height: '100%', backfaceVisibility: 'hidden' }}>{isFront ? children[frontIndex] : children[backIndex]}</div>
        <div style={{ width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: `rotate${axis.toUpperCase()}(180deg)` }}>{isFront ? children[backIndex] : children[frontIndex]}</div>
      </div>
    );
  }
}
