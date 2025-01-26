"use strict";
const common_vendor = require("../common/vendor.js");
const buttonPosition = () => {
  const buttonData = common_vendor.reactive({
    but_height: "0px",
    but_top: "0px",
    but_button: "0px"
  });
  const { height, top, bottom } = common_vendor.index.getStorageSync("buttonPosition");
  buttonData.but_height = height + "px";
  buttonData.but_top = top + "px";
  buttonData.but_button = bottom + 10 + "px";
  return {
    but_height: buttonData.but_height,
    but_top: buttonData.but_top,
    but_button: buttonData.but_button
  };
};
exports.buttonPosition = buttonPosition;
