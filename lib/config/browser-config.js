'use strict';

const path = require('path');
const _ = require('lodash');

module.exports = class BrowserConfig {
    constructor(id, browserOptions, systemOptions) {
        this.id = id;
        _.extend(this, browserOptions);
        this.system = systemOptions;
    }

    getScreenshotPath(test, stateName) {
        const filename = `${stateName}.png`;
        const screenshotsDir = this.screenshotsDir;

        return _.isFunction(screenshotsDir)
            ? path.resolve(process.cwd(), screenshotsDir(test), filename)
            : path.resolve(process.cwd(), screenshotsDir, test.id(), this.id, filename);
    }
};
