
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
        title: 'Definition ID *',
        type: 'string',
        required: true,
      },
      choice: {
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
        title: 'Name *',
        type: 'string',
        required: true,
        options: {
          infoText: 'The name of the header or query parameter to be used',
        },
      },
      in: {
        title: 'Location of key *',
        required: true,
        type: 'string',
        enum: ['query', 'header'],
        options: {
          infoText: 'The location of the API key.',
        },
      },
      flow: {
        title: 'Flow *',
        type: 'string',
        required: true,
        enum: ['implicit', 'password', 'application', 'accessCode'],
        options: {
          infoText: 'The flow used by the OAuth2 security scheme.',
        },
      },
    },
  },
};

module.exports = { security, securityDefinitions };
