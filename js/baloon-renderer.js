const renderBaloon = (data) => {
  const cardTemplate = document.querySelector('#card').content;
  const cardTemplateItem = cardTemplate.querySelector('.popup');
  const card = cardTemplateItem.cloneNode(true);
  const photos = card.querySelector('.popup__photos');
  const photo = photos.querySelector('.popup__photo');
  const featuresList = card.querySelector('.popup__features');

  const houseTypeAliases = {
    'flat': 'Квартира',
    'bungalow': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец',
  };
  const textDataAliases = {
    'popup__text--address': data.offer.address,
    'popup__title': data.offer.title,
    'popup__type': houseTypeAliases[data.offer.type],
    'popup__description': data.offer.description,
    'popup__text--price': (data.offer.price !== '') ? data.offer.price + ' ₽/ночь' : '',
    'popup__text--time': (data.offer.checkin !== '' && data.offer.checkout !== '') ? `Заезд после ${data.offer.checkin}, выезд до ${data.offer.checkout}.` : '',
    'popup__text--capacity': (data.offer.rooms!== '' && data.offer.guests !== '') ? `${data.offer.rooms} комнаты для ${data.offer.guests} гостей.` : '',
  };
  // Showing simple text data
  for (let key in textDataAliases) {
    if (textDataAliases[key] !== '') {
      card.querySelector('.' + key).innerText = textDataAliases[key];
    } else {
      card.querySelector('.' + key).style.display = 'none';
    }
  }
  // Displaying photos
  const photosFragment = document.createDocumentFragment()
  for (let i = 0; i < data.offer.photos.length; i++) {
    const newPhoto = photo.cloneNode(true);
    newPhoto.src = data.offer.photos[i];
    photosFragment.appendChild(newPhoto);
  }
  photos.removeChild(photo);
  photos.appendChild(photosFragment);
  if (photos.children.length === 0) {
    photos.style.display = 'none';
  }
  // Displaying features icons
  featuresList.innerHTML = '';
  const featuresFragment = document.createDocumentFragment()
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
  card.querySelector('.popup__avatar').src = data.author.avatar;

  return card;
};
export {renderBaloon};

