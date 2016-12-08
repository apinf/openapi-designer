/* global validator */
const SRL = require('srl');

/**
 * Regexes for validating fields that can't be validated using Alpaca built-in
 * validators.
 */
const validatorPatterns = {
  mimeType: new SRL(`
    begin with capture (
        any of (digit, letter) once,
        any of (digit, letter, one of "!#$&-^_.+") between 0 and 126 times
    )
    literally "/"
    capture (
        any of (digit, letter) once,
        any of (digit, letter, one of "!#$&-^_.+") between 0 and 126 times
    )
    must end, case insensitive
  `),
};

function validateString (format, value) {
  let portSplitter;
  switch (format) {
    case 'url':
      if (!validator.isURL(value)) {
        return 'Invalid URL';
      }
      break;
    case 'email':
      if (!validator.isEmail(value)) {
        return 'Invalid e-mail address';
      }
      break;
    case 'uuid':
      if (!validator.isUUID(value)) {
        return 'Invalid UUID';
      }
      break;
    case 'hostname':
      // The validator package doesn't do hostname (FQDN + optional port) validation
      // by default, so we split the port into a separate string if it exists.
      portSplitter = value.indexOf(':');
      if (portSplitter !== -1) {
        if (!validator.isFQDN(value.substr(0, portSplitter))) {
          return 'Invalid hostname';
        } else if (!validator.isInt(value.substr(portSplitter + 1), { min: 1, max: 65536 })) {
          return 'Invalid port in hostname';
        }
      } else if (!validator.isFQDN(value)) {
        return 'Invalid hostname';
      }
      break;
    case 'mime':
      if (!validatorPatterns.mimeType.isMatching(value)) {
        return 'Invalid MIME type';
      }
      break;
    default:
      return '';
  }
  return '';
}

/**
 * Alpaca validator functions to check fields using the regexes above.
 */
module.exports = {
  required (schema, value, path) {
    if (schema.required && value.length === 0) {
      return [{ path, message: 'This field is required' }];
    }
    return [];
  },

  type (schema, value, path) {
    if (schema.type === 'string') {
      /*
        Validate various strings formats.
       */
      const message = validateString(schema.format, value);
      if (message.length > 0) {
        return [{ path, message }];
      }
    } else if (schema.type === 'number') {
      // Validate non-integer numbers.
      if (!validator.isDecimal(value)) {
        return [{ path, message: 'Invalid number' }];
      }
    } else if (schema.type === 'integer') {
      // Validate integers.
      if (!validator.isNumeric(value)) {
        return [{ path, message: 'Invalid integer' }];
      }
    }
    return [];
  },
};
