'use strict';

require('../../');
require('fetch-stringify');
var tape = require('tape');
var qs = require('qs');

tape('default querystring stringify function', function (test) {
    test.plan(1);
    fetch('/post', {
        querystring: {a: [1, 2]},
        method: 'POST',
        body: {
            arr: [1,2,3,'中文']
        }
    }).then(function (response) {
        console.log(response.header);
        response.json().then(function (json) {
            test.deepEqual(json, {url:'/post?a%5B0%5D=1&a%5B1%5D=2', body:{"arr":[1,2,3,"中文"]}});
        })
    });
});

tape('set fetch.querystring function', function (test) {
    test.plan(1);
    fetch.querystring = function (qo) {
        return qs.stringify(qo, {arrayFormat: 'repeat'});
    }
    fetch('/post', {
        querystring: {a: [1, 2]},
        method: 'POST',
        body: {
            arr: [1,2,3,'中文']
        }
    }).then(function (response) {
        console.log(response.header);
        response.json().then(function (json) {
            test.deepEqual(json, {url:'/post?a=1&a=2', body:{"arr":[1,2,3,"中文"]}});
        })
    });
});
