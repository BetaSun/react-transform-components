import React, { PureComponent } from 'react';
import { classNames, isArray } from '../utils';
import styles from './index.less';

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
        className={classNames(styles.container, className)}
        style={{
          ...style,
          transform: `rotate${axis.toUpperCase()}(${isFront ? 0 : 180}deg)`,
          transition: `transform ${duration}s`,
        }}
      >
        <div className={styles.front}>{isFront ? children[frontIndex] : children[backIndex]}</div>
        <div className={styles.back} style={{ transform: `rotate${axis.toUpperCase()}(180deg)` }}>{isFront ? children[backIndex] : children[frontIndex]}</div>
      </div>
    );
  }
}
