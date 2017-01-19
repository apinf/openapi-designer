const { externalDocs } = require('./externaldocs');

const schemaImport = {
  $ref: {
    title: 'Reference (key of another definition)',
    type: 'string',
  },
  hardReference: {
    title: 'Hard reference',
    type: 'boolean',
    options: {
      infoText: 'If yes, the reference data will be copied here instead of making a JSON $ref field',
    },
  },
};

const schema = {
  title: 'Schema-based object',
  type: 'object',
  properties: {
    key: {
      title: 'Key *',
      type: 'string',
      required: true,
    },
    hardReferenceOnly: {
      title: 'Only hard references',
      type: 'boolean',
      options: {
        infoText: 'If yes, all references to this field will become hard references',
      },
    },
    type: {
      title: 'Type',
      type: 'string',
      enum: ['null', 'boolean', 'object', 'array', 'integer', 'number', 'string'],
      default: 'null',
    },
    format: {
      title: 'Format',
      type: 'string',
      default: '',
      options: { dependencies: { type: ['integer', 'number', 'string'] } },
    },

    title: {
      title: 'Title',
      type: 'string',
      default: '',
    },
    description: {
      title: 'Description',
      type: 'string',
      default: '',
    },
    default: {
      title: 'Default value',
      default: null,
    },

    minimum: {
      title: 'Minimum',
      type: 'integer',
      options: { dependencies: { type: ['number', 'integer'] } },
    },
    maximum: {
      title: 'Maximum',
      type: 'integer',
      options: { dependencies: { type: ['number', 'integer'] } },
    },
    exclusiveMinimum: {
      title: 'Exclusive minimum',
      type: 'boolean',
      default: false,
      options: { dependencies: { type: ['number', 'integer'] } },
    },
    exclusiveMaximum: {
      title: 'Exclusive maximum',
      type: 'boolean',
      default: false,
      options: { dependencies: { type: ['number', 'integer'] } },
    },

    minLength: {
      title: 'Minimum length',
      type: 'integer',
      default: -1,
      options: { dependencies: { type: 'string' } },
    },
    maxLength: {
      title: 'Maximum length',
      type: 'integer',
      default: -1,
      options: { dependencies: { type: 'string' } },
    },
    pattern: {
      title: 'Pattern',
      type: 'string',
      default: '',
      options: { dependencies: { type: 'string' } },
    },
    enum: {
      title: 'Value choices',
      type: 'array',
      default: [],
      options: { dependencies: { type: 'string' } },
    },

    minItems: {
      title: 'Minimum number of items',
      type: 'integer',
      default: -1,
      options: { dependencies: { type: 'array' } },
    },
    maxItems: {
      title: 'Maximum number of items',
      type: 'integer',
      default: -1,
      options: { dependencies: { type: 'array' } },
    },
    uniqueItems: {
      title: 'Items must be unique?',
      type: 'boolean',
      default: false,
      options: { dependencies: { type: 'array' } },
    },
    items: {
      title: 'Item object',
      type: 'object',
      properties: schemaImport,
      options: { dependencies: { type: 'array' } },
    },

    minProperties: {
      title: 'Minimum number of properties',
      type: 'integer',
      default: -1,
      options: { dependencies: { type: 'object' } },
    },
    maxProperties: {
      title: 'Maximum number of properties',
      type: 'integer',
      default: -1,
      options: { dependencies: { type: 'object' } },
    },
    required: {
      title: 'Required subfields',
      type: 'array',
      default: [],
      options: { dependencies: { type: 'object' } },
    },
    readOnly: {
      title: 'Read-only?',
      type: 'boolean',
      default: false,
      options: { dependencies: { type: 'object' } },
    },
    properties: {
      title: 'Properties',
      type: 'array',
      items: {
        title: 'Property',
        type: 'object',
        properties: {
          key: {
            title: 'Property key',
            type: 'string',
          },
          $ref: {
            title: 'Reference (key of another definition)',
            type: 'string',
          },
          hardReference: {
            title: 'Hard reference',
            options: {
              infoText: 'Whether or not to hard copy the data of the reference to this object in post-processing rather than simply adding a $ref field.',
            },
            type: 'boolean',
          },
        },
      },
      options: { dependencies: { type: 'object' } },
    },
    patternProperties: {
      title: 'Patterned properties',
      type: 'array',
      items: {
        title: 'Patterned property',
        type: 'object',
        properties: {
          key: {
            type: 'string',
            title: 'Key pattern',
          },
          $ref: {
            title: 'Reference (key of another definition)',
            type: 'string',
          },
          hardReference: {
            title: 'Hard reference',
            options: {
              infoText: 'Not yet implemented! Whether or not to hard copy the data of the reference to this object in post-processing rather than simply adding a $ref field.',
            },
            type: 'boolean',
          },
        },
      },
      options: { dependencies: { type: 'object' } },
    },
    additionalProperties: {
      title: 'Allow additional properties?',
      type: 'boolean',
      default: false,
      options: { dependencies: { type: 'object' } },
    },

    externalDocs,
    example: {
      title: 'Example',
      options: {
        disable_properties: false,
        disable_edit_json: false,
      },
      default: null,
    },
  },
};

const definitions = {
  title: 'Definitions',
  type: 'array',
  items: schema,
};

module.exports = { definitions, schemaImport, schema };
