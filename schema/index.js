const { paths } = require('./paths');
const { info } = require('./info');
const { tags } = require('./tags');
const { security, securityDefinitions } = require('./security');
const { schemes, consumes, produces } = require('./ioinfo');
const { externalDocs } = require('./externaldocs');

module.exports = {
  info,
  schemes,
  consumes,
  produces,
  paths,
  security,
  securityDefinitions,
  tags,
  externalDocs,
};
