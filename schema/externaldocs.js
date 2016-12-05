
const externalDocs = {
  description: 'Additional external documentation.',
  title: 'External Documentation',
  type: 'object',
  required: false,
  properties: {
    url: {
      description: ' The URL for the target documentation. Value MUST be in ' +
      'the format of a URL.',
      title: 'URL',
      type: 'string',
      format: 'url',
      required: true,
    },
    description: {
      description: 'A short description of the target documentation. GFM ' +
      'syntax can be used for rich text representation.',
      title: 'Description',
      type: 'string',
    },
  },
};

module.exports = { externalDocs };
