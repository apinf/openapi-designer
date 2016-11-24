const { externalDocs } = require('./externaldocs');

const tags = {
  title: 'Tags',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: {
        title: 'name',
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
