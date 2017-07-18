export const externalDocs = {
  'type': 'object',
  'hideValueIfEmpty': true,
  'i18n': {
    'path': 'form.externalDocs'
  },
  'children': {
    'description': {
      'type': 'markdown',
      'hideValueIfEmpty': true
    },
    'url': {
      'type': 'text',
      'hideValueIfEmpty': false,
      'validation': ['requiredIfParent', 'url']
    }
  }
};
