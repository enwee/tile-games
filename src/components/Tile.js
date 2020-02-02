import React from "react";
import "./Tile.css";
import reactLogo from "../resources/reactLogo192.png";

const Tile = ({ tileId, isShown, image, handleTileClick, cheatMode }) => {
  let classNameString = "tile cover"; // contain is also avail
  let imgSrcUrl = isShown ? image : reactLogo;
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
