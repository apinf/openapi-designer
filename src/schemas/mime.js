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

export const consumes = Object.assign({}, mimeTypeArray);
consumes.overrideI18nPath = 'form.mime.consumes';
export const produces = Object.assign({}, mimeTypeArray);
produces.overrideI18nPath = 'form.mime.produces';

export const mime = {
  'type': 'object',
  'showValueInParent': false,
  'isCollapsible': false,
  'children': {
    'consumes': consumes,
    'produces': produces
  }
};
