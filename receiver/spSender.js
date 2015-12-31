var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("COM3", {
  baudrate: 57600
});


serialPort.on("open", function () {
  console.log('open2');
  serialPort.write("ls\n", function(err, results) {
    console.log('err ' + err);
    console.log('results ' + results);
  });
}); 