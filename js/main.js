import {handleMap} from './map.js';
import {handleForm, changeFormStatus} from './form-handler.js';
import {validateForm, setFormSubmit} from './form-validation.js'

changeFormStatus('disabled');

handleMap();

handleForm();

validateForm();

//setFormSubmit(() => console.log(1))

