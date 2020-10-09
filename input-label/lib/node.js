module.exports = (node, model) => {
  const { x, y, size: [width = 40, height = 20] = [] } = model;
  return {
    left: x - width / 2,
    top: y - height / 2,
    width,
    height
  };
};
