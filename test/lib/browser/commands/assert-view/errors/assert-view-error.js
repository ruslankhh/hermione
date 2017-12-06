'use strict';

const AssertViewError = require('lib/browser/commands/assert-view/errors/assert-view-error');

describe('AssertViewError', () => {
    it('should be instance of Error', () => {
        const err = new AssertViewError();

        assert.instanceOf(err, Error);
    });
});
