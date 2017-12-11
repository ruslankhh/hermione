'use strict';

const fs = require('fs');
const temp = require('temp');
const Image = require('./image');
const ImageDiffError = require('./errors/image-diff-error');
const NoRefImageError = require('./errors/no-ref-image-error');
const {mocha: {getTestContext}} = require('../../../utils');

temp.track();

module.exports = (browser) => {
    const {publicAPI: session, config} = browser;
    const {tolerance} = config;
    const {system: {diffColor}} = config;

    session.addCommand('assertView', (state) => {
        const test = getTestContext(session.executionContext);
        const refPath = config.getScreenshotPath(test, state);
        const currPath = temp.path({suffix: '.png'});

        return takeScreenshot(session, currPath)
            .then(() => {
                if (!fs.existsSync(refPath)) {
                    throw new NoRefImageError(state, {refPath, currPath});
                }
            })
            .then(() => Image.compare(refPath, currPath, {tolerance}))
            .then((isEqual) => {
                if (isEqual) {
                    return;
                }

                const diffOpts = {refPath, currPath, diffColor, tolerance};

                throw new ImageDiffError(state, {refPath, currPath}, buildDiffFn(diffOpts));
            });
    });
};

function takeScreenshot(session, imagePath) {
    return session.screenshot()
        .then((screenData) => Image.fromBase64(screenData.value))
        .then((currImage) => currImage.save(imagePath));
}

function buildDiffFn(opts) {
    return (diffPath) => {
        return Image.buildDiff({
            refPath: opts.refPath,
            currPath: opts.currPath,
            diffPath,
            diffColor: opts.diffColor,
            tolerance: opts.tolerance
        });
    };
}
