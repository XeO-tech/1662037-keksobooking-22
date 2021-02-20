/* global L:readonly */

import {createObjectsArr} from './data.js';
import {map, mainMarker} from './map.js';
import {fillCard} from './elements-generator.js';

const adsList = createObjectsArr(10);

const changeFormStatus = (status) => {
  const adForm = document.querySelector('.ad-form');
  const adFormElements = adForm.querySelectorAll('.ad-form__element');
  const mapFilters = document.querySelector('.map__filters');
  const mapFiltersElements = mapFilters.children;

  switch (status) {
    case 'disabled':
      adForm.classList.add('ad-form--disabled');
      adFormElements.forEach((element) => element.disabled = true);
      mapFilters.classList.add('map__filters--disabled');
      for (let element of mapFiltersElements) {
        element.disabled = true;
      }
      break;

    case 'enabled':
      adForm.classList.remove('ad-form--disabled');
      adFormElements.forEach((element) => element.disabled = false);
      mapFilters.classList.remove('map__filters--disabled');
      for (let element of mapFiltersElements) {
        element.disabled = false;
      }
      break;
  }
}

const getAddressByMarkerOnly = () => {
  const addressField = document.querySelector('#address');
  addressField.readOnly = true;
  mainMarker.on('moveend', (evt) => {
    const coordinates = evt.target.getLatLng();
    addressField.value = `${coordinates.lat.toFixed(5)}, ${coordinates.lng.toFixed(5)}`
  });
}

const showAdsOnMap = (adsArray) => {
  const adsIcon = L.icon({
    iconUrl: '../img/pin.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
  adsArray.forEach((element) => {
    const marker = L.marker({
      lat: element.location.x,
      lng: element.location.y,
    },
    {
      icon: adsIcon,
    });
    marker
      .addTo(map)
      .bindPopup(fillCard(element));
  });
};

changeFormStatus('disabled');

map.on('load', changeFormStatus('enabled'));

getAddressByMarkerOnly();

showAdsOnMap(adsList);


