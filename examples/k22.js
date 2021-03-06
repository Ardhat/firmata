/**
 * Sample script to take readings from a k22 co2 sensor.
 * http://www.co2meter.com/collections/co2-sensors/products/k-22-oc-co2-sensor-module
 */

var Board = require("../");

Board.requestPort(function(error, port) {
  var board = new Board(port.comName);

  board.on("ready", function() {
    var k22 = 0x68;

    board.i2cConfig();
    board.i2cWrite(k22, [0x22, 0x00, 0x08, 0x2A]);
    board.i2cRead(k22, 4, function(data) {
      var ppms = 0;
      ppms |= data[1] & 0xFF;
      ppms = ppms << 8;
      ppms |= data[2] & 0xFF;
      var checksum = data[0] + data[1] + data[2];
      if (checksum === data[3]) {
        console.log("Current PPMs: " + ppms);
      } else {
        console.log("Checksum failure");
      }
    });
  });
});
