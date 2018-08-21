'use strict';
angular.module('tableGraphExplorerApp').directive('graphQuery', [function ($log) {
        return {
            restrict: 'EA', //E = element, A = attribute, C = class, M = comment         
            scope: {
                //@ reads the attribute value, = provides two-way binding, & works with functions
                inputQuery: "="
            },
            templateUrl: '/scripts/directives/graphQuery.html',
            link: function ($scope, element, attrs) { }, //DOM manipulation
            controller: 'GraphQueryCtrl'
        };
    }
]);

angular.module('tableGraphExplorerApp').controller('GraphQueryCtrl', ['$scope', '$log', 'QueryService', 'IdService', 'GremlinQueryParser',function ($scope, $log, QueryService, IdService,GremlinQueryParser) {
        $log.log("GraphQueryCtrl Query from directive", $scope.inputQuery);
        $scope.vertices = [];
        $scope.showFilter = false;
        $scope.filters = [];
        if ($scope.inputQuery.vertices) {
            var query = "g.V()";
            $log.log("Adding id queries to query");
            for (var i = 0; i < $scope.inputQuery.vertices.length; i++) {
                var vertex = $scope.inputQuery.vertices[i];
                $scope.filters.push({filterType: "id", id: vertex.id});
            }
        }

        $scope.filterTypes = ["id", "label", "property"];
        $scope.config = {
            simpleIds: true,
            showVertexProperties: true,
            showEdgeProperties: true
        };
        $scope.offset = 0;
        $scope.limit = 5;
        $scope.query = "g.V()";
        $scope.data = {};

        $scope.addFilter = function () {
            $scope.filters.push({filterType: "property"});
        };
        $scope.addRangeToQuery = function (query) {
            return query + ".range(" + $scope.offset + "," + $scope.limit + ")";

        };

        $scope.getQuery = function () {
            var label = null;
            var ids = [];
            var props = [];
            for (var i = 0; i < $scope.filters.length; i++) {
                var filter = $scope.filters[i];
                if (filter.filterType === "id") {
                    ids.push("'" + filter.id + "'");
                } else if (filter.filterType === "label") {
                    label = "'" + filter.label + "'";
                } else {
                    var propQuery = "has('" + filter.property + "','" + filter.value + "')";
                    props.push(propQuery);
                }
            }
            var query = null;

            if (ids.length > 0) {
                query = "g.V([" + ids.join() + "])";
            } else {
                query = "g.V()";
            }
            if (label) {
                query += ".hasLabel(" + label + ")";
            }
            if (props.length > 0) {
                query += "." + props.join(".");
            }
            $log.log("Query before range: ", query);
            $scope.query = query;
            return $scope.addRangeToQuery($scope.query);
        };

        $scope.getNextPage = function () {
            $scope.data.relatedData = {vertices: [], edges: []}
            $scope.offset = parseInt($scope.offset) + parseInt($scope.limit);
            $scope.limit = parseInt($scope.limit) + parseInt($scope.limit);
            $scope.queryVertices();
        };

        $scope.getPreviousPage = function () {
            $scope.data.relatedData = {vertices: [], edges: []};
            var delta = parseInt($scope.limit) - parseInt($scope.offset);
            $scope.offset = parseInt($scope.offset) - delta;
            $scope.limit = parseInt($scope.limit) - delta;
            $scope.queryVertices();
        };
        $scope.queryVertices = function () {

            var query = $scope.getQuery();
            $log.log("Query ", query);
            QueryService.query(query, function (data) {
                $log.log("query results", data);
                var list = data["@value"];
                var dataInOldFormat = {vertices: []};
                for(var i = 0; i < list.length; i++){
                    var vertex = list[i]["@value"];
                    GremlinQueryParser.parseVertexProperties(vertex);
                    dataInOldFormat.vertices.push(vertex);
                }
                $scope.vertices = $scope.processQueryResults(null, dataInOldFormat);
                $log.log("$scope.vertiex",$scope.vertices);
                $scope.data.relatedData = {vertices: $scope.vertices, edges: []};
                //this is now due to WS so need to manually apply
                $scope.$apply();
            });

//            var queryResp = QueryService.query(query);
//            $log.log("Query resp", queryResp);
//            queryResp.then(function (data) {
//                $log.log("query results", data);
//                $scope.vertices = $scope.processQueryResults(null, data);
//                $scope.data.relatedData = {vertices: $scope.vertices, edges: []};
//            });
        };

        $scope.processQueryResults = function (vertex, data) {
            if ($scope.config.simpleIds) {
                for (var i = 0; i < data.vertices.length; i++) {
                    var id = data.vertices[i].id;
                    data.vertices[i]._id = IdService.getSimpleId(id);
                }
            }
            $log.log("Vertices",data.vertices);
            return data.vertices;
        };

        $scope.getAllNeighbors = function () {
            for (var i = 0; i < $scope.vertices.length; i++) {
                $scope.getNeighbors($scope.vertices[i]);
            }
        };


        $scope.queryVertices();
    }]);
