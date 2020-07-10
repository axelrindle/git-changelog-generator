// Require modules
const chalk = require('chalk');
const logSymbols = require('log-symbols');

/**
 * Defines some basic logging formatters.
 */
module.exports.logger = {
    info: msg => console.log(`  ${chalk.cyan('>')} ${msg}`),
    success: msg => console.log(`  ${chalk.cyan(logSymbols.success)} ${msg}`),
    fail: msg => {
        console.log(`  ${chalk.red(logSymbols.error)} An error occurred!`);
        console.error(msg);
        process.exit(-1);
    }
};

/**
 * commander.js transformer for splitting comma-separated strings into an array
 * 
 * @returns {Array} An array of values.
 */
module.exports.commaSeparated = (value, prev) => value.split(',');

/**
 * Splits a string at new lines and removes empty lines.
 * 
 * @param {string} str The string to process.
 * @returns {Array} An array with the lines.
 */
module.exports.splitLines = str => str.split('\n').filter(el => el.length > 0);