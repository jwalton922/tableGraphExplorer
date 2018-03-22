# tableGraphExplorer
This project is for displaying in a [Tinkerpop](http://tinkerpop.apache.org/) compatible graph. It uses a bootstrap table, and lets you traverse edges by nesting tables in tables. It's not the prettiest thing in the world, but if you want to do a quick data check it can be useful.

![Image](https://user-images.githubusercontent.com/449037/37786323-03d893e8-2dc2-11e8-92ee-4a89e2f298d8.png)

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
The project will start with an initial load of data using a g.V().range(0,5). Use the <, -, or > actions to traverse the graph. The actions in the header row perform the action on all displayed vertices for that table. The action in the data rows perform the action for the vertex in that row. Below is a description of the action buttons.

### Actions
* &lt; Gets incoming edges and the source vertices
* &dash; Gets both incoming and outgoing edges and the other vertices
* &gt; Gets outgoing edges and the destination vertices
* &plus; Creates new table and initializes it with ID query of vertices
