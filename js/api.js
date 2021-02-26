const getMapData = (onSuccess, onFail) => {
  fetch('https://22.javascript.pages.academy/keksobooking/data')
    .then((response) => response.json())
    .then((adsArray) => {
      onSuccess(adsArray);
    })
    .catch(() => onFail());
};

const sendFormData = (onSuccess, onFail, body) => {
  fetch('https://22.javascript.pages.academy/keksobooking2',
    {
      method: 'POST',
      body,
    })
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onFail();
      }
    });
};

export {getMapData, sendFormData}
