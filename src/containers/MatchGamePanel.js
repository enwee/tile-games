import React from "react";
import axios from "axios";
import MatchX from "./MatchX";
import Settings from "./Settings";
import QuoteBox from "../components/QuoteBox";
import WhoButton from "../components/WhoButton";
import picUrlArray from "../resources/picUrlArray";
import customQuotes from "../resources/customQuotes";
import { checkTenClicks, shuffleArray } from "../resources/functions";
import { quoteAPIurl, gcsAPIurl } from "../constants/index";
import "./MatchGamePanel.css";

class MatchGamePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      placeholderText: "Tomatos -2- search",
      picUrlArray: picUrlArray,
      picsToMatch: 2,
      boardCol: 4,
      boardRow: 4,
      quotesArray: [{ quoteText: "Loading...", author: "Anonymous" }],
      quoteId: 0,
      clickCount: [] //this is not the one in MatchX.js
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
    const { searchText, picsToMatch } = this.state;
    if (!searchText || !(event.key === "Enter")) return;

    axios(`${gcsAPIurl}${searchText}`)
      .then(({ data }) => {
        const newPicUrlArray = data.items.map(item => {
          return { image: item.image.thumbnailLink, fitTile: false };
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
            placeholderText: `${searchText} -${picsToMatch}- search`
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

  boardUpdate = (picUrlArray, picsToMatch, boardCol, boardRow) => {
    this.setState(() => ({
      picUrlArray: picUrlArray,
      picsToMatch: picsToMatch,
      boardCol: boardCol,
      boardRow: boardRow
    }));
  };

  componentDidMount() {
    this.getQuotesArray();
  }

  render = () => {
    const quote = this.state.quotesArray[this.state.quoteId];
    return (
      <div>
        <input
          type="text"
          placeholder={this.state.placeholderText}
          value={this.state.searchText}
          onChange={event =>
            //this.setState(() => ({ searchText: event.target.value }))
            this.setState({ searchText: event.target.value })
          }
          onKeyPress={this.getPics}
        />
        <MatchX
          picUrlArray={this.state.picUrlArray}
          picsToMatch={this.state.picsToMatch}
          boardCol={this.state.boardCol}
          boardRow={this.state.boardRow}
          isMatch={this.getQuote}
        />
        <QuoteBox
          quote={quote.quoteText}
          author={quote.author}
          handleClick={this.getCustomQuote}
        />
        <WhoButton quote={quote} />
        {/* <Settings
          picUrlArray={this.state.picUrlArray}
          picsToMatch={this.state.picsToMatch}
          boardCol={this.state.boardCol}
          boardRow={this.state.boardRow}
          boardUpdate={this.boardUpdate}
        /> */}
      </div>
    );
  };
}

export default MatchGamePanel;
