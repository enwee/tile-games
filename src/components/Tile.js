import React from "react";
import "./Tile.css";

const Tile = ({ id, isShown, image, handleTileClick }) => {
  return (
    <img
      className="tile"
      src={isShown ? image : `${process.env.PUBLIC_URL}/logo512.png`}
      alt={id}
      onClick={handleTileClick}
    />
  );
};

export default Tile;
