import {parseJSON} from '../resources/jsonparser';

export class Header {
  schema = {
    'type': 'object',
    'children': {
      'info': {
        'type': 'object',
        'children': {
          'title': {
            'type': 'text',
            'columns': 5
          },
          'version': {
            'type': 'text',
            'columns': 3
          },
          'description': {
            'type': 'textarea'
          },
          'termsofservice': {
            'type': 'text',
            'label': 'Terms of Service'
          }
        }
      },
      'contact': {
        'type': 'object',
        'children': {
          'name': {
            'type': 'text'
          },
          'email': {
            'type': 'text'
          },
          'url': {
            'type': 'text',
            'label': 'URL'
          }
        }
      }
    }
  }
  field = undefined
  show = false

  constructor() {
    this.field = parseJSON('header', this.schema);
  }

  getValue() {
    return this.field.getValue();
  }

  getViewStrategy() {
    return 'forms/form.html';
  }
}
