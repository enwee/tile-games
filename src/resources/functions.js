const checkTenClicks = (nextClickCount, tileId) => {
  let isTenClicks = false;
  nextClickCount.push(tileId);
  if (nextClickCount.every(prevTileId => prevTileId === tileId)) {
    if (nextClickCount.length >= 10) {
      isTenClicks = true;
      nextClickCount = [];
    }
  } else {
    nextClickCount = [];
  }
  return [nextClickCount, isTenClicks];
};

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export { checkTenClicks, shuffleArray };
