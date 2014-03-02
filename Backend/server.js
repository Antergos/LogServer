var net = require('net'),
    fs = require('fs'),
    request = require('request'),
    buffer = require('buffer');

var server = net.createServer(function(conn) {
    console.log('server connected');

});

var HOST = '127.0.0.1'
var PORT = '9001'

process.argv.forEach(function (val, index, array) {
  if(index == '2'){
    if(val.substring(0,7) == '--host='){
      HOST = val.substring(7);
    }
  }
});

// DB Config
var databaseUrl = "logserver";
var collections = ["logs"]
var db = require("mongojs").connect(databaseUrl, collections);

var iplocator_url = "http://ipinfo.io/";

server.listen(PORT, HOST, function() {
    //listening
    console.log('Listening on port ' + PORT + '\n');

    server.on('connection', function(conn) {
        var current_time = Date.now();
        var remoteAddress = '';
        var chunks = [];

        console.log('connection made...\n')
        conn.on('data', function(chunk) {
            remoteAddress = conn.remoteAddress;
            chunks.push(chunk);  
        });
        conn.on('end', function(){
            var data = Buffer.concat(chunks);
            console.log('data received from ' + remoteAddress);

            // Get IP country
            request({
                url: iplocator_url + remoteAddress + '/country',
                json: false
            }, function (error, response, body) {

                if (!error && response.statusCode === 200) {
                    // Save to DB
                    db.logs.save({log_timestamp: current_time, client_ip: remoteAddress, ip_location: body.toString('utf8').replace('\n', ''), log_data: data.toString('utf8')}, function(err, saved) {
                        if( err || !saved ) console.log("- Log not saved -");
                        else console.log("- Log saved -");
                    });
                }
            })
        });
    })
});
