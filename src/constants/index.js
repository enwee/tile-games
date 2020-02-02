const quoteAPIurl =
  "https://programming-quotes-api.herokuapp.com/quotes/lang/en";

const gcsAPIurl = `https://www.googleapis.com/customsearch/v1?key=${process.env.REACT_APP_SECRET}&cx=${process.env.REACT_APP_G_CUSTOM_SEARCH}&searchType=image&imgSize=large&q=`;

const wikipediaUrl = "https://en.wikipedia.org/wiki/";

export { quoteAPIurl, gcsAPIurl, wikipediaUrl };
