//Declare dependencies
var http = require('https');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;

//When making a request, you need to send options and a callback
var options = {
    host: 'api.imgur.com',
    path: '/3/gallery/hot/viral/0.json',
    headers: { 'Authorization': 'Client-ID 0981a810f4e0eb0' }
};

var emitter = new EventEmitter(); //Create an instance of Event Emitter

//The reponse is received in chunks so we append each check to the end of the `body` until it ends
callback = function(response) {
    var body = '';


    //another chunk of data has been recieved, so append it to `body`
    response.on('data', function(chunk) {
        body += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function() {
        body = JSON.parse(body); //Format the JSON so it is easier to read

        var test = body.data;
        //The response includes 3 keys: Data, Success, and Code. 
        //We only care about Data as that is where all the Image info is.

        //Loop thru the array of posts on the gallery
        for (i = 0; i < test.length; i++) {

            var links = test[i].link; //Temporarily set each link from the current array index equal to `links`

            //Stores the first 10 characters of a url into `str`
            var str = links.substring(0, 9);

            //If a specified char does not exist in a string, indexOf() returns a -1
            //Since single images start with `http://i.` we check to see if that period is there
            //If the period is there, we don't skip that URL
            if (str.indexOf('.') == -1) {

                //Take the link stored in `link` and append it to a file
                fs.appendFile('imgur2.txt', links + '\n', (err) => {
                    if (err) throw err;
                    return emitter.emit('ResponseEnded'); //Throws a flag
                });

            }

        }

    });
}

emitter.on('ResponseEnded', function() {
    //do something
});

//Initiate the request with the parameters we set earlier and then end it.
http.request(options, callback).end();
