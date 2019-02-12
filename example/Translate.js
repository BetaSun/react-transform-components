import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { Translate } from 'react-transform-components';

export default class App extends PureComponent {
  state = {
    queue: [0],
  }

  /**
   * 修改旋转组件的索引
   */
  handleUpdateQueue = () => {
    this.setState(({ queue }) => ({ queue: queue.concat(1) }));
  };

  render() {
    const { queue } = this.state;

    return (
      <div>
        <div style={{ height: 600 }}>
          <Translate queue={queue} cover={false} offset={{ left: 10, top: 10, bottom: 10, right: 10 }}>
            <div style={{ height: '100%', backgroundColor: 'yellow' }} />
            <div style={{ height: '100%', backgroundColor: 'pink' }} />
          </Translate>
        </div>
        <Button type="primary" onClick={this.handleUpdateQueue}>点击</Button>
      </div>
    );
  }
}
