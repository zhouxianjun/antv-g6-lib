import PluginBase from '@antv/g6/lib/plugins/base';
import { debounce, cloneDeep } from 'lodash';

class History extends PluginBase {
  getDefaultCfgs() {
    return {
      updateDebounceWait: 1000
    };
  }

  init() {
    this.redoStack = [];
    this.undoStack = [];
    const wait = this.get('updateDebounceWait') || 1000;
    this.debounceBeforeUpdate = debounce(this.onBeforeUpdate, wait, {
      leading: true,
      trailing: false
    });
  }

  getEvents() {
    return {
      beforeadditem: 'onBeforeAdd',
      beforeupdateitem: 'debounceBeforeUpdate',
      beforeremoveitem: 'onBeforeRemove'
    };
  }

  get hasUndo() {
    return this.undoStack.length > 0;
  }

  get hasRedo() {
    return this.redoStack.length > 0;
  }

  get graph() {
    return this.get('graph');
  }

  push(data) {
    this.undoStack.push({
      time: Date.now(),
      data: cloneDeep(data || this.graph.save())
    });
  }

  undo() {
    if (!this.hasUndo) {
      return;
    }
    this.redoStack.push({
      time: Date.now(),
      data: this.graph.save()
    });
    const { data } = this.undoStack.pop();
    this.after(data);
  }

  redo() {
    if (!this.hasRedo) {
      return;
    }
    this.push();
    const { data } = this.redoStack.pop();
    this.after(data);
  }

  after(data) {
    this.graph.clear();
    Object.keys(data).forEach(key => data[key].forEach(n => n.history = false));
    this.graph.changeData(data, false);
  }

  proxyInputLabelUpdate(showInput, config) {
    return async (e) => {
      const {item} = e;
      const data = cloneDeep(this.graph.save());
      const result = await Reflect.apply(showInput, this, [item, {graph: this.graph, ...config}]);
      const { value, oldLabel } = result;
      if (value !== oldLabel) {
        this.push(data);
      }
      return result;
    };
  }

  onBeforeAdd({ model: {history = true} }) {
    if (history) {
      this.push();
    }
  }

  onBeforeUpdate({ cfg }) {
    const {history = true} = cfg;
    if (history) {
      this.push();
    }
  }

  onBeforeRemove({ item: {history = true} }) {
    if (history) {
      this.push();
    }
  }
}

export default History;
