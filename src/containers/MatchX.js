import React from "react";
import "./MatchX.css";
import Board from "../components/Board";
import clonedeep from "lodash.clonedeep";
import { checkTenClicks, shuffleArray } from "../resources/functions";

class MatchX extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardArray: [],
      tilesSelected: [],
      clickCount: [],
      cheatMode: false
    };
  }

  boardArrayInit = () => {
    const { picUrlArray, picsToMatch, boardRow, boardCol } = this.props;
    let newBoardArray = [];
    for (let index = 0; index < boardRow * boardCol; index++) {
      const picUrlIndex = Math.floor(index / picsToMatch) % picUrlArray.length;
      newBoardArray.push({
        isShown: false,
        isSelected: false,
        image: picUrlArray[picUrlIndex].image,
        fitTile: picUrlArray[picUrlIndex].fitTile
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

    if (tilesSelected.length < this.props.picsToMatch) {
      nextBoardArray[tileId].isShown = true;
      nextBoardArray[tileId].isSelected = true;
      nextTilesSelected.push(tileId);
    }
    if (tilesSelected.length === this.props.picsToMatch - 1) {
      if (
        tilesSelected.every(
          tile => boardArray[tile].image === boardArray[tileId].image
        )
      ) {
        nextTilesSelected.forEach(
          tile => (nextBoardArray[tile].isSelected = false)
        );
        this.props.isMatch(); //change quote, add point, etc
      }
    }
    if (tilesSelected.length === this.props.picsToMatch) {
      if (
        !tilesSelected.every(
          tile => boardArray[tile].image === boardArray[tilesSelected[0]].image
        )
      ) {
        tilesSelected.forEach(tile => {
          nextBoardArray[tile].isShown = false;
          nextBoardArray[tile].isSelected = false;
        });
      }
      nextBoardArray[tileId].isShown = true;
      nextBoardArray[tileId].isSelected = true;
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
    if (
      this.props.picUrlArray !== prevProps.picUrlArray ||
      this.props.picsToMatch !== prevProps.picsToMatch ||
      this.props.boardRow !== prevProps.boardRow ||
      this.props.boardCol !== prevProps.boardCol
    ) {
      this.boardArrayInit();
    }
  }

  render() {
    return (
      <div className="matchX">
        <div className="resetButton">
          <button onClick={this.boardArrayInit}>restart</button>
        </div>
        <div className="board">
          <Board
            boardArray={this.state.boardArray}
            boardCol={this.props.boardCol}
            handleTileClick={this.handleTileClick}
            cheatMode={this.state.cheatMode}
          />
        </div>
      </div>
    );
  }
}

export default MatchX;
