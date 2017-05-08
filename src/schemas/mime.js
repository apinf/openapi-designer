export const mime = {
  'type': 'object',
  'showValueInParent': false,
  'children': {
    'consumes': {
      'type': 'array',
      'item': {
        'type': 'text',
        'label': 'MIME type'
      }
    },
    'produces': {
      'type': 'array',
      'item': {
        'type': 'text',
        'label': 'MIME type'
      }
    }
  }
};
