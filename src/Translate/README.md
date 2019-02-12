| 属性 | 说明 | 类型 | 默认值 |
| -- | -- | -- | -- |
| className | 容器类名 | string | - |
| style | 容器样式 | object | - |
| direction | 滑动方向，可选：'left','right','top','bottom' | object | right |
| duration | 滑动动画时长，单位为秒 | number | 0.5 |
| queue | 由需要显示的元素的索引组成的数组，且有顺序，如[0,1]代表着最底层为索引0的元素，上面覆盖着索引为1的元素，当改变为[0,1,2]时，索引为2的元素会以direction设置的方向滑动显示并覆盖在索引1之上 | number[] | [] |
| cover | 新显示的元素是否覆盖在旧元素之上，false则将旧元素以direction设置的方向移动 | boolean | true |
| offset | 卡片偏移，一般情况下无用，可用于防止阴影被隐藏，如设置了右边5px的阴影，可以设置right: 5 | object | { left: 0, right: 0, top: 0, right: 0 } |
