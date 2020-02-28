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

## HTML Template
For style and `CSS` information, refer to the [ customization guide](CUSTOM.md). 
HTML template exists in `views/index.ejs`.