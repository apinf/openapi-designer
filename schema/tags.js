const { externalDocs } = require('./externaldocs');

const tags = {
  title: 'Tags',
  type: 'array',
  uniqueItems: true,
  items: {
    title: 'Tag',
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
