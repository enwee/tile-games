import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../components/Button";
import quoteSet from "../resources/customQuotes";
import { backEndUrl } from "../resources/constants";
import { checkTenClicks, shuffleArray } from "../resources/functions";
import "./QuoteBox.css";

const QuoteBox = () => {
  const [quotesArray, setQuotesArray] = useState([
    { quote: "Loading...", author: "Anonymous" }
  ]);
  const [quoteId, setQuoteId] = useState(0);
  const [clickCount, setClickCount] = useState([]);

  const getQuotesArray = () => {
    axios(`${backEndUrl}/quotes/Warren Buffett`)
      .then(({ data }) => {
        const newQuotesArray = quoteSet.quotes.concat(shuffleArray(data));
        setQuotesArray(newQuotesArray);
        //getQuote();
      })
      .catch(error => {
        console.log("getQuotesArray>>>", error);
      })
      .finally(() => {}); // always executed
  };

  const getQuote = () => {
    const quoteId = Math.floor(Math.random() * quotesArray.length);
    setQuoteId(quoteId);
  };

  const getCustomQuote = author => {
    let nextClickCount = clickCount;
    let nextQuoteId = quoteId;
    let toggleCheat = true;
    //let toggleCheat = false;
    //[nextClickCount, toggleCheat] = checkTenClicks(nextClickCount, author);
    if (toggleCheat) {
      nextQuoteId = Math.floor(Math.random() * quotesArray.length);
      // nextQuoteId = Math.floor(Math.random() * quoteSet.quotes.length);
    }
    setQuoteId(nextQuoteId);
    setClickCount(nextClickCount);
  };

  getQuotesArray();
  // useEffect(() => {
  //   getQuotesArray();
  // }, []);

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
