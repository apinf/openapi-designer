const { schemes, consumes, produces } = require('./ioinfo');
const { externalDocs } = require('./externaldocs');
const { schema, schemaImport } = require('./schema');

// The parameter schema object for non-body parameters is very similar to the
// actual Schema object, so we just customize it a bit rather than copying all
// the code manually.
const parameterSchema = JSON.parse(JSON.stringify(schema));
parameterSchema.properties.type.enum = ['boolean', 'array', 'integer', 'number', 'string', 'file'];
parameterSchema.properties.default.type = ['boolean', 'array', 'integer', 'number', 'string'];
delete parameterSchema.properties.key;
delete parameterSchema.properties.hardReferenceOnly;
delete parameterSchema.properties.title;
delete parameterSchema.properties.description;
delete parameterSchema.properties.externalDocs;
delete parameterSchema.properties.example;
delete parameterSchema.headerTemplate;
parameterSchema.properties.collectionFormat = {
  title: 'Collection format',
  type: 'string',
  default: 'csv',
  enum: ['csv', 'ssv', 'tsv', 'pipes'],
  options: { dependencies: { type: 'array' } },
};
parameterSchema.title = 'Schema';
parameterSchema.options = { dependencies: {
  in: ['query', 'header', 'path', 'formData'],
} };


const parameters = {
  description: 'A list of parameters that are applicable for all the ' +
    'operations described under this path. These parameters can be ' +
    'overridden at the operation level, but cannot be removed there. The ' +
    'list MUST NOT include duplicated parameters. A unique parameter is ' +
    'defined by a combination of a name and location. The list can use the ' +
    'Reference Object to link to parameters that are defined at the Swagger ' +
    'Object\'s parameters. There can be one "body" parameter at most.',
  title: 'Parameters',
  type: 'array',
  format: 'tabs',
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

      schema: {
        title: 'Schema',
        type: 'object',
        properties: schemaImport,
        options: { dependencies: { in: 'body' } },
      },

      schemaNotBody: parameterSchema,
    },
  },
};

const header = JSON.parse(JSON.stringify(schema));
header.properties.type.enum = ['boolean', 'array', 'integer', 'number', 'string'];
header.properties.default.type = ['boolean', 'array', 'integer', 'number', 'string'];
delete header.properties.title;
delete header.properties.externalDocs;
delete header.properties.example;
header.properties.collectionFormat = {
  title: 'Collection format',
  type: 'string',
  default: 'csv',
  enum: ['csv', 'ssv', 'tsv', 'pipes'],
  options: { dependencies: { type: 'array' } },
};
header.title = 'Header';
header.properties.key.title = 'Header name';

const headers = {
  title: 'Headers',
  type: 'array',
  uniqueItems: 'true',
  items: header,
};

const responses = {
  description: 'The list of possible responses as they are returned from ' +
  'executing this operation.',
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
      schema: {
        title: 'Schema object',
        type: 'object',
        properties: schemaImport,
      },
      headers,
      examples: {
        title: 'Examples',
        type: 'array',
        items: {
          title: 'Example',
          type: 'object',
          properties: {
            mimeType: {
              title: 'MIME type',
              type: 'string',
              format: 'mime',
            },
            value: {
              title: 'Value',
              options: {
                disable_properties: false,
                disable_edit_json: false,
              },
            },
          },
        },
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
    description: 'Describes a single API operation on a path.',
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
  description: 'Holds the relative paths to the individual endpoints. ' +
  'The path is appended to the basePath in order to construct the full URL. ' +
  'The Paths may be empty, due to ACL constraints.',
  title: 'Paths',
  type: 'array',
  format: 'tabs',
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
