import React from "react";
import "./WhoButton.css";
import { wikipediaUrl } from "../constants/index";

const WhoButton = ({ quote }) => {
  return (
    <button
      className="whoButton"
      onClick={() =>
        window.open(!!quote.url ? quote.url : `${wikipediaUrl}${quote.author}`)
      }
    >
      Who's this?
    </button>
  );
};

export default WhoButton;
