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
  hostname: new SRL(`
    begin with capture (
      capture (
        any of (digit, letter, one of "-") once or more,
        literally "." once
      ) never or more,
      any of (digit, letter, one of "-") once or more
    ) once,
    capture (
      literally ":" once,
      digit once or more
    ) optional,
    must end, case insensitive
  `),
};

/**
 * Alpaca validator functions to check fields using the regexes above.
 */
module.exports = {
  mimeType (callback) {
    if (validatorPatterns.mimeType.isMatching(this.getValue())) {
      callback({ status: true });
    } else {
      callback({ status: false, message: 'Invalid MIME type e.g. application/vnd.github.v3.raw+json' });
    }
  },

  hostname (callback) {
    if (validatorPatterns.hostname.isMatching(this.getValue())) {
      callback({ status: true });
    } else {
      callback({ status: false, message: 'Invalid hostname e.g. host.example.com:80' });
    }
  },

  basePath () {
    if (!this.getValue().startsWith('/')) {
      this.setValue(`/${this.getValue()}`);
    }
  },
};
