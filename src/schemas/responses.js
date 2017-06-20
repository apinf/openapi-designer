export const response = {
  'type': 'object',
  'label': 'Response #$index for HTTP ${#/httpStatus}',
  'legendChildren': {
    'x-oad-type': {
      'type': 'option',
      'choices': ['response', 'reference']
    }
  },
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
      }],
      'conditions': {
        '../type': 'reference'
      }
    },
    'httpStatus': {
      'type': 'text',
      'label': 'HTTP status code',
      'keyPlaceholder': 'Enter HTTP status code...',
      'infoText': 'Set to `default` to handle all other statuses',
      'conditions': {
        '../type': 'response'
      }
    },
    'description': {
      'type': 'textarea',
      'conditions': {
        '../type': 'response'
      }
    },
    'schema': {
      'type': 'lazylink',
      'target': '/global-definitions/types/:item',
      'hideValueIfEmpty': true,
      'overrides': {
        'labelFormat': 'Response schema',
        'legendChildren/name': null,
        'legendChildren/type/columns': 8
      },
      'conditions': {
        '../type': 'response'
      }
    }
  }
};

const namedResponse = JSON.parse(JSON.stringify(response));
namedResponse.legendChildren['x-oad-type'].columns = 4;
namedResponse.legendChildren.responseName = {
  'type': 'text',
  'placeholder': 'Enter name...',
  'columns': 4
};


export const responses = {
  'type': 'array',
  'format': 'map',
  'collapseManagement': true,
  'addIndexToChildLabel': false,
  'keyField': 'responseName',
  'newItemText': 'New Response',
  'item': namedResponse
};
