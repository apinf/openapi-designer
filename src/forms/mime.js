import {parseJSON} from '../resources/jsonparser';

export class Header {
  schema = {
    'type': 'array',
    'label': 'Array Test',
    'format': 'map',
    'keyField': 'name',
    'item': {
      'type': 'object',
      'label': 'Contact object',
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
  field = undefined

  constructor() {
    this.field = parseJSON('mime', this.schema);
  }

  getViewStrategy() {
    return 'forms/form.html';
  }
}
