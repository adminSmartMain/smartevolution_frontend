const indexOutBounds = (targetStep, steps) =>
  (targetStep < 0 && -1) || (targetStep >= steps && 1) || 0;

export default indexOutBounds;
