/* global L:readonly */

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
  iconUrl: '../img/main-pin.svg',
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

mainMarker.addTo(map);

export {map, mainMarker};
