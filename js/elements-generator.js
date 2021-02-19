const cardTemplate = document.querySelector('#card').content;
const cardTemplateItem = cardTemplate.querySelector('.popup');

const fillCard = (data) => {
  const card = cardTemplateItem.cloneNode(true);
  const photos = card.querySelector('.popup__photos');
  const photo = photos.querySelector('.popup__photo');
  const featuresList = card.querySelector('.popup__features');

  const evaluateType = () => {
    switch (data.offer.type) {
      case 'flat':
        return 'Квартира';
      case 'bungalow':
        return 'Бунгало';
      case 'house':
        return 'Дом';
      case 'palace':
        return 'Дворец';
      default:
        return '';
    }
  }

  const textDataAlias = {
    'popup__text--address': data.offer.address,
    'popup__title': data.offer.title,
    'popup__type': evaluateType(),
    'popup__description': data.offer.description,
    'popup__text--price': (data.offer.price !== '') ? data.offer.price + ' ₽/ночь' : '',
    'popup__text--time': (data.offer.checkin !== '' && data.offer.checkout !== '') ? `Заезд после ${data.offer.checkin}, выезд до ${data.offer.checkout}.` : '',
    'popup__text--capacity': (data.offer.rooms!== '' && data.offer.guests !== '') ? `${data.offer.rooms} комнаты для ${data.offer.guests} гостей.` : '',
  }

  // Showing simple text data
  for (let key in textDataAlias) {
    if (textDataAlias[key] !== '') {
      card.querySelector('.' + key).innerText = textDataAlias[key];
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
const render = (data) => {
  const testMapElement = fillCard(data[0]);
  document.querySelector('#map-canvas').appendChild(testMapElement);
}

export {render};
