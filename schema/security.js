
const security = {
  title: 'Security',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      _key: {
        title: 'Name',
        type: 'string',
        required: true,
      },
      value: {
        title: 'Scope names',
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
  },
};

const securityDefinitions = {

};

module.exports = { security, securityDefinitions };
