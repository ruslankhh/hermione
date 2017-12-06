'use strict';

const AssertViewError = require('lib/browser/commands/assert-view/errors/assert-view-error');
const ImageDiffError = require('lib/browser/commands/assert-view/errors/image-diff-error');

describe('ImageDiffError', () => {
    it('should be instance of "AssertViewError"', () => {
        assert.instanceOf(new ImageDiffError(), AssertViewError);
    });

    it('should contain in message state name', () => {
        const error = new ImageDiffError('plain');

        assert.match(error.message, /images are different for "plain" state/);
    });

    it('should contain reference image path', () => {
        const error = new ImageDiffError('plain', {refPath: '/some/path'});

        assert.equal(error.refImagePath, '/some/path');
    });

    it('should contain function for diff image generating', () => {
        const buildDiffFn = sinon.stub();
        const error = new ImageDiffError('plain', {}, buildDiffFn);

        error.saveDiffTo('/diff/path');

        assert.calledOnceWith(buildDiffFn, '/diff/path');
    });
});
