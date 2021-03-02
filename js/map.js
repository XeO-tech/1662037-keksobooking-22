/* global L:readonly */

import {fillCard} from './elements-generator.js';
import {changeFormStatus} from './form.js';
import {getMapData} from './api.js';

const DEFAULT_LAT = 35.68251;
const DEFAULT_LNG = 139.75121;

const addressField = document.querySelector('#address');
const adsMarkersLayer = L.layerGroup();

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

const handleMap = () => {

  const ALERT_SHOW_TIME = 5000;
  const MAX_ADS_ON_MAP = 10;

  const typeFilter = document.querySelector('#housing-type');
  const roomFilter = document.querySelector('#housing-rooms');
  const priceFilter = document.querySelector('#housing-price');
  const guestsFilter = document.querySelector('#housing-guests');



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

  const filterTypeField = (array) => {
    if (typeFilter.value === 'any') {
      return array.slice();
    }
    return array.filter((element) => {
      return element.offer.type === typeFilter.value
    });
  };

  const filterRoomField = (array) => {
    if (roomFilter.value === 'any') {
      return array;
    }
    return array.filter((element) => {
      return element.offer.rooms.toString() === roomFilter.value
    })
  };

  const filterPriceField = (array) => {
    if (priceFilter.value === 'any') {
      return array;
    }
    return array.filter((element) => {
      switch (priceFilter.value) {
        case ('high'):
          return element.offer.price >= 50000;
        case ('middle'):
          return (element.offer.price >= 10000 && element.offer.price < 50000);
        case ('low'):
          return element.offer.price < 10000;
      }
    })
  }

  const filterGuestsField = (array) => {
    if (guestsFilter.value === 'any') {
      return array;
    }
    return array.filter((element) => {
      return element.offer.guests.toString() === guestsFilter.value
    })
  };

  const filterFunctionsList = [filterTypeField, filterRoomField, filterPriceField, filterGuestsField];

  const setTypeFilter =  (adsArray) => {
    let isUsedBefore = false;
    let beforeFilterApplied = [];
    const onFilterChange = (evt) => {
      switch (true) {
        case (!isUsedBefore):
          beforeFilterApplied = [...currentAdsOnMap];
          currentAdsOnMap = filterTypeField(currentAdsOnMap);
          showAdsOnMap(currentAdsOnMap);
          isUsedBefore = true;
          lastUsedFilter = evt.target.name;
          break;
        case (isUsedBefore && lastUsedFilter === evt.target.name):
          currentAdsOnMap = [...beforeFilterApplied]
          currentAdsOnMap = filterTypeField(currentAdsOnMap);
          showAdsOnMap(currentAdsOnMap);
          break;
        case (isUsedBefore && lastUsedFilter !== evt.target.name):
          currentAdsOnMap = filterRoomField(adsArray);
          currentAdsOnMap = filterPriceField(currentAdsOnMap);
          beforeFilterApplied = [...currentAdsOnMap];
          currentAdsOnMap = filterTypeField(currentAdsOnMap);
          showAdsOnMap(currentAdsOnMap);
          lastUsedFilter = evt.target.name;
      }
    };
    typeFilter.addEventListener('change', onFilterChange);
  };

  const setRoomFilter = (adsArray) => {
    let isUsedBefore = false;
    let beforeFilterApplied = [];
    const onFilterChange = (evt) => {
      switch (true) {
        case (!isUsedBefore):
          beforeFilterApplied = [...currentAdsOnMap];
          currentAdsOnMap = filterRoomField(currentAdsOnMap);
          showAdsOnMap(currentAdsOnMap);
          isUsedBefore = true;
          lastUsedFilter = evt.target.name;
          break;
        case (isUsedBefore && lastUsedFilter === evt.target.name):
          currentAdsOnMap = [...beforeFilterApplied]
          currentAdsOnMap = filterRoomField(currentAdsOnMap);
          showAdsOnMap(currentAdsOnMap);
          break;
        case (isUsedBefore && lastUsedFilter !== evt.target.name):
          currentAdsOnMap = filterTypeField(adsArray);
          currentAdsOnMap = filterPriceField(currentAdsOnMap);
          beforeFilterApplied = [...currentAdsOnMap];
          currentAdsOnMap = filterRoomField(currentAdsOnMap);
          showAdsOnMap(currentAdsOnMap);
          lastUsedFilter = evt.target.name;
      }
    };
    roomFilter.addEventListener('change', onFilterChange);
  };

  const setPriceFilter = (adsArray) => {
    let isUsedBefore = false;
    let beforeFilterApplied = [];
    const onFilterChange = (evt) => {
      switch (true) {
        case (!isUsedBefore):
          beforeFilterApplied = [...currentAdsOnMap];
          currentAdsOnMap = filterPriceField(currentAdsOnMap);
          showAdsOnMap(currentAdsOnMap);
          isUsedBefore = true;
          lastUsedFilter = evt.target.name;
          break;
        case (isUsedBefore && lastUsedFilter === evt.target.name):
          currentAdsOnMap = [...beforeFilterApplied]
          currentAdsOnMap = filterPriceField(currentAdsOnMap);
          showAdsOnMap(currentAdsOnMap);
          break;
        case (isUsedBefore && lastUsedFilter !== evt.target.name):
          currentAdsOnMap = filterRoomField(adsArray);
          currentAdsOnMap = filterTypeField(currentAdsOnMap);
          beforeFilterApplied = [...currentAdsOnMap];
          currentAdsOnMap = filterPriceField(currentAdsOnMap);
          showAdsOnMap(currentAdsOnMap);
          lastUsedFilter = evt.target.name;
      }
    };
    priceFilter.addEventListener('change', onFilterChange);
  };

  const setupFilterHandler = (adsArray, filterField, filterFunction) => {
    let isUsedBefore = false;
    let beforeFilterApplied = [];
    const onFilterChange = (evt) => {
      switch (true) {
        case (!isUsedBefore):
          beforeFilterApplied = [...currentAdsOnMap];
          currentAdsOnMap = filterFunction(currentAdsOnMap);
          showAdsOnMap(currentAdsOnMap);
          isUsedBefore = true;
          lastUsedFilter = evt.target.name;
          break;
        case (isUsedBefore && lastUsedFilter === evt.target.name):
          currentAdsOnMap = [...beforeFilterApplied]
          currentAdsOnMap = filterFunction(currentAdsOnMap);
          showAdsOnMap(currentAdsOnMap);
          break;
        case (isUsedBefore && lastUsedFilter !== evt.target.name):
          currentAdsOnMap = [...adsArray]
          filterFunctionsList
            .filter((element) => element !== filterFunction)
            .forEach((element) => currentAdsOnMap = element(currentAdsOnMap));
          beforeFilterApplied = [...currentAdsOnMap];
          currentAdsOnMap = filterFunction(currentAdsOnMap);
          showAdsOnMap(currentAdsOnMap);
          lastUsedFilter = evt.target.name;
      }
    };
    console.log(filterField)
    filterField.addEventListener('change', onFilterChange);
  };

  const onMapLoaded = () => {
    changeFormStatus('form_fields_enabled');
    getMapData((adsArray) => {
      showAdsOnMap(adsArray);
      changeFormStatus('filters_enabled');

      currentAdsOnMap = [...adsArray];
      setTypeFilter(adsArray);
      setRoomFilter(adsArray);
      setPriceFilter(adsArray);
      setupFilterHandler(adsArray, guestsFilter, filterGuestsField)

    },
    () => showMapAlert('Не удалось загрузить объявления с сервера'),
    );
  };


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

  mainMarker.addTo(map);

  setupAddressByMarkerOnly();

  map.on('load', onMapLoaded());
};

const setDefaultMarkerPosition = () => {
  mainMarker.setLatLng([DEFAULT_LAT, DEFAULT_LNG]);
  addressField.value = `${DEFAULT_LAT}, ${DEFAULT_LNG}`;
};

export {handleMap, setDefaultMarkerPosition};
