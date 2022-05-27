const request = require('request');
const _ = require('lodash');
const fs = require('fs');

const DEFAULT_OPTIONS = {
    retries: 0,
    retryAttempts: 0,
    backoff: 1,
    backoffType: 'fixed', // [fixed, exponential]
};

/**
 * Determine whether the request should be retried
 * 
 * @param {object} options
 * @param {number} options.retryAttempts
 * @param {number} options.retries
 * @param {number} statusCode
 * @returns {boolean}
 */
const _shouldRetry = (options, statusCode) => {
    if (!_.includes([500, 501, 502], statusCode)) {
        return false;
    }
    return options.retryAttempts < options.retries;
};

/**
 * Request with retriable configs
 *
 * @param {string} url
 * @param {object} [options]
 * @param {number} [options.retryAttempts]
 * @param {number} [options.retries]
 * @param {number} [options.backoff]
 * @param {string} [options.backoffType]
 * @param {function} [callback]
 */
const retriableRequest = (url, options, callback) => {
    options = _.extend(DEFAULT_OPTIONS, options || {});

    const req = request.get(url);
    req.on('response', (response) => {
        if (response.statusCode === 200) {
            return callback ? callback(null, req, response) : undefined;
        }
        else if (_shouldRetry(options, response.statusCode)) {
            const backoff = options.backoffType === 'exponential'
                ? Math.pow(options.backoff, options.retryAttempts)
                : options.backoff;
            return setTimeout(() => {
                options.retryAttempts += 1;
                console.log(`Retrying #${options.retryAttempts}....`);
                return retriableRequest(url, options, callback);
            }, backoff * 1000);
        }
        return callback
            ? callback(new Error('Could not retrieve data'))
            : undefined;
    });
    req.on('error', (err) => callback(err));
};

const run = () => {
    retriableRequest(
        'https://www.w3schools.com/howto/img_forest.jpg',
        {
            retries: 5,
            backoff: 2,
        },
        (err, req) => {
            if (err) {
                console.error(err);
                return;
            };
            req.pipe(fs.createWriteStream('image.jpg'));
        }
    );
};

run();
