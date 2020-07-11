// Require modules
const tinydate = require('tinydate');
const { listAllTags } = require('../commands');

/**
 * Retrieves and parses a list of tags for the current git repository.
 * 
 * Returned list objects have the following signature:
 * 
 * ```js
 * {
 *     name: String // Tag name
 *     date: String // Creation date
 * }
 * ```
 * 
 * @returns {Promise<Array<string>>} A promise that resolves with an array of tag objects.
 */
module.exports = async () => {
    const list = await listAllTags();
    const mapped = list.map(line => {
        const parts = line.split(';');
        return {
            name: parts[0].split('/')[2],                           // tag name
            date: tinydate(program.dateFormat)(new Date(parts[1])), // formatted creation date
        };
    });

    // Include master revisions
    if (program.withMaster) {
        const branch = typeof program.withMaster == 'string' ? program.withMaster : 'master';
        mapped.unshift({
            name: branch,
            date: 'latest'
        });
    }

    return mapped;
}