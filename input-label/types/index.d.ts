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

/**
 * 超出文本宽度换行
 * @param str 文本
 * @param maxWidth 最大宽度
 * @param fontSize 字体大小
 */
export declare function fittingString(str: string, maxWidth: number, fontSize: number): string;

/**
 * 超出文本宽度添加指定后缀
 * @param str 文本
 * @param maxWidth 最大宽度
 * @param fontSize 字体大小
 * @param ellipsis 后缀
 */
export declare function fittingEllipsisString(str: string, maxWidth: number, fontSize: number, ellipsis?: string): string;

/**
 * 添加样式
 * @param dom 元素
 * @param name 样式名称
 */
export declare function addClass(dom: HTMLElement | Element, name: string): void;

/**
 * 删除样式
 * @param dom 元素
 * @param name 样式名称
 */
export declare function removeClass(dom: HTMLElement | Element, name: string): void;
