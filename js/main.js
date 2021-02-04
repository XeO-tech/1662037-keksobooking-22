'use strict'
const getIntFromRange = (min, max) => getFloatFromRange(min, max);

const getFloatFromRange = (min, max, decimal) => {
  if (min < 0 || max < 0) {
    return 'Диапазон может быть только положительный, включая ноль';
  }
  if (max === min) {
    return max;
  }
  return (Math.random() * (Math.abs(max - min)) + Math.min(max, min)).toFixed(decimal);
}
getFloatFromRange(3.1, 7.3, 2);
getIntFromRange(9, 7);
