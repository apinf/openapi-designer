const externalDocs = {
  title: 'External Documentation',
  type: 'object',
  required: false,
  properties: {
    url: {
      title: 'URL',
      type: 'string',
      format: 'url',
      required: true,
    },
    description: {
      title: 'Description',
      type: 'string',
    },
  },
};

module.exports = { externalDocs };
