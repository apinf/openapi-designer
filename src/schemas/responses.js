export const response = {
  'type': 'selectable',
  'label': 'Response #$index for HTTP ${#:key}',
  'keyKey': 'status',
  'keyPlaceholder': 'Enter HTTP status code...',
  'types': {
    'response': {
      'label': '',
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
            'labelFormat': 'Response body',
            'legendChildren/name': null,
            'legendChildren/type/columns': 8
          }
        }
      }
    },
    'reference': {
      'label': '',
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

export const responses = {
  'type': 'array',
  'format': 'map',
  'collapseManagement': true,
  'addIndexToChildLabel': false,
  'keyField': 'responseName',
  'newItemText': 'New Response',
  'item': namedResponse
};
