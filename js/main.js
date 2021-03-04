import {handleMap} from './map.js';
import {handleForm, changeFormStatus, setupFormValidity} from './form.js';
import './picture-uploader.js';

changeFormStatus('disabled');

handleMap();

handleForm();

setupFormValidity();
