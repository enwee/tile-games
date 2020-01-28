import React from "react";
import "./GameBoard.css";
import Tile from "./Tile";

const GameBoard = ({ boardArray, boardCol, handleTileClick }) => {
  const jsxArray = [];
  boardArray.forEach((tile, index) => {
    jsxArray.push(
      <Tile
        id={tile.id}
        isShown={tile.isShown}
        image={tile.image}
        handleTileClick={handleTileClick}
        key={index}
      />
    );
    if (!((index + 1) % boardCol)) {
      jsxArray.push(<br />);
    }
  });
  return jsxArray;
};

export default GameBoard;
