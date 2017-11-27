'use strict';

const Promise = require('bluebird');
const looksSame = require('looks-same');
const PngImg = require('png-img');

class Image {
    constructor(buffer) {
        this._img = new PngImg(buffer);
    }

    save(file) {
        return Promise.fromCallback((cb) => this._img.save(file, cb));
    }

    static fromBase64(base64) {
        return new Image(new Buffer(base64, 'base64'));
    }

    static compare(path1, path2, opts = {}) {
        return Promise.fromCallback((cb) => {
            looksSame(path1, path2, opts, cb);
        });
    }

    static buildDiff(opts) {
        const diffOptions = {
            reference: opts.refPath,
            current: opts.currPath,
            diff: opts.diffPath,
            highlightColor: opts.diffColor,
            tolerance: opts.tolerance
        };
        return Promise.fromCallback((cb) => looksSame.createDiff(diffOptions, cb));
    }
}

module.exports = Image;
