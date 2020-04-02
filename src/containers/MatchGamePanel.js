import React from "react";
import axios from "axios";
import uuidv4 from "uuid/v4";
import MatchX from "./MatchX";
import Settings from "./Settings";
import QuoteBox from "../components/QuoteBox";
import picSet1 from "../resources/picSet1";
import { gcsAPIurl } from "../resources/constants";
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
      score: 0
    };
  }

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

  updateGameState = gameStateObject => {
    this.setState(gameStateObject);
  };

  render = () => {
    const {
      searchText,
      picSetNameId,
      picArray,
      picsToMatch,
      boardRow,
      boardCol,
      showSettings,
      score
    } = this.state;
    return (
      <div>
        <button onClick={() => this.setState({ showSettings: !showSettings })}>
          <span role="img" aria-label="settings">
            {showSettings ? "Play" : "⚙️"}
          </span>
        </button>
        <input
          type="text"
          placeholder={`${picSetNameId.name} -${picsToMatch}- search`}
          value={searchText}
          onChange={event => this.setState({ searchText: event.target.value })}
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
          <>
            <MatchX
              picArray={picArray}
              picsToMatch={picsToMatch}
              boardCol={boardCol}
              boardRow={boardRow}
              isMatch={() => this.setState({ score: score + 1 })}
            />
            <QuoteBox score={score} />
          </>
        )}
      </div>
    );
  };
}

export default MatchGamePanel;
