export const mimeTypeArray = {
  'type': 'array',
  'item': {
    'type': 'text',
    'label': 'MIME type',
    'autocomplete': [
      'application/json',
      'application/xml',
      'application/x-www-form-urlencoded',
      'multipart/form-data',
      'text/plain; charset=utf-8',
      'text/html'
    ]
  }
};

export const mime = {
  'type': 'object',
  'showValueInParent': false,
  'children': {
    'consumes': mimeTypeArray,
    'produces': mimeTypeArray
  }
};
