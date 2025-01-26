"use strict";
const common_vendor = require("../common/vendor.js");
const voice_nls = require("./nls.js");
const voice_eventbus = require("./eventbus.js");
class SpeechTranscription {
  constructor(config) {
    this._event = new voice_eventbus.EventBus();
    this._config = config;
  }
  defaultStartParams() {
    return {
      format: "pcm",
      sample_rate: 16e3,
      enable_intermediate_result: true,
      enable_punctuation_prediction: true,
      enable_inverse_text_normalization: true
    };
  }
  on(which, handler) {
    this._event.off(which);
    this._event.on(which, handler);
  }
  async start(param) {
    this._client = new voice_nls.NlsClient(this._config);
    this._taskid = this._client.uuid();
    let req = {
      header: {
        message_id: this._client.uuid(),
        task_id: this._taskid,
        namespace: "SpeechTranscriber",
        name: "StartTranscription",
        appkey: this._config.appkey
      },
      payload: param,
      context: this._client.defaultContext()
    };
    return new Promise(async (resolve, reject) => {
      try {
        await this._client.start(
          //onmessage
          (msg, isBinary) => {
            if (!isBinary) {
              let str = msg.toString();
              let msgObj = JSON.parse(str);
              if (msgObj.header.name === "TranscriptionStarted") {
                this._event.emit("started", str);
                resolve(str);
              } else if (msgObj.header.name === "TranscriptionResultChanged") {
                this._event.emit("changed", str);
              } else if (msgObj.header.name === "TranscriptionCompleted") {
                this._event.emit("TranscriptionCompleted", str);
              } else if (msgObj.header.name === "SentenceBegin") {
                this._event.emit("begin", str);
              } else if (msgObj.header.name === "SentenceEnd") {
                this._event.emit("end", str);
              } else if (msgObj.header.name === "TaskFailed") {
                this._client.shutdown();
                this._client = null;
                this._event.emit("TaskFailed", str);
                this._event.emit("failed", str);
              }
            }
          },
          //onclose
          () => {
            this._event.emit("closed");
          }
        );
        this._client.send(JSON.stringify(req), false);
      } catch (error) {
        reject(error);
      }
    });
  }
  async close(param) {
    if (this._client == null) {
      return new Promise((resolve, reject) => {
        common_vendor.wx$1.nextTick(() => {
          reject("client is null");
        });
      });
    }
    let req = {
      header: {
        message_id: this._client.uuid(),
        task_id: this._taskid,
        namespace: "SpeechTranscriber",
        name: "StopTranscription",
        appkey: this._config.appkey
      },
      payload: param,
      context: this._client.defaultContext()
    };
    return new Promise((resolve, reject) => {
      this._event.off("TranscriptionCompleted");
      this._event.on(
        "TranscriptionCompleted",
        (msg) => {
          if (this._client) {
            this._client.shutdown();
            this._client = null;
          }
          this._event.emit("completed", msg);
          resolve(msg);
        }
      );
      this._event.off("TaskFailed");
      this._event.on(
        "TaskFailed",
        (msg) => {
          reject(msg);
        }
      );
      this._client.send(JSON.stringify(req), false);
    });
  }
  ctrl(param) {
    if (this._client == null) {
      throw new Error("client is null");
    }
    let req = {
      header: {
        message_id: this._client.uuid(),
        task_id: this._taskid,
        namespace: "SpeechTranscriber",
        name: "ControlTranscription",
        appkey: this._config.appkey
      },
      payload: param,
      context: this._client.defaultContext()
    };
    this._client.send(JSON.stringify(req), false);
  }
  shutdown() {
    if (this._client == null) {
      return;
    }
    this._client.shutdown();
  }
  sendAudio(data) {
    if (this._client == null) {
      return false;
    }
    this._client.send(data, true);
    return true;
  }
}
exports.SpeechTranscription = SpeechTranscription;
