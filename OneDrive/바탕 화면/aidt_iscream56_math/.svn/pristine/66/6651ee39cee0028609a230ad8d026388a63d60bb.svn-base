var Receiver = {
  port: undefined,
  data: {},
  connect: function () {
    var self = this;
    var p = new Promise((reslove) => {
      var handleMessage = (event) => {
        [this.port] = event.ports || [];
        if (!this.port) {
          return;
        }

        window.removeEventListener("message", handleMessage);

        console.log("Message channel connect success...");
        reslove(self);
      }
      window.addEventListener("message", handleMessage, false);
    });
    return p;
  },
  close: function () {
    this.port.close();
  },
  send: function (command, params) {
    if (isConnectedPlaform()){
      this.port.postMessage({ command, params });
    }    
  },
  receive: function (fn) {
    this.port.onmessage = fn;
  },
  setData: function (data) {
    this.data = data;
  },
  getData: function () {
    return this.data;
  }
};