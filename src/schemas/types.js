export const typeFormatChoices = [
  {
    'key': 'int32',
    'label': '32-bit integer',
    'conditions': {
      '../type': 'integer'
    }
  },
  {
    'key': 'int64',
    'label': '64-bit integer',
    'conditions': {
      '../type': 'integer'
    }
  },
  {
    'key': 'float',
    'label': '32-bit floating point',
    'conditions': {
      '../type': 'number'
    }
  },
  {
    'key': 'double',
    'label': '64-bit floating point',
    'conditions': {
      '../type': 'number'
    }
  },
  {
    'key': '',
    'label': 'String',
    'conditions': {
      '../type': 'string'
    }
  },
  {
    'key': 'byte',
    'label': 'Byte (Base64)',
    'conditions': {
      '../type': 'string'
    }
  },
  {
    'key': 'binary',
    'label': 'Binary (octet sequence)',
    'conditions': {
      '../type': 'string'
    }
  },
  {
    'key': 'date',
    'label': 'Date',
    'conditions': {
      '../type': 'string'
    }
  },
  {
    'key': 'date-time',
    'label': 'Date and Time',
    'conditions': {
      '../type': 'string'
    }
  },
  {
    'key': 'password',
    'label': 'Password',
    'conditions': {
      '../type': 'string'
    }
  }
];

export const types = {
  'type': 'array',
  'format': 'map',
  'keyField': 'name',
  'showValueInParent': false,
  'addIndexToChildLabel': false,
  'collapseManagement': true,
  'newItemText': 'New Type',
  'item': {
    'type': 'object',
    'label': 'Type #$index: ${#/name}',
    'legendChildren': {
      'type': {
        'type': 'option',
        'columns': '4',
        'placeholder': 'Type name',
        'format': 'dropdown',
        'choices': ['', 'string', 'integer', 'boolean', 'number', 'array', 'object', 'reference', 'null']
      },
      'name': {
        'type': 'text',
        'columns': '4',
        'label': 'Enter key...'
      }
    },
    'children': {
      '$ref': {
        'type': 'option',
        'format': 'dropdown',
        'label': 'Target',
        'hideIfNoChoices': false,
        'dataSources': [{
          'source': '/global-definitions/types',
          'key': '#/definitions/${#/name}',
          'label': 'Type ${#/name}'
        }],
        'conditions': {
          '../type': 'reference'
        }
      },
      'title': {
        'type': 'text',
        'conditions': {
          '../type': ['string', 'integer', 'number', 'array', 'object', 'null']
        }
      },
      'description': {
        'type': 'textarea',
        'conditions': {
          '../type': ['string', 'integer', 'number', 'array', 'object', 'null']
        }
      },
      'format': {
        'type': 'option',
        'format': 'dropdown',
        'choices': typeFormatChoices
      },
      'items': {
        'type': 'lazylink',
        'target': '/global-definitions/types/:item',
        'overrides': {
          'labelFormat': 'Array item',
          'legendChildren/name': null,
          'legendChildren/type/columns': 8
        },
        'conditions': {
          '../type': 'array'
        }
      },
      'properties': {
        'type': 'lazylink',
        'target': '/global-definitions/types',
        'overrides': {
          'labelFormat': 'Properties',
          '#/:item;labelFormat': 'Property #$index: ${#/name}'
        },
        'conditions': {
          '../type': 'object'
        }
      },
      'required': {
        'label': 'Required subfields',
        'type': 'array',
        'item': {
          'type': 'option',
          'format': 'dropdown',
          'dataSources': [{
            'source': '../../properties/:child',
            'key': '${#/name}',
            'label': 'Field ${#/name}'
          }],
          'label': 'Required subfield'
        },
        'conditions': {
          '../type': 'object'
        }
      }
    }
  }
};
