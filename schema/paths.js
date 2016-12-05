const { schemes, consumes, produces } = require('./ioinfo');
const { externalDocs } = require('./externaldocs');

const parameters = {
  title: 'Parameters',
  type: 'array',
  uniqueItems: true,
  items: {
    title: 'Parameter',
    type: 'object',
    headerTemplate: '{{ self.name }}',
    properties: {
      name: {
        title: 'Name *',
        type: 'string',
        required: true,
      },
      in: {
        title: 'Parameter location *',
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
        title: 'Required *',
        type: 'boolean',
        required: true,
      },
    },
  },
};

const responses = {
  title: 'Responses',
  type: 'array',
  format: 'tabs',
  uniqueItems: 'true',
  items: {
    title: 'Response',
    type: 'object',
    headerTemplate: '{{ self.statusCode }}',
    properties: {
      statusCode: {
        title: 'HTTP Status *',
        type: 'string',
        required: true,
      },
      description: {
        title: 'Description *',
        type: 'string',
        required: true,
      },
    },
  },
};

const methods = {
  title: 'Methods',
  type: 'array',
  format: 'tabs',
  uniqueItems: true,
  items: {
    title: 'Method',
    type: 'object',
    headerTemplate: '{{ self.method }}',
    properties: {
      method: {
        title: 'Method',
        type: 'string',
        enum: ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'],
      },
      tags: {
        title: 'Tags',
        type: 'array',
        items: {
          title: 'Tag',
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
      responses,
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
  uniqueItems: true,
  items: {
    title: 'Path',
    type: 'object',
    headerTemplate: 'Path {{ self.path }}',
    properties: {
      path: {
        title: 'Path *',
        type: 'string',
        required: true,
      },
      methods,
      parameters,
    },
    minItems: 1,
  },
};

module.exports = { paths, methods, parameters };
