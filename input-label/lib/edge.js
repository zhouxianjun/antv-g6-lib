module.exports = (edge, model, graph, {
  width = 100,
  height = 20
} = {}) => {
  let { startPoint, endPoint } = model;
  startPoint = graph.getCanvasByPoint(startPoint.x, startPoint.y);
  endPoint = graph.getCanvasByPoint(endPoint.x, endPoint.y);
  // 获取锚点横轴距离
  const distanceX = Math.abs(startPoint.x - endPoint.x);
  // 获取锚点纵轴距离
  const distanceY = Math.abs(startPoint.y - endPoint.y);
  if (distanceX > distanceY && distanceX < width) {
    width = distanceX;
  }
  const startLeft = startPoint.x < endPoint.x ? startPoint.x : endPoint.x;
  const startTop = startPoint.y < endPoint.y ? startPoint.y : endPoint.y;
  // 计算输入框位置
  const left = startLeft + distanceX / 2 - width / 2;
  const top = startTop + distanceY / 2 - height / 2;
  return {
    left, top, height, width
  };
};
