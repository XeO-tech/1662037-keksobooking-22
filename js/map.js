/* global L:readonly */
/* global _:readonly */

import {renderBaloon} from './baloon-renderer.js';
import {changeFormStatus} from './form.js';
import {getMapData} from './api.js';

const DEFAULT_LAT = 35.68251;
const DEFAULT_LNG = 139.75121;
const DEFAULT_MAP_SCALE = 9;
const MAX_ADS_ON_MAP = 10;

const addressField = document.querySelector('#address');
const adsMarkersLayer = L.layerGroup();
let downloadedAds = [];

const map = L.map('map-canvas')
  .setView({
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
  }, DEFAULT_MAP_SCALE);
L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

const pinIcon = L.icon({
  iconUrl: './img/main-pin.svg',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const mainMarker = L.marker(
  {
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
  },
  {
    draggable: true,
    icon: pinIcon,
  },
);

const showAdsOnMap = (adsArray) => {
  const adsIcon = L.icon({
    iconUrl: './img/pin.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  if (adsMarkersLayer.getLayers().length > 0) {
    adsMarkersLayer.clearLayers();
  }

  adsArray.slice(0, MAX_ADS_ON_MAP).forEach((element) => {
    L.marker({
      lat: element.location.lat,
      lng: element.location.lng,
    },
    {
      icon: adsIcon,
    })
      .addTo(adsMarkersLayer)
      .bindPopup(renderBaloon(element));
  });
  adsMarkersLayer.addTo(map);
};

const handleMap = () => {
  const ALERT_SHOW_TIME = 5000;
  const RERENDER_DELAY = 500;
  const HIGH_PRICE_VALUE = 50000;
  const MIDDLE_PRICE_VALUE = 10000;

  const typeFilter = document.querySelector('#housing-type');
  const roomsFilter = document.querySelector('#housing-rooms');
  const priceFilter = document.querySelector('#housing-price');
  const guestFilter = document.querySelector('#housing-guests');
  const featuresList = document.querySelector('#housing-features');
  const wifiFilter = featuresList.querySelector('input[value=wifi ]');
  const dishwasherFilter = featuresList.querySelector('input[value=dishwasher]');
  const parkingFilter = featuresList.querySelector('input[value=parking]');
  const washerFilter = featuresList.querySelector('input[value=washer]');
  const elevatorFilter = featuresList.querySelector('input[value=elevator]');
  const conditionerFilter = featuresList.querySelector('input[value=conditioner]');

  const setupAddressByMarkerOnly = () => {
    addressField.readOnly = true;
    addressField.value = `${DEFAULT_LAT}, ${DEFAULT_LNG}`;

    mainMarker.on('moveend', (evt) => {
      const newCoordinates = evt.target.getLatLng();
      addressField.value = `${newCoordinates.lat.toFixed(5)}, ${newCoordinates.lng.toFixed(5)}`
    });
  };

  const showMapAlert = (message) => {
    const alertContainer = document.createElement('div');
    alertContainer.style.zIndex = 1000;
    alertContainer.style.position = 'absolute';
    alertContainer.style.left = 0;
    alertContainer.style.right = 0;
    alertContainer.style.top = 0;
    alertContainer.style.padding = '2px';
    alertContainer.style.fontSize = '15px';
    alertContainer.style.textAlign = 'center';
    alertContainer.style.backgroundColor = 'red';
    alertContainer.style.opacity = 0.8;
    alertContainer.textContent = message;

    document.querySelector('#map-canvas').append(alertContainer);
    setTimeout(() => {
      alertContainer.remove();
    }, ALERT_SHOW_TIME);
  };

  const filterSimpleTextField = (array, filterName, filterField) => {
    if (filterField.value === 'any') {
      return array;
    }
    return array.filter((element) => {
      return element.offer[filterName].toString() === filterField.value
    });
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
          return element.offer[filterName] < MIDDLE_PRICE_VALUE;
      }
    });
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

  const setupFilterHandler = (adsArray, filterName) => {
    const filterField = filtersProperties[filterName].filterField;

    const onFilterChange = () => {
      let currentAdsOnMap = [...adsArray];
      Object.keys(filtersProperties)
        .forEach((filter) => currentAdsOnMap = filtersProperties[filter].filterFunction(currentAdsOnMap, filter, filtersProperties[filter].filterField));
      showAdsOnMap(currentAdsOnMap);
    };
    filterField.addEventListener('change', _.debounce(onFilterChange, RERENDER_DELAY));
  };

  const onMapLoaded = () => {
    changeFormStatus('form_fields_enabled');
    getMapData((adsArray) => {
      downloadedAds = [...adsArray];
      showAdsOnMap(adsArray);
      changeFormStatus('filters_enabled');

      for (let filterName in filtersProperties) {
        setupFilterHandler(adsArray, filterName)
      }
    },
    () => showMapAlert('Не удалось загрузить объявления с сервера'),
    );
  };

  mainMarker.addTo(map);
  setupAddressByMarkerOnly();
  map.on('load', onMapLoaded());
};

const setDefaultMarkerPosition = () => {
  mainMarker.setLatLng([DEFAULT_LAT, DEFAULT_LNG]);
  addressField.value = `${DEFAULT_LAT}, ${DEFAULT_LNG}`;
};

const resetMapMarks = () => showAdsOnMap(downloadedAds);

export {handleMap, setDefaultMarkerPosition, resetMapMarks};
