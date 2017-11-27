'use strict';

const AssertViewError = require('./assert-view-error');

module.exports = class ImageDiffError extends AssertViewError {
    constructor(stateName, refImagePath, currentImagePath, diffImagePath) {
        super(stateName, currentImagePath);

        this.name = 'ImageDiffError';
        this.message = `images are different for "${stateName}" state.`;
        this.refImagePath = refImagePath;
        this.diffImagePath = diffImagePath;
    }
};
