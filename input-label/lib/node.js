module.exports = (node, model, graph) => {
  const { x, y } = model;
  let { size: [width = 40, height = 20] = [] } = model;
  const canvasXY = graph.getCanvasByPoint(x, y);
  const zoom = graph.getZoom();
  width = width * zoom;
  height = height * zoom;
  return {
    left: canvasXY.x - width / 2,
    top: canvasXY.y - height / 2,
    width,
    height
  };
};
