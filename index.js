//
// http://www.steves-internet-guide.com/using-node-mqtt-client/
//
var mqtt = require('mqtt');
const fs = require('fs');
const uuidv4 = require('uuid/v4');
console.log('connecting...');
var broker = 'diskstation.local'
var client = mqtt.connect("mqtt://"+broker,{'clientId':'mqttjs01'});
client.on("connect",function(){
  console.log("connected, subscribing...");
  client.subscribe('testchannel', {qos:1});
});

client.on("error",function(error){
  console.log("Can't connect:\n"+error);
});

client.on("error",function(error){
  console.log("Can't connect" + error);
  process.exit(1)
});

var prepareMessage = function(message){

  let message_json = JSON.parse(message);
  //https://www.npmjs.com/package/uuid
  message_json['id'] = uuidv4();
  message_json['timestamp_received'] = new Date();
  console.log('message: ' + message_json);
  return message_json;
};
client.on('message',function(topic, message, packet){
  //console.log("message is "+ message);
  writeData(message);
	//console.log("topic is "+ topic);
});
const weather_data_file = 'weather_data.json';
//https://stackabuse.com/reading-and-writing-json-files-with-node-js/
// https://stackoverflow.com/questions/38906579/node-js-append-json-to-array
var writeData = function(message) {
  //console.log('message: ' + message);
  let message_json = prepareMessage(message); //JSON.parse(message);
  //https://www.npmjs.com/package/uuid
  //message_json['id'] = uuidv4();
  //console.log('message_json: ' + message_json);
  let rawdata = fs.readFileSync(weather_data_file);
  let weatherData = JSON.parse(rawdata);


  weatherData.push(message_json);
  //console.log("weatherData["+weatherData.length+"]: " + JSON.stringify(weatherData));

  fs.writeFile(weather_data_file, JSON.stringify(weatherData), function(err) {
    if (err) {
        console.log('writing weather data problem: '+err);
        return;
    }
    console.log("The file was saved!");
});


};


console.log('client finished!');
