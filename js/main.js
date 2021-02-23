import {createObjectsArr} from './data.js';
import {map, renderMap, getAddressByMarkerOnly, showAdsOnMap} from './map.js';
import {handleForm, changeFormStatus} from './form-handler.js';

const adsList = createObjectsArr(10);

const onMapLoaded = () => changeFormStatus('enabled');


changeFormStatus('disabled');

renderMap();

map.on('load', onMapLoaded());

handleForm();

showAdsOnMap(adsList);

getAddressByMarkerOnly();
