const { schemes, consumes, produces } = require('./ioinfo');
const { externalDocs } = require('./externaldocs');

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
      methodName: {
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
      externalDocs,
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

const paths = {
  title: 'Paths',
  type: 'array',
  required: true,
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
    minItems: 1,
  },
};

module.exports = { paths, methods, parameters };
