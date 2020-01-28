import React from "react";
import "./Match2.css";
import GameBoard from "../components/GameBoard";
import gcsResObj from "../gcsResObj";
import clonedeep from "lodash.clonedeep";

const boardRow = 4;
const boardCol = 4;
const boardSize = boardCol * boardRow;
const imageDuplicates = 2;

class Match2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardArray: [],
      tilesSelected: []
    };
  }

  boardArrayInit = () => {
    const boardArray = Array(boardSize)
      .fill()
      .map((tile, index) => {
        const picIndex = Math.floor(index / imageDuplicates);
        return {
          isShown: false,
          image: gcsResObj.items[picIndex].image.thumbnailLink
        };
      });
    return this.boardArrayShuffle(boardArray).map((tile, index) => {
      tile.id = index;
      return tile;
    });
  };

  boardArrayShuffle = array => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  componentDidMount() {
    this.setState(() => {
      return { boardArray: this.boardArrayInit() };
    });
  }

  handleTileClick = event => {
    const id = Number(event.target.alt);
    const { boardArray, tilesSelected } = this.state;
    let nextBoardArray = clonedeep(boardArray);
    let nextTilesSelected = [...tilesSelected];

    if (boardArray[id].isShown) return;
    if (tilesSelected.length < imageDuplicates) {
      nextBoardArray[id].isShown = true;
      nextTilesSelected.push(id);
    }
    if (tilesSelected.length === imageDuplicates) {
      if (
        boardArray[tilesSelected[0]].image !==
        boardArray[tilesSelected[1]].image
      ) {
        nextBoardArray[tilesSelected[0]].isShown = false;
        nextBoardArray[tilesSelected[1]].isShown = false;
      }
      nextBoardArray[id].isShown = true;
      nextTilesSelected = [id];
    }

    this.setState({
      boardArray: nextBoardArray,
      tilesSelected: nextTilesSelected
    });
  };

  render() {
    const { boardArray } = this.state;
    return (
      <div className="match2">
        <GameBoard
          boardArray={boardArray}
          boardCol={boardCol}
          handleTileClick={this.handleTileClick}
        />
      </div>
    );
  }
}

export default Match2;
