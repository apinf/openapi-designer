const validators = require('../validators');

exports.fields = {
  info: {
    fields: {
      host: { validator: validators.hostname },
      basePath: { validator: validators.basePath },
    },
  },
  schemes: {
    toolbarSticky: true,
  },
  consumes: {
    items: {
      validator: validators.mimeType,
    },
    toolbarSticky: true,
  },
  produces: {
    items: {
      validator: validators.mimeType,
    },
    toolbarSticky: true,
  },
  paths: {
    type: 'map',
    toolbarSticky: true,
    items: {
      methods: {
        // This isn't working, `methods` isn't a map in the JSON output
        type: 'map',
        toolbarSticky: true,
      },
    },
  },
};
