/**
 * ! Add leading zeroes
 */

module.exports = (value) => value.toString().length < 2 ? `0${value}` : `${value}`;