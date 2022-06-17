import request from 'request';
import _ from 'lodash';
import fs from 'fs';

const RETRIABLE_STATUS_CODES = [500, 501, 502, 503, 504];

const BACKOFF_TYPES = {
    FIXED: 'fixed',
    EXPONENTIAL: 'exponential',
};

const DEFAULT_OPTIONS = {
    retries: 0,
    retryAttempts: 0,
    backoff: 1,
    backoffType: BACKOFF_TYPES.FIXED,
    getCurrentBackoff: function () {
        return this.backoffType === BACKOFF_TYPES.EXPONENTIAL
            ? this.backoff * Math.pow(2, this.retryAttempts)
            : this.backoff
    },
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
    if (!_.includes(RETRIABLE_STATUS_CODES, statusCode)) {
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
 * @param {function} [options.getCurrentBackoff]
 * @param {function} [callback]
 */
const retriableRequest = (url, options, callback) => {
    options = _.extend(_.clone(DEFAULT_OPTIONS), options || {});

    const req = request.get(url);
    req.on('response', (response) => {
        if (response.statusCode === 200) {
            return callback ? callback(null, req, response) : undefined;
        }
        else if (_shouldRetry(options, response.statusCode)) {
            return setTimeout(() => {
                options.retryAttempts += 1;
                console.log(`Retrying #${options.retryAttempts}....`);
                return retriableRequest(url, options, callback);
            }, options.getCurrentBackoff());
        }
        return callback
            ? callback(new Error('Could not retrieve data'))
            : undefined;
    });
    req.on('error', (err) => callback ? callback(err) : undefined);
};

const run = () => {
    retriableRequest(
        'https://www.w3schools.com/howto/img_forest.jpg',
        {
            retries: 5,
            backoff: 64,
            backoffType: BACKOFF_TYPES.EXPONENTIAL,
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
