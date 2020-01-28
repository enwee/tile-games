import React from "react";
import "./Match2.css";
import GameBoard from "../components/GameBoard";
import gcsResObj from "../gcsResObj";
import clonedeep from "lodash.clonedeep";

const boardSize = 16;
const imageRepeated = 2;

class Match2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardArray: [],
      prevTileSelected: ""
    };
  }

  boardArrayInit = () => {
    const boardArray = Array(boardSize)
      .fill()
      .map((tile, index) => {
        const picIndex = Math.floor(index / imageRepeated);
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
    const { boardArray, prevTileSelected } = this.state;

    // if no previous tile
    //   => open a close tile or close an open tile
    // if there is a previous tile
    //   => compare they are same,
    //     same do nothing, not same => close both and clear pervious state tile

    this.toggleTile(id);
    if (prevTileSelected !== "") {
      if (boardArray[prevTileSelected].image !== boardArray[id].image) {
        this.toggleTile(prevTileSelected);
        this.toggleTile(id);
        this.setState(() => {
          return { prevTileSelected: "" };
        });
      }
    } else {
      this.setState(() => {
        return { prevTileSelected: id };
      });
      console.log(this.state);
    }
  };

  toggleTile = id => {
    const copyOfBoardArray = clonedeep(this.state.boardArray).map(tile => {
      if (tile.id === id) {
        tile.isShown = !tile.isShown;
      }
      return tile;
    });

    this.setState(() => ({
      boardArray: copyOfBoardArray
    }));
  };

  render() {
    const { boardArray } = this.state;
    return (
      <div className="match2">
        <GameBoard
          boardArray={boardArray}
          handleTileClick={this.handleTileClick}
        />
      </div>
    );
  }
}

export default Match2;
