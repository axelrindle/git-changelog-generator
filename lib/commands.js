// Require modules
const child_process = require('child_process');
const { splitLines } = require('./util');

/**
 * Asynchronously executes a command.
 * 
 * @param {string} cmd The command to execute.
 * @returns {Promise<string>} A promise which resolves with the command output.
 */
const exec = cmd => new Promise((resolve, reject) => {
    child_process.exec(cmd, (err, stdout, stderr) => {
        if (err) reject (err);
        else resolve(splitLines(stdout));
    });
});

module.exports = {

    listAllTags: () => exec('git for-each-ref --sort=-creatordate --format \'%(refname);%(creatordate)\' refs/tags'),

    extractGitLogs(from, to, paths) {
        let command = `git log --pretty=oneline ${from}...${to}`;
        if (paths) command += ' -- ' + paths.join(' ');
        return exec(command);
    },

    extractFirstCommit: () => exec('git rev-list --max-parents=0 HEAD'),

    findTag: commit => exec(`git describe --tags --abbrev=0 --always ${commit}`)

};