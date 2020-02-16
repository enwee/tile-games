import React from "react";
import axios from "axios";
import MatchX from "./MatchX";
import Settings from "./Settings";
import QuoteBox from "../components/QuoteBox";
import WhoButton from "../components/WhoButton";
import picDocument from "../resources/picDocument";
import customQuotes from "../resources/customQuotes";
import { checkTenClicks, shuffleArray } from "../resources/functions";
import { quoteAPIurl, gcsAPIurl } from "../constants/index";
import "./MatchGamePanel.css";

class MatchGamePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      picDocName: picDocument.picDocName,
      picUrlArray: picDocument.picUrlArray,
      picsToMatch: 2,
      boardCol: 4,
      boardRow: 4,
      showSettings: false,
      quotesArray: [{ quoteText: "Loading...", author: "Anonymous" }],
      quoteId: 0,
      clickCount: [] //this is for quotebox, its not the one in MatchX.js
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
    const { searchText } = this.state;
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
            searchText: "",
            //placeholderText: `${searchText} -${picsToMatch}- search`,
            picDocName: searchText,
            picUrlArray: newPicUrlArray
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
    const {
      searchText,
      picDocName,
      picUrlArray,
      picsToMatch,
      boardRow,
      boardCol,
      showSettings,
      quotesArray,
      quoteId
    } = this.state;
    return (
      <div>
        <button onClick={() => this.setState({ showSettings: !showSettings })}>
          <span role="img" aria-label="settings">
            ⚙️
          </span>
        </button>
        <input
          type="text"
          placeholder={`${picDocName} -${picsToMatch}- search`}
          value={searchText}
          onChange={event =>
            //this.setState(() => ({ searchText: event.target.value }))
            this.setState({ searchText: event.target.value })
          }
          onKeyPress={this.getPics}
        />
        {showSettings ? (
          <Settings
            picUrlArray={picUrlArray}
            picsToMatch={picsToMatch}
            boardCol={boardCol}
            boardRow={boardRow}
            boardUpdate={this.boardUpdate}
          />
        ) : (
          <div>
            <MatchX
              picUrlArray={picUrlArray}
              picsToMatch={picsToMatch}
              boardCol={boardCol}
              boardRow={boardRow}
              isMatch={this.getQuote}
            />
            <QuoteBox
              quote={quotesArray[quoteId].quoteText}
              author={quotesArray[quoteId].author}
              handleClick={this.getCustomQuote}
            />
            <WhoButton quote={quotesArray[quoteId]} />
          </div>
        )}
      </div>
    );
  };
}

export default MatchGamePanel;
