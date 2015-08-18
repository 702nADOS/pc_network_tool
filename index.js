// setup the required modules
var xml2json = require('xml2json'),
    fs = require('fs'),
    dom0_client = require('./dom0_client.js'),
    magic_numbers = require('./magic_numbers.js'),
    sleep = require('node-sleep').sleep
    ;

// XXX: Config
var tasksFile = 'tasks.xml';
var server_details = {
  'host': '192.168.0.14',
  'port': '3001'
};
var monitor_client_details = {
  'host' : '192.168.0.254',
  'port' : '3002'
};

// read the XML data from the tasks.xml file
var xml = fs.readFileSync(tasksFile);
var tasks = xml2json.toJson(xml);
tasks = JSON.parse(tasks);

// Loop through all the tasks
// generate the binaries (most probably it is running a make command and copying the binary
// connect to the client
// send all the binaries
// send json when you have to activate the task
// XXX: JSON can be part of LUA as well

//var binary = fs.readFileSync('binaries/hello.elf');
var client = new dom0_client();
client.init({server_details: server_details, mon_client: monitor_client_details});
client.on('connected', function(){
  console.log('connected');
  client.sendLua("print 'hello';");
  sleep(1000);
  client.sendTaskDescription(tasks.taskset.periodictask);

  //console.log("sending message");
  //client.sendBinary(binary);
  sleep(30000);
  client.sendLua("test = L4.default_loader:start({caps={l4re_ipc = L4.Env.l4re_ipc}},\"network\");");
  //client.close();
});

/*
 * TASK EXAMPLE
 *
 * {
  id: 1,
  executiontime: 3,
  criticaltime: 3,
  ucfirmrt: {},
  uawmean: { size: 10 },
  priority: 1,
  period: 4,
  offset: 0
}*/

process.on('SIGINT', function(code) {
  console.log('exiting the TCP Connection to client');
  client.close();
})
