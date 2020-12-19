基于@antv/g6的节点与边的label输入框组件

# 使用
```js
import {showInput, fittingString, addClass, removeClass} from '@alone-g6/input-label';
```
在合适的地方激活输入框
```js
const result = showInput(item, {graph: this.graph, options});
const { value, oldLabel, fittingValue } = result;
```

# options
* `parent`: input输入框父及dom，HTMLElement 或 Selector
* `style`: input输入框样式
* `graph`: g6 实例
* `autoUpdate`: 是否自动更新label，默认true
* `focusClear`: 是否在input获得焦点时清除现有label，默认true
* `onFocus`: 获得焦点事件
* `textOverflow`: 文本溢出后处理方式：`ellipsis` or `newline` 默认 `ellipsis`
* `textEllipsis`: 文本溢出后ellipsis处理方式的后缀默认`...`
* `padding`: 文本padding，计算文本溢出时使用，默认 0

