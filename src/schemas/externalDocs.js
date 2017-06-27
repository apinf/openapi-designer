export const externalDocs = {
  'type': 'object',
  'hideValueIfEmpty': true,
  'overrideI18nPath': 'form.externalDocs',
  'children': {
    'description': {
      'type': 'textarea',
      'hideValueIfEmpty': true
    },
    'url': {
      'type': 'text',
      'hideValueIfEmpty': false
    }
  }
};
