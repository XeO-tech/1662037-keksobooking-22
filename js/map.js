/* global L:readonly */

import {fillCard} from './elements-generator.js';
import {changeFormStatus} from './form.js';
import {getMapData} from './api.js';
import {setupFilterHandler} from './filters.js';

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

const showAds = (adsArray) => {
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

  const onMapLoaded = () => {
    changeFormStatus('form_fields_enabled');
    getMapData((adsArray) => {
      downloadedAds = [...adsArray];
      showAds(adsArray);
      changeFormStatus('filters_enabled');
      setupFilterHandler(adsArray);
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

const resetMapMarks = () => showAds(downloadedAds);

export {handleMap, setDefaultMarkerPosition, resetMapMarks, showAds};
