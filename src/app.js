import {parseJSON} from './resources/jsonparser';
import {schema} from './schemas/index';

export class App {
  constructor() {
    // Allow access from browser console
    window.$oai = this;

    this.forms = parseJSON('swagger', schema);

    this.activeForm = this.forms.getChild('header');
    this.activeForm.show = true;

    window.onhashchange = () => {
      const formID = window.location.hash.substr(2);
      if (this.forms.hasChild(formID)) {
        this.activeForm.show = false;
        this.activeForm = this.forms.getChild(formID);
        this.activeForm.show = true;
      }
    };
    window.onhashchange();
  }

  get json() {
    return JSON.stringify(this.forms.getValue(), '', '  ');
  }
}
