'use strict';

const AssertViewError = require('./assert-view-error');

module.exports = class NoRefImageError extends AssertViewError {
    constructor(stateName, refImagePath, currentImagePath) {
        super(stateName, currentImagePath);

        this.name = 'NoRefImageError';
        this.message = `can not find reference image at ${refImagePath} for "${stateName}" state.`;
    }
};
