import {handleMap} from './map.js';
import {handleForm, changeFormStatus} from './form-handler.js';
import {validateForm} from './form-validation.js'

changeFormStatus('disabled');

handleMap()

handleForm();

validateForm();
