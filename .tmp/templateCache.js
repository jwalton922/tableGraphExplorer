angular.module('tableGraphExplorerApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/main.html',
    "<div id=\"mainQueryContainer\" class=\"row\"> <div data-ng-repeat=\"query in queries\"> <div data-graph-query input-query=\"query\"></div> </div> <!--    <div>\n" +
    "            <h4>Query</h4>\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    Offset: <input data-ng-model=\"offset\" type=\"text\" class=\"form-control input-sm\"/>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    Limit <input data-ng-model=\"limit\" type=\"text\" class=\"form-control input-sm\"/>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <textarea data-ng-model=\"query\" rows=\"3\" cols=\"90\"></textarea>\n" +
    "            <div><button class=\"btn btn-danger\" data-ng-click=\"queryVertices()\">Query</button></div>\n" +
    "        </div>\n" +
    "        <nested-row-display data-ng-if=\"data.relatedData\" data-relateddata=\"data.relatedData\" data-showvertexproperties=\"config.showVertexProperties\" data-showedgeproperties=\"config.showEdgeProperties\" data-parentvertex=\"{{vertex.id}}\"></nested-row-display>\n" +
    "        <div>\n" +
    "            <span><button data-ng-click=\"getPreviousPage()\" data-ng-show=\"offset > 0\" >Previous</button></span>\n" +
    "            <span><button data-ng-click=\"getNextPage()\">Next</button></span>\n" +
    "        </div>--> </div>"
  );

}]);
