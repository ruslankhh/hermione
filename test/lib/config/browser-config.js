'use strict';

const BrowserConfig = require('../../../lib/config/browser-config');

describe('BrowserConfig', () => {
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        sandbox.stub(process, 'cwd').returns('/def/path');
    });

    afterEach(() => sandbox.restore());

    describe('constructor', () => {
        it('should be extended with browser id', () => {
            const config = new BrowserConfig('bro');

            assert.equal(config.id, 'bro');
        });

        it('should be extended with system options', () => {
            const config = new BrowserConfig('bro', {}, {foo: 'bar'});

            assert.deepEqual(config.system, {foo: 'bar'});
        });
    });

    describe('getScreenshotPath', () => {
        const test = {hashedFullTitle: () => '12345'};

        it('should return full screenshot path for current test state', () => {
            const config = new BrowserConfig('bro', {screenshotsDir: 'scrs'});
            const res = config.getScreenshotPath(test, 'plain');

            assert.equal(res, '/def/path/scrs/12345/bro/plain.png');
        });

        it('should override screenshot path with result of "screenshotsDir" execution if it is function', () => {
            const config = new BrowserConfig('bro', {screenshotsDir: () => 'foo'});
            const res = config.getScreenshotPath(test, 'plain');

            assert.equal(res, '/def/path/foo/plain.png');
        });
    });
});
