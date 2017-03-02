import 'aurelia-mdl';
import {componentHandler} from 'encapsulated-mdl';
import {fieldTypes} from './resources/fieldtypes';

export class App {
  formSchema = {};

  constructor() {
    // Allow access from browser console
    window.$oai = this;
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

  bind() {
    // Temporary hardcoded form data
    this.formSchema.header = this.parseJSON('header', {
      type: 'object',
      children: {
        info: {
          type: 'object',
          children: {
            title: {
              type: 'text',
              columns: 5
            },
            version: {
              type: 'text',
              columns: 3
            },
            description: {
              type: 'textarea'
            },
            termsofservice: {
              type: 'text',
              label: 'Terms of Service'
            }
          }
        },
        contact: {
          type: 'object',
          children: {
            name: {
              type: 'text'
            },
            email: {
              type: 'text'
            },
            url: {
              type: 'text',
              label: 'URL'
            }
          }
        }
      }
    });
    this.formSchema.mime = this.parseJSON('mime', {
      type: 'array',
      label: 'Array Test',
      item: {
        id: 'array-elem',
        type: 'text',
        labelFormat: 'Mui'
      }
    });
  }
}
