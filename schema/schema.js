
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

const schemaImportWithKey = {
  key: {
    title: 'Property key',
    type: 'string',
  },
  $ref: schemaImport.$ref,
  hardReference: schemaImport.hardReference,
};

const schema = {
  title: 'Schema-based object',
  headerTemplate: '{{ self.key }}',
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

    /* title: {
      title: 'Title',
      type: 'string',
      default: '',
    }, */
    description: {
      title: 'Description',
      type: 'string',
      default: '',
    },

    /* minimum: {
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
    }, */

    /* minLength: {
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
    }, */
    pattern: {
      title: 'Pattern',
      type: 'string',
      default: '',
      options: { dependencies: { type: 'string' } },
    },
    enum: {
      title: 'Value choices',
      type: 'array',
      items: {
        type: 'string',
        title: 'Value choice',
      },
      default: [],
      options: { dependencies: { type: 'string' } },
    },

    /* minItems: {
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
    }, */
    items: {
      title: 'Item object',
      type: 'object',
      properties: schemaImport,
      options: { dependencies: { type: 'array' } },
    },
    uniqueItems: {
      title: 'Items must be unique?',
      type: 'boolean',
      default: false,
      options: { dependencies: { type: 'array' } },
    },

    /* minProperties: {
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
    }, */
    properties: {
      title: 'Properties',
      type: 'array',
      format: 'tabs',
      items: {
        title: 'Property',
        type: 'object',
        headerTemplate: '{{ self.key }}',
        properties: schemaImportWithKey,
      },
      options: { dependencies: { type: 'object' } },
    },
    patternProperties: {
      title: 'Patterned properties',
      type: 'array',
      format: 'tabs',
      items: {
        title: 'Patterned property',
        type: 'object',
        headerTemplate: '{{ self.key }}',
        properties: schemaImportWithKey,
      },
      options: { dependencies: { type: 'object' } },
    },
    required: {
      title: 'Required subfields',
      type: 'array',
      items: {
        type: 'string',
        title: 'Field name',
      },
      default: [],
      options: { dependencies: { type: 'object' } },
    },
    readOnly: {
      title: 'Read-only?',
      type: 'boolean',
      default: false,
      options: { dependencies: { type: 'object' } },
    },
    additionalProperties: {
      title: 'Allow additional properties?',
      type: 'boolean',
      default: false,
      options: { dependencies: { type: 'object' } },
    },

    // externalDocs,
    default: {
      title: 'Default value',
      default: null,
    },
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
  format: 'tabs',
  items: schema,
};

module.exports = { definitions, schemaImport, schema };
