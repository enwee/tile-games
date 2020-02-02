import React from "react";
import axios from "axios";
import MatchX from "./MatchX";
import QuoteBox from "../components/QuoteBox";
import WhoButton from "../components/WhoButton";
import picUrlArray from "../resources/picUrlArray";
import customQuotes from "../resources/customQuotes";
import { checkTenClicks, shuffleArray } from "../resources/functions";
import { quoteAPIurl, gcsAPIurl } from "../constants/index";
import "./Match2Panel.css";

class Match2Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      placeholderText: "Tomatos - Pic Search",
      picUrlArray: picUrlArray,
      quotesArray: [{ quoteText: "Loading...", author: "Anonymous" }],
      quoteId: 0,
      clickCount: []
    };
  }

  getQuotesArray = () => {
    axios(quoteAPIurl)
      .then(({ data }) => {
        const newQuotesArray = customQuotes.concat(
          shuffleArray(
            data.map(quote => ({ quoteText: quote.en, author: quote.author }))
          )
        );
        this.setState(() => ({ quotesArray: newQuotesArray }));
        this.getQuote();
      })
      .catch(error => {
        console.log("getQuotesArray>>>", error);
      })
      .finally(() => {
        // always executed
      });
  };

  getQuote = () => {
    const quoteId = Math.floor(Math.random() * this.state.quotesArray.length);
    this.setState(() => ({ quoteId: quoteId }));
  };

  getCustomQuote = author => {
    let nextClickCount = [...this.state.clickCount];
    let nextQuoteId = this.state.quoteId;
    let toggleCheat = false;
    [nextClickCount, toggleCheat] = checkTenClicks(nextClickCount, author);
    if (toggleCheat) {
      nextQuoteId = Math.floor(Math.random() * customQuotes.length);
    }
    this.setState(() => ({ quoteId: nextQuoteId, clickCount: nextClickCount }));
  };

  getPics = event => {
    if (!this.state.searchText || !(event.key === "Enter")) return;

    axios(`${gcsAPIurl}${this.state.searchText}`)
      .then(({ data }) => {
        const newPicUrlArray = data.items.map(item => {
          return item.image.thumbnailLink;
        });
        if (newPicUrlArray.length < 10) {
          this.setState(() => ({
            searchText: "",
            placeholderText: "Can't Find 10 pics"
          }));
        } else {
          this.setState(() => ({
            picUrlArray: newPicUrlArray,
            searchText: "",
            placeholderText: `${this.state.searchText} - Pics Search`
          }));
        }
      })
      .catch(error => {
        this.setState(() => ({
          searchText: "",
          placeholderText: "Failed to load"
        }));
        console.log("getPics>>>", error);
      })
      .finally(() => {
        // always executed
      });
  };

  componentDidMount() {
    this.getQuotesArray();
  }

  render() {
    const quote = this.state.quotesArray[this.state.quoteId];
    return (
      <div>
        <input
          type="text"
          placeholder={this.state.placeholderText}
          value={this.state.searchText}
          onChange={event => this.setState({ searchText: event.target.value })}
          onKeyPress={this.getPics}
        />
        <MatchX isMatch={this.getQuote} picUrlArray={this.state.picUrlArray} />
        <QuoteBox
          quote={quote.quoteText}
          author={quote.author}
          handleClick={this.getCustomQuote}
        />
        <WhoButton quote={quote} />
      </div>
    );
  }
}

export default Match2Panel;
