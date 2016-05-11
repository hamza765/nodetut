var http = require('http');
var fs = require('fs');

    // An object of options to indicate where to post to
var post_options = {
    host: 'localhost',
    port: '8080',
    path: '/api/scan',
method: 'POST',
headers: {
    'Content-Type': 'application/json'
}
};

// Set up the request
var post_req = http.request(post_options, function(res) {
    res.setEncoding('utf8');
    var body = '';
    res.on('data', function (chunk) {
    body += chunk;
});
res.on('end', function () {
    body = JSON.parse(body)
    // Make sure it's working
    console.log(body.response.subject);
});
});

// post the data
var url = 'hamzakhan.org';
var catURL = {"url": url, "path":"/", "port":"443", "live_scan":"false", "advanced":"true"};
post_req.write(JSON.stringify(catURL));
post_req.end();