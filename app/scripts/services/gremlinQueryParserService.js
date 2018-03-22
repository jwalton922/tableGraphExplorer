'use strict';
angular.module('tableGraphExplorerApp').factory('GremlinQueryParser', ['$log', '$http', function ($log, $http) {

        function parseProperties(inputProperties) {
            $log.log("Parse properties",inputProperties);
            var properties = {};
            if (inputProperties) {
                for (var property in inputProperties) {
                    var propertyValueObject = inputProperties[property];
                    if (Array.isArray(propertyValueObject)) {
                        var propertyValueList = propertyValueObject;
                        var valueList = [];
                        for (var i = 0; i < propertyValueList.length; i++) {
                            var value = propertyValueList[i];
                            if (value["@value"] && value["@value"].value) {
                                valueList.push(value["@value"].value);
                            }

                        }
                        properties[property] = valueList;
                    } else {
                        $log.log("Property value is not array", propertyValueObject);
                        if (propertyValueObject["@value"] && propertyValueObject["@value"].value) {
                            properties[property] = propertyValueObject["@value"].value;
                        }
                    }
                }
            }
            return properties;
        }
        function parseVertex(vertex) {
            $log.log("Parsing vertex", vertex);
            var simplifiedVertex = {};

            simplifiedVertex.id = vertex.id;
            simplifiedVertex._id = vertex.id;
            simplifiedVertex.label = vertex.label;
            simplifiedVertex.properties = parseProperties(vertex.properties);
            return simplifiedVertex;
        }

        function parseEdge(edge) {
            $log.log("Parsing edge", edge);
            var simplifiedEdge = {};
            simplifiedEdge.inV = edge.inV;
            simplifiedEdge.outV = edge.outV;
            simplifiedEdge.label = edge.label;
            simplifiedEdge.id = edge.id;
            simplifiedEdge.properties = parseProperties(edge.properties);
            return simplifiedEdge;
        }

        function parseGremlinWrapper(obj) {
            $log.log("Parse gremlin wrapper: ", obj);
            var retValue = {vertices: [], edges: []};
            var type = obj["@type"];
            var value = obj["@value"];
            if (type === "g:Vertex") {
                retValue.vertices.push(parseVertex(value));
            } else if (type === "g:Edge") {
                retValue.edges.push(parseEdge(value));
            } else if (type === "g:List") {
                for (var i = 0; i < value.length; i++) {
                    var listRetData = parseGremlinWrapper(value[i]);
                    $log.log("List ret data", listRetData);
                    Array.prototype.push.apply(retValue.vertices, listRetData.vertices);
                    Array.prototype.push.apply(retValue.edges, listRetData.edges);
                    $log.log("After list concat", retValue);
                }
            } else if (type === "g:Map") {
                if (value && value.constructor === Array) {
                    for (var i = 0; i < value.length; i++) {
                        var listRetData = parseGremlinWrapper(value[i]);
                        Array.prototype.push.apply(retValue.vertices, listRetData.vertices);
                        Array.prototype.push.apply(retValue.edges, listRetData.edges);
                    }
                } else {
                    //assume map?
                    for (var key in value) {
                        var mapValue = value[key];
                        var mapValueRetData = parseGremlinWrapper(mapValue);
                        Array.prototype.push.apply(retValue.vertices, mapValueRetData.vertices);
                        Array.prototype.push.apply(retValue.edges, mapValueRetData.edges);
                    }
                }
            } else {
                $log.log("Unhandled gremlin type: " + type);
            }
            $log.log("parseGremlinWrapper turn data", retValue);
            return retValue;
        }

        function parseQuery(xhr) {
            if (!xhr.result || !xhr.result.data) {
                $log.log("No data result from query!", xhr);
                return null;
            }
            var data = xhr.result.data;
            var returnData = parseGremlinWrapper(data);
//            if (!data["@type"] === "g:List") {
//                $log.log("Expecting query result to be list. Received type " + data["@type"], xhr);
//            }
//            var dataList = data["@value"];
//            var returnData = {vertices: [], edges: []};
//            for (var i = 0; i < dataList.length; i++) {
//                var dataListElement = dataList[i];
//                var elementReturnData = parseGremlinWrapper(dataListElement);
//                $log.log("Element return data",elementReturnData)
//                returnData.vertices.concat(elementReturnData.vertices);
//                returnData.edges.concat(elementReturnData.edges);
//            }
            $log.log("Parse query return data", returnData);
            return returnData;
        }
        return {
            parseQuery: parseQuery
        };
    }]);
