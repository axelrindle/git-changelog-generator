/**
 * Defines hyperlink generation for github.
 * 
 * @param {string} repo The repository name in the format `<USER>/<REPO>`.
 */
module.exports.github = repo => ({
    tag(name) {
        return `https://github.com/${repo}/releases/tag/${name}`;
    },
    commit(sha) {
        return `https://github.com/${repo}/commit/${sha}`;
    }
});

/**
 * Defines hyperlink generation for gitlab.
 * 
 * @param {string} repo The repository name in the format `<USER>/<REPO>`.
 */
module.exports.gitlab = repo => ({
    tag(name) {
        return `https://gitlab.com/${repo}/-/releases/tag/${name}`;
    },
    commit(sha) {
        return `https://gitlab.com/${repo}/-/commit/${sha}`;
    }
});