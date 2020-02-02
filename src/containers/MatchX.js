import React from "react";
import "./MatchX.css";
import Board from "../components/Board";
import clonedeep from "lodash.clonedeep";
import { checkTenClicks, shuffleArray } from "../resources/functions";

const boardRow = 4;
const boardCol = 4;
//const picsToMatch = 10;
const boardSize = boardCol * boardRow;

class MatchX extends React.Component {
  constructor({ props }) {
    super(props);
    this.state = {
      boardArray: [],
      tilesSelected: [],
      clickCount: [],
      cheatMode: false,
      picsToMatch: 2
    };
  }

  boardArrayInit = () => {
    let newBoardArray = [];
    for (let index = 0; index < boardSize; index++) {
      const picUrlIndex =
        Math.floor(index / this.state.picsToMatch) %
        this.props.picUrlArray.length;
      newBoardArray.push({
        isShown: false,
        image: this.props.picUrlArray[picUrlIndex]
      });
    }
    newBoardArray = shuffleArray(newBoardArray).map((tile, index) => {
      tile.id = index;
      return tile;
    });
    this.setState(() => ({
      boardArray: newBoardArray,
      tilesSelected: [],
      clickCount: [],
      cheatMode: false
    }));
  };

  handleTileClick = tileId => {
    const {
      boardArray,
      tilesSelected,
      clickCount,
      cheatMode,
      picsToMatch
    } = this.state;
    let nextBoardArray = clonedeep(boardArray);
    let nextTilesSelected = [...tilesSelected];
    let nextClickCount = [...clickCount];
    let toggleCheat = false;

    if (boardArray[tileId].isShown) {
      [nextClickCount, toggleCheat] = checkTenClicks(nextClickCount, tileId);
      this.setState(() => ({
        cheatMode: toggleCheat ? !cheatMode : cheatMode,
        clickCount: nextClickCount
      }));
      return;
    }

    if (tilesSelected.length < picsToMatch) {
      nextBoardArray[tileId].isShown = true;
      nextTilesSelected.push(tileId);
    }
    if (tilesSelected.length === picsToMatch - 1) {
      if (
        tilesSelected.every(
          tile => boardArray[tile].image === boardArray[tileId].image
        )
      ) {
        this.props.isMatch(); //change quote, add point, etc
      }
    }
    if (tilesSelected.length === picsToMatch) {
      if (
        !tilesSelected.every(
          tile => boardArray[tile].image === boardArray[tilesSelected[0]].image
        )
      ) {
        tilesSelected.forEach(tile => (nextBoardArray[tile].isShown = false));
      }
      nextBoardArray[tileId].isShown = true;
      nextTilesSelected = [tileId];
    }
    this.setState({
      boardArray: nextBoardArray,
      tilesSelected: nextTilesSelected,
      clickCount: nextClickCount
    });
  };

  componentDidMount() {
    this.boardArrayInit();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.picUrlArray !== prevProps.picUrlArray) {
      this.boardArrayInit();
    }
    if (this.state.picsToMatch !== prevState.picsToMatch) {
      this.boardArrayInit();
    }
  }

  render() {
    const { boardArray } = this.state;
    return (
      <div className="matchX">
        <div className="matchSelector">
          <select
            value={this.state.picsToMatch}
            onChange={event => {
              const value = Number(event.target.value);
              this.setState(() => ({ picsToMatch: value }));
            }}
          >
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
          </select>
        </div>
        <div className="resetButton">
          <button onClick={this.boardArrayInit}>restart</button>
        </div>
        <div className="board">
          <Board
            boardArray={boardArray}
            boardCol={boardCol}
            handleTileClick={this.handleTileClick}
            cheatMode={this.state.cheatMode}
          />
        </div>
      </div>
    );
  }
}

export default MatchX;
