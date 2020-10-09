基于@antv/g6的历史记录组件

# 使用
```js
import History from '@alone-g6/history';
const history = new History({
    // 更新防抖延迟
    updateDebounceWait: 1000
});
new G6.Graph({
    plugins: [history]
})
```

# 属性
* `hasUndo`: 是否有返回栈
* `hasRedo`: 是否有前进栈

# methods
* `push(data?)`: 新增undo操作栈，如传入data则直接使用该data，否则自动调用graph.save()
* `undo`: 返回（撤销操作）
* `redo`: 前进
* `proxyInputLabelUpdate(showInput, options?)`: 代理`input-label`的`showInput`操作并记录历史记录

