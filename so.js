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




fs.readFile('urls.txt', function(err, data) {

    //if (err) throw err;
    //console.log(err);
    var array = data.toString().split('\n');
    for (var i = 0; i < array.length - 1; i++) {
        str = array[i];
        array[i] = str.slice(0, -1);
    }
    //console.log(array);


    var emitter = new EventEmitter();
    var counter = 1,
        n = array.length;
    //console.log(n);

    // Start with the first request



    function PostRequest() {
        var post_req = http.request(post_options, function(res) {
            //console.log('Status: ' + res.statusCode);
            //console.log('Headers: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            var body = '';
            res.on('data', function(chunk) {
                body += chunk;
            });
            res.on('end', function() {
                body = JSON.parse(body);
                // Make sure it's working
                console.log(body.response.subject);
                console.log(counter);

                // ADD THE CALLBACK 
                // OR 
                // TRIGGER EVENT
                //PostRequest();
                return emitter.emit('ResponseEnded');

            });
        });

        var url = array[counter];
        //console.log(url);
        var catURL = { "url": url };
        //console.log(catURL);
        var jsonURL = catURL.toString();


        post_req.write(JSON.stringify(catURL));
        post_req.end();
    }


    emitter.on('ResponseEnded', function() {
        counter++;
        if (counter < n) {
            PostRequest();
        } else {
            console.log('No more requests');
        }
    });


    PostRequest();
});
