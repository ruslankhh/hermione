'use strict';

const fs = require('fs');
const webdriverio = require('webdriverio');
const temp = require('temp');
const Image = require('lib/browser/commands/assert-view/image');
const NoRefImageError = require('lib/browser/commands/assert-view/errors/no-ref-image-error');
const ImageDiffError = require('lib/browser/commands/assert-view/errors/image-diff-error');
const {mkBrowser_, makeSessionStub_} = require('../../utils');

describe('assertView command', () => {
    const sandbox = sinon.sandbox.create();
    const initBrowser = () => mkBrowser_().init();
    let session, imageStub;

    beforeEach(() => {
        session = makeSessionStub_(sandbox);
        session.screenshot = sandbox.stub().named('screenshot').resolves({value: 'base64hash'});
        session.executionContext = {};
        sandbox.stub(webdriverio, 'remote').returns(session);
        imageStub = {save: sandbox.stub().named('save')};
        sandbox.stub(Image, 'fromBase64').resolves(imageStub);
        sandbox.stub(Image, 'compare');
        sandbox.stub(Image.prototype, 'save').resolves();
        sandbox.stub(fs, 'existsSync');
        sandbox.stub(temp, 'path');
    });

    afterEach(() => sandbox.restore());

    describe('take screenshot', () => {
        beforeEach(() => {
            fs.existsSync.returns(true);
            Image.compare.resolves(true);
        });

        it('should take screenshot', () => {
            return initBrowser()
                .then(() => session.assertView('plain'))
                .then(() => assert.calledOnceWith(session.screenshot));
        });

        it('should convert captured screenshot from base64', () => {
            return initBrowser()
                .then(() => session.assertView('plain'))
                .then(() => assert.calledOnceWith(Image.fromBase64, 'base64hash'));
        });

        it('should save captured screenshot', () => {
            temp.path.returns('/curr/path');

            return initBrowser()
                .then(() => session.assertView('plain'))
                .then(() => assert.calledOnceWith(imageStub.save, '/curr/path'));
        });
    });

    it('should fail with "NoRefImageError" error if there are no reference image to compare with', () => {
        fs.existsSync.returns(false);

        return assert.isRejected(
            initBrowser().then(() => session.assertView('plain')),
            NoRefImageError
        );
    });

    describe('image compare', () => {
        const mkConfig = (opts = {}) => {
            return Object.assign({
                getScreenshotPath: () => '/some/path',
                system: {diffColor: '#ffffff'}
            }, opts);
        };

        beforeEach(() => {
            fs.existsSync.returns(true);
        });

        it('should compare current image with reference', () => {
            Image.compare.resolves(true);
            temp.path.returns('/curr/path');
            const config = mkConfig({
                getScreenshotPath: () => '/ref/path',
                tolerance: 100
            });

            return mkBrowser_(config)
                .init()
                .then(() => session.assertView('plain'))
                .then(() => {
                    assert.calledOnceWith(Image.compare, '/ref/path', '/curr/path', {tolerance: 100});
                });
        });

        describe('if images are not equal', () => {
            beforeEach(() => {
                Image.compare.resolves(false);
                sandbox.stub(Image, 'buildDiff');
            });

            it('should fail with "ImageDiffError" error', () => {
                const assertView = () => {
                    return mkBrowser_(mkConfig())
                        .init()
                        .then(() => session.assertView('plain'));
                };

                return assert.isRejected(assertView(), ImageDiffError);
            });

            it('should extend error with buildDiff function', () => {
                return mkBrowser_(mkConfig())
                    .init()
                    .then(() => session.assertView('plain'))
                    .catch((error) => {
                        assert.isFunction(error.saveDiffTo);
                    });
            });

            describe('function to build diff image', () => {
                const saveDiff = (diffPath = '/diff/path', config) => {
                    return mkBrowser_(config)
                        .init()
                        .then(() => session.assertView('plain'))
                        .catch((error) => error.saveDiffTo(diffPath));
                };

                it('should build diff with passed image paths', () => {
                    const config = mkConfig({getScreenshotPath: () => '/reference/path'});
                    temp.path.returns('/current/path');

                    return saveDiff('/diff/path', config)
                        .then(() => {
                            assert.calledWithMatch(Image.buildDiff, {
                                currPath: '/current/path',
                                diffPath: '/diff/path',
                                refPath: '/reference/path'
                            });
                        });
                });

                it('should pass to function compare options from browser', () => {
                    const config = {
                        tolerance: 100,
                        system: {diffColor: '#111111'}
                    };

                    return saveDiff('/diff/path', config)
                        .then(() => {
                            assert.calledWithMatch(Image.buildDiff, {tolerance: 100, diffColor: '#111111'});
                        });
                });
            });
        });
    });
});
