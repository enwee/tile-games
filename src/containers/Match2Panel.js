import React from "react";
import axios from "axios";
import MatchX from "./MatchX";
import QuoteBox from "../components/QuoteBox";
import WhoButton from "../components/WhoButton";
import picUrlArray from "../data/picUrlArray";
import customQuotes from "../data/customQuotes";
import "./Match2Panel.css";

const quoteAPIurl =
  "https://programming-quotes-api.herokuapp.com/quotes/lang/en";
const gcsAPIurl = `https://www.googleapis.com/customsearch/v1?key=${process.env.REACT_APP_SECRET}&cx=${process.env.REACT_APP_G_CUSTOM_SEARCH}&searchType=image&imgSize=large&q=`;

class Match2Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      placeholderText: "Tomatos - Pic Search",
      picUrlArray: picUrlArray,
      quotesArray: customQuotes,
      quote: "Loading...",
      author: "Anonymous"
    };
  }

  getQuotesArray = () => {
    axios(quoteAPIurl)
      .then(({ data }) => {
        const newQuotesArray = customQuotes.concat(
          data.map(quote => ({
            quote: quote.en,
            author: quote.author
          }))
        );
        this.setState(() => ({ quotesArray: newQuotesArray }));
        this.getQuote();
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .finally(function() {
        // always executed
      });
  };

  getQuote = () => {
    const quoteId = Math.floor(Math.random() * this.state.quotesArray.length);
    const { quote, author } = this.state.quotesArray[quoteId];
    this.setState(() => ({ quote: quote, author: author }));
  };

  customQuote = author => {
    console.log(author);
    const quoteId = Math.floor(Math.random() * customQuotes.length);
    this.setState(() => ({
      quote: this.state.quotesArray[quoteId].quote,
      author: this.state.quotesArray[quoteId].author
    }));
  };

  getPics = event => {
    const pressReturn = event.type === "keypress" && event.key === "Enter";
    if (!this.state.searchText || !pressReturn) return;

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
        console.log(">>>", error);
      })
      .finally(function() {
        // always executed
      });
  };

  componentDidMount() {
    this.getQuotesArray();
  }

  render() {
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
          quote={this.state.quote}
          author={this.state.author}
          handleClick={this.customQuote}
        />
        <WhoButton customQuotes={customQuotes} author={this.state.author} />
      </div>
    );
  }
}

export default Match2Panel;
