'use strict';

const AssertViewError = require('lib/browser/commands/assert-view/errors/assert-view-error');
const NoRefImageError = require('lib/browser/commands/assert-view/errors/no-ref-image-error');

describe('NoRefImageError', () => {
    it('should be instance of "AssertViewError"', () => {
        const error = new NoRefImageError();

        assert.instanceOf(error, AssertViewError);
    });

    it('should contain in message info about state name and path to reference image', () => {
        const error = new NoRefImageError('plain', 'refPath');

        assert.match(error.message, /reference image at refPath for "plain" state./);
    });
});
