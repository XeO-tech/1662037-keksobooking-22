import {setupMap} from './map.js';
import {setupForm, changeFormStatus, setupFormValidity} from './form.js';

changeFormStatus('disabled');
setupMap();
setupForm();
setupFormValidity();
