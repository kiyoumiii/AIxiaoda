"use strict";
const common_vendor = require("../common/vendor.js");
const voice_uuid = require("./uuid.js");
class NlsClient {
  constructor(config) {
    if (!config || !config.url || !config.appkey || !config.token) {
      throw new Error("invalid config!");
    }
    this._config = config;
  }
  start(onmessage, onclose) {
    if (typeof onmessage !== "function") {
      throw new Error("expect function onmessage");
    }
    if (typeof onclose != "function") {
      throw new Error("expect function onclose");
    }
    this._ws = common_vendor.wx$1.connectSocket({
      url: this._config.url,
      tcpNoDelay: true,
      header: {
        "X-NLS-Token": this._config.token
      }
    });
    this._ws.onMessage((res) => {
      if (typeof res.data === "string") {
        onmessage(res.data, false);
      } else {
        onmessage(res.data, true);
      }
    });
    this._ws.onClose((code, reason) => {
      onclose(code, reason);
    });
    return new Promise((resolve, reject) => {
      this._ws.onOpen((res) => {
        resolve(res);
      });
      this._ws.onError((errMsg) => {
        reject(errMsg);
      });
    });
  }
  send(data, isBinary) {
    if (this._ws == null) {
      return;
    }
    this._ws.send({
      data
    });
  }
  uuid() {
    return voice_uuid.uuid(true);
  }
  shutdown() {
    if (this._ws == null) {
      return;
    }
    this._ws.close();
  }
  defaultContext() {
    return {
      sdk: {
        name: "nls-wx-sdk",
        version: "0.0.1",
        language: "wxjs"
      }
    };
  }
}
exports.NlsClient = NlsClient;
