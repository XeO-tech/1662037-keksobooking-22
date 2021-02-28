import {createObjectsArr} from './data.js';
import {handleMap} from './map.js';
import {handleForm, changeFormStatus, setupFormValidity} from './form.js';

changeFormStatus('disabled');

handleMap(createObjectsArr(10));

handleForm();

setupFormValidity();
