// Home v2 copy — merged entry for all 6 languages
const A = require('./i18n-home-a'); // en, zh, ru
const B = require('./i18n-home-b'); // vi, th
const C = require('./i18n-home-c'); // id
const IH = Object.assign({}, A, B, C);
module.exports = { IH };
