const validators = require('../validators');

const info = {
  fields: {
    host: { validator: validators.hostname },
    basePath: { validator: validators.basePath },
  },
};
const schemes = {
  toolbarSticky: true,
};
const consumes = {
  items: {
    validator: validators.mimeType,
  },
  toolbarSticky: true,
};
const produces = {
  items: {
    validator: validators.mimeType,
  },
  toolbarSticky: true,
};
const paths = {
  type: 'map',
  toolbarSticky: true,
  items: {
    methods: {
        // This isn't working, `methods` isn't a map in the JSON output
      type: 'map',
      toolbarSticky: true,
    },
  },
};
const security = {
  type: 'map',
  toolbarSticky: true,
  items: {
    value: {
      toolbarSticky: true,
    },
  },
};

module.exports = { info, schemes, consumes, produces, paths, security };
