/* global L:readonly */

import {fillCard} from './elements-generator.js';
import {changeFormStatus} from './form-handler.js';
import {getData} from './api.js';

const handleMap = () => {

  const onMapLoaded = () => changeFormStatus('enabled');

  const map = L.map('map-canvas')
    .setView({
      lat: 35.6825,
      lng: 139.7593,
    }, 12);

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
      lat:35.6825,
      lng:139.7512,
    },
    {
      draggable: true,
      icon: pinIcon,
    },
  ).addTo(map);

  const getAddressByMarkerOnly = () => {
    const addressField = document.querySelector('#address');
    const mainMarkerCoordinates = mainMarker.getLatLng();

    addressField.readOnly = true;
    addressField.value = `${mainMarkerCoordinates.lat.toFixed(5)}, ${mainMarkerCoordinates.lng.toFixed(5)}`;

    mainMarker.on('moveend', (evt) => {
      const newCoordinates = evt.target.getLatLng();
      addressField.value = `${newCoordinates.lat.toFixed(5)}, ${newCoordinates.lng.toFixed(5)}`
    });
  }

  const showAdsOnMap = (adsArray) => {
    const adsIcon = L.icon({
      iconUrl: './img/pin.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
    adsArray.forEach((element) => {
      L.marker({
        lat: element.location.x,
        lng: element.location.y,
      },
      {
        icon: adsIcon,
      })
        .addTo(map)
        .bindPopup(fillCard(element));
    });
  };

  getAddressByMarkerOnly();

  map.on('load', onMapLoaded());

  showAdsOnMap(getData);
}

export {handleMap};
