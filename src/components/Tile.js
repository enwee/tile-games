import React from "react";
import "./Tile.css";

const Tile = ({ id, isShown, image, handleTileClick, cheatMode }) => {
  let imgTag = (
    <img
      className="tile"
      src={isShown ? image : `${process.env.PUBLIC_URL}/logo192.png`}
      alt={id}
      onClick={handleTileClick}
    />
  );
  if (!isShown && cheatMode) {
    imgTag = (
      <img
        className="tile opacity"
        src={image}
        alt={id}
        onClick={handleTileClick}
      />
    );
  }
  return imgTag;
};

export default Tile;
