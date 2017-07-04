import {schemes} from './schemes';
import {externalDocs} from './externalDocs';

export const header = {
  'type': 'object',
  'showValueInParent': false,
  'isCollapsible': false,
  'children': {
    'info': {
      'type': 'object',
      'children': {
        'title': {
          'type': 'text',
          'columns': 5,
          'validation': ['required']
        },
        'version': {
          'type': 'text',
          'columns': 3,
          'validation': ['required']
        },
        'description': {
          'type': 'textarea',
          'hideValueIfEmpty': true
        },
        'termsOfService': {
          'type': 'text',
          'label': 'Terms of Service',
          'hideValueIfEmpty': true,
          'validation': ['url']
        },
        'contact': {
          'type': 'object',
          'hideValueIfEmpty': true,
          'children': {
            'name': {
              'type': 'text',
              'hideValueIfEmpty': true
            },
            'email': {
              'type': 'text',
              'hideValueIfEmpty': true,
              'validation': ['email']
            },
            'url': {
              'type': 'text',
              'label': 'URL',
              'hideValueIfEmpty': true,
              'validation': ['url']
            }
          }
        },
        'license': {
          'type': 'object',
          'hideValueIfEmpty': true,
          'children': {
            'name': {
              'type': 'text',
              'hideValueIfEmpty': true,
              'validation': ['requiredIfParent']
            },
            'url': {
              'type': 'text',
              'hideValueIfEmpty': true,
              'validation': ['url']
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
          'type': 'text',
          'validation': ['hostname']
        },
        'basePath': {
          'type': 'text',
          'label': 'Base path',
          'validation': ['path']
        },
        'schemes': schemes
      }
    },
    'externalDocs': externalDocs
  }
};
