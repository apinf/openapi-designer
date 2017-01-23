
const security = {
  description: 'A declaration of which security schemes are applied for the ' +
    'API as a whole. The list of values describes alternative security ' +
    'schemes that can be used (that is, there is a logical OR between the ' +
    'security requirements). Individual operations can override this definition.',
  title: 'Security',
  type: 'array',
  uniqueItems: true,
  items: {
    title: 'Security requirement',
    type: 'object',
    properties: {
      key: {
        title: 'Name *',
        type: 'string',
        required: true,
      },
      value: {
        title: 'Scope names',
        type: 'array',
        items: {
          title: 'Scope',
          type: 'string',
        },
      },
    },
  },
};

const securityDefinitions = {
  title: 'Security Definitions',
  type: 'array',
  format: 'tabs',
  items: {
    title: 'Security definition',
    headerTemplate: '{{ self.key }}',
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
        enum: ['basic', 'apiKey', 'oauth2'],
        required: true,
      },
      description: {
        title: 'Description',
        type: 'string',
      },
      name: {
        title: 'Name',
        type: 'string',
        required: true,
        options: { dependencies: { type: 'apiKey' } },
      },
      in: {
        title: 'Location of key',
        required: true,
        type: 'string',
        enum: ['query', 'header'],
        options: { dependencies: { type: 'apiKey' } },
      },
      flow: {
        title: 'Flow',
        type: 'string',
        required: true,
        enum: ['implicit', 'password', 'application', 'accessCode'],
        options: {
          infoText: 'The flow used by the OAuth2 security scheme.',
          dependencies: { type: 'oauth2' },
        },
      },
      authorizationUrl: {
        title: 'Authorization URL',
        type: 'string',
        required: true,
        format: 'url',
        options: {
          dependencies: {
            type: 'oauth2',
            flow: ['implicit', 'accessCode'],
          },
        },
      },
      tokenUrl: {
        title: 'Token URL',
        type: 'string',
        required: true,
        format: 'url',
        options: {
          dependencies: {
            type: 'oauth2',
            flow: ['password', 'application', 'accessCode'],
          },
        },
      },
      scopes: {
        title: 'Scopes',
        type: 'array',
        items: {
          type: 'object',
          title: 'Scope',
          properties: {
            name: {
              title: 'Scope name *',
              type: 'string',
              required: true,
            },
            description: {
              title: 'Description',
              type: 'string',
            },
          },
        },
        options: {
          map: true,
          mapKey: 'name',
          valueKey: 'description',
          dependencies: { type: 'oauth2' },
        },
      },
    },
  },
};

module.exports = { security, securityDefinitions };
