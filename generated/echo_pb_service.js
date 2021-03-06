// package: echo
// file: echo.proto

var echo_pb = require("./echo_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var EchoService = (function () {
  function EchoService() {}
  EchoService.serviceName = "echo.EchoService";
  return EchoService;
}());

EchoService.GetEcho = {
  methodName: "GetEcho",
  service: EchoService,
  requestStream: false,
  responseStream: false,
  requestType: echo_pb.Echo,
  responseType: echo_pb.Echo
};

exports.EchoService = EchoService;

function EchoServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

EchoServiceClient.prototype.getEcho = function getEcho(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EchoService.GetEcho, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.EchoServiceClient = EchoServiceClient;

