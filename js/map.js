/* global L:readonly */

import {fillCard} from './elements-generator.js';
import {changeFormStatus} from './form-handler.js';

const handleMap = (adsArray) => {

  changeFormStatus('disabled');

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

  getAddressByMarkerOnly();

  showAdsOnMap(adsArray);

  map.on('load', onMapLoaded());
}

export {handleMap};
