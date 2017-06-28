export const response = {
  'type': 'selectable',
  'label': 'Response #$index for HTTP ${#:key}',
  'keyKey': 'status',
  'keyPlaceholder': 'Enter HTTP status code...',
  'overrideI18nPath': 'form.response',
  'interpolations': {
    'httpStatus': '${#:key}'
  },
  'types': {
    'response': {
      'overrideI18nPath': 'form.response',
      'type': 'object',
      'children': {
        'description': {
          'type': 'textarea'
        },
        'schema': {
          'type': 'lazylink',
          'target': '/global-definitions/types/:item',
          'hideValueIfEmpty': true,
          'overrides': {
            'overrideI18nKeys': {
              'label': 'form.response.schema.label'
            },
            'legendChildren/name': null,
            'legendChildren/x-oad-type/columns': 8
          }
        }
      }
    },
    'reference': {
      'overrideI18nPath': 'form.response',
      'type': 'object',
      'children': {
        '$ref': {
          'type': 'option',
          'format': 'dropdown',
          'label': 'Target',
          'hideIfNoChoices': false,
          'dataSources': [{
            'source': '/global-definitions/responses',
            'key': '#/responses/${#:key}',
            'label': 'Response ${#:key}'
          }]
        }
      }
    }
  }
};

const namedResponse = JSON.parse(JSON.stringify(response));
namedResponse.keyKey = 'responseName';
namedResponse.keyPlaceholder = 'Enter name...';
namedResponse.interpolations = {
  'name': '${#:key}'
};
namedResponse.overrideI18nKeys = {
  'label': 'form.global-definitions.responses.item.label'
};

export const responses = {
  'type': 'array',
  'format': 'map',
  'collapseManagement': true,
  'isCollapsible': false,
  'addIndexToChildLabel': false,
  'keyField': 'responseName',
  'newItemText': 'New Response',
  'item': namedResponse
};
