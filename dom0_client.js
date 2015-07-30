/* the dom0_client that we could require
 * and create/remove operations
 */

var net = require('net'),
    debug = require('./debug.js');

var dom0_client = function(){
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
dom0_client.prototype.init = function(server_details){
  debug.log('Creating the client socket to talk to server');
  // create the client
  this.clientSocket = net.createConnection(server_details);
};

/*
 * function sendControl : sends a control message to the server
 * parameters:
 *  message: Hex , part of the magic_numbers that defines which
 *          control message we are sending.
 */
dom0_client.prototype.sendControl = function(message){
  debug.log('sending control message to server ' + message);
  this.clientSocket.write(new Buffer(message));
};

module.exports = dom0_client;
