import {parseJSON} from './resources/jsonparser';
import {header} from './schemas/header';
import {mime} from './schemas/mime';

export class App {
  constructor() {
    // Allow access from browser console
    window.$oai = this;

    this.forms = {
      header: parseJSON('header', header),
      mime: parseJSON('mime', mime)
    };

    this.activeForm = this.forms.header;
    this.activeForm.show = true;

    window.onhashchange = () => {
      const form = window.location.hash.substr(2);
      if (this.forms.hasOwnProperty(form)) {
        this.activeForm.show = false;
        this.forms[form].show = true;

        this.activeForm = this.forms[form];
      }
    };
    window.onhashchange();
  }

  get formArray() {
    return Object.values(this.forms);
  }

  get json() {
    const data = {};
    for (const [name, form] of Object.entries(this.forms)) {
      data[name] = form.getValue();
    }
    return JSON.stringify(data, '', '  ');
  }
}
