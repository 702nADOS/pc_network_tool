
// setup the required modules
var xml2json = require('xml2json'),
    fs = require('fs'),
    dom0_client = require('./dom0_client.js'), // dom0_client to talk to the server
    magic_numbers = require('./magic_numbers.js') // magic number for communication
    ;

// TODO: move these variables to the config.json / configManager
var tasksFile = 'tasks.xml';
var server_details = {
    'host': '127.0.0.1',
    'port': '3001'
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

var client = new dom0_client();
client.init(server_details);
client.sendLua("print 'hello';");
