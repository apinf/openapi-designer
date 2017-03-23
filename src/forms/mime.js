import {parseJSON} from '../resources/jsonparser';

export class MIME {
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
  show = false

  constructor() {
    this.field = parseJSON('mime', this.schema);
  }

  getValue() {
    return this.field.getValue();
  }

  getViewStrategy() {
    return 'forms/form.html';
  }
}
