import React from "react";
import "./MatchX.css";
import Board from "../components/Board";
import clonedeep from "lodash.clonedeep";

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
      cheatClickCount: [],
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
    newBoardArray = this.shuffleArray(newBoardArray).map((tile, index) => {
      tile.id = index;
      return tile;
    });
    this.setState(() => ({
      boardArray: newBoardArray,
      tilesSelected: [],
      cheatClickCount: [],
      cheatMode: false
    }));
  };

  shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
    const {
      boardArray,
      tilesSelected,
      cheatClickCount,
      cheatMode
    } = this.state;
    let nextBoardArray = clonedeep(boardArray);
    let nextTilesSelected = [...tilesSelected];
    let nextCheatClickCount = [...cheatClickCount];
    let nextCheatMode = cheatMode;

    if (boardArray[tileId].isShown) {
      nextCheatClickCount.push(tileId);
      if (nextCheatClickCount.every(prevTileId => prevTileId === tileId)) {
        if (nextCheatClickCount.length >= 10) {
          nextCheatMode = !cheatMode;
          nextCheatClickCount = [];
        }
      } else {
        nextCheatClickCount = [];
      }
      this.setState(() => ({
        cheatMode: nextCheatMode,
        cheatClickCount: nextCheatClickCount
      }));
      return;
    } else {
      nextCheatClickCount = [];
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
      cheatClickCount: nextCheatClickCount
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
