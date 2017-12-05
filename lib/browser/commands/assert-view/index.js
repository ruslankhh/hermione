'use strict';

const fs = require('fs');
const temp = require('temp');
const Image = require('./image');
const ImageDiffError = require('./errors/image-diff-error');
const NoRefImageError = require('./errors/no-ref-image-error');
const {getTestContext} = require('../../../utils');

temp.track();

module.exports = (browser) => {
    const session = browser.publicAPI;

    session.addCommand('assertView', (state) => {
        const test = getTestContext(session.executionContext);
        const refPath = browser.config.getScreenshotPath(test, state);
        const currPath = temp.path({suffix: '.png'});
        const {config} = browser;

        return session.screenshot()
            .then((screenData) => Image.fromBase64(screenData.value))
            .then((currImage) => currImage.save(currPath))
            .then(() => {
                if (!fs.existsSync(refPath)) {
                    throw new NoRefImageError(state, refPath, currPath);
                }
            })
            .then(() => Image.compare(refPath, currPath, {tolerance: config.tolerance}))
            .then((isEqual) => {
                if (isEqual) {
                    return;
                }

                const diffPath = temp.path({suffix: '.png'});
                const diffOpts = {
                    refPath, currPath, diffPath,
                    diffColor: browser.config.system.diffColor,
                    tolerance: config.tolerance
                };

                return Image.buildDiff(diffOpts)
                    .then(() => {
                        const imagePaths = {
                            refImagePath: refPath,
                            currentImagePath: currPath,
                            diffImagePath: diffPath
                        };
                        throw new ImageDiffError(state, imagePaths);
                    });
            });
    });
};
