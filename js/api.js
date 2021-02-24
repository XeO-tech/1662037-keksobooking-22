const getData = (onSuccess) => {
  fetch('https://22.javascript.pages.academy/keksobooking/data')
    .then((response) => {
      console.log(response);
      response.json()
    })
    .then((adsArray) => {
      onSuccess(adsArray);
    });


};

// const sendData = (onSuccess, onFail, body) => {

// };

export {getData}
