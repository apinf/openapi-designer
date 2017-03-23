export const header = {
  'type': 'object',
  'children': {
    'info': {
      'type': 'object',
      'children': {
        'title': {
          'type': 'text',
          'label': 'Title for ${../version}',
          'columns': 5
        },
        'version': {
          'type': 'text',
          'columns': 3
        },
        'description': {
          'type': 'textarea',
          'conditions': {
            '../version': ['0.1.0', '0.2.0']
          }
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
};
