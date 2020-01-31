import React from "react";
import "./Tile.css";

const Tile = ({ tileId, isShown, image, handleTileClick, cheatMode }) => {
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
      alt={`tile${tileId}`}
      myprop="value"
      onClick={() => handleTileClick(tileId)}
    />
  );
};

export default Tile;
