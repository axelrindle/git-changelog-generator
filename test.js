// Require modules
const test = require('ava');

const chalk = require('chalk');
const { stdout, stderr } = require("test-console");
const util = require('./lib/util');
const logSymbols = require('log-symbols');

const tmp = require('tmp');
const isGitRepo = require('./lib/is-git-repository');

test('logging info is correctly formatted', t => {
    const info = stdout.inspectSync(function() {
        util.logger.info('foo');
    });
    t.deepEqual(info, [ `  ${chalk.cyan('>')} foo\n` ]);
});

test('logging success is correctly formatted', t => {
    const success = stdout.inspectSync(function() {
        util.logger.success('bar');
    });
    t.deepEqual(success, [ `  ${chalk.green(logSymbols.success)} bar\n` ]);
});

test('logging error is correctly formatted', t => {
    const myStderr = stderr.inspect();
    const error = stdout.inspectSync(function() {
        util.logger.fail('lorem ipsum');
    });
    myStderr.restore();
    t.deepEqual(error, [ `  ${chalk.red(logSymbols.error)} An error occurred!\n` ]);
    t.true(myStderr.output.join('\n').indexOf('lorem ipsum') !== -1);
});

test('util#commaSeparated splits a list at all commas', t => {
    const myListAsAText = 'foo,bar,lorem ipsum, dolor,sit';
    t.deepEqual(util.commaSeparated(myListAsAText), [ 'foo', 'bar', 'lorem ipsum', ' dolor', 'sit' ]);
});

test('util#splitLines removes any newlines and empty lines', t => {
    const myText = 'foo\nbar\n';
    const splitted = util.splitLines(myText);
    t.deepEqual(splitted, [ 'foo', 'bar' ])
});

test.cb('isGitRepository fails in a non-git environment', t => {
    t.plan(1);
    
    const originalCwd = process.cwd();
    tmp.dir((err, path, cleanupCallback) => {
        if (err) throw err;
        
        process.chdir(path);
        t.false(isGitRepo());
        process.chdir(originalCwd);
        
        cleanupCallback();

        t.end();
    });
});

test('isGitRepository succeeds in a git environment', t => t.true(isGitRepo()));