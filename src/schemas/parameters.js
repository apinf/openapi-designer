import {typeFormatChoices} from './types';

export const parameter = {
  'type': 'object',
  'label': 'Parameter #$index: ${#/paramName}',
  'children': {
    'name': {
      'type': 'text'
    },
    'in': {
      'type': 'option',
      'format': 'dropdown',
      'label': 'Location',
      'choices': [{
        'key': 'path',
        'label': 'Path'
      }, {
        'key': 'query',
        'label': 'Query'
      }, {
        'key': 'header',
        'label': 'Header'
      }, {
        'key': 'formData',
        'label': 'Form data'
      }, {
        'key': 'body',
        'label': 'Body'
      }]
    },
    'description': {
      'type': 'textarea'
    },
    'required': {
      'type': 'option',
      'format': 'checkbox'
    },
    'schema': {
      'type': 'lazylink',
      'target': '/global-definitions/types/:item',
      'overrides': {
        'labelFormat': 'Body schema',
        'legendChildren/name': null,
        'legendChildren/type/columns': 8
      },
      'conditions': {
        '../in': 'body'
      }
    },
    'type': {
      'type': 'option',
      'columns': '4',
      'placeholder': 'Type name',
      'format': 'dropdown',
      'choices': ['string', 'integer', 'number', 'boolean', 'array', 'file'],
      'conditions': {
        '../in': ['path', 'query', 'header', 'formData']
      }
    },
    'format': {
      'type': 'option',
      'format': 'dropdown',
      'choices': typeFormatChoices,
      'conditions': {
        '../in': ['path', 'query', 'header', 'formData']
      }
    },
    'allowEmptyValue': {
      'type': 'option',
      'format': 'checkbox',
      'label': 'Allow empty value?',
      'conditions': {
        '../in': ['path', 'query', 'header', 'formData']
      }
    },
    'items': {
      'type': 'array',
      'item': {
        'type': 'text',
        'label': 'Non-body parameter items not yet implemented'
      },
      'conditions': {
        '../in': ['path', 'query', 'header', 'formData'],
        '../type': 'array'
      }
    },
    'collectionFormat': {
      'type': 'option',
      'format': 'dropdown',
      'label': 'Collection format',
      'choices': [{
        'key': 'csv',
        'label': 'CSV (foo,bar)'
      }, {
        'key': 'ssv',
        'label': 'SSV (foo bar)'
      }, {
        'key': 'tsv',
        'label': 'TSV (foo\\tbar)'
      }, {
        'key': 'pipes',
        'label': 'Pipes (foo|bar)'
      }, {
        'key': 'multi',
        'label': 'Parameter separation (foo=bar&foo=baz)',
        'conditions': [
          '../in': ['query', 'formData']
        ]
      }]
    }
  }
};

export const namedParameter = JSON.parse(JSON.stringify(parameter));
namedParameter.legendChildren = {
  'paramName': {
    'type': 'text',
    'placeholder': 'Enter name...'
  }
};

export const parameters = {
  'type': 'array',
  'format': 'map',
  'collapseManagement': true,
  'addIndexToChildLabel': false,
  'keyField': 'paramName',
  'newItemText': 'New Parameter',
  'item': namedParameter
};
