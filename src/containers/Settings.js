import React from "react";
import axios from "axios";
import SelectorList from "../components/SelectorList";
import Tile from "../components/Tile";
import Button from "../components/Button";
import { backEndUrl } from "../constants/index";
import "./Settings.css";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { picsList: [{ name: "Loading..." }] };
  }

  handleDragStart = (event, tileDragged) => {
    event.dataTransfer.setData("text/plain", tileDragged);
    //event.dataTransfer.effectAllowed = "move"; //default is "all"
  };

  handleDragOver = event => {
    event.preventDefault();
  };

  handleDrop = (event, tileDropOn) => {
    event.preventDefault();
    const { updateGameState, picArray, ...rest } = this.props;
    const tileDragged = Number(event.dataTransfer.getData("text/plain"));
    //const nextPicArray = clonedeep(picArray);
    //cannot use this even though not supposed to change prop directly
    //but updateGameState (destructures as {picArray})
    //it wont see nextPicArray, yet need to keep it as picArray,
    //for other cases of updateGameState where row/col/etc is changed
    [picArray[tileDragged], picArray[tileDropOn]] = 
    [picArray[tileDropOn], picArray[tileDragged]]; //prettier-ignore
    updateGameState({ picArray, ...rest });
  };

  checkboxChange = index => {
    const { updateGameState, picArray, ...rest } = this.props;
    picArray[index].fitTile = !picArray[index].fitTile;
    updateGameState({ picArray, ...rest });
  };

  getPicsList = () => {
    axios(`${backEndUrl}/pics`)
      .then(({ data }) => {
        this.setState({ picsList: data });
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {}); // always executed
  };

  getPicSet = id => {
    let { updateGameState, picSetNameId, picArray, ...rest } = this.props;
    axios(`${backEndUrl}/pics/${id}`)
      .then(({ data: picSet }) => {
        picSetNameId = { name: picSet.name, id: picSet.id };
        picArray = picSet.pics;
        updateGameState({ picSetNameId, picArray, ...rest });
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {}); // always executed
  };

  savePicsArray = (picSetNameId, picArray) => {
    const picSet = {
      id: picSetNameId.id,
      name: picSetNameId.name,
      user: "fromfrontend",
      pics: picArray
    };
    axios
      .put(`${backEndUrl}/pics/${picSetNameId.id}`, picSet)
      .catch(error => {
        console.log(error);
      })
      .finally(() => {}); // always executed
  };

  componentDidMount = () => {
    this.getPicsList();
  };

  // componentDidUpdate = (prevProps, prevState) => {
  //   if (prevProps) {
  //   }
  //   //this.getPicsList();
  // };

  render = () => {
    const {
      updateGameState,
      picSetNameId,
      picArray,
      picsToMatch,
      boardCol,
      boardRow
    } = this.props;
    return (
      <div className="settings">
        <div className="numSelectorGroup">
          {[
            { name: "picsToMatch", choices: [2, 3, 4, 5, 6, 7, 8] },
            { name: "boardCol", choices: [4, 5, 6, 7, 8] },
            { name: "boardRow", choices: [4, 5, 6, 7, 8] }
          ].map(selecting => (
            <span className="numSelector" key={selecting.name}>
              <label>{selecting.name === "picsToMatch" ? "Match" : ""}</label>
              <label>{selecting.name === "boardCol" ? "Columns" : ""}</label>
              <label>{selecting.name === "boardRow" ? "Rows" : ""}</label>
              <SelectorList
                selecting={selecting.name}
                choices={selecting.choices}
                values={selecting.choices}
                picSetNameId={picSetNameId}
                picArray={picArray}
                picsToMatch={picsToMatch}
                boardCol={boardCol}
                boardRow={boardRow}
                updateGameState={updateGameState}
              />
            </span>
          ))}
        </div>
        <div className="tiles">
          {picArray.map((tile, index) => (
            <div key={`tile${index}`}>
              <input
                type="checkbox"
                id={index}
                checked={tile.fitTile}
                onChange={() => this.checkboxChange(index)}
              />
              <Tile
                tileId={index}
                isShown="true"
                image={tile.image}
                fitTile={tile.fitTile}
                notUsed={
                  index >= Math.ceil((boardCol * boardRow) / picsToMatch)
                }
                handleTileClick={() => {}}
                handleDragStart={this.handleDragStart}
                handleDragOver={this.handleDragOver}
                handleDrop={this.handleDrop}
              />
            </div>
          ))}
          <SelectorList
            selecting="picSetNameId"
            choices={this.state.picsList.map(pic => pic.name)}
            values={this.state.picsList.map(pic => pic.id)}
            getPicSet={this.getPicSet}
          />
          <br />
          <Button
            picSetNameId={picSetNameId}
            picArray={picArray}
            savePicsArray={this.savePicsArray}
          >
            Save
          </Button>
        </div>
      </div>
    );
  };
}

export default Settings;
