const recipes = {};

// function which responds with a JSON object
const respondJSON = (request, response, status, object) => {
  // object for the headers with the conte-type being JSON
  const headers = {
    'Content-Type': 'application/json',
  };

  // send response with JSON object
  response.writeHead(status, headers);

  response.write(JSON.stringify(object));
  response.end();
};

// function to respond without JSON body (HEAD requests)
const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  response.writeHead(status, headers);
  response.end();
};

// get user Object with response code of 200
const getRecipes = (request, response) => {
  // send JSON object as higher encapsulated object
  /* if empty object is sent, does not necessarily mean there is no
    recipes object.. just means there is an empty "thing" */
  const responseJSON = {
    recipes,
  };
    // user object is stringified and written in respondJSON
  return respondJSON(request, response, 200, responseJSON);
};

// add User object from POST body
const addRecipe = (request, response, body) => {
  const responseJSON = {
    message: 'Recipe name and date to cook are both required',
  };
    // make sure both fields are filled out in textboxes
  if (!body.recipe || !body.date || !body.month || !body.recipeDetails) {
    responseJSON.id = 'addRecipeMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }
  // default status code
  let responseCode = 204;

  // if user doesn't exist yet
  if (!recipes[body.recipe]) {
    // create new, empty user and set status code of 201
    responseCode = 201;
    recipes[body.recipe] = {};
  }
  // add or update fields for this user name
  recipes[body.recipe].recipe = body.recipe;
  recipes[body.recipe].recipeDetails = body.recipeDetails;
  recipes[body.recipe].meal = body.meal;
  recipes[body.recipe].month = body.month;
  recipes[body.recipe].date = body.date;




  // if response is created, set created message and semd response w/message
  if (responseCode === 201) {
    responseJSON.message = 'Recipe Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  return respondJSON(request, response, responseCode, responseJSON);
};

// get info about user object
const getRecipesMeta = (request, response) => {
  respondJSONMeta(request, response, 200);
};

const updateRecipe = (request, response) => {
  const newRecipe = {
    createdAt: Date.now(),
  };

  recipes[newRecipe.createdAt] = newRecipe;
  return respondJSON(request, response, 201, newRecipe);
  // index into object and store based on timestamp
  // normally would be added through the username, not at time user was created
};

// function for 404 GET request
const notFound = (request, response) => {
  // create error message for response
  const responseJSON = {
    message: 'The page you were looking for was not found.',
    id: 'notFound',
  };
  // return a 404 with an error message
  respondJSON(request, response, 404, responseJSON);
};
// function for 404 HEAD request
const notFoundMeta = (request, response) => {
  // returns 404 without error message
  respondJSONMeta(request, response, JSON);
};

module.exports = {
  getRecipes,
  addRecipe,
  getRecipesMeta,
  updateRecipe,
  notFound,
  notFoundMeta,
};
