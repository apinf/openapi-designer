const { paths } = require('./paths');
const { info } = require('./info');
const { schemes, consumes, produces } = require('./ioinfo');

exports.schema = {
  title: 'Open API designer',
  type: 'object',
  properties: {
    swagger: {
      type: 'string',
      title: 'Swagger Version',
      required: true,
      default: '2.0',
      enum: ['2.0'],
    },
    info,
    schemes,
    consumes,
    produces,
    paths,
  },
};
