const backEndUrl = "https://tile-games.herokuapp.com";
const quoteAPIurl = `${backEndUrl}/quotes/Programming`;

const gcsAPIurl = `https://www.googleapis.com/customsearch/v1?key=${process.env.REACT_APP_SECRET}&cx=${process.env.REACT_APP_G_CUSTOM_SEARCH}&searchType=image&imgSize=large&safe=active&q=`;

const wikipediaUrl = "https://en.wikipedia.org/wiki/";

export { backEndUrl, quoteAPIurl, gcsAPIurl, wikipediaUrl };
