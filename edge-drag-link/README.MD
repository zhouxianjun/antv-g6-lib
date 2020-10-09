基于@antv/g6的边拖拽连线组件

# 使用
```js
import {edgeDragLinkNode, stateName as edgeStateName, edgeDragLinkBehavior, edgeDragArrow} from '@alone-g6/edge-drag-link';
const EdgeDragLinkNode = edgeDragLinkNode();
```
1、在自定义节点的afterDraw函数调用该组件的afterDraw用于生成拖拽辅助点shape
```js
afterDraw(cfg, group) {
    EdgeDragLinkNode.afterDraw(cfg, group);
  }
```

2、在合适的时机设置edge-drag-link为激活状态，用于显示拖拽点
```js
setState(name, value, item) {
    EdgeDragLinkNode.setState(name, value, item);
}
```

3、使用交互
```js
G6.registerBehavior(edgeDragLinkBehavior.name, edgeDragLinkBehavior);
modes: {
  default: ['drag-node', edgeDragLinkBehavior.name],
}
```
4、使用箭头拖拽
```js
G6.registerEdge('some-name', edgeDragArrow, 'line');
```

# 节点参数
* `markerStyle`: 辅助点的样式
* `getAttr`: 动态获取attr属性function(value, item, shape)
* `stateChanged`: 状态变更事件function(value, item, shape)

# 交互参数
* `shouldBegin(e)`: 是否允许当前被操作的条件下开始创建边
* `shouldEnd(e)`：是否允许当前被操作的条件下结束创建边

# 交互事件
* `edge-drag-link:end`：当边创建完成时将会触发该时机事件。使用 graph.on('edge-drag-link:end', edge => {...}) 监听。其参数 edge 字段即为刚刚创建的边。
