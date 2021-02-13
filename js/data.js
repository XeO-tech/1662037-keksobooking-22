import {getIntFromRange, getFloatFromRange} from './util.js';

const OFFER_TYPES = ['palace', 'flat', 'house', 'bungalow'];
const CHECK_TIME = ['12:00', '13:00', '14:00'];
const FEATURES_LIST = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

const createFeaturesList = () => {
  let resultArr = [];
  let tempArr = [...FEATURES_LIST];
  const randomLength = getIntFromRange(0, FEATURES_LIST.length);
  for (let i = 0; i < randomLength; i++) {
    const randomElement = getIntFromRange(0, tempArr.length-1);
    resultArr.push(tempArr[randomElement]);
    tempArr.splice(randomElement,1);
  }
  return resultArr;
};

const createPhotosLinks = () => new Array(getIntFromRange(0,10)).fill('http://o0.github.io/assets/images/tokyo/hotel').map((value, ind) => value += `${ind + 1}.jpg`);

const createObject = () => {
  const roomsNumber = getIntFromRange(2,4);
  const coordinateX = getFloatFromRange(35.65000, 35.70000, 5);
  const coordinateY = getFloatFromRange(139.70000, 139.80000, 5);
  return {
    author: {
      avatar: `img/avatars/user0${getIntFromRange(1,8)}.png`,
    },
    offer: {
      title: `Сдается ${roomsNumber}-x комнатное жилье`,
      address: `${coordinateX}, ${coordinateY}`,
      price: getIntFromRange(20000, 50000),
      type: OFFER_TYPES[getIntFromRange(0,3)],
      rooms: roomsNumber,
      guests: getIntFromRange(1,6),
      checkin: CHECK_TIME[getIntFromRange(0,2)],
      checkout: CHECK_TIME[getIntFromRange(0,2)],
      features: createFeaturesList(),
      description: `Сдается отличное ${roomsNumber}-x комнатное жилье c видом на Кремль.`,
      photos: createPhotosLinks(),
    },
    location: {
      x: coordinateX,
      y: coordinateY,
    },
  };
};

const createObjectsArr = (quantity) => new Array(quantity).fill(null).map(() => createObject());

export {createObjectsArr};

