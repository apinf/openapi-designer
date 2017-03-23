export const security = {
  'type': 'object',
  'children': {
    'checkboxes': {
      'type': 'option',
      'format': 'checkbox',
      'choices': [
        'optiona',
        {
          'key': 'optionb',
          'label': 'Option B'
        },
        'OptionC'
      ]
    },
    'dropdown': {
      'type': 'option',
      'format': 'dropdown',
      'choices': [
        'The First Choice',
        {
          'key': 'choice2',
          'label': 'Another choice'
        }
      ]
    }
  }
};
