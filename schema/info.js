
const contact = {
  title: 'Contact',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Name',
    },
    url: {
      type: 'string',
      format: 'url',
      title: 'URL',
    },
    email: {
      type: 'string',
      format: 'email',
      title: 'Email',
    },
  },
};

const license = {
  title: 'License',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Name *',
      required: true,
    },
    url: {
      type: 'string',
      format: 'url',
      title: 'URL',
    },
  },
};

const info = {
  type: 'object',
  title: 'Info',
  properties: {
    title: {
      type: 'string',
      title: 'Title *',
      required: true,
    },
    version: {
      description: 'The version of the API (not Swagger)',
      type: 'string',
      title: 'Version *',
      required: true,
    },
    termsOfService: {
      type: 'string',
      title: 'Terms of Service',
    },
    contact,
    license,
    host: {
      description: 'The hostname the API is available at. Do not include protocol or base path.',
      type: 'string',
      title: 'Host',
    },
    basePath: {
      type: 'string',
      title: 'Base path',
    },
  },
};

module.exports = { info, contact, license };
