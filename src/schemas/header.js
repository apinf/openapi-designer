import {schemes} from './schemes';
import {externalDocs} from './externalDocs';

export const header = {
  'type': 'object',
  'showValueInParent': false,
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
        },
        'license': {
          'type': 'object',
          'children': {
            'name': {
              'type': 'text'
            },
            'url': {
              'type': 'text'
            }
          }
        }
      }
    },
    'host': {
      'label': 'Host location',
      'type': 'object',
      'showValueInParent': false,
      'children': {
        'host': {
          'type': 'text'
        },
        'basePath': {
          'type': 'text',
          'label': 'Base path'
        },
        'schemes': schemes
      }
    },
    'externalDocs': externalDocs
  }
};
