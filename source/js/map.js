import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import {renderBalloon} from './balloon-renderer.js';
import {changeFormStatus} from './form.js';
import {getMapData} from './api.js';
import {setupFilterHandler} from './filters.js';

const DEFAULT_LAT = 35.68251;
const DEFAULT_LNG = 139.75121;
const DEFAULT_MAP_SCALE = 9;
const MAX_ADS_ON_MAP = 10;
const ALERT_SHOW_TIME = 5000;

const addressField = document.querySelector('#address');
const adsMarkersLayer = L.layerGroup();
let downloadedAds = [];

const map = L.map('map-canvas');
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
      .bindPopup(renderBalloon(element));
  });
  adsMarkersLayer.addTo(map);
};
const setupMap = () => {
  const setupAddressByMarkerOnly = () => {
    addressField.readOnly = true;
    addressField.value = `${DEFAULT_LAT}, ${DEFAULT_LNG}`;

    mainMarker.on('moveend', (evt) => {
      const newCoordinates = evt.target.getLatLng();
      addressField.value = `${newCoordinates.lat.toFixed(5)}, ${newCoordinates.lng.toFixed(5)}`
    });
  };
  const showAlert = (message) => {
    const alertContainerNode = document.createElement('div');
    alertContainerNode.style.zIndex = 1000;
    alertContainerNode.style.position = 'absolute';
    alertContainerNode.style.left = 0;
    alertContainerNode.style.right = 0;
    alertContainerNode.style.top = 0;
    alertContainerNode.style.padding = '2px';
    alertContainerNode.style.fontSize = '15px';
    alertContainerNode.style.textAlign = 'center';
    alertContainerNode.style.backgroundColor = 'red';
    alertContainerNode.style.opacity = 0.8;
    alertContainerNode.textContent = message;

    document.querySelector('#map-canvas').append(alertContainerNode);
    setTimeout(() => {
      alertContainerNode.remove();
    }, ALERT_SHOW_TIME);
  };
  const onLoaded = () => {
    changeFormStatus('form_fields_enabled');
    getMapData((adsArray) => {
      downloadedAds = [...adsArray];
      showAds(adsArray);
      changeFormStatus('filters_enabled');
      setupFilterHandler(adsArray);
    },
    () => showAlert('Не удалось загрузить объявления с сервера'),
    );
  };
  mainMarker.addTo(map);
  setupAddressByMarkerOnly();
  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  ).addTo(map);

  map
    .on('load', onLoaded)
    .setView({
      lat: DEFAULT_LAT,
      lng: DEFAULT_LNG,
    }, DEFAULT_MAP_SCALE);
};
const setDefaultMarkerPosition = () => {
  mainMarker.setLatLng([DEFAULT_LAT, DEFAULT_LNG]);
  addressField.value = `${DEFAULT_LAT}, ${DEFAULT_LNG}`;
};
const resetMarks = () => showAds(downloadedAds);

export {setupMap, setDefaultMarkerPosition, resetMarks, showAds};
