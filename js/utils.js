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
const defineWordEnding = (number, word) => {
  switch (true) {
    case (number % 10 === 1 && number !== 11):
      return word;
    case (number % 10 === 2 && number !== 12):
    case (number % 10 === 3 && number !== 13):
    case (number % 10 === 4 && number !== 14):
      return word + 'а';
    default:
      return word + 'ов';
  }
};
export {getFloatFromRange, isEscEvent, defineWordEnding};
