import {showAds} from './map.js';
import {debounce} from './utils.js';

const RERENDER_DELAY = 500;
const HIGH_PRICE_VALUE = 50000;
const MIDDLE_PRICE_VALUE = 10000;

const typeFilter = document.querySelector('#housing-type');
const roomsFilter = document.querySelector('#housing-rooms');
const priceFilter = document.querySelector('#housing-price');
const guestFilter = document.querySelector('#housing-guests');
const featuresListNode = document.querySelector('#housing-features');
const wifiFilter = featuresListNode.querySelector('input[value=wifi]');
const dishwasherFilter = featuresListNode.querySelector('input[value=dishwasher]');
const parkingFilter = featuresListNode.querySelector('input[value=parking]');
const washerFilter = featuresListNode.querySelector('input[value=washer]');
const elevatorFilter = featuresListNode.querySelector('input[value=elevator]');
const conditionerFilter = featuresListNode.querySelector('input[value=conditioner]');

const filterSimpleTextField = (array, filterName, filterField) => {
  if (filterField.value === 'any') {
    return array;
  }
  return array.filter((element) => {
    return element.offer[filterName].toString() === filterField.value
  })
};
const filterPriceField = (array, filterName, filterField) => {
  if (filterField.value === 'any') {
    return array;
  }
  return array.filter((element) => {
    switch (filterField.value) {
      case 'high':
        return element.offer[filterName] >= HIGH_PRICE_VALUE;
      case 'middle':
        return (element.offer[filterName] >= MIDDLE_PRICE_VALUE && element.offer.price < HIGH_PRICE_VALUE);
      case 'low':
        return element.offer[filterName] < MIDDLE_PRICE_VALUE ;
    }
  })
};
const filterFeatures = (array, filterName, filterField) => {
  if (!filterField.checked) {
    return array;
  }
  return array.filter((element) => element.offer.features.includes(filterName))
};
const filtersProperties = {
  type: {
    filterField: typeFilter,
    filterFunction: filterSimpleTextField,
  },
  price: {
    filterField: priceFilter,
    filterFunction: filterPriceField,
  },
  rooms: {
    filterField: roomsFilter,
    filterFunction: filterSimpleTextField,
  },
  guests: {
    filterField: guestFilter,
    filterFunction: filterSimpleTextField,
  },
  wifi: {
    filterField: wifiFilter,
    filterFunction: filterFeatures,
  },
  dishwasher: {
    filterField: dishwasherFilter,
    filterFunction: filterFeatures,
  },
  parking: {
    filterField: parkingFilter,
    filterFunction: filterFeatures,
  },
  washer: {
    filterField: washerFilter,
    filterFunction: filterFeatures,
  },
  elevator: {
    filterField: elevatorFilter,
    filterFunction: filterFeatures,
  },
  conditioner: {
    filterField: conditionerFilter,
    filterFunction: filterFeatures,
  },
};
const setupFilterHandler = (adsArray) => {
  const onFilterChange = () => {
    let currentAdsOnMap = [...adsArray];
    Object.keys(filtersProperties)
      .forEach((filter) => currentAdsOnMap = filtersProperties[filter].filterFunction(currentAdsOnMap, filter, filtersProperties[filter].filterField));
    showAds(currentAdsOnMap);
  };
  Object.keys(filtersProperties)
    .forEach((filter) => filtersProperties[filter].filterField.addEventListener('change', debounce(onFilterChange, RERENDER_DELAY)));
};
export {setupFilterHandler};
