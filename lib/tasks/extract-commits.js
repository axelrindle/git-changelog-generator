// Require modules
const asyncForEach = require('@axelrindle/async-for-each');
const { extractFirstCommit, extractGitLogs } = require('../commands');

/**
 * Finds all commits which exist between to tags. If the oldest tag is reached, the range is
 * set to be between the first commit and the oldest tag.
 * 
 * Returned list objects have the following signature:
 * 
 * ```js
 * {
 *     tag: {
 *         name: String // Tag name
 *         date: String // Creation date
 *     },
 *     commits: [
 *         {
 *             sha: String, // The commit sha
 *             message: String // The commit message
 *         }
 *     ]
 * }
 * ```
 * 
 * @param {Array} tags The extracted tag list.
 * @returns {Array} An array containing all commits associated with a tag. 
 */
module.exports = async (tags) => {
    let resultList = [];

    await asyncForEach(tags, async (tag, index) => {
        const prevTag = index < tags.length - 1 ? tags[index + 1].name : await extractFirstCommit();
    
        const extractedLogs = await extractGitLogs(prevTag, tag.name, program.paths);
        const commits = extractedLogs
            .map(line => ({
                sha: line.substring(0, 40),
                message: line.substring(41, line.length)
            }));
    
        // Only register when there are commits or ignoring empty tags
        if (commits.length > 0 || program.withEmptyTags) {
            resultList.push({
                tag: tags[index],
                commits
            });
        }
    });

    // Apply history limit. Useful to remove outdated versions
    if (program.limit) {
        let end = program.limit;
        if (end > resultList.length) {
            end = resultList.length;
        }
        resultList = resultList.slice(0, end);
    }

    return resultList;
};