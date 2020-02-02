import React from "react";
import "./WhoButton.css";

const WhoButton = ({ customQuotes, author }) => {
  return (
    <button
      className="whoButton"
      onClick={() =>
        window.open(
          customQuotes.map(quote => quote.author).includes(author)
            ? customQuotes.filter(quote => quote.author === author)[0].url
            : `https://en.wikipedia.org/wiki/${author}`
        )
      }
    >
      Who's this?
    </button>
  );
};

export default WhoButton;
