const schemes = {
  title: 'Schemes',
  type: 'array',
  items: {
    title: 'Scheme',
    type: 'string',
    enum: ['http', 'https', 'ws', 'wss'],
  },
};

const consumes = {
  title: 'Consumes',
  type: 'array',
  items: {
    title: 'MIME type',
    type: 'string',
  },
};

const produces = {
  title: 'Produces',
  type: 'array',
  items: {
    title: 'MIME type',
    type: 'string',
  },
};

module.exports = { schemes, consumes, produces };
