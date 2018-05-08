'use strict';
angular.module('tableGraphExplorerApp').directive('nestedRowDisplay', [function ($log) {
        return {
            restrict: 'EA', //E = element, A = attribute, C = class, M = comment         
            scope: {
                //@ reads the attribute value, = provides two-way binding, & works with functions
                relateddata: '=',
                showvertexproperties: '=',
                showedgeproperties: '=',
                parentvertex: '@'
            },
            templateUrl: '/scripts/directives/nestedRowDisplay.html',
            link: function ($scope, element, attrs) { }, //DOM manipulation
            controller: 'NestedRowDisplayCtrl'
        };
    }
]);

angular.module('tableGraphExplorerApp').controller('NestedRowDisplayCtrl', ['$scope', '$log', 'QueryService', 'IdService', '$timeout', '$rootScope', function ($scope, $log, QueryService, IdService, $timeout, $rootScope) {
        $log.log("Nested Row Display Ctrl");
        $log.log("Related data", $scope.relateddata);
        $log.log("showvertexproperties", $scope.showvertexproperties);
        $log.log("showedgeproperties", $scope.showedgeproperties);
        $scope.vertices = [];
        $scope.traversalRelatedData = {vertices: [], edges: []};
        $scope.showEdgeColumns = false;

        $scope.newTable = function (vertex) {
            var vertices = [];
            if(vertex){
                vertices.push(vertex);
            } else {
                for(var i = 0; i < $scope.vertices.length; i++){
                    vertices.push($scope.vertices[i]);
                }
            }
            $rootScope.$broadcast('newQuery', {
                vertices: vertices
            });
        };

        $scope.processRelatedData = function () {
            for (var i = 0; i < $scope.relateddata.vertices.length; i++) {
                var vertex = $scope.relateddata.vertices[i];
                vertex._id = IdService.getSimpleId(vertex.id)
                var vertexEdge = null;
                vertex.edge = vertexEdge;
                for (var j = 0; j < $scope.relateddata.edges.length; j++) {
                    var edge = $scope.relateddata.edges[j];
                    var foundEdge = false;
                    var direction = null;
                    if (vertex.id === edge.inV) {
                        direction = "Out"
                        foundEdge = true;
                    } else if (vertex.id === edge.outV) {
                        direction = "In"
                        foundEdge = true;
                    }
                    if (foundEdge) {
                        vertexEdge = {};
                        vertexEdge.label = edge.label;
                        vertexEdge.direction = direction;
                        vertexEdge.properties = edge.properties;
                        $scope.showEdgeColumns = true;
                        break;
                    }
                }
                vertex.edge = vertexEdge;
                $log.log("Vertex edge", vertex.edge);
                $scope.vertices.push(vertex);
            }
            $log.log("vertices", $scope.vertices);
        };
        $scope.processRelatedData();
        $scope.$watch('relateddata', function () {
            $scope.vertices = [];
            $log.log("New related data");
            if ($scope.relateddata) {
                $scope.processRelatedData();
            }
        });
        $scope.getInEdges = function (vertex, offset, limit) {
            if (!offset && offset !== 0) {
                offset = 0;
            }
            if (!limit) {
                limit = 5;
            }
            var inNeighborsQuery = "g.V('" + vertex.id + "').inE().limit(" + limit + ").as('edges').outV().as('vertices').select('edges','vertices')";
            return  QueryService.query(inNeighborsQuery);
        };
        $scope.getOutEdges = function (vertex, offset, limit) {
            if (!offset && offset !== 0) {
                offset = 0;
            }
            if (!limit) {
                limit = 5;
            }
            var outNeighborsQuery = "g.V('" + vertex.id + "').outE().limit(" + limit + ").as('edges').inV().as('vertices').select('edges','vertices')";
            return QueryService.query(outNeighborsQuery);
        };

        $scope.traverseOutEdges = function (vertex) {
            $scope.traversalRelatedData = {vertices: [], edges: []};
            if (vertex) {
                $scope.getOutEdges(vertex, $scope.start, $scope.end).then(function (inData) {
                    $scope.processTraversalData(vertex, [inData]);
                });
            } else {
                for (var i = 0; i < $scope.vertices.length; i++) {
                    var thisVertex = $scope.vertices[i];
                    $timeout(function (v) {
                        $log.log("Timeout resolve vertex", v);
                        $scope.traverseOutEdges(v);
                    }, 10, true, thisVertex);
                }
            }
        };

        $scope.traverseInEdges = function (vertex) {
             $scope.traversalRelatedData = {vertices: [], edges: []};
            if (vertex) {
                $scope.getInEdges(vertex, $scope.start, $scope.end).then(function (inData) {
                    $scope.processTraversalData(vertex, [inData]);
                });
            } else {
                for (var i = 0; i < $scope.vertices.length; i++) {
                    var thisVertex = $scope.vertices[i];
                    $timeout(function (v) {
                        $log.log("Timeout resolve vertex", v);
                        $scope.traverseInEdges(v);
                    }, 10, true, thisVertex);
                }
            }
        };
        $scope.traverseBothEdges = function (vertex) {
             $scope.traversalRelatedData = {vertices: [], edges: []};
            $log.log("Getting neighbors for vertex", vertex);
            if (vertex) {
                $scope.getInEdges(vertex).then(function (inData) {
                    $log.log("In edge data", inData);
                    $scope.getOutEdges(vertex).then(function (outData) {
                        $log.log("Out edge data", outData);
                        $scope.processTraversalData(vertex, [inData, outData]);
                    });
                });
            } else {
                for (var i = 0; i < $scope.vertices.length; i++) {
                    var thisVertex = $scope.vertices[i];
                    $timeout(function (v) {
                        $log.log("Timeout resolve vertex", v);
                        $scope.traverseBothEdges(v);
                    }, 10, true, thisVertex);
                }
            }

        };

        $scope.processTraversalData = function (vertex, data) {
            var vertices = $scope.traversalRelatedData.vertices;
            var edges = $scope.traversalRelatedData.edges;
            $log.log("processTraversalData data arg",data);
            for (var i = 0; i < data.length; i++) {
                if(!data[i]){
                    continue;
                }
                Array.prototype.push.apply(vertices, data[i].vertices);
                Array.prototype.push.apply(edges, data[i].edges);
            }
            vertex.relatedData = {vertices: vertices, edges: edges};
        };
//        for(var key in $scope){
//            $log.log("Scope key: "+key);
//            if(key.indexOf('related')>=0){
//                $log.log("related data = ",$scope[key]);
//            }
//        }
    }]);