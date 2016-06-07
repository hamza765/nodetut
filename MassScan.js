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

    if (err) throw err;
    console.log(err);
    var array = data.toString().split('\n');
    for (var i = 0; i < array.length; i++) {
        str = array[i];
        array[i] = str.slice(0, -1);
        
    }
    //console.log(array);


    var emitter = new EventEmitter();
    var counter = 0,
        n = array.length;

    //function PostRequest() {
    for (var i = 0; i < array.length - 1; i++) {
        var post_req = http.request(post_options, function(res) {
            res.setEncoding('utf8');
            var body = '';
            res.on('data', function(chunk) {
                body += chunk;
            });
            res.on('end', function() {
                body = JSON.parse(body);
                // Make sure it's working
                //var successCount = 0;
                var subject = body.response.subject;
                if(subject != undefined)
                console.log(subject);

                
                //PostRequest();
                //return emitter.emit('ResponseEnded');

            });
        });

        var url = array[counter];

        var catURL = { "url": url };
        post_req.write(JSON.stringify(catURL));
        post_req.end();
        //console.log(counter);
        counter++;
    }

    // emitter.on('ResponseEnded', function() {
    //     counter++;
    //     if (counter < n) {
    //         PostRequest();
    //     } else {
    //         console.log('No more requests');
    //     }
    // });
    //PostRequest();
});
