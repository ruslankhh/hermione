'use strict';

const AssertViewError = require('./browser/commands/assert-view/errors/assert-view-error');
const ImageDiffError = require('./browser/commands/assert-view/errors/image-diff-error');
const NoRefImageError = require('./browser/commands/assert-view/errors/no-ref-image-error');
const MultipleError = require('./browser/commands/assert-view/errors/multiple-error');

module.exports = {
    AssertViewError,
    ImageDiffError,
    NoRefImageError,
    MultipleError
};
