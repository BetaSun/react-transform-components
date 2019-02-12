import React, { PureComponent } from 'react';
import debounce from 'lodash/debounce';
import Scrollbars from 'react-custom-scrollbars';

// 默认每帧移动距离
const DEFAULT_STEP = 1;

/**
 * 自定义滚动条容器
 */
export default class Scroll extends PureComponent {
  constructor(props) {
	  super(props);
    this.state = {
      // 是否内容超出容器高度（用于开启自动滚动时判断是否需要复制内容）
      isOverflow: false,
      // 是否鼠标移入（用于开启自动滚动且未移入时隐藏滚动条）
      isMouseEnter: false,
      // 是否在拖拽中
      isDragging: false,
      // 鼠标移入时，数组截取的开始索引
      startIndex: 0,
    };
    // resize添加去抖
    this.debouncedResize = debounce(this.resize, 100, { leading: true, trailing: false });
    // 间隔定时器
    this.intervalTimer = null;
    // 间隔定时器起始时间
    this.intervalStart = null;
    // 滚动定时器
    this.scrollTimer = null;
    // 滚动起始时间
    this.scrollStart = null;
    // 临时存放的scrollTop
    this.scrollTop = 0;
  }

  /**
   * 挂载后
   */
  componentDidMount() {
    const { autoScroll } = this.props;
    // 如果开启了自动滚动
    if (autoScroll) {
      // 初始化（判断当前内容高度是否超出）
      this.resize();
      // 添加resize事件监听
      window.addEventListener('resize', this.debouncedResize);
      // 添加mouseup事件监听
      window.addEventListener('mouseup', this.handleMouseUp);
    }
  }

  /**
   * 更新后
   */
  componentDidUpdate({ children: prevChildren }) {
    const { autoScroll, children } = this.props;
    // 这里需要判断源数据是否发生变化
    if (autoScroll && prevChildren !== children) {
      this.resize();
    }
  }

  /**
   * 销毁前
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedResize);
    window.removeEventListener('mouseup', this.handleMouseUp);
    this.unsetIntervalTimer();
    this.unsetScrollTimer();
  }

  /**
   * 设置元素的引用
   * @param {object} dom 元素引用
   */
  refDom = (dom) => {
    this.dom = dom;
  }

  /**
   * 判断是否内容超出容器高度
   */
  resize = () => {
    const { autoScroll } = this.props;
    if (autoScroll) {
      const { isOverflow: prevIsOverflow } = this.state;
      const clientHeight = this.dom.getClientHeight();
      const scrollHeight = this.dom.getScrollHeight();
      const { children } = this.dom.view;
      // 判断是否内容超出容器高度
      const isOverflow = prevIsOverflow ? children[Math.floor(children.length / 2)].offsetTop > clientHeight  : scrollHeight > clientHeight;
      // 修改state
      this.setState({
        isOverflow,
      });
      if (!prevIsOverflow && isOverflow) {
        this.setIntervalTimer();
      }
      else if (prevIsOverflow && !isOverflow) {
        this.unsetIntervalTimer();
        this.unsetScrollTimer();
      }
    }
  }

  /**
   * 设置间隔定时器
   */
  setIntervalTimer = () => {
    const { interval } = this.props;
    if (interval) {
      this.intervalTimer = window.requestAnimationFrame(this.intervalCallback);
    }
    else {
      this.setScrollTimer();
    }
  }

  /**
   * 间隔定时器回调函数
   * @param {number} timestamp requestAnimationFrame回调参数时间戳
   */
  intervalCallback = (timestamp) => {
    const { interval } = this.props;
    if (!this.intervalStart) {
      this.intervalStart = timestamp;
    }
    // 计算已经经过的时间
    const offset = timestamp - this.intervalStart;
    // 如果已经经过指定的时间，则开始滚动
    if (offset >= interval) {
      this.unsetIntervalTimer();
      this.setScrollTimer();
    }
    // 否则继续下一次
    else {
      this.intervalTimer = window.requestAnimationFrame(this.intervalCallback);
    }
  }

  /**
   * 清除间隔定时器
   */
  unsetIntervalTimer = () => {
    window.cancelAnimationFrame(this.intervalTimer);
    this.intervalStart = null;
  }

  /**
   * 设置滚动定时器
   */
  setScrollTimer = () => {
    const { scrollTo, index } = this.getTargetPosition();
    const callback = () => {
      const { step=DEFAULT_STEP } = this.props;
      // 计算目标位置
      const target = Math.min(this.dom.getScrollTop() + step, scrollTo);
      // 如果已经经过对应时长，则清除滚动定时器，并开始下一次计时
      if (target >= scrollTo) {
        this.dom.scrollTop(target);
        if (Math.floor(this.dom.view.children.length / 2) === index) {
          this.dom.scrollToTop();
        }
        this.unsetScrollTimer();
        this.setIntervalTimer();
      }
      // 否则开始滚动
      else {
        this.dom.scrollTop(target);
        this.scrollTimer = window.requestAnimationFrame(callback);
      }
    }
    this.scrollTimer = window.requestAnimationFrame(callback);
  }

  /**
   * 清除滚动定时器
   */
  unsetScrollTimer = () => {
    window.cancelAnimationFrame(this.scrollTimer);
    this.scrollStart = null;
  }

  /**
   * 获取当前位置相关参数
   */
  getTargetPosition = () => {
    const { children } = this.dom.view;
    const currentScrollTop = this.dom.getScrollTop();
    const scrollHeight = this.dom.getScrollHeight();
    const averageHeight = scrollHeight / children.length;
    let index = Math.floor(currentScrollTop / averageHeight);
    while(true) {
      if (children[index].offsetTop > currentScrollTop) {
        if (children[index-1].offsetTop > currentScrollTop) {
          index -= 1;
        }
        else {
          return {
            // 当前位置所在元素的索引
            index: index - 1,
            // 当期的scrollTop
            scrollTop: currentScrollTop,
            // 当前位置到下一个元素顶部的距离
            scrollTo: children[index].offsetTop,
            // 当前位置到上一个元素底部的距离
            scrollSlice: currentScrollTop - children[index-1].offsetTop,
          };
        }
      }
      else {
        index += 1;
      }
    }
  }

  /**
   * 鼠标移入
   */
  handleMouseEnter = (e) => {
    const { onMouseEnter, autoScroll } = this.props;
    const { isOverflow, isDragging } = this.state;
    // 如果开启自动滚动，则清空定时器
    if (autoScroll && isOverflow) {
      if (isDragging) {
        this.setState({ isMouseEnter: true });
      }
      else {
        const { index, scrollTop, scrollSlice } = this.getTargetPosition();
        this.scrollTop = scrollTop - scrollSlice;
        this.setState({ isMouseEnter: true, startIndex: index }, () => {
          this.dom.scrollTop(scrollSlice);
        });
        this.unsetIntervalTimer();
        this.unsetScrollTimer();
      }
    }
    if (onMouseEnter) {
      onMouseEnter(e);
    }
  }

  /**
   * 鼠标移出
   */
  handleMouseLeave = (e) => {
    const { onMouseLeave, autoScroll } = this.props;
    const { isOverflow } = this.state;
    // 如果开启自动滚动
    if (autoScroll && isOverflow) {
      // 左键按下中
      if (e.buttons === 1) {
        this.setState({ isMouseEnter: false, isDragging: true });
      }
      else {
        const currentScrollTop = this.dom.getScrollTop();
        this.setState({ isMouseEnter: false }, () => {
          const { children } = this.dom.view;
          const maxHeight = children[Math.ceil(children.length / 2)].offsetTop;
          this.dom.scrollTop((this.scrollTop+currentScrollTop) % maxHeight);
          this.setIntervalTimer();
        });

      }
    }
    if (onMouseLeave) {
      onMouseLeave(e);
    }
  }

  /**
   * 鼠标松开
   */
  handleMouseUp = () => {
    const { isDragging, isMouseEnter } = this.state;
    // 如果isDragging为true，则autoScroll和isOverflow必然为true
    if (isDragging) {
      const currentScrollTop = this.dom.getScrollTop();
      this.setState({ isDragging: false }, () => {
        if (!isMouseEnter) {
          const { children } = this.dom.view;
          const maxHeight = children[Math.ceil(children.length / 2)].offsetTop;
          this.dom.scrollTop((this.scrollTop+currentScrollTop) % maxHeight);
          this.setIntervalTimer();
        }
      });
    }
  }

  /**
   * 滚动条
   * @param {object} style 滚动条的默认样式
   */
  renderThumb = ({ style }) => {
    const { thumbStyle, autoScroll } = this.props;
    const { isMouseEnter, isDragging } = this.state;
    const extra = autoScroll ? { display: isMouseEnter || isDragging ? 'block' : 'none' } : undefined;
    return (
      <div
        style={{
          cursor: 'pointer',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: 'inherit',
          ...style,
          ...thumbStyle,
          ...extra,
        }}
      />
    );
  }

  /**
   * 开启轮播时的内容列表
   */
  renderChildren = () => {
    const { autoScroll, children, split } = this.props;
    const { isOverflow, isMouseEnter, isDragging, startIndex } = this.state;
    // 如果开启自动滚动
    if (autoScroll) {
      // 内容超出时
      if (isOverflow) {
        const copyChildren = React.Children.map(children, child => React.cloneElement(child, { key: `${child.key}_cpy` }));
        // 鼠标移入或在拖拽时
        if (isMouseEnter || isDragging) {
          return children.slice(startIndex).concat(split, copyChildren.slice(0, startIndex));
        }
        return children.concat(split, copyChildren);
      }
    }
    return children;
  }

  /**
   * 渲染
   */
  render() {
    const {
      // 容器类名
      className,
      // 容器样式
      style,
      // 是否自动隐藏滚动条
      autoHide,
      // 是否自动滚动
      autoScroll,
      // 自动滚动的时间间隔，默认5s
      interval,
      // 每一帧移动的距离
      step,
      // 开启自动滚动后可能存在的分隔元素
      split,
      // 内容
      children,
      // 滚动条样式
      thumbStyle,
      // 鼠标移入
      onMouseEnter,
      // 鼠标移出
      onMouseLeave,
      // 剩余的参数,详见react-custom-scrollbars组件可设置参数
      ...restProps
    } = this.props;

    return (
      <Scrollbars
        className={className}
        style={style}
        renderThumbHorizontal={this.renderThumb}
        renderThumbVertical={this.renderThumb}
        autoHide={autoHide}
        ref={this.refDom}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        {...restProps}
      >
        {this.renderChildren()}
      </Scrollbars>
    );
  }
}
