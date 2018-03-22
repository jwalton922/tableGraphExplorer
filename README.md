# tableGraphExplorer
This project is for displaying in a [Tinkerpop](http://tinkerpop.apache.org/) compatible graph. It uses a bootstrap table, and lets you traverse edges by nesting tables in tables. It's not the prettiest thing in the world, but if you want to do a quick data check it can be useful.

## Getting Started
Inside the project diretory run

* npm install
* bower install

## Serving the project locally
* grunt serve
* In browser open localhost:9000

## Building the project
* grunt build
* Outputs to dist folder

## Using TableGraphExplorer
The project will start with an initial load of data using a g.V().range(0,5).
