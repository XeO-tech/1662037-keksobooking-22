import {handleMap} from './map.js';
import {handleForm, changeFormStatus, setupFormValidity} from './form.js';

changeFormStatus('disabled');

handleMap();

handleForm();

setupFormValidity();
