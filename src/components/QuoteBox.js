import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../components/Button";
import { backEndUrl } from "../resources/constants";
import { checkTenClicks } from "../resources/functions";
import "./QuoteBox.css";

const QuoteBox = ({ score, quoteCategory }) => {
  const [quotesArray, setQuotesArray] = useState([
    { quote: "Loading...", author: "Anonymous" }
  ]);
  const [quoteId, setQuoteId] = useState(0);
  const [clickCount, setClickCount] = useState([]);

  useEffect(() => {
    axios(`${backEndUrl}/quotes/${quoteCategory}`)
      .then(({ data }) => setQuotesArray(data))
      .catch(error => {
        console.log("getQuotesArray>>>", error);
      })
      .finally(); // always executed
  }, [quoteCategory]);

  useEffect(() => {
    const quoteId = Math.floor(Math.random() * quotesArray.length);
    setQuoteId(quoteId);
  }, [quotesArray, score]);

  const getCustomQuote = author => {
    let nextClickCount = clickCount;
    let nextQuoteId = quoteId;
    let toggleCheat = false;
    [nextClickCount, toggleCheat] = checkTenClicks(nextClickCount, author);
    if (toggleCheat) {
      nextQuoteId = Math.floor(Math.random() * quotesArray.length);
    }
    setQuoteId(nextQuoteId);
    setClickCount(nextClickCount);
  };

  return (
    <div className="quoteBox">
      <div className="quote">{quotesArray[quoteId].quote}</div>
      <div
        className="author"
        onClick={() => getCustomQuote(quotesArray[quoteId].author)}
      >{`- ${quotesArray[quoteId].author}`}</div>
      <br />
      <Button quote={quotesArray[quoteId]}>Who's this?</Button>
    </div>
  );
};

export default QuoteBox;
