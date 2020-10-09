import {ShapeDefine, ShapeOptions} from "@antv/g6/lib/interface/shape";
import {BehaviorOption, IShapeBase, Item} from "@antv/g6/lib/types";
import {ShapeAttrs} from "@antv/g-base/esm/types";
import {ComboConfig, EdgeConfig, NodeConfig} from "@antv/g6/es/types";
import Group from "@antv/g-canvas/lib/group";

/**
 * @param value 当前状态是否激活
 * @param item 节点
 * @param shape 辅助点
 */
type NodeCb = (value: boolean, item: Item, shape: IShapeBase) => ShapeAttrs | any;

interface NodeOptions {
  /**
   * 辅助点的样式
   */
  markerStyle?: ShapeAttrs,
  /**
   * 动态获取attr属性
   */
  getAttr?: NodeCb,
  /**
   * 状态变更事件
   */
  stateChanged?: NodeCb
}

interface EdgeDragLinkBehaviorOption extends BehaviorOption {
  name: String
}

/**
 * 创建拖拽边连线组件node定义
 * @param options
 */
export declare function edgeDragLinkNode(options?: NodeOptions): ShapeOptions | ShapeDefine;

/**
 * 状态名称
 */
export declare const stateName: String;
/**
* 辅助点位图形attr名称
*/
export declare const shapeName: String;
export declare const arrowStartShapeName: String;
export declare const arrowEndShapeName: String;
/**
 * 交互定义
 */
export declare const edgeDragLinkBehavior: EdgeDragLinkBehaviorOption;
/**
 * 边定义
 */
export declare const edgeDragArrow: ShapeOptions;

/**
 * 更新辅助控制点位置
 * @param cfg 要更新节点的model
 * @param group 要更新节点的group
 */
export declare function updateBehavior(cfg: NodeConfig | EdgeConfig | ComboConfig, group: Group): void;
