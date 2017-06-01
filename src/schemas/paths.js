const methodDefinition = {
  'label': '${#:method} handler',
  'type': 'object',
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
};

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
      'methodDefinition': {
        'display': false,
        'collapsed': true,
        'type': 'object',
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
      },
      'get': {
        'type': 'lazylink',
        'target': '../methodDefinition',
        'overrides': {
          'labelFormat': 'GET handler',
          '_display': true
        }
      },
      'put': {
        'type': 'lazylink',
        'target': '../methodDefinition',
        'overrides': {
          'labelFormat': 'PUT handler',
          '_display': true
        }
      },
      'post': {
        'type': 'lazylink',
        'target': '../methodDefinition',
        'overrides': {
          'labelFormat': 'POST handler',
          '_display': true
        }
      },
      'delete': {
        'type': 'lazylink',
        'target': '../methodDefinition',
        'overrides': {
          'labelFormat': 'DELETE handler',
          '_display': true
        }
      },
      'options': {
        'type': 'lazylink',
        'target': '../methodDefinition',
        'overrides': {
          'labelFormat': 'OPTIONS handler',
          '_display': true
        }
      },
      'head': {
        'type': 'lazylink',
        'target': '../methodDefinition',
        'overrides': {
          'labelFormat': 'HEAD handler',
          '_display': true
        }
      },
      'patch': {
        'type': 'lazylink',
        'target': '../methodDefinition',
        'overrides': {
          'labelFormat': 'PATCH handler',
          '_display': true
        }
      }
    }
  }
};
