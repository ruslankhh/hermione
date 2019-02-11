'use strict';

const _ = require('lodash');

module.exports = class MultipleError extends Error {
    constructor(errors) {
        super();

        this.name = this.constructor.name;
        this.message = errors.map(e => e.message).join('; ');
        this.stack = this.message + '\n' + errors.map(e => e.stack).join('\n');
        this.errors = errors.map(e => _.pick(e, ['name', 'message', 'stack', 'stateName', 'screenshot']));
    }
};
