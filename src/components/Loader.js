import React from "react";

export default ({ color = "#A4243B" }) => {
  const colorCSS = "4px solid " + color;
  return (
    <div id="ripple" className="lds-ripple">
      <div
        testid="ring_one"
        className="ring_one"
        style={{ border: colorCSS }}
      ></div>
      <div
        testid="ring_two"
        className="ring_two"
        style={{ border: colorCSS }}
      ></div>
    </div>
  );
};
