const getData = (onSuccess, onFail) => {
  fetch('https://22.javascript.pages.academy/keksobooking/data2')
    .then((response) => response.json())
    .then((adsArray) => {
      onSuccess(adsArray);
    })
    .catch((err) => onFail(err));
};


// const sendData = (onSuccess, onFail, body) => {

// };

export {getData}
