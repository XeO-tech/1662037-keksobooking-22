/* global L:readonly */

import {fillCard} from './elements-generator.js';

const map = L.map('map-canvas')
  .setView({
    lat: 35.6825,
    lng: 139.7593,
  }, 12);

const pinIcon = L.icon({
  iconUrl: '/img/main-pin.svg',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const mainMarker = L.marker(
  {
    lat:35.6825,
    lng:139.7512,
  },
  {
    draggable: true,
    icon: pinIcon,
  },
)

const renderMap = () => {
  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  ).addTo(map);

  mainMarker.addTo(map);

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
    iconUrl: '/img/pin.svg',
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

export {map, renderMap, getAddressByMarkerOnly, showAdsOnMap};
