import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../components/Button";
import quoteSet from "../resources/customQuotes";
import { backEndUrl } from "../resources/constants";
import { checkTenClicks } from "../resources/functions";
import "./QuoteBox.css";

const QuoteBox = score => {
  const [quotesArray, setQuotesArray] = useState([
    { quote: "Loading...", author: "Anonymous" }
  ]);
  const [quoteId, setQuoteId] = useState(0);
  const [clickCount, setClickCount] = useState([]);

  useEffect(() => {
    axios(`${backEndUrl}/quotes/Programming`)
      .then(({ data }) => {
        const newQuotesArray = quoteSet.quotes.concat(data);
        setQuotesArray(newQuotesArray);
      })
      .catch(error => {
        console.log("getQuotesArray>>>", error);
      })
      .finally(); // always executed
  }, []);

  useEffect(() => {
    const quoteId = Math.floor(Math.random() * quotesArray.length);
    setQuoteId(quoteId);
  }, [quotesArray.length, score]);

  const getCustomQuote = author => {
    let nextClickCount = clickCount;
    let nextQuoteId = quoteId;
    let toggleCheat = false;
    [nextClickCount, toggleCheat] = checkTenClicks(nextClickCount, author);
    if (toggleCheat) {
      nextQuoteId = Math.floor(Math.random() * quoteSet.quotes.length);
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
      >
        {`- ${quotesArray[quoteId].author}`}
      </div>
      <br />
      <Button quote={quotesArray[quoteId]}>Who's this?</Button>
    </div>
  );
};

export default QuoteBox;
