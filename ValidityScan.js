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




fs.readFile('alexa.txt', function(err, data) {

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
            res.setEncoding('utf8');
            var body = '';
            res.on('data', function(chunk) {
                body += chunk;
            });
            res.on('end', function() {
                time = JSON.parse(body);
                // Make sure it's working
                var subject = time.response.subject;
                if (subject == undefined) {

                    console.log('Undefined');
                } else {
                    var valid_from = time.response.valid_from;
                    var valid_to = time.response.valid_to;

                    var validFrom = DateFrom(valid_from);
                    var validTo = DateTo(valid_to);

                    var dateNow = new Date();

                    if (dateNow >= validTo) {
                        fs.appendFile('expired.txt', array[counter].toString() + '\n', (err) => {
                            if (err) throw err;

                        });
                    }

                    console.log(time.response.subject.CN)
                    console.log(counter);
                    //console.log(validTo);
                }
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

    function DateFrom(dateStart) {

        var valid_from = dateStart;
        valid_from = valid_from.substring(5); //Removes Day

        //valid_to = valid_to.substring(5); //Removes Day
        var dateFrom = valid_from.substring(0, 2);
        dateFrom = parseInt(dateFrom, 10);
        var monthFrom = valid_from.substring(3, 6);
        switch (monthFrom) {
            case 'Jan':
                monthFrom = 1;
                break;
            case 'Feb':
                monthFrom = 2;
                break;
            case 'Mar':
                monthFrom = 3;
                break;
            case 'Apr':
                monthFrom = 4;
                break;
            case 'May':
                monthFrom = 5;
                break;
            case 'Jun':
                monthFrom = 6;
                break;
            case 'Jul':
                monthFrom = 7;
                break;
            case 'Aug':
                monthFrom = 8;
                break;
            case 'Sep':
                monthFrom = 9;
                break;
            case 'Oct':
                monthFrom = 10;
                break;
            case 'Nov':
                monthFrom = 11;
                break;
            case 'Dec':
                monthFrom = 12;
                break;
        }
        var yearFrom = valid_from.substring(7, 11);
        yearFrom = parseInt(yearFrom, 10);
        var hourFrom = valid_from.substring(12, 14)
        hourFrom = parseInt(hourFrom, 10);
        var minFrom = valid_from.substring(15, 17)
        minFrom = parseInt(minFrom, 10);
        var secFrom = valid_from.substring(18, 20)
        secFrom = parseInt(secFrom, 10);

        var validFrom = new Date(yearFrom, monthFrom, dateFrom, hourFrom, minFrom, secFrom);
        return validFrom;
    }

    function DateTo(dateEnd) {

        var valid_To = dateEnd;
        valid_To = valid_To.substring(5); //Removes Day

        //valid_to = valid_to.substring(5); //Removes Day
        var dateTo = valid_To.substring(0, 2);
        dateTo = parseInt(dateTo, 10);
        var monthTo = valid_To.substring(3, 6);
        switch (monthTo) {
            case 'Jan':
                monthTo = 1;
                break;
            case 'Feb':
                monthTo = 2;
                break;
            case 'Mar':
                monthTo = 3;
                break;
            case 'Apr':
                monthTo = 4;
                break;
            case 'May':
                monthTo = 5;
                break;
            case 'Jun':
                monthTo = 6;
                break;
            case 'Jul':
                monthTo = 7;
                break;
            case 'Aug':
                monthTo = 8;
                break;
            case 'Sep':
                monthTo = 9;
                break;
            case 'Oct':
                monthTo = 10;
                break;
            case 'Nov':
                monthTo = 11;
                break;
            case 'Dec':
                monthTo = 12;
                break;
        }
        var yearTo = valid_To.substring(7, 11);
        yearTo = parseInt(yearTo, 10);
        var hourTo = valid_To.substring(12, 14)
        hourTo = parseInt(hourTo, 10);
        var minTo = valid_To.substring(15, 17)
        minTo = parseInt(minTo, 10);
        var secTo = valid_To.substring(18, 20)
        secTo = parseInt(secTo, 10);

        var validTo = new Date(yearTo, monthTo, dateTo, hourTo, minTo, secTo);
        return validTo;
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
