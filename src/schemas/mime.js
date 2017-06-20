const mimeTypeArray = {
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
    // Stringify+parse the object to remove pointers/references.
    'consumes': JSON.parse(JSON.stringify(mimeTypeArray)),
    'produces': JSON.parse(JSON.stringify(mimeTypeArray))
  }
};
