import React from "react";
import "./Tile.css";

const Tile = ({ id, isShown, image, handleTileClick, cheatMode }) => {
  let classNameString = "tile";
  let imgSrcUrl = isShown ? image : `${process.env.PUBLIC_URL}/logo192.png`;
  if (!isShown && cheatMode) {
    imgSrcUrl = image;
    classNameString += " opacity";
  }
  return (
    <img
      className={classNameString}
      src={imgSrcUrl}
      alt={id}
      onClick={handleTileClick}
    />
  );
};

export default Tile;
