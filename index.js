// setup the required modules
var xml2json = require('xml2json'),
    fs = require('fs'),
    // dom0_client to talk to the server
    dom0_client = require('./dom0_client.js'),
    // magic number for communication
    magic_numbers = require('./magic_numbers.js'),
    sleep = require('node-sleep').sleep
    ;

// TODO: move these variables to the config.json / configManager
var tasksFile = 'tasks.xml';
var server_details = {
  'host': '192.168.0.13',
  //'host': '127.0.0.1',
  'port': '3001'
};
var monitor_client_details = {
  'host' : '192.168.0.254',
  'port' : '3002'
};

// read the XML data from the tasks.xml file
// XXX: configure the filename in a config.json file in the end
var xml = fs.readFileSync(tasksFile);

var tasks = xml2json.toJson(xml);
tasks = JSON.parse(tasks);


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
var exampleTask = tasks.taskset.periodictask[0];

var binary = fs.readFileSync('binary.elf');

var client = new dom0_client();
client.init({server_details: server_details, mon_client: monitor_client_details});

client.on('connected', function(){
  console.log('connected');
  //client.sendLua("print 'hello';");
  client.sendBinary(binary);
  sleep(3000);
  client.sendLua("test = L4.default_loader:start({caps={l4re_ipc = L4.Env.l4re_ipc}},\"network\");");
});
