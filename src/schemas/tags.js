import {externalDocs} from './externalDocs';

export const tags = {
  'type': 'array',
  'isCollapsible': false,
  'item': {
    'type': 'object',
    'label': 'Tag',
    'i18n': {
      'interpolations': {
        'name': '${#/name}'
      }
    },
    'children': {
      'name': {
        'type': 'text',
        'validation': ['required']
      },
      'description': {
        'type': 'markdown'
      },
      'externalDocs': externalDocs
    }
  }
};
