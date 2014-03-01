var net = require('net'),
    fs = require('fs'),
    buffer = require('buffer');

var server = net.createServer(function(conn) {
    console.log('server connected');

});

var HOST = '82.192.75.147';
var PORT = '9001';

// DB Config
var databaseUrl = "logserver";
var collections = ["logs"]
var db = require("mongojs").connect(databaseUrl, collections);

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
            db.logs.save({log_timestamp: current_time, client_ip: remoteAddress, log_data: data.toString('utf8')}, function(err, saved) {
                if( err || !saved ) console.log("- Log not saved -");
                else console.log("- Log saved -");
            });
        });
    })
});
