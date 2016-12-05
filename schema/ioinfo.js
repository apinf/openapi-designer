
const schemes = {
  description: 'The transfer protocol for the operation.' +
  ' Values MUST be from the list: "http", "https", "ws", "wss".' +
  ' The value overrides the Swagger Object schemes definition',
  title: 'Schemes',
  type: 'array',
  uniqueItems: true,
  items: {
    title: 'Scheme',
    type: 'string',
    enum: ['http', 'https', 'ws', 'wss'],
  },
};

const consumes = {
  description: 'A list of MIME types the operation can consume.' +
    ' This overrides the consumes definition at the Swagger Object.' +
    ' An empty value MAY be used to clear the global definition. ' +
    ' Value MUST be as described under Mime Types.',
  title: 'Consumes',
  type: 'array',
  uniqueItems: true,
  items: {
    title: 'MIME type',
    type: 'string',
  },
};

const produces = {
  description: 'A list of MIME types the operation can produce.' +
  ' This overrides the produces definition at the Swagger Object.' +
  ' An empty value MAY be used to clear the global definition.' +
  ' Value MUST be as described under Mime Types.',
  title: 'Produces',
  type: 'array',
  uniqueItems: true,
  items: {
    title: 'MIME type',
    type: 'string',
  },
};

module.exports = { schemes, consumes, produces };
