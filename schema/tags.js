const { externalDocs } = require('./externaldocs');

const tags = {
  description: 'A list of tags for API documentation control. Tags can be ' +
    'used for logical grouping of operations by resources or any other ' +
    'qualifier,',
  title: 'Tags',
  type: 'array',
  format: 'tabs',
  uniqueItems: true,
  items: {
    title: 'Tag',
    headerTemplate: '{{ self.name }}',
    type: 'object',
    properties: {
      name: {
        title: 'Name *',
        type: 'string',
        required: true,
      },
      description: {
        title: 'Description',
        type: 'string',
      },
      externalDocs,
    },
  },
};

module.exports = { tags };
