# Docs: Developer Guide
[[ Main README ]](../README.md)

## Javascript Files

Server-side JS:

- **index.js** - Main server-side file. Passes routes from queries to client-side.
- **queries.js** - Another server-side file, contains all the servers query routes and templates for getting information from the PSQL database.

The `public/js` folder contains all the client-side JS:
- **public / js / main.js** - contains the `ready()` function which performs setup when `views/index.ejs` loads.
- **public / js / data.js** - contains all the client-side functions for getting data from the PSQL database. Most of these are references to routes which get information on the server side, and then use this information to create additional selectors on the `data` screen, or render content.
- **public / js / graph.js** - handles creation of graphs and tables for the `graph` view of the tool. Uses chartJS.
- **public / js / map.js** - handles creation of maps and points for the `map` view. Uses ARC GIS JS API.
- **public / js / util.js** - handles odd things, such as generation of `HTML` for the template, and disabling/enabling views.

## Creating a new PSQL Query
The process of adding new server-side queries and allowing the client-side to access those functions, without providing access to the data, can be a little tricky. I have outlined the process I use here in the hopes that it will be helpful.
1. In `queries.js` create a new function to get information using a programmed query string. This should look something like the example below:
```js
...
const getSomething = (request, response) => {
    var query = 'SELECT something from SOMETABLE;'
    serverOut(query); // print the query text
    pool.query(query, (error, results) => {
        if (error) {
            throw error // error from query string
        }
        response.status(200).json(results.rows) // return the results
    })
}
module.exports = {
    ...
    getSomething, // this must match the route in index.js
    ...
}
```
2. In `index.js`, create a route so that the client-side will be able to access the routes in `queries.js`. This should look something like this:
```js
app.get('/something', q.getSomething); // should match the name in module.exports
```
3. We can now access the route from client-side. For example, in the file `public/js/data.js`. This should look something like this:
```js
function getSomthing(){
    $.ajax({
        type: 'GET',
        url: '/something', // should match the name in index.js
        success: function(response) { 
            console.table(response); // show the full result

            // a renderer could be made to use this data here
        },
        error: function(xhr, status, err) {
            console.log(xhr.responseText); // if query fails
        }
    });
}
```


## HTML Template
For style and `CSS` information, refer to the [ customization guide](CUSTOM.md). 
HTML template exists in `views/index.ejs`.