export const tags = {
  'type': 'object',
  'children': {
    'title': {
      'type': 'text'
    },
    'description': {
      'type': 'text'
    },
    'child': {
      'type': 'selectable',
      'defaultType': 'boolean',
      'valueKey': 'value',
      'types': {
        'string': {
          'type': 'text'
        },
        'boolean': {
          'type': 'option',
          'format': 'checkbox'
        },
        'object': {
          '$ref': '/tags/child'
        }
      }
    }
  }
};
