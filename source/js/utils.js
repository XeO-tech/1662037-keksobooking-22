
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
const debounce = (func, delay) => {
  let lastCall;
  return function() {
    lastCall = Date.now();
    setTimeout(() => {
      if ((Date.now() - lastCall) >= delay) {
        return func();
      }
    }, delay);
  }
};
export {isEscEvent, defineWordEnding, debounce};
