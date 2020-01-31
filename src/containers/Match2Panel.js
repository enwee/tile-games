import React from "react";
import "./Match2Panel.css";
import MatchX from "./MatchX";
import QuoteBox from "../components/QuoteBox";
import axios from "axios";
import picUrlArray from "../images/picUrlArray";

const quoteAPIurl =
  "https://programming-quotes-api.herokuapp.com/quotes/random";
const gcsAPIurl = `https://www.googleapis.com/customsearch/v1?key=${process.env.REACT_APP_SECRET}&cx=${process.env.REACT_APP_G_CUSTOM_SEARCH}&searchType=image&imgSize=large&q=`;

class Match2Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      placeholderText: "Tomatos",
      picUrlArray: picUrlArray,
      quote: "Loading...",
      author: "Anonymous"
    };
  }

  getQuote = () => {
    axios(quoteAPIurl)
      .then(({ data }) => {
        this.setState({ quote: data.en, author: data.author });
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .finally(function() {
        // always executed
      });
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
            placeholderText: this.state.searchText
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
    this.getQuote();
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
        <QuoteBox quote={this.state.quote} author={this.state.author} />
        <button
          onClick={() =>
            window.open(`https://en.wikipedia.org/wiki/${this.state.author}`)
          }
        >
          Who's this?
        </button>
      </div>
    );
  }
}

export default Match2Panel;
