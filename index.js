//
// http://www.steves-internet-guide.com/using-node-mqtt-client/
//
var mqtt = require('mqtt');
const fs = require('fs');
const uuidv4 = require('uuid/v4');
const axios = require('axios');

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

  //
  // https://stackoverflow.com/questions/10659523/how-to-get-the-exact-local-time-of-client
  //
  message_json['timestamp_received'] = new Date().toISOString();
  console.log('message: ' + JSON.stringify(message_json));
  return message_json;
};
client.on('message',function(topic, message, packet){
  pushDataToAWS(message);
  writeData(message);
});
const weather_data_file = 'weather_data.json';
const url = 'https://m4o25zb2ng.execute-api.eu-central-1.amazonaws.com/dev/envdata';
var pushDataToAWS = function(message){
  console.log('pushDataToAWS: start');
  console.log('1: ' + message);
  const json = JSON.parse(message);
  console.log('2: ' + JSON.stringify(json));
  axios.post(url, json)
		.then(function(response){
		  console.log('pushed data to aws:\n' + message);
		})
		.catch(function(error){
		  console.log('pushing data to aws failed: ' + error);
		})
		;
};
//https://stackabuse.com/reading-and-writing-json-files-with-node-js/
// https://stackoverflow.com/questions/38906579/node-js-append-json-to-array
var writeData = function(message) {
  //console.log('message: ' + message);
  let message_json = prepareMessage(message); //JSON.parse(message);
	pushDatatoAWS(message_json);
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
