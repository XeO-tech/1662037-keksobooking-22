const getIntFromRange = (min, max) => getFloatFromRange(min, max);

const getFloatFromRange = (min, max, decimal) => {
  if (min < 0 || max < 0) {
    return 'Диапазон может быть только положительный, включая ноль';
  }
  if (max === min) {
    return max;
  }
  return Number((Math.random() * (Math.abs(max - min)) + Math.min(max, min)).toFixed(decimal));
};

const isEscEvent = (evt) => {
  return evt.key === ('Escape' || 'Esc');
};

export {getIntFromRange, getFloatFromRange, isEscEvent};
