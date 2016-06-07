var http = require('http');
var fs = require('fs');

// An object of options to indicate where to post to
var post_options = {
    host: 'scanner.ssltools.com',
    path: '/api/scan',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};




//ARRAY OF URLs READ FROM A FILE
//fs.readFile('url.txt', function(err, data) {
//if (err) throw err;
//console.log(data);
var array = ["ssl.com", "google.com", "hamzakhan.org"];
for (var i = 0; i < array.length; i++) {
    //console.log(array[i]);
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });
        res.on('end', function() {
            body = JSON.parse(body);
            // Make sure it's working
            console.log(body.response.subject);
        });
    });

    var url = array[i];
    var catURL = { "url": url, "path": "/", "port": "443", "live_scan": "false", "advanced": "true" };
    post_req.write(JSON.stringify(catURL));
    post_req.end();

}

//});
