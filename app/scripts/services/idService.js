'use strict';
angular.module('tableGraphExplorerApp').factory('IdService', ['$log', function ($log) {
        var idToSimpleMap = {};
        var simpleToIdMap = {};
        return {
            getSimpleId: function(id){
                if(!idToSimpleMap[id]){
                    var newSimpleId = Object.keys(idToSimpleMap).length + 1;
                    idToSimpleMap[id] = newSimpleId;
                    simpleToIdMap[newSimpleId] = id;
                }
                return idToSimpleMap[id];
            },
            getId: function(simpleId){
                return simpleToIdMap[simpleId];
            }
        };
    }]);

