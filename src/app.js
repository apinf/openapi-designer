import 'aurelia-mdl';
import {componentHandler} from 'encapsulated-mdl';
import {fieldTypes} from './resources/fieldtypes';
import {header} from './schema/header';
import {mime} from './schema/mime';

export class App {
  formSchema = {};

  constructor() {
    // Allow access from browser console
    window.$oai = this;

    this.formSchema.header = this.parseJSON('header', header);
    this.formSchema.mime = this.parseJSON('mime', mime);
  }

  parseJSON(id, obj) {
    if (obj.type === 'object') {
      for (const [key, field] of Object.entries(obj.children)) {
        obj.children[key] = this.parseJSON(key, field);
      }
    }
    return new fieldTypes[obj.type]().init(id, obj);
  }

  attached() {
    // Activate Material Design Lite
    componentHandler.upgradeElement(document.getElementById('container'));
  }
}
