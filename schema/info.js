
const contact = {
  description: 'Contact information for the exposed API.',
  title: 'Contact',
  type: 'object',
  properties: {
    name: {
      description: 'The identifying name of the contact person/organization.',
      type: 'string',
      title: 'Name',
    },
    url: {
      description: 'The URL pointing to the contact information.',
      type: 'string',
      format: 'url',
      title: 'URL',
    },
    email: {
      description: 'The email address of the contact person/organization. ' +
      'MUST be in the format of an email address.',
      type: 'string',
      format: 'email',
      title: 'Email',
    },
  },
};

const license = {
  description: 'License information for the exposed API.',
  title: 'License',
  type: 'object',
  properties: {
    name: {
      description: 'The license name used for the API.',
      type: 'string',
      title: 'Name *',
      required: true,
    },
    url: {
      description: 'A URL to the license used for the API. MUST be in the ' +
      'format of a URL.',
      type: 'string',
      format: 'url',
      title: 'URL',
    },
  },
};

const info = {
  description: 'The object provides metadata about the API. The metadata ' +
  'can be used by the clients if needed, and can be presented in the ' +
  'Swagger-UI for convenience.',
  type: 'object',
  title: 'Info',
  properties: {
    title: {
      description: 'The title of the application.',
      type: 'string',
      title: 'Title *',
      required: true,
    },
    version: {
      description: 'Provides the version of the application API (not to be ' +
      'confused with the specification version).',
      type: 'string',
      title: 'Version *',
      required: true,
    },
    termsOfService: {
      description: 'The Terms of Service for the API.',
      type: 'string',
      title: 'Terms of Service',
    },
    contact,
    license,
    host: {
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
