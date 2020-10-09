import { throttle } from 'lodash';
import {getControlAnchorPosition} from '../../util';
import {shapeName, stateName, arrowStartShapeName, arrowEndShapeName} from './const';

/**
 * 更新辅助控制点
 * @param cfg
 * @param group
 */
export const update = (cfg, group) => {
  const { size: [width, height] } = cfg;
  const anchor = group.get('children').filter(c => c.attr('name') === shapeName);
  anchor.forEach((anchorShape) => {
    const p = anchorShape.attr('_anchor');
    const [x, y] = p;
    const point = getControlAnchorPosition(x, y, width, height);
    anchorShape.attr(point);
  });
};

export default {
  name: 'edge-drag-link',
  isMoving: false,
  type: null,
  current: null,
  cursorCache: new Map(),
  getDefaultCfg() {
    return {
      shouldBegin: () => true,
      shouldEnd: () => true,
      shouldMoveEnd: () => true,
      throttleMove: throttle(this.move.bind(this), 50)
    };
  },
  getEvents() {
    return {
      'node:mousedown': 'start',
      'node:mousemove': 'onMouseover',
      'node:mouseout': 'clearState',
      'mousemove': 'throttleMove',
      'mouseup': 'stop',
      'edge:mousedown': 'onEdgeClick'
    };
  },
  onMouseover (e) {
    this.clearState();
    e.item.setState(stateName, true);
  },
  onEdgeClick(e) {
    const type = e.item?.get('type');
    if (type !== 'edge') {
      return;
    }
    const edgeShapeName = e.shape?.get('name');
    if (![arrowStartShapeName, arrowEndShapeName].includes(edgeShapeName)) {
      return;
    }
    if (edgeShapeName === arrowStartShapeName) {
      this.type = 'source';
      this.old = {
        index: e.item.get('sourceAnchorIndex'),
        id: e.item.getSource().get('id')
      };
    } else if (edgeShapeName === arrowEndShapeName) {
      this.type = 'target';
      this.old = {
        index: e.item.get('targetAnchorIndex'),
        id: e.item.getTarget().get('id')
      };
    }
    if (this.type) {
      this.current = e.item;
      this.isMoving = true;
      this.graph.emit('edge-drag-link:start', this.current);
    }
  },
  clearState () {
    this.graph.setAutoPaint(false);
    this.graph.getNodes().forEach(node => this.graph.clearItemStates(node, [stateName]));
    this.graph.paint();
    this.graph.setAutoPaint(true);
  },
  start (e) {
    const attrName = e.target.attr('name');
    if (attrName !== shapeName || this.isMoving) {
      return;
    }
    if (typeof this.shouldBegin === 'function') {
      const result = this.shouldBegin(e);
      if (result === false) {
        return;
      }
    }
    this.isMoving = true;
    const model = e.item.getModel();
    const anchorPoints = e.item.getAnchorPoints();
    let sourceAnchor;
    if (anchorPoints && anchorPoints.length) {
      // 获取距离指定坐标最近的一个锚点
      sourceAnchor = e.item.getLinkPoint({ x: e.x, y: e.y });
    }
    this.type = 'target';
    this.current = this.graph.addItem('edge', {
      source: model.id,
      sourceAnchor: sourceAnchor?.index,
      history: false,
      target: {
        x: e.x,
        y: e.y
      }
    });
    this.graph.emit('edge-drag-link:start', this.current);
  },
  move (e) {
    const { isMoving, current, type = 'target' } = this;
    if (isMoving && current && !current.destroyed) {
      if (e.item?.get('type') === 'node' && typeof e.target?.attr === 'function') {
        const cursor = this.cursorCache.get(e.target);
        if (typeof this.shouldMoveEnd === 'function' && !cursor) {
          const result = this.shouldMoveEnd(e, current, type);
          if (result === false) {
            this.cursorCache.set(e.target, e.target.attr('cursor') || 'auto');
            e.target.attr({
              cursor: 'not-allowed'
            });
          }
        }
      }
      this.graph.updateItem(current, {
        [type]: {
          x: e.x,
          y: e.y
        }
      });
    }
  },
  stop (e) {
    const { isMoving, current, type } = this;
    if (isMoving && current && !current.destroyed) {
      this.clearCursor();
      this.isMoving = false;
      this.current = null;
      this.type = null;
      const node = e.item;
      const isSelf = (type === 'target' && node.get('id') === current.getSource().get('id')) || (type === 'source' && node.get('id') === current.getTarget().get('id'));
      let shouldEnd = true;
      if (typeof this.shouldEnd === 'function') {
        const result = this.shouldEnd(e, current, type);
        shouldEnd = result !== false;
      }
      if (!shouldEnd || !node || node === current || node.destroyed || isSelf) {
        if (this.old) {
          this.graph.updateItem(current, {
            [type]: this.old.id,
            [`${type}Anchor`]: this.old.index
          });
          this.old = null;
        } else {
          this.graph.removeItem(current);
        }
        this.graph.emit('edge-drag-link:end', current);
        return;
      }
      const anchorPoints = node.getAnchorPoints();
      let targetAnchor;
      if (anchorPoints && anchorPoints.length) {
        // 获取距离指定坐标最近的一个锚点
        targetAnchor = node.getLinkPoint({ x: e.x, y: e.y });
      }
      this.graph.updateItem(current, {
        [type]: node.get('id'),
        [`${type}Anchor`]: targetAnchor?.index
      });
      this.graph.emit('edge-drag-link:end', current);
    }
  },
  clearCursor() {
    for (const [key, value] of this.cursorCache.entries()) {
      key.attr({
        cursor: value
      });
    }
    this.cursorCache.clear();
  }
};
