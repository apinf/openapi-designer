export const tags = {
  'type': 'array',
  'item': {
    'type': 'object',
    'label': 'Tag',
    'children': {
      'name': {
        'type': 'text'
      },
      'description': {
        'type': 'textarea'
      },
      'externalDocs': {
        'type': 'object',
        'children': {
          'description': {
            'type': 'textarea'
          },
          'url': {
            'type': 'text'
          }
        }
      }
    }
  }
};
