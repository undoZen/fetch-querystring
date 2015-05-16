'use strict';
if (!global.fetch) {
    throw(new Error('you want to enhance fetch but there is no fetch function, try use fetch-polyfill or node-fetch first.'));
}
var qs = require('qs');
var slice = Array.prototype.slice.call.bind(Array.prototype.slice);
global.fetch = (function (f) {
    Object.keys(f).forEach(function (method) {
        fetch[method] = f[method];
    });
    console.log(Object.keys(f));
    return fetch;
    function fetch(url) {
        var opts = arguments[1] || {};
        if (!opts || !opts.querystring) {
            return f.apply(this, arguments);
        }
        var querystring = opts.querystring;
        delete opts.querystring;
        console.log(Object.keys(fetch));
        var qss = global.fetch.querystring || qs.stringify;
        var search = qss(querystring);
        url = url.replace(/\?.+$/, '') + '?' + search;
        var args = [url].concat(slice(arguments, 1));
        console.log(args);
        return f.apply(this, args);
    }
}(fetch));
