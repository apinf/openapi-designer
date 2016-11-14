exports.schemes = {
  title: 'Schemes',
  type: 'array',
  items: {
    title: 'Scheme',
    type: 'string',
    enum: ['http', 'https', 'ws', 'wss'],
  },
  minItems: 1,
};

exports.consumes = {
  title: 'Consumes',
  type: 'array',
  items: {
    title: 'MIME type',
    type: 'string',
  },
  minItems: 1,
};

exports.produces = {
  title: 'Produces',
  type: 'array',
  items: {
    title: 'MIME type',
    type: 'string',
  },
  minItems: 1,
};
