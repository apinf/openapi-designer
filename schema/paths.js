const { schemes, consumes, produces } = require('./ioinfo');

const parameters = {
  title: 'Parameters',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: {
        title: 'Name',
        type: 'string',
        required: true,
      },
      in: {
        title: 'Parameter location',
        type: 'string',
        default: 'path',
        enum: ['query', 'header', 'path', 'formData', 'body'],
        required: true,
      },
      description: {
        title: 'Description',
        type: 'string',
      },
      required: {
        title: 'Required',
        type: 'boolean',
        required: true,
      },
    },
  },
};

const methods = {
  title: 'Methods',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      _key: {
        title: 'Method',
        type: 'string',
        enum: ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'],
      },
      tags: {
        title: 'Tags',
        type: 'array',
        items: {
          type: 'string',
        },
      },
      summary: {
        title: 'Summary',
        type: 'string',
        maxLength: 120,
      },
      description: {
        title: 'Description',
        type: 'string',
      },
      externalDocs: {
        title: 'External Documentation',
        type: 'object',
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
      },
      operationId: {
        title: 'Operation ID',
        type: 'string',
      },
      schemes,
      consumes,
      produces,
      parameters,
    },
  },
};

exports.paths = {
  title: 'Paths',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      _key: {
        title: 'Path',
        type: 'string',
      },
      methods,
      parameters,
    },
  },
};
