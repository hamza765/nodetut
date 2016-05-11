var http = require('http');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;

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


var array = {};

fs.readFile('urls.txt', function(err, data) {

    if (err) throw err;
    array = data.toString().split("\n");
    //console.log(array);

    var emitter = new EventEmitter();
    var counter = 0,
        n = array.length;
    console.log(n);

    function PostRequest() {
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

                // ADD THE CALLBACK 
                // OR 
                // TRIGGER EVENT
                //PostRequest();
                return emitter.emit('ResponseEnded');

            });
        });

        var url = array[counter];
        var catURL = { "url": url, "path": "/", "port": "443", "live_scan": "false", "advanced": "true" };
        post_req.write(JSON.stringify(catURL), function(err) {
            //console.log(err);
            post_req.end();
        });
    }


    emitter.on('ResponseEnded', function() {
        ++counter;
        if (counter < n) {
            PostRequest();
        } else {
            console.log('No more requests');
        }
    });


    // Start with the first request
    PostRequest();
});
