import {arrowEndShapeName, arrowStartShapeName} from './const';

export default {
  afterDraw(cfg, group) {
    const { startPoint, endPoint } = cfg;
    const startShape = group.addShape('circle', {
      attrs: {
        x: startPoint.x,
        y: startPoint.y,
        r: 8,
        fill: 'blue',
        opacity: 0
      },
      name: arrowStartShapeName
    });
    const endShape = group.addShape('circle', {
      attrs: {
        x: endPoint.x,
        y: endPoint.y,
        r: 8,
        fill: 'red',
        opacity: 0
      },
      name: arrowEndShapeName
    });
    [startShape, endShape].forEach(shape => {
      shape.on('mouseenter', () => {
        shape.attr({
          cursor: 'crosshair'
        });
      });
      shape.on('mouseleave', () => {
        shape.attr({
          cursor: 'unset'
        });
      });
    });
  },
  afterUpdate(cfg, item) {
    const group = item.getContainer();
    const children = group.get('children');
    const startShape = children.find(c => c.get('name') === arrowStartShapeName);
    const { startPoint, endPoint } = cfg;
    if (startShape) {
      startShape.attr({
        x: startPoint.x,
        y: startPoint.y
      });
    }

    const endShape = children.find(c => c.get('name') === arrowEndShapeName);
    if (endShape) {
      endShape.attr({
        x: endPoint.x,
        y: endPoint.y
      });
    }
  }
};
