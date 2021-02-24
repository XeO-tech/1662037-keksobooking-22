const ALERT_SHOW_TIME = 5000;

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

const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = 1000;
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = 0;
  alertContainer.style.top = 0;
  alertContainer.style.right = 0;
  alertContainer.style.padding = '2px';
  alertContainer.style.fontSize = '15px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';
  alertContainer.style.opacity = 0.8;

  alertContainer.textContent = message;

  document.querySelector('#map-canvas').append(alertContainer);
  document.querySelector('#map-canvas').adjustHTML('beforeend','check');


  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
}

export {getIntFromRange, getFloatFromRange, showAlert};
