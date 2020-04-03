import React from "react";
import "./Tile.css";
import reactLogo from "../resources/reactLogo192.png";

const Tile = ({
  tileId,
  isShown,
  isSelected,
  image,
  fitTile,
  cheatMode,
  notUsed,
  handleTileClick,
  handleDragStart,
  handleDragOver,
  handleDrop
}) => {
  let classNameString = "tile".concat(fitTile ? " contain" : " cover");
  let imgSrcUrl = isShown ? image : reactLogo;
  if (isSelected) classNameString += " selected";
  if ((!isShown && cheatMode) || notUsed) {
    imgSrcUrl = image;
    classNameString += " opacity";
  }
  return (
    <img
      className={classNameString}
      src={imgSrcUrl}
      alt={`tile${tileId}`}
      onClick={() => handleTileClick(tileId)}
      // draggable="true" //images and links are draggable by default
      onDragStart={event => handleDragStart(event, tileId)}
      onDragOver={handleDragOver}
      onDrop={event => handleDrop(event, tileId)}
    />
  );
};

export default Tile;
