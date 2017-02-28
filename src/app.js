import 'aurelia-mdl';
import {componentHandler} from 'encapsulated-mdl';
import {Objectfield} from './resources/elements/objectfield';
import {fieldTypes} from './resources/fieldtypes';

export class App {
  formSchema = {};

  constructor() {
    // Allow access from browser console
    window.$oai = this;
  }

  parseJSON(obj) {
    const data = [];
    for (const [key, field] of Object.entries(obj)) {
      switch (field.type) {
      case 'object':
        field.children = this.parseJSON(field.children);
        data.push(new Objectfield().init(key, field));
        break;
      default:
        data.push(new fieldTypes[field.type]().init(key, field));
      }
    }
    return data;
  }

  bind() {
    this.formSchema.info = this.parseJSON({
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
    });
    this.formSchema.mime = this.parseJSON({
      array: {
        type: 'array',
        label: 'Array Test',
        item: {
          id: 'array-elem',
          type: 'text',
          labelFormat: 'Mui'
        }
      }
    });
  }

  attached() {
    componentHandler.upgradeElement(document.getElementById('container'));
  }
}
