'use strict';

const crypto = require('crypto');

exports.logger = {
    log: console.log,
    warn: console.warn,
    error: console.error
};

exports.getTestContext = (context) => {
    return context.type === 'hook' && /^"before each"/.test(context.title)
        ? context.ctx.currentTest
        : context;
};

exports.getShortMD5 = (str) => crypto.createHash('md5').update(str, 'ascii').digest('hex').substr(0, 7);
