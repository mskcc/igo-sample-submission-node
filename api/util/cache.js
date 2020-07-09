// https://medium.com/@danielsternlicht/caching-like-a-boss-in-nodejs-9bccbbc71b9b
var _ = require('lodash');
import NodeCache from 'node-cache';

class Cache {
    constructor(ttlSeconds) {
        this.cache = new NodeCache({
            stdTTL: ttlSeconds,
            checkperiod: ttlSeconds * 0.2,
            useClones: false,
        });
    }

    get(key, storeFunction) {
        const value = this.cache.get(key);
        if (value) {
            console.log('retrieved from cache: ' + key);
            return Promise.resolve(value);
        }

        return storeFunction().then((result) => {
            if (!_.isEmpty(result)) {
                this.cache.set(key, result);
                console.log('added to cache: ' + key);
                return result;
            } else {
                return result;
            }
        });
    }

    del(keys) {
        this.cache.del(keys);
    }

    delStartWith(startStr = '') {
        if (!startStr) {
            return;
        }

        const keys = this.cache.keys();
        for (const key of keys) {
            if (key.indexOf(startStr) === 0) {
                this.del(key);
            }
        }
    }

    flush() {
        this.cache.flushAll();
    }
}

export default Cache;
