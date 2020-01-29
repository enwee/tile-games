import React from "react";
import "./QuoteBox.css";

const QuoteBox = ({ quote, author }) => {
  return (
    <div>
      <div className="quote">{`' ${quote} '`}</div>
      <div className="author">{`- ${author}`}</div>
    </div>
  );
};

export default QuoteBox;
