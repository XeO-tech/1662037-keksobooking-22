/* global L:readonly */
/* global _:readonly */

import {fillCard} from './elements-generator.js';
import {changeFormStatus} from './form.js';
import {getMapData} from './api.js';

const DEFAULT_LAT = 35.68251;
const DEFAULT_LNG = 139.75121;
const MAX_ADS_ON_MAP = 10;

const addressField = document.querySelector('#address');
const adsMarkersLayer = L.layerGroup();

let downloadedAds = [];

const map = L.map('map-canvas')
  .setView({
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
  }, 9);

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
      .bindPopup(fillCard(element));
  });

  adsMarkersLayer.addTo(map);
};

const handleMap = () => {

  const ALERT_SHOW_TIME = 5000;
  const RERENDER_DELAY = 500

  const typeFilter = document.querySelector('#housing-type');
  const roomFilter = document.querySelector('#housing-rooms');
  const priceFilter = document.querySelector('#housing-price');
  const guestFilter = document.querySelector('#housing-guests');
  const featuresList = document.querySelector('#housing-features');
  const wifiFilter = featuresList.querySelector('input[value=\'wifi\']');
  const dishwasherFilter = featuresList.querySelector('input[value=\'dishwasher\']');
  const parkingFilter = featuresList.querySelector('input[value=\'parking\']');
  const washerFilter = featuresList.querySelector('input[value=\'washer\']');
  const elevatorFilter = featuresList.querySelector('input[value=\'elevator\']');
  const conditionerFilter = featuresList.querySelector('input[value=\'conditioner\']');


  let lastUsedFilter = '';
  let currentAdsOnMap = [];

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

  const filterSimpleField = (array, filterName, filterField) => {
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
        case ('high'):
          return element.offer[filterName] >= 50000;
        case ('middle'):
          return (element.offer[filterName] >= 10000 && element.offer.price < 50000);
        case ('low'):
          return element.offer[filterName] < 10000;
      }
    })
  };

  const filterFeatures = (array, filterName, filterField) => {
    if (!filterField.checked) {
      return array;
    }
    return array.filter((element) => element.offer.features.includes(filterName))
  };

  const filtersDescription = {
    type: {
      filterField: typeFilter,
      filterFunction: filterSimpleField,
    },
    price: {
      filterField: priceFilter,
      filterFunction: filterPriceField,
    },
    rooms: {
      filterField: roomFilter,
      filterFunction: filterSimpleField,
    },
    guests: {
      filterField: guestFilter,
      filterFunction: filterSimpleField,
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
    const filterField = filtersDescription[filterName].filterField;
    const filterFunction = filtersDescription[filterName].filterFunction;

    let isUsedBefore = false;
    let beforeFilterApplied = [];

    const onFilterChange = () => {
      switch (true) {
        // Если фильтр ранее НЕ был использован, то можно обрабатывать текущий отсортированный массив объявлений
        case (!isUsedBefore):
          beforeFilterApplied = [...currentAdsOnMap];
          currentAdsOnMap = filterFunction(currentAdsOnMap, filterName, filterField);
          showAdsOnMap(currentAdsOnMap);
          isUsedBefore = true;
          lastUsedFilter = filterName;
          break;
        // Если фильтр ранее БЫЛ использован и предыдущий использованный фильтр ОН ЖЕ, то нужно обрабатывать массив объявлений, собранный до первого раза использования данного фильтра в непрырывной последовательности
        case (isUsedBefore && lastUsedFilter === filterName):
          currentAdsOnMap = filterFunction(beforeFilterApplied, filterName, filterField);
          showAdsOnMap(currentAdsOnMap);
          break;
        // Если фильтр ранее БЫЛ использован, но предыдущий использованный фильтр НЕ ОН же, то нужно последовательно применить другие активные фильтры, сохранить получившийся массив в beforeFilterApplied для использования в вышеописанном случае, после чего применить текущий фильтр последним
        case (isUsedBefore && lastUsedFilter !== filterName):
          currentAdsOnMap = [...adsArray]
          Object.keys(filtersDescription)
            .filter((element) => element !== filterName)
            .forEach((element) => currentAdsOnMap = filtersDescription[element].filterFunction(currentAdsOnMap, element, filtersDescription[element].filterField));
          beforeFilterApplied = [...currentAdsOnMap];
          currentAdsOnMap = filterFunction(currentAdsOnMap, filterName, filterField);
          showAdsOnMap(currentAdsOnMap);
          lastUsedFilter = filterName;
      }
    };
    filterField.addEventListener('change', _.debounce(onFilterChange, RERENDER_DELAY));
  };

  const onMapLoaded = () => {
    changeFormStatus('form_fields_enabled');
    getMapData((adsArray) => {
      showAdsOnMap(adsArray);
      changeFormStatus('filters_enabled');
      downloadedAds = currentAdsOnMap = [...adsArray];

      for (let filterName in filtersDescription) {
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

const resetMapMarks = () => {
  showAdsOnMap(downloadedAds);
}

export {handleMap, setDefaultMarkerPosition, resetMapMarks};
