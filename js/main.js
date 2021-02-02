'use strict'
const getIntFromRange = (min, max) => {
  min = Math.floor(min);
  max = Math.floor(max);
  if (min < 0 || max < 0) {
    return 'Диапазон может быть только положительный, включая ноль';
  }
  if (min > max) {
    let temp = min;
    min = max;
    max = temp;
  }
  if (max === min) {
    return max;
  }
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const getFloatFromRange = (min, max, decimal) => {
  if (min < 0 || max < 0) {
    return 'Диапазон может быть только положительный, включая ноль';
  }
  if (min > max) {
    let temp = min;
    min = max;
    max = temp;
  }
  if (max === min) {
    return max;
  }
  return (Math.random() * (max - min) + min).toFixed(decimal);
}

