import React from "react";

const NumSelector = props => {
  const { picUrlArray, picsToMatch, boardCol, boardRow, boardUpdate } = props;
  let match = picsToMatch,
    col = boardCol,
    row = boardRow,
    options = [];
  return (
    <select
      value={props[props.select]}
      onChange={event => {
        const numSelected = Number(event.target.value);
        switch (props.select) {
          case "picsToMatch":
            match = numSelected;
            options = [2, 3, 4, 5, 6, 7, 8];
            break;
          case "boardCol":
            col = numSelected;
            options = [4, 5, 6, 7, 8];
            break;
          case "boardRow":
            row = numSelected;
            options = [4, 5, 6, 7, 8];
            break;
          default:
        }
        boardUpdate(picUrlArray, match, col, row);
      }}
    >
      {/* does not work, did not give array */}
      {/* perhaps try jsx array, return jsx */}
      {options.map(num => (
        <option>num</option>
      ))}

      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
      <option>6</option>
      <option>7</option>
      <option>8</option>
    </select>
  );
};

export default NumSelector;
