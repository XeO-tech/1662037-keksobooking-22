const handleForm = () => {
  const adForm = document.querySelector('.ad-form');
  const placeType = adForm.querySelector('#type');
  const nightPrice = adForm.querySelector('#price');
  const checkIn = adForm.querySelector('#timein');
  const checkOut = adForm.querySelector('#timeout');

  const onCheckInOut = (evt) => {
    (evt.target === checkIn) ? checkOut.value = evt.target.value : checkIn.value = evt.target.value;
  };

  [checkIn, checkOut].forEach((element) => element.addEventListener('change', onCheckInOut));

  placeType.addEventListener('change', () => {
    let minPrice = 0;
    switch (placeType.value) {
      case 'bungalow':
        minPrice = 80000;
        break;
      case 'flat':
        minPrice = 5000;
        break;
      case 'house':
        minPrice = 15000;
        break;
      case 'palace':
        minPrice = 120000;
        break;
    }
    nightPrice.min = nightPrice.placeholder = minPrice;
  });
}
export {handleForm}
