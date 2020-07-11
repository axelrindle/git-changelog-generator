// Require modules
const { program } = require('commander');

/**
 * Generates markdown markup based on a previously generated result list.
 * 
 * @param {Array} resultList A list of tags with associated commits.
 */
module.exports = resultList => {
    let markdown = '';

    // Title
    if (program.title) {
        markdown += '# Changelog\n';
    }

    // Append tags and their commits
    resultList.forEach(entry => {
        markdown += `\n## ${entry.tag.name} \`(${entry.tag.date})\`\n`;

        if (program.commitAmount) {
            markdown += `Total changes in this version: ${entry.commits.length}\n\n`;
        } else {
            markdown += '\n';
        }

        // Each commit message is a dedicated list entry
        entry.commits.forEach(commit => {
            markdown += `- ${commit.message}\n`;
        });

        markdown += '\n';
    });

    return markdown;
};