/* the dom0_client that we could require
 * and create/remove operations
 */

var net = require('net'),
    debug = require('./debug.js');

var dom0_client = function() {
  var server_details, // JS Object, details of the client Server, host and port
  clientSocket, // variable that holds the socket connection to the client
  connected // BOOL, state of the connection
  ;
  var magic_numbers = require('./magic_numbers.js'); // this file has all the communication protocol IDs
};

/*
 * function init: initializes the communication and sets the channels
 * parameters:
 *  server_details : JSON object that has the details of the server
 *    port
 *    host
 *
 */
dom0_client.prototype.init = function(server_details) {
  debug.log('Creating the client socket to talk to server');
  // create the client
  this.clientSocket = net.createConnection(server_details);
};

/*
 * function sendControl : sends a control message to the server
 * parameters:
 *  message: HEX, part of the magic_numbers that defines which
 *          control message we are sending.
 */
dom0_client.prototype.sendControl = function() {
  debug.log('sending control message to server ');
  this.clientSocket.write(new Buffer(this.magic_numbers.control));
};

/*
 * function sendLUA : sends a LUA message to the server
 * parameters:
 *  message: STRING, the lua message that should be sent
 *          to the server
 */
dom0_client.prototype.sendLua = function(message) {
  debug.log('sending lua meesage to the server '+ message);

  // get the length of the message
  var messageLength = message.length;

  // protocol is to send LUA control message first
  //                then send the length of the message
  //                then send the message
  this.clientSocket.write(new Buffer(this.magic_numbers.lua));
  this.clientSocket.write(messageLength);
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
  this.clientSocket.write(this.magic_numbers.send_binary);
  this.clientSocket.write(binary.length);

  // TODO: wait for GO_SEND here. need to make these parts more elegant
  this.clientSocket.write(binary
}

module.exports = dom0_client;
