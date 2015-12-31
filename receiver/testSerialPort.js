var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("COM4", {
  baudrate: 57600
});

serialPort.on("open", function () {
  console.log('open');
  serialPort.on('data', function(data) {
    console.log('data received: ' + data);
  });
  serialPort.write("ls\n", function(err, results) {
    console.log('err ' + err);
    console.log('results ' + results);
  });
});

var serialPort2 = new SerialPort("COM3", {
  baudrate: 57600
});

serialPort2.on("open", function () {
  console.log('open2');
  serialPort2.on('data2', function(data) {
    console.log('data2 received: ' + data);
  });
}); 