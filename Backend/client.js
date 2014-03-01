var net = require('net');
var fs = require('fs');


var PORT = 9001;
var HOST = '82.192.75.147';
var FILEPATH = 'file.txt';

var client = new net.Socket()

//connect to the server
client.connect(PORT,HOST,function() {
    'Client Connected to server'

    //send a file to the server
    var fileStream = fs.createReadStream(FILEPATH);
    fileStream.on('error', function(err){
        console.log(err);
    })

    fileStream.on('open',function() {
        console.log('Sending log file...');
        fileStream.pipe(client);
    });

});

//handle closed
client.on('close', function() {
    console.log('Connection finished')
});

client.on('error', function(err) {
    console.log(err);
});
