'use strict';

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
