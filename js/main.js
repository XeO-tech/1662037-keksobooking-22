import {createObjectsArr} from './data.js';
import {map, renderMap, getAddressByMarkerOnly, showAdsOnMap} from './map.js';
import {handleForm, changeFormStatus} from './form-handler.js';

const adsList = createObjectsArr(10);

changeFormStatus('disabled');

renderMap();

map.on('load', changeFormStatus('enabled'));

showAdsOnMap(adsList);

getAddressByMarkerOnly();

handleForm();

