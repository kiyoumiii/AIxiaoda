"use strict";
class EventBus {
  // 订阅
  on(event, fn, context) {
    if (typeof fn != "function") {
      console.error("fn must be a function");
      return;
    }
    this._stores = this._stores || {};
    (this._stores[event] = this._stores[event] || []).push({ cb: fn, ctx: context });
  }
  // 发布
  emit(event) {
    this._stores = this._stores || {};
    var store = this._stores[event], args;
    if (store) {
      store = store.slice(0);
      args = [].slice.call(arguments, 1);
      for (var i = 0, len = store.length; i < len; i++) {
        store[i].cb.apply(store[i].ctx, args);
      }
    }
  }
  // 注销
  off(event, fn) {
    this._stores = this._stores || {};
    if (!arguments.length) {
      this._stores = [];
      return;
    }
    var store = this._stores[event];
    if (!store) {
      return;
    }
    if (arguments.length === 1) {
      delete this._stores[event];
      return;
    }
    for (var i = 0, len = store.length; i < len; i++) {
      if (fn === store[i].cb) {
        store.splice(i, 1);
      }
    }
  }
}
exports.EventBus = EventBus;
