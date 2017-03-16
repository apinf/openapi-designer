export const mime = {
  'type': 'array',
  'label': 'Array Test',
  'item': {
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
};
