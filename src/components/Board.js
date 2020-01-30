import React from "react";
import "./Board.css";
import Tile from "./Tile";

const Board = ({ boardArray, boardCol, handleTileClick, cheatMode }) => {
  const jsxArray = [];
  boardArray.forEach((tile, index) => {
    jsxArray.push(
      <Tile
        id={tile.id}
        isShown={tile.isShown}
        image={tile.image}
        handleTileClick={handleTileClick}
        cheatMode={cheatMode}
        key={index}
      />
    );
    if (!((index + 1) % boardCol)) {
      jsxArray.push(<br key={`br${index}`} />);
    }
  });
  return jsxArray;
};

export default Board;
