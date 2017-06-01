export const paths = {
  'type': 'array',
  'format': 'map',
  'keyField': 'name',
  'addIndexToChildLabel': false,
  'collapseManagement': true,
  'item': {
    'type': 'object',
    'label': 'Path ${#/name}',
    'legendChildren': {
      'name': {
        'type': 'text',
        'label': 'Enter path...'
      }
    },
    'children': {
      'title': {
        'type': 'text',
        'conditions': {
          '../type': ['string', 'integer', 'number', 'array', 'object', 'null']
        }
      },
      'get': {
        'type': 'link',
        'target': '../methods/method(get)'
      },
      'put': {
        'type': 'link',
        'target': '../methods/method(put)'
      },
      'post': {
        'type': 'link',
        'target': '../methods/method(put)'
      },
      'delete': {
        'type': 'link',
        'target': '../methods/method(delete)'
      },
      'options': {
        'type': 'link',
        'target': '../methods/method(options)'
      },
      'head': {
        'type': 'link',
        'target': '../methods/method(head)'
      },
      'patch': {
        'type': 'link',
        'target': '../methods/method(patch)'
      },
      'methods': {
        'type': 'array',
        'format': 'map',
        'keyField': 'method',
        'addIndexToChildLabel': false,
        'collapseManagement': true,
        'showValueInParent': false,
        'item': {
          'label': '${#/method:getChoiceLabel()} handler',
          'type': 'object',
          'legendChildren': {
            'method': {
              'type': 'option',
              'format': 'dropdown',
              'choices': [
                {'key': 'get', 'label': 'GET'},
                {'key': 'put', 'label': 'PUT'},
                {'key': 'post', 'label': 'POST'},
                {'key': 'delete', 'label': 'DELETE'},
                {'key': 'options', 'label': 'OPTIONS'},
                {'key': 'head', 'label': 'HEAD'},
                {'key': 'patch', 'label': 'PATCH'}
              ]
            }
          },
          'children': {
            'operationId': {
              'label': 'Operation ID',
              'type': 'text'
            },
            'summary': {
              'type': 'text'
            },
            'description': {
              'type': 'textarea'
            },
            'tags': {
              'type': 'array',
              'item': {
                'type': 'text'
              }
            }
          }
        }
      }
    }
  }
};
