import React from "react";
import "./GameBoard.css";
import Tile from "./Tile";

const GameBoard = ({ boardArray, handleTileClick }) => {
  return boardArray.map((tile, index) => {
    return (
      <Tile
        id={tile.id}
        isShown={tile.isShown}
        image={tile.image}
        handleTileClick={handleTileClick}
        key={index}
      />
    );
  });
};

export default GameBoard;
