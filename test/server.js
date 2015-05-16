'use strict';
var http = require('http');
var fs = require('fs');
var path = require('path');
var rawBody = require('raw-body');

http.createServer(function (req, res) {
    req.url = req.url.replace(/\/+/, '/');
    console.log(req.url);
    if (req.url === '/' || req.url === '/test' || req.url === '/test/') {
        return res.writeHead(302, '/test/index.html');
    }
    if (req.url === '/test/index.html') {
        req.url = '/test/index.html';
    }
    if (req.url.match(/^\/post/)) {
        console.log(req.headers);
        rawBody(req, {length: req.headers['content-length']}, function (err, buf) {
            console.log(arguments);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            console.log(buf.length, buf.toString());
            var body = req.headers['content-type'].indexOf('json') ? JSON.parse(buf.toString()) : buf.toString();
            if (err) return res.end(err.toString());
            res.end(JSON.stringify({url: req.url, body: body}));
        });
        return;
    }
    var filePath = path.join(__dirname, '..', req.url);
    fs.exists(filePath, function (exists) {
        if (!exists) {
            res.statusCode = 404;
            res.end('404');
            return;
        }
        //res.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream(filePath).pipe(res);
    });
}).listen(8080);
