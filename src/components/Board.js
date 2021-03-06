import React from "react";
import "./Board.css";
import Tile from "./Tile";

const Board = ({ boardArray, boardCol, handleTileClick, cheatMode }) => {
  const nonZeroBasedCounting = 1;
  const jsxArray = [];
  boardArray.forEach((tile, index) => {
    jsxArray.push(
      <Tile
        tileId={tile.id}
        isShown={tile.isShown}
        isSelected={tile.isSelected}
        image={tile.image}
        fitTile={tile.fitTile}
        cheatMode={cheatMode}
        handleTileClick={handleTileClick}
        handleDragStart={() => {}}
        key={`tile${index}`}
      />
    );
    if (!((index + nonZeroBasedCounting) % boardCol)) {
      jsxArray.push(<br key={`br${index}`} />);
    }
  });
  return jsxArray;
};

export default Board;
