'use strict';
var http = require('http');
var tape = require('tape');
var qs = require('qs');
global.fetch = require('node-fetch');
require('../../');
require('fetch-stringify');

var rawBody = require('raw-body');
var server = http.createServer(function (req, res) {
    console.log(req.headers);
    rawBody(req, {length: req.headers['content-length']}, function (err, buf) {
        console.log(arguments);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        var body = JSON.parse(buf.toString());
        if (err) return res.end(err.toString());
        console.log(body);
        res.end(JSON.stringify({url: req.url, body: body}));
    });
})
var address = server.listen().address();
console.log(address);

tape('default querystring stringify function', function (test) {
    test.plan(1);
    fetch('http://127.0.0.1:' + address.port + '/post', {
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
    fetch('http://127.0.0.1:' + address.port + '/post', {
        querystring: {a: [1, 2]},
        method: 'POST',
        body: {
            arr: [1,2,3,'中文']
        }
    }).then(function (response) {
        console.log(response.header);
        response.json().then(function (json) {
            test.deepEqual(json, {url:'/post?a=1&a=2', body:{"arr":[1,2,3,"中文"]}});
            server.close();
        })
    });
});
