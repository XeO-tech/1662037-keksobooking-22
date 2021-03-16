const HouseTypeAliases = {
  'flat': 'Квартира',
  'bungalow': 'Бунгало',
  'house': 'Дом',
  'palace': 'Дворец',
};

const renderBalloon = (data) => {
  const cardTemplate = document.querySelector('#card').content;
  const cardNode = cardTemplate.querySelector('.popup').cloneNode(true);
  const photosContainer = cardNode.querySelector('.popup__photos');
  const photoNode = photosContainer.querySelector('.popup__photo');
  const featuresList = cardNode.querySelector('.popup__features');

  const textDataAliases = {
    'popup__text--address': data.offer.address,
    'popup__title': data.offer.title,
    'popup__type': HouseTypeAliases[data.offer.type],
    'popup__description': data.offer.description,
    'popup__text--price': (data.offer.price !== '') ? data.offer.price + ' ₽/ночь' : '',
    'popup__text--time': (data.offer.checkin !== '' && data.offer.checkout !== '') ? `Заезд после ${data.offer.checkin}, выезд до ${data.offer.checkout}.` : '',
    'popup__text--capacity': (data.offer.rooms!== '' && data.offer.guests !== '') ? `${data.offer.rooms} комнаты для ${data.offer.guests} гостей.` : '',
  };
  // Showing simple text data
  for (let key in textDataAliases) {
    if (textDataAliases[key] !== '') {
      cardNode.querySelector('.' + key).innerText = textDataAliases[key];
    } else {
      cardNode.querySelector('.' + key).style.display = 'none';
    }
  }
  // Displaying photos
  const photosFragment = document.createDocumentFragment();
  for (let i = 0; i < data.offer.photos.length; i++) {
    const newPhoto = photoNode.cloneNode(true);
    newPhoto.src = data.offer.photos[i];
    photosFragment.appendChild(newPhoto);
  }
  photosContainer.removeChild(photoNode);
  photosContainer.appendChild(photosFragment);
  if (photosContainer.children.length === 0) {
    photosContainer.style.display = 'none';
  }
  // Displaying features icons
  featuresList.innerHTML = '';
  const featuresFragment = document.createDocumentFragment();
  for (let element of data.offer.features) {
    const newFeature = document.createElement('li');
    newFeature.className = `popup__feature popup__feature--${element}`;
    featuresFragment.appendChild(newFeature);
  }
  featuresList.appendChild(featuresFragment);
  if (featuresList.children.length === 0) {
    featuresList.style.display = 'none';
  }
  // Displaying avatar
  cardNode.querySelector('.popup__avatar').src = data.author.avatar;

  return cardNode;
};
export {renderBalloon};

