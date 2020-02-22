import React from "react";
import axios from "axios";
import uuidv4 from "uuid/v4";
import MatchX from "./MatchX";
import Settings from "./Settings";
import QuoteBox from "../components/QuoteBox";
import Button from "../components/Button";
import picSet1 from "../resources/picSet1";
import quoteSet from "../resources/customQuotes";
import { checkTenClicks, shuffleArray } from "../resources/functions";
import { quoteAPIurl, gcsAPIurl } from "../constants/index";
import "./MatchGamePanel.css";

class MatchGamePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      picSetNameId: { name: picSet1.name, id: picSet1.id },
      picArray: picSet1.pics,
      picsToMatch: 2,
      boardCol: 4,
      boardRow: 4,
      showSettings: false,
      quotesArray: [{ quote: "Loading...", author: "Anonymous" }],
      quoteId: 0,
      clickCount: [] //this is for quotebox, its not the one in MatchX.js
    };
  }

  getQuotesArray = () => {
    axios(quoteAPIurl)
      .then(({ data }) => {
        const newQuotesArray = quoteSet.quotes.concat(shuffleArray(data));
        this.setState(() => ({ quotesArray: newQuotesArray }));
        this.getQuote();
      })
      .catch(error => {
        console.log("getQuotesArray>>>", error);
      })
      .finally(() => {}); // always executed
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
      nextQuoteId = Math.floor(Math.random() * quoteSet.quotes.length);
    }
    this.setState(() => ({ quoteId: nextQuoteId, clickCount: nextClickCount }));
  };

  getPicArray = event => {
    const { searchText } = this.state;
    if (!searchText || !(event.key === "Enter")) return;

    axios(`${gcsAPIurl}${searchText}`)
      .then(({ data }) => {
        if (data.items.length < 10) {
          this.setState(() => ({ searchText: "" })); //"Can't Find 10 pics" msg?
        } else {
          const newPicArray = data.items.map(item => ({
            image: item.image.thumbnailLink,
            fitTile: false,
            id: uuidv4()
          }));
          this.setState(() => ({
            searchText: "",
            picSetNameId: { name: searchText, id: uuidv4() },
            picArray: newPicArray
          }));
        }
      })
      .catch(error => {
        this.setState(() => ({
          searchText: "" //"Failed to load" msg to user??
        }));
        console.log("getPics>>>", error);
      })
      .finally(() => {}); // always executed
  };

  updateGameState = ({
    picSetNameId,
    picArray,
    picsToMatch,
    boardCol,
    boardRow
  }) => {
    this.setState(() => ({
      picSetNameId: picSetNameId,
      picArray: picArray,
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
      picSetNameId,
      picArray,
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
          placeholder={`${picSetNameId.name} -${picsToMatch}- search`}
          value={searchText}
          onChange={event =>
            //this.setState(() => ({ searchText: event.target.value }))
            this.setState({ searchText: event.target.value })
          }
          onKeyPress={this.getPicArray}
        />
        {showSettings ? (
          <Settings
            picSetNameId={picSetNameId}
            picArray={picArray}
            picsToMatch={picsToMatch}
            boardCol={boardCol}
            boardRow={boardRow}
            updateGameState={this.updateGameState}
          />
        ) : (
          <span>
            <MatchX
              picArray={picArray}
              picsToMatch={picsToMatch}
              boardCol={boardCol}
              boardRow={boardRow}
              isMatch={this.getQuote}
            />
            <QuoteBox
              quote={quotesArray[quoteId].quote}
              author={quotesArray[quoteId].author}
              handleClick={this.getCustomQuote}
            />
            <Button quote={quotesArray[quoteId]}>Who's this?</Button>
          </span>
        )}
      </div>
    );
  };
}

export default MatchGamePanel;
