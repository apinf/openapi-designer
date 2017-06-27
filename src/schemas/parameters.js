import {typeFormatChoices} from './types';

const parameterType = {
  'type': 'option',
  'columns': '4',
  'placeholder': 'Type name',
  'format': 'dropdown',
  'choices': ['string', 'integer', 'number', 'boolean', 'array']
};

const toplevelParameterType = JSON.parse(JSON.stringify(parameterType));
toplevelParameterType.conditions = {
  '../in': ['path', 'query', 'header', 'formData']
};
toplevelParameterType.choices.push({
  'key': 'file',
  'conditions': {
    '../in': 'formData'
  }
});

const parameterFormat = {
  'type': 'option',
  'format': 'dropdown',
  'choices': typeFormatChoices,
  'overrideI18nPath': 'form.types.item.format'
};

const toplevelParameterFormat = JSON.parse(JSON.stringify(parameterFormat));
toplevelParameterFormat.conditions = {
  '../in': ['path', 'query', 'header', 'formData']
};

const parameterCollectionFormat = {
  'type': 'option',
  'format': 'dropdown',
  'label': 'Collection format',
  'choices': ['csv', 'ssv', 'tsv', 'pipes'],
  'conditions': {
    '../type': 'array'
  }
};

const toplevelParameterCollectionFormat = JSON.parse(JSON.stringify(parameterCollectionFormat));
toplevelParameterCollectionFormat.conditions['../type'] = 'array';
toplevelParameterCollectionFormat.choices.push({
  'key': 'multi',
  'label': 'Parameter separation (foo=bar&foo=baz)',
  'conditions': [
    '../in': ['query', 'formData']
  ]
});

export const parameterItemDefinition = {
  'type': 'object',
  'overrideI18nPath': 'form.parameter.parameter',
  'overrideI18nKeys': {
    'label': 'form.parameter.parameter.items.label'
  },
  'children': {
    'type': parameterType,
    'format': parameterFormat,
    'collectionFormat': parameterCollectionFormat,
    'items': {
      'type': 'lazylink',
      'target': '/parameter-item-definition',
      'conditions': {
        '../type': 'array'
      }
    }
  }
};

const toplevelParameterItemDefinition = Object.assign({}, parameterItemDefinition);
toplevelParameterItemDefinition.conditions = {
  '../in': ['path', 'query', 'header', 'formData'],
  '../type': 'array'
};

export const parameter = {
  'type': 'selectable',
  'overrideI18nPath': 'form.parameter',
  'types': {
    'parameter': {
      'type': 'object',
      'label': '',
      'children': {
        'name': {
          'type': 'text'
        },
        'in': {
          'type': 'option',
          'format': 'dropdown',
          'label': 'Location',
          'choices': ['path', 'query', 'header', 'formData', 'body']
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
            'legendChildren/x-oad-type/columns': 8
          },
          'conditions': {
            '../in': 'body'
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
        'type': toplevelParameterType,
        'format': toplevelParameterFormat,
        'collectionFormat': toplevelParameterCollectionFormat,
        'items': toplevelParameterItemDefinition
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
            'source': '/global-definitions/parameters',
            'key': '#/parameters/${#:key}',
            'label': 'Parameter ${#:key}'
          }]
        }
      }
    }
  }
};

export const namedParameter = JSON.parse(JSON.stringify(parameter));
namedParameter.keyKey = 'paramName';
namedParameter.keyPlaceholder = 'Enter name...';
namedParameter.overrideI18nKeys = {
  'label': 'form.global-definitions.parameters.item.label'
};

export const parameters = {
  'type': 'array',
  'format': 'map',
  'collapseManagement': true,
  'isCollapsible': false,
  'addIndexToChildLabel': false,
  'keyField': 'paramName',
  'newItemText': 'New Parameter',
  'item': namedParameter
};
