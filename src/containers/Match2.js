import React from "react";
import "./Match2.css";
import Board from "../components/Board";
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
    let newBoardArray = Array(boardSize)
      .fill()
      .map((tile, index) => {
        const picIndex = Math.floor(index / imageDuplicates);
        return {
          isShown: false,
          image: this.props.picUrlArray[picIndex]
        };
      });
    newBoardArray = this.boardArrayShuffle(newBoardArray).map((tile, index) => {
      tile.id = index;
      return tile;
    });
    this.setState(() => ({ boardArray: newBoardArray }));
  };

  boardArrayShuffle = array => {
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
    if (tilesSelected.length === imageDuplicates - 1) {
      if (boardArray[tilesSelected[0]].image === boardArray[id].image) {
        this.props.changeQuote();
      }
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
        <div className="resetButton">
          <button onClick={this.boardArrayInit}>restart</button>
        </div>
        <div>
          <Board
            boardArray={boardArray}
            boardCol={boardCol}
            handleTileClick={this.handleTileClick}
          />
        </div>
      </div>
    );
  }
}

export default Match2;
