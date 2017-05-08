export const security = {
  'type': 'array',
  'format': 'map',
  'keyField': 'key',
  'item': {
    'label': 'Security definition',
    'type': 'selectable',
    'defaultType': 'basic',
    'keyKey': 'key',
    'types': {
      'basic': {
        'label': '',
        'type': 'object',
        'children': {
          'description': {
            'type': 'text'
          }
        }
      },
      'apiKey': {
        'label': '',
        'type': 'object',
        'children': {
          'description': {
            'type': 'text'
          },
          'name': {
            'type': 'text'
          },
          'in': {
            'label': 'API key location',
            'type': 'option',
            'format': 'dropdown',
            'choices': ['query', 'header']
          }
        }
      },
      'oauth2': {
        'label': '',
        'type': 'object',
        'children': {
          'description': {
            'type': 'text'
          },
          'flow': {
            'type': 'option',
            'format': 'dropdown',
            'choices': ['implicit', 'password', 'application', 'accessCode']
          },
          'authorizationUrl': {
            'label': 'Authorization URL',
            'type': 'text',
            'conditions': {
              '../flow': ['implicit', 'accessCode']
            }
          },
          'tokenUrl': {
            'label': 'Token URL',
            'type': 'text',
            'conditions': {
              '../flow': ['password', 'application', 'accessCode']
            }
          }/*,
          'scopes': {
            'type': 'array',
            'format': 'map',
            'keyField': 'key',
            'item': {
              'type': 'object',
              'keyField': 'key',
              'children': {
                'key': {
                  'type': 'text'
                },
                'value':
              }
            }
          }*/
        }
      }
    }
  }
};
