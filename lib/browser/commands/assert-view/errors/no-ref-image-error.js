'use strict';

const AssertViewError = require('./assert-view-error');

module.exports = class NoRefImageError extends AssertViewError {
    constructor(stateName, imagePaths = {}) {
        super(stateName, imagePaths.currPath);

        this.name = 'NoRefImageError';
        this.message = `can not find reference image at ${imagePaths.refPath} for "${stateName}" state.`;
    }
};
