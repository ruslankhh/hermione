'use strict';

const AssertViewError = require('./assert-view-error');

module.exports = class ImageDiffError extends AssertViewError {
    constructor(stateName, imagePaths = {}, buildDiffFn) {
        super(stateName, imagePaths.currPath);

        this.name = 'ImageDiffError';
        this.message = `images are different for "${stateName}" state.`;
        this.refImagePath = imagePaths.refPath;
        this.saveDiffTo = buildDiffFn;
    }
};
