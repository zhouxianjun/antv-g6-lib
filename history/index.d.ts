import {GraphData, TreeGraphData} from "@antv/g6/es/types";

export default class History {
  /**
   * 是否有返回栈
   */
  readonly hasUndo: boolean;
  /**
   * 是否有前进栈
   */
  readonly hasRedo: boolean;
  /**
   * 新增undo操作栈，如传入data则直接使用该data，否则自动调用graph.save()
   */
  push: (data?: TreeGraphData | GraphData) => void;
  /**
   * 返回（撤销操作）
   */
  undo: () => void;
  /**
   * 前进
   */
  redo: () => void;
  /**
   * 代理`input-label`的`showInput`操作并记录历史记录
   */
  proxyInputLabelUpdate: (showInput: Function, options?: Object) => Promise<(e) => any>;
}
