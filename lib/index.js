#!/usr/bin/env node
// Require modules
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { program } = require('commander');
const { logger, commaSeparated } = require('./util');
const pkg = require('../package.json');
const cliData = require('../res/cli.json');
const isGitRepo = require('./is-git-repository');

// Make sure we are in a valid git repository
if (!isGitRepo()) {
    return process.exit(-1);
}

// Parse CLI args
global.program = program
    .name(pkg.name)
    .description(pkg.description)
    .version(pkg.version)
    .option('-p, --paths <paths>', cliData.option.paths, commaSeparated)
    .option('--no-title', cliData.option['no-title'])
    .option('--no-commit-amount', cliData.option['no-commit-amount'])
    .option('--with-master [branch]', cliData.option['with-master'])
    .option('--date-format <format>', cliData.option['date-format'], '{DD}.{MM}.{YYYY}')
    .option('-o, --output <file>', cliData.option.output, 'CHANGELOG.md')
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
        await fs.promises.writeFile(program.output, markdown);

        const amountCommits = resultList
            .map(el => el.commits.length)
            .reduce((next, curr) => curr + next);
        logger.success(`Successfully extracted a total of ${resultList.length} tags and ${amountCommits} commits.`);

    } catch (error) {
        logger.fail(error);
        process.exit(-1);
    }
})();