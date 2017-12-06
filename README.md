# Geops
This project is based on:
 - [bootstrap 4](https://getbootstrap.com/) for CSS
 - [d3 v4](https://d3js.org/) for data visualizations
 - [OpenLayers 4](https://openlayers.org/) for webmapping
 - [snabbdom](https://github.com/snabbdom/snabbdom) for part of HTML rendering
 - [webpack](https://webpack.js.org/) as building tool
 
Javascript in this project is written using part of the es6 syntax.

## Getting started
### Prerequisites
Having Node.js and npm installed on your machine.
### Installing dependencies
To install all dependencies, execute `npm -i` command
### Starting the project for developement
To start the project on your local machine (for development), execute `npm run start` command
### Making a production build
To make a production build (which will be located in _dist_ folder in project root directory), execute `npm run build` command
## Managing OpenLayers build
To reduce the size of OpenLayers depedency, a custom build of Openlayers is used. Following the procedure detailed in [Openlayer website](https://openlayers.org/en/latest/doc/tutorials/custom-builds.html), the file _ol.custom.json_ (located in the root directory of the project) is used as a configuration file and the command `npm run build:ol` can be used to create a custom build.