var exports = module.exports = {};


/*
 * Helper function that returns a 4 byte buffer
 * parameter: hex, a hex number
 * returns : buffer representation of hex in int32 Little Endian Format
 */
function getInt32LE(hex){
  var buf = new Buffer(4);
  buf.writeUInt32LE(hex, 0);
  return buf;
}

/* the dom0_client that we could require
 * and create/remove operations
 */

var net = require('net'),
    debug = require('./debug.js'),
    sleep = require('node-sleep').sleep,
    EventEmitter = require( "events" ).EventEmitter;
    ;


var dom0_client = function() {
  this.server_details = {}; // JS Object, details of the client Server, host and port
  this.clientSocket = null; // variable that holds the socket connection to the client
  this.monitorSocket = null;
  this.connected = false;// BOOL, state of the connection
  this.magic_numbers = require('./magic_numbers.js'); // this file has all the communication protocol IDs
};

// make the dom0 client inherit all the properties
// of eventEmitter
dom0_client.prototype = new EventEmitter;

/*
 * function init: initializes the communication and sets the channels
 * parameters:
 *  server_details : JSON object that has the details of the server
 *    port
 *    host
 *
 */
dom0_client.prototype.init = function(options) {
  var client = this;
  debug.log('Creating the client socket to talk to server');

  // create the client, connect to it
  this.clientSocket = net.createConnection(options.server_details);

  this.clientSocket.on('connect', function(){
    client.emit('connected');
  });
  this.clientSocket.on('data', function(data) {
    console.log( " == " + data.toString());
  });

  // start listening on a seperate port and create handlers for them as well.
  //this.monitorSocket = net.createServer(function(socket){
    //console.log('CONNECTED: '+ sock.remoteAddress + ':' + sock.remotePort);

    //sock.on('data', function(data) {
      //console.log('DATA ' + sock.remoteAddress + ': ' + data);
    //});

    //sock.on('close', function(data) {
      //console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    //});
  //}).listen(options.mon_client.port, options.mon_client.host);
};

/*
 * function sendControl : sends a control message to the server
 * parameters:
 *  message: HEX, part of the magic_numbers that defines which
 *          control message we are sending.
 */
dom0_client.prototype.sendControl = function() {
  debug.log('sending control message to server ');

  this.clientSocket.write(getInt32LE(this.magic_numbers.control));
};

/*
 * function sendLUA : sends a LUA message to the server
 * parameters:
 *  message: STRING, the lua message that should be sent
 *          to the server
 */
dom0_client.prototype.sendLua = function(message) {
  debug.log('sending lua meesage to the server '+ message);

  // protocol is to send LUA control message first
  //                then send the length of the message
  //                then send the message
  //console.log(this.magic_numbers.lua);
  //var lua = new Buffer(4);
  //lua.writeUInt32LE(this.magic_numbers.lua, 0);
  //this.clientSocket.write(lua);
  this.clientSocket.write(getInt32LE(this.magic_numbers.lua));
  console.log(getInt32LE);
  debug.log('send message length ');
  this.clientSocket.write(getInt32LE(message.length));
  console.log(getInt32LE(message.length));
  debug.log('send Message');
  this.clientSocket.write(message);

  // TODO: we should get a response if the LUA message was received
  // successfully or not.
  // XXX: Its only if it was received, nothing about if the LUA string
  // exectued right or not.
};

/*
 * function sendBinary: sends a binary to the server
 * parameters:
 *  binary: BUFFER, the binary that we should send to the server,
 *          instance of node Buffer class.
 */
dom0_client.prototype.sendBinary = function(binary) {
  debug.log('sending binary file to the server');

  this.sendControl();

  this.clientSocket.write(getInt32LE(this.magic_numbers.send_binary));
  this.clientSocket.write(getInt32LE(binary.length));

  debug.log('expecting an OK by this time');
  sleep(3000);

  // TODO: wait for GO_SEND here. need to make these parts more elegant
  this.clientSocket.write(binary);
};

/*
 * function close : closes the socket connection
 *
 */
dom0_client.prototype.close = function(){
  this.clientSocket.end();
}

module.exports = dom0_client;
