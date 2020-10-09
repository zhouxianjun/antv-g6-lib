import {isObject} from 'lodash';

const SHOW_STYLE = {
  fillOpacity: 1,
  strokeOpacity: 1
};

const HIDE_STYLE = {
  fillOpacity: 0,
  strokeOpacity: 0
};

/**
 * 获取辅助控制的边线位置属性
 * @param width
 * @param height
 * @return {{path: ((string|number)[]|string[])[], x: number, width: *, y: number, height: *}}
 */
export const getEdgeShapeAttr = (width, height) => ({
  x: 0 - width / 2,
  y: 0 - height / 2,
  width,
  height,
  path: [
    [ 'M', -width / 2, -height / 2 ],
    [ 'L', width / 2, -height / 2 ],
    [ 'L', width / 2, height / 2 ],
    [ 'L', -width / 2, height / 2 ],
    [ 'Z' ]
  ]
});

/**
 * 获取辅助控制的点位置
 * @param x 控制点x坐标
 * @param y 控制点y坐标
 * @param width
 * @param height
 * @return {{x: number, y: number}}
 */
export const getControlAnchorPosition = (x, y, width, height) => {
  // 计算Marker中心点坐标
  const originX = -width / 2;
  const originY = -height / 2;
  const anchorX = x * width + originX;
  const anchorY = y * height + originY;
  return {
    x: anchorX,
    y: anchorY
  };
};

/**
 * shape状态变更
 * @param stateName 状态名称
 * @param shapeName 节点attr名称
 * @param getAttr 动态获取attr属性function(value, item, shape)
 * @param stateChanged 状态变更事件function(value, item, shape)
 * @return {function(*, *=, *): void}
 */
export const changeStateOfShapes = (stateName, shapeName, {
  getAttr,
  stateChanged
}) => {
  return (name, value, item) => {
    if (name === stateName) {
      const group = item.getContainer();
      const children = group.get('children');
      const shapes = children.filter(child => child.attr('name') === shapeName);
      shapes.forEach(async shape => {
        let cAttr = {};
        if (typeof getAttr === 'function') {
          const ret = await Reflect.apply(getAttr, this, [value, item, shape]);
          if (isObject(ret)) {
            cAttr = ret;
          }
        }
        shape.attr({
          ...value ? SHOW_STYLE : HIDE_STYLE,
          ...cAttr
        });
        value && shape.show();
        !value && shape.hide();
        if (typeof stateChanged === 'function') {
          Reflect.apply(stateChanged, this, [value, item, shape]);
        }
      });
    }
  };
};
