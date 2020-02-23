import React from "react";
import "./Button.css";
import { wikipediaUrl } from "../constants/index";

const Button = ({ quote, children, picSetNameId, picArray, savePicsArray }) => {
  return (
    <button
      className="Button"
      onClick={() => {
        if (children === "Who's this?")
          window.open(quote.url || `${wikipediaUrl}${quote.author}`);
        if (children === "Save") savePicsArray(picSetNameId, picArray);
      }}
    >
      {children}
    </button>
  );
};

export default Button;
