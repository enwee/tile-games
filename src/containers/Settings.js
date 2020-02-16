import React from "react";
import Tile from "../components/Tile";
import "./Settings.css";
import clonedeep from "lodash.clonedeep";
import NumSelector from "../components/NumSelector";

class Settings extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {};
  // }

  handleDragStart = (event, tileDragged) => {
    event.dataTransfer.setData("text/plain", tileDragged);
    //event.dataTransfer.effectAllowed = "move"; //default is "all"
  };

  handleDragOver = event => {
    event.preventDefault();
  };

  handleDrop = (event, tileDropOn) => {
    event.preventDefault();
    const { picUrlArray, picsToMatch, boardCol, boardRow } = this.props;
    const tileDragged = Number(event.dataTransfer.getData("text/plain"));
    const nextpicUrlArray = clonedeep(picUrlArray);
    [nextpicUrlArray[tileDragged], nextpicUrlArray[tileDropOn]] = 
    [nextpicUrlArray[tileDropOn], nextpicUrlArray[tileDragged]]; //prettier-ignore
    this.props.boardUpdate(nextpicUrlArray, picsToMatch, boardCol, boardRow);
  };

  checkboxChange = index => {
    const { picUrlArray, picsToMatch, boardCol, boardRow } = this.props;
    const nextpicUrlArray = clonedeep(picUrlArray);
    nextpicUrlArray[index].fitTile = !picUrlArray[index].fitTile;
    this.props.boardUpdate(nextpicUrlArray, picsToMatch, boardCol, boardRow);
  };

  render = () => {
    const { picUrlArray, picsToMatch, boardCol, boardRow } = this.props;
    return (
      <div className="Settings">
        {["picsToMatch", "boardCol", "boardRow"].map(select => (
          <NumSelector
            select={select}
            picUrlArray={picUrlArray}
            picsToMatch={picsToMatch}
            boardCol={boardCol}
            boardRow={boardRow}
            boardUpdate={this.props.boardUpdate}
            key={select}
          />
        ))}

        {picUrlArray.map((tile, index) => (
          <div key={`setting${index}`}>
            <Tile
              tileId={index}
              isShown="true"
              image={tile.image}
              fitTile={tile.fitTile}
              notUsed={index >= Math.ceil((boardCol * boardRow) / picsToMatch)}
              handleTileClick={() => {}}
              handleDragStart={this.handleDragStart}
              handleDragOver={this.handleDragOver}
              handleDrop={this.handleDrop}
            />
            <input
              type="checkbox"
              id={index}
              checked={tile.fitTile}
              onChange={() => this.checkboxChange(index)}
            />
            <label>Show Full Pic</label>
          </div>
        ))}
      </div>
    );
  };
}

export default Settings;
