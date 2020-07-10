#!/usr/bin/env node
// Require modules
const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const { program } = require('commander');
const { logger, commaSeparated } = require('./util');
const pkg = require('../package.json');

// Parse CLI args
global.program = program
    .name(pkg.name)
    .description(pkg.description)
    .version(pkg.version)
    .option('-p, --paths <paths>', 'limit the commit history to the given paths (comma separated)', commaSeparated)
    .option('--no-title', 'disables the insertion of a h1 title at the start of the markdown document')
    .option('--date-format <format>', 'specifies the date format used in the markdown document', '{DD}.{MM}.{YYYY}')
    .option('--output <file>', 'specifies the output file which the markdown will be written to', 'CHANGELOG.md')
    .parse(process.argv);

(async () => {

    try {
        
        logger.info('Parsing tags ...');
        const tags = await require('./tasks/parse-tags')();

        logger.info('Collecting commits ...');
        const resultList = await require('./tasks/extract-commits')(tags);

        logger.info('Generating markdown ...');
        const markdown = require('./tasks/generate-markdown')(resultList);

        logger.info('Writing to file ' + chalk.underline(path.resolve(program.output)) + ' ...');
        await fs.writeFile(program.output, markdown);

        const amountCommits = resultList
            .map(el => el.commits.length)
            .reduce((next, curr) => curr + next);
        logger.success(`Successfully extracted a total of ${tags.length} tags and ${amountCommits} commits.`);

    } catch (error) {
        logger.fail(error);
    }

})();