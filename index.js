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
tasks = cleanup(tasks);

var xml = fs.readFileSync('tasks2.xml');
var tasks2 = xml2json.toJson(xml);
tasks2 = JSON.parse(tasks2);
tasks2 = cleanup(tasks2);

var client = new dom0_client();

client.init({server_details: server_details, mon_client: monitor_client_details});

client.on('connected', function(){
  console.log('connected');
  client.sendLua("print 'hello';");
  client.sendTaskDescription(tasks);
  //client.sendTaskDescription(tasks2);
  client.sendBinary();
});

process.stdin.on('data', function(){
  client.start();
  client.sendTaskDescription(tasks2);
});

/*
 * TASK EXAMPLE
 *
 * {
  id: 1,
  executiontime: 3,
  criticaltime: 3,
  priority: 1,
  period: 4,
  offset: 0
}*/

process.on('SIGINT', function(code) {
  console.log('exiting the TCP Connection to client');
  client.close();
});


function cleanup(tasks){
  tasks = tasks.taskset.periodictask;
  for(var task in tasks){
    delete tasks[task].ucfirmrt;
    delete tasks[task].uawmean;
  }
  return tasks;
}
