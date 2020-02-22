import React from "react";

const SelectorList = props => {
  const {
    selecting,
    choices,
    values,
    picList,
    updateGameState,
    getPicSet,
    picsToMatch,
    boardCol,
    boardRow,
    ...rest
  } = props;
  const propsToUpdate = { picsToMatch, boardCol, boardRow };
  return (
    <span>
      {/* <input list={selecting} />
      <datalist id={selecting}></datalist> */}
      <select
        onChange={event => {
          const selected = event.target.value;
          if (["picsToMatch", "boardCol", "boardRow"].includes(selecting)) {
            propsToUpdate[selecting] = Number(selected);
            updateGameState({ ...propsToUpdate, ...rest });
          } else getPicSet(selected);
        }}
      >
        {choices.map((choice, index) => (
          <option value={values[index]} key={choice}>
            {choice}
          </option>
        ))}
      </select>
      {/* <option></option> */}
    </span>
  );
};

export default SelectorList;
