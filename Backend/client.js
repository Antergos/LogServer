var net = require('net');
var fs = require('fs');


var PORT = 9001;
var HOST = '127.0.0.1';
var FILEPATH = 'file.txt';

process.argv.forEach(function (val, index, array) {
  if(index == '2'){
    if(val.substring(0,7) == '--host='){
      HOST = val.substring(7);
    }else{
      if(val.substring(0,7) == '--file='){
        FILEPATH = val.substring(7);
      }
    }
  }
  if(index == '3'){
    FILEPATH = val.substring(7);
  }
});
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
