
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

};

module.exports = { security, securityDefinitions };
