const backEndUrl = process.env.REACT_APP_BACKEND_URL;
const quoteAPIurl = `${backEndUrl}/quotes/Programming`;

const gcsAPIurl = `https://www.googleapis.com/customsearch/v1?key=${process.env.REACT_APP_SECRET}&cx=${process.env.REACT_APP_G_CUSTOM_SEARCH}&searchType=image&imgSize=large&safe=active&q=`;

const wikipediaUrl = "https://en.wikipedia.org/wiki/";

const unDeleteableIds = [
  "984b6f93-bc67-4395-9ab7-95e97ad80918", //Colors
  "9a4058cf-7b03-481f-b1e9-529b5bfb3b4d", //Ducks
  "2af9a7dd-c5bd-4ef7-960e-564b30cbad14", //Mario
  "dd80936e-2850-463b-b9c5-bd8ba345e8e6", //Space
  "2447fbbc-0f5f-455b-ab27-d86ee283895f" //Tomatos
];

export { backEndUrl, quoteAPIurl, gcsAPIurl, wikipediaUrl, unDeleteableIds };
