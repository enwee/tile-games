import React from "react";
import "./QuoteBox.css";

const QuoteBox = ({ quote, author, handleClick }) => {
  return (
    <div className="quoteBox">
      <div className="quote">{quote}</div>
      <div className="author" onClick={() => handleClick(author)}>
        {`- ${author}`}
      </div>
    </div>
  );
};

export default QuoteBox;
