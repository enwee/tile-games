import React from "react";
import axios from "axios";
import SelectorList from "../components/SelectorList";
import Tile from "../components/Tile";
import Button from "../components/Button";
import { backEndUrl } from "../resources/constants";
import picSet1 from "../resources/picSet1";
import "./Settings.css";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { picsList: [{ name: "Loading..." }], unsaved: false };
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
    [picArray[tileDragged], picArray[tileDropOn]] = 
    [picArray[tileDropOn], picArray[tileDragged]]; //prettier-ignore
    updateGameState({ picArray, ...rest });
    //this.setState({ unsaved: true }); // but not good enough
  };

  checkboxChange = index => {
    const { updateGameState, picArray, ...rest } = this.props;
    picArray[index].fitTile = !picArray[index].fitTile;
    updateGameState({ picArray, ...rest });
    //this.setState({ unsaved: true }); // but not good enough
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

  getDbPicSet = id => {
    let { updateGameState, picSetNameId, picArray, ...rest } = this.props;
    axios
      .get(`${backEndUrl}/pics/${id}`)
      .then(({ data: picSet }) => {
        const { pics, ...theRest } = picSet;
        picSetNameId = { ...theRest };
        picArray = pics;
        updateGameState({ picSetNameId, picArray, ...rest });
        this.setState({ unsaved: false });
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {}); // always executed
  };

  savePicSet = (picSetNameId, picArray) => {
    const picSet = {
      id: picSetNameId.id,
      name: picSetNameId.name,
      user: "fromfrontend",
      pics: picArray
    };
    axios
      .put(`${backEndUrl}/pics/${picSetNameId.id}`, picSet)
      .then(() => {
        this.getPicsList();
        this.setState({ unsaved: false });
      }) //statement vs function?
      .catch(error => {
        console.log(error);
      })
      .finally(() => {}); // always executed
  };
  deletePicSet = picSetNameId => {
    axios
      .delete(`${backEndUrl}/pics/${picSetNameId.id}`)
      .then(() => {
        this.getDbPicSet(picSet1.id);
        this.getPicsList();
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {}); // always executed
  };

  componentDidMount = () => {
    this.getPicsList();
  };

  // componentDidUpdate = prevProps => {
  //   if (this.props.picArray !== prevProps.picArray)
  //     this.setState({ unsaved: true });
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
            selecting="dbPicSet"
            choices={this.state.picsList.map(pic => pic.name)}
            values={this.state.picsList.map(pic => pic.id)}
            picSetNameId={picSetNameId}
            getDbPicSet={this.getDbPicSet}
          />
          <br />
          {/* {this.state.unsaved ? ( */}
          <Button
            picSetNameId={picSetNameId}
            picArray={picArray}
            savePicSet={this.savePicSet}
          >
            Save
          </Button>
          {/* ) : (
            ""
          )} */}
          {/* {this.state.loggedin ? ( */}
          <Button picSetNameId={picSetNameId} deletePicSet={this.deletePicSet}>
            Delete
          </Button>
          {/* ) : (
            ""
          )} */}
        </div>
      </div>
    );
  };
}

export default Settings;
