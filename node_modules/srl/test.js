'use strict'

const SRL = require('./')
const query = new SRL('capture (letter twice) as word whitespace');

console.log(query.getMatch('aa bb cc dd'))
