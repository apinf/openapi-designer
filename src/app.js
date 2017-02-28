import 'aurelia-mdl';
import {componentHandler} from 'encapsulated-mdl';
import {Objectfield} from './resources/elements/objectfield';
import {Textfield} from './resources/elements/textfield';
import {Textareafield} from './resources/elements/textareafield';

const fieldTypes = {
  text: Textfield,
  textarea: Textareafield,
  object: Objectfield
};

export class App {
  formSchema = {};

  parseJSON(obj) {
    const data = [];
    for (const [key, field] of Object.entries(obj)) {
      switch (field.type) {
      case 'object':
        field.children = this.parseJSON(field.children);
        data.push(new Objectfield(key, field));
        break;
      default:
        data.push(new fieldTypes[field.type](key, field));
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
            type: 'text'
          }
        }
      }
    });
  }

  attached() {
    componentHandler.upgradeElement(document.getElementById('container'));
  }
}
