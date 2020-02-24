import React from "react";
import { unDeleteableIds } from "../constants/index";

const SelectorList = props => {
  const {
    selecting,
    choices,
    values,
    picList,
    picSetSelected,
    picsToMatch,
    boardCol,
    boardRow,
    updateGameState,
    getDbPicSet,
    ...rest
  } = props;
  const propsToUpdate = { picsToMatch, boardCol, boardRow };
  const MCR = ["picsToMatch", "boardCol", "boardRow"].includes(selecting);
  const isDbPicSet = values.includes(props.picSetNameId.id);
  const isNewSet = !MCR && !isDbPicSet;
  return (
    <span>
      <select
        value={MCR ? props[selecting] : props.picSetNameId.id}
        onChange={event => {
          const selected = event.target.value;

          if (MCR) {
            propsToUpdate[selecting] = Number(selected);
            updateGameState({ ...propsToUpdate, ...rest });
          }
          if (selecting === "dbPicSet") {
            getDbPicSet(selected);
          }
        }}
      >
        {isNewSet ? <option>{`${props.picSetNameId.name}*`}</option> : ""}
        {choices.map((choice, index) => (
          <option value={values[index]} key={index}>
            {choice}
            {unDeleteableIds.includes(values[index]) ? "⊛" : ""}
          </option>
        ))}
      </select>
    </span>
  );
};

export default SelectorList;
