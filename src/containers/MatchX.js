import React from "react";
import "./MatchX.css";
import Board from "../components/Board";
import clonedeep from "lodash.clonedeep";
import { checkTenClicks, shuffleArray } from "../resources/functions";

const boardRow = 4;
const boardCol = 4;
const boardSize = boardCol * boardRow;
const picsToMatch = 2;

class MatchX extends React.Component {
  constructor({ props }) {
    super(props);
    this.state = {
      boardArray: [],
      tilesSelected: [],
      clickCount: [],
      cheatMode: false
    };
  }

  boardArrayInit = () => {
    let newBoardArray = [];
    for (let index = 0; index < boardSize; index++) {
      const picUrlIndex =
        Math.floor(index / picsToMatch) % this.props.picUrlArray.length;
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

  componentDidMount() {
    this.boardArrayInit();
  }

  componentDidUpdate(prevProps) {
    if (this.props.picUrlArray !== prevProps.picUrlArray) {
      this.boardArrayInit();
    }
  }

  handleTileClick = tileId => {
    const { boardArray, tilesSelected, clickCount, cheatMode } = this.state;
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
      if (boardArray[tilesSelected[0]].image === boardArray[tileId].image) {
        this.props.isMatch();
      }
    }
    if (tilesSelected.length === picsToMatch) {
      if (
        //todo a array.every for more than 2 matching
        boardArray[tilesSelected[0]].image !==
        boardArray[tilesSelected[1]].image
      ) {
        nextBoardArray[tilesSelected[0]].isShown = false;
        nextBoardArray[tilesSelected[1]].isShown = false;
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

  render() {
    const { boardArray } = this.state;
    return (
      <div className="matchX">
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
