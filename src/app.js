import {parseJSON} from './resources/jsonparser';
import {Objectfield} from './resources/elements/objectfield';
import {header} from './schemas/header';
import {mime} from './schemas/mime';
import {security} from './schemas/security';

export class App {
  constructor() {
    // Allow access from browser console
    window.$oai = this;

    this.forms = new Objectfield();
    this.forms.addChild(parseJSON('header', header));
    this.forms.addChild(parseJSON('mime', mime));
    this.forms.addChild(parseJSON('security', security));

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

  get formArray() {
    return Object.values(this.forms.children);
  }

  get json() {
    return JSON.stringify(this.forms.getValue(), '', '  ');
  }
}
