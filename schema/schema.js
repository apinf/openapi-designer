
const schemaImport = {
  $ref: {
    title: 'Reference (key of another definition)',
    type: 'string',
  },
  hardReference: {
    title: 'Hard reference',
    type: 'boolean',
    options: {
      infoText: 'Whether or not to hard copy the data of the reference to this object in post-processing rather than simply adding a $ref field.',
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
    type: {
      title: 'Type',
      type: 'string',
      enum: ['null', 'boolean', 'object', 'array', 'integer', 'number', 'string'],
      default: 'null',
    },
    format: {
      title: 'Format',
      type: 'string',
      options: { dependencies: { type: ['integer', 'number', 'string'] } },
    },

    title: {
      title: 'Title',
      type: 'string',
    },
    description: {
      title: 'Description',
      type: 'string',
    },
    default: {
      title: 'Default value',
    },

    minimum: {
      title: 'Inclusive minimum',
      type: 'integer',
      options: { dependencies: { type: ['number', 'integer'] } },
    },
    maximum: {
      title: 'Inclusive maximum',
      type: 'integer',
      options: { dependencies: { type: ['number', 'integer'] } },
    },
    exclusiveMinimum: {
      title: 'Exclusive minimum',
      type: 'integer',
      options: { dependencies: { type: ['number', 'integer'] } },
    },
    exclusiveMaximum: {
      title: 'Exclusive maximum',
      type: 'integer',
      options: { dependencies: { type: ['number', 'integer'] } },
    },

    minLength: {
      title: 'Minimum length',
      type: 'integer',
      options: { dependencies: { type: 'string' } },
    },
    maxLength: {
      title: 'Maximum length',
      type: 'integer',
      options: { dependencies: { type: 'string' } },
    },
    pattern: {
      title: 'Pattern',
      type: 'string',
      options: { dependencies: { type: 'string' } },
    },
    enum: {
      title: 'Value choices',
      type: 'array',
      options: { dependencies: { type: 'string' } },
    },

    minItems: {
      title: 'Minimum number of items',
      type: 'integer',
      options: { dependencies: { type: 'array' } },
    },
    maxItems: {
      title: 'Maximum number of items',
      type: 'integer',
      options: { dependencies: { type: 'array' } },
    },
    uniqueItems: {
      title: 'Items must be unique?',
      type: 'boolean',
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
      options: { dependencies: { type: 'object' } },
    },
    maxProperties: {
      title: 'Maximum number of properties',
      type: 'integer',
      options: { dependencies: { type: 'object' } },
    },
    required: {
      title: 'Required subfields',
      type: 'array',
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
      options: { dependencies: { type: 'object' } },
    },
  },
};

const definitions = {
  title: 'Definitions',
  type: 'array',
  items: schema,
};

module.exports = { definitions, schemaImport, schema };
