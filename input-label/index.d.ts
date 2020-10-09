interface InputResult {
  value: String,
  oldLabel: String,
  fittingValue: String
}

interface ShowInputOptions {
  /**
   * input输入框父及dom，HTMLElement 或 Selector
   */
  parent: HTMLElement | String,
  /**
   * input输入框样式
   */
  style: Object,
  /**
   * g6 实例
   */
  graph: any,
  /**
   * 是否自动更新label，默认true
   */
  autoUpdate: boolean,
  /**
   * 是否在input获得焦点时清除现有label，默认true
   */
  focusClear: boolean,
  /**
   * 获得焦点事件
   */
  onFocus: (node, label) => void
}

/**
 * 激活输入框
 * @param node 当前节点或边
 * @param options 参数
 */
export declare function showInput (node : any, options : ShowInputOptions): Promise<InputResult>;
