import React from "react";
import "./Match2Panel.css";
import Match2 from "./Match2";
import QuoteBox from "../components/QuoteBox";
import TextInputBox from "../components/TextInputBox";
import axios from "axios";

class Match2Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      quote: "Loading...",
      author: "Anonymous"
    };
  }

  getQuote = () => {
    axios("https://programming-quotes-api.herokuapp.com/quotes/random")
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

  componentDidMount() {
    this.getQuote();
  }

  render() {
    return (
      <div>
        <TextInputBox />
        <Match2 changeQuote={this.getQuote} />
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
