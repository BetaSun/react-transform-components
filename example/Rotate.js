import React, { PureComponent } from 'react';
import { Button } from 'antd'
import { Rotate } from 'react-transform-components';

export default class App extends PureComponent {
  state = {
    frontIndex: 0,
  }

  /**
   * 修改旋转组件的索引
   */
  handleUpdateFrontIndex = () => {
    this.setState(({ frontIndex }) => ({ frontIndex: +!frontIndex }));
  };

  render() {
    const { frontIndex } = this.state;

    return (
      <div>
        <div style={{ height: 600 }}>
          <Rotate frontIndex={frontIndex}>
            <div style={{ height: '100%', backgroundColor: 'yellow' }} />
            <div style={{ height: '100%', backgroundColor: 'pink' }} />
          </Rotate>
        </div>
        <Button type="primary" onClick={this.handleUpdateFrontIndex}>点击</Button>
      </div>
    );
  }
}
