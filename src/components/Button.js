import React from "react";
import "./Button.css";
import { wikipediaUrl } from "../constants/index";

const Button = ({
  quote,
  children,
  picSetNameId,
  picArray,
  savePicSet,
  deletePicSet
}) => {
  return (
    <button
      className="Button"
      onClick={() => {
        if (children === "Who's this?")
          window.open(quote.url || `${wikipediaUrl}${quote.author}`);
        if (children === "Save") savePicSet(picSetNameId, picArray);
        if (children === "Delete") deletePicSet(picSetNameId);
      }}
    >
      {children}
    </button>
  );
};

export default Button;
