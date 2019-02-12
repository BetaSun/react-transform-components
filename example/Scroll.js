import React, { PureComponent } from 'react';
import { Scroll } from 'react-transform-components';

const list = [...Array(10).keys()];
export default class App extends PureComponent {
  componentDidMount() {
    
  }

  render() {
    return (
      <Scroll style={{ height: 600 }} /* interval={0} */ step={4} thumbStyle={{ background: '#ccc' }} autoScroll split={<div key="split" style={{ marginBottom: 20, height: 60, backgroundColor: '#f28800' }}>分隔</div>}>
        {list.map(i => <div key={i} style={{ marginBottom: 20, height: 120, backgroundColor: '#00a8ff' }}>{i}</div>)}
      </Scroll>
    );
  }
}
