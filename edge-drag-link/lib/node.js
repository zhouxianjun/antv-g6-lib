import {uniqWith} from 'lodash';
import { stateName, shapeName } from './const';
import {changeStateOfShapes, getControlAnchorPosition} from '../../util';

const DEFAULT_MARKER_STYLE = {
  r: 3,
  symbol: 'circle',
  fill: '#FFFFFF',
  fillOpacity: 0,
  stroke: 'red',
  strokeOpacity: 0,
  cursor: 'crosshair'
};

/**
 * 生成锚点
 * @param interval 间隔
 * @return {unknown[]}
 */
export const getAnchors = interval => {
  const anchors = [];
  for (let i = 0; i <= 1; i+=interval) {
    const v = Number(i.toFixed(2));
    anchors.push([0, v]);
    anchors.push([v, 0]);
    anchors.push([1, v]);
    anchors.push([v, 1]);
  }
  return uniqWith(anchors, (o, n) => o.x === n.x && o.y === n.y);
};

export default ({ markerStyle, getAttr, stateChanged } = {}) => {
  return {
    setState (name, value, item) {
      changeStateOfShapes(stateName, shapeName, {getAttr, stateChanged})(name, value, item);
    },
    afterDraw(cfg, group) {
      const { id, edgeDragLink: { markerStyle: markerStyle2 } = {}, anchorPoints } = cfg;
      let width, height;
      if (cfg.size) {
        [width, height] = cfg.size;
      } else {
        ({width, height} = group.getFirst());
      }
      if (anchorPoints?.length) {
        anchorPoints.forEach((p, index) => {
          const [x, y] = p;
          const point = getControlAnchorPosition(x, y, width, height);
          group.addShape('marker', {
            id: `${id}-${shapeName}-${index}`,
            name: shapeName,
            attrs: {
              name: shapeName,
              ...point,
              _anchor: p,
              // 锚点默认样式
              ...DEFAULT_MARKER_STYLE,
              ...markerStyle,
              ...markerStyle2,
            }
          });
        });
      }
    }
  };
};
