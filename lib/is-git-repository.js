// Require modules
const child_process = require('child_process');

/**
 * Tests whether the current working directory is a valid git repository.
 * 
 * @returns {boolean}
 */
module.exports = () => {
    try {
        child_process.execSync('git status');
        return true;
    } catch (error) {
        return false;
    }
};