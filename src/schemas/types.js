export const types = {
  'type': 'array',
  'format': 'map',
  'keyField': 'name',
  'item': {
    'type': 'object',
    'label': 'Type',
    'legendChildren': {
      'type': {
        'type': 'option',
        'columns': '4',
        'placeholder': 'Type name',
        'format': 'dropdown',
        'choices': ['string', 'integer', 'number', 'array', 'object', 'null']
      },
      'name': {
        'type': 'text',
        'columns': '4'
      }
    },
    'children': {
      'title': {
        'type': 'text'
      },
      'description': {
        'type': 'textarea'
      },
      'format': {
        'type': 'option',
        'format': 'dropdown',
        'choices': [
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
          }
        ]
      },
      'item': {
        'type': 'lazylink',
        'target': '/types/:item',
        'overrides': {
          '#/labelFormat': 'Array item'
        },
        'conditions': {
          '../type': 'array'
        }
      },
      'properties': {
        'type': 'lazylink',
        'target': '/types',
        'overrides': {
          '#/labelFormat': 'Properties',
          '#/:item/labelFormat': 'Property'
        },
        'conditions': {
          '../type': 'object'
        }
      }
    }
  }
};
