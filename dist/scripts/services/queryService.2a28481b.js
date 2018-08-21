'use strict';
angular.module('tableGraphExplorerApp').factory('QueryService', ['$log', '$http', 'GremlinQueryParser','ConfigService', function ($log, $http, GremlinQueryParser,ConfigService) {
        $log.log("Initializing query service");
        function uuidv4() {
	  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	  });
	}
        var requestId = 0;
        return {

            query: function (query, callback) {
                var serverUrl = ConfigService.getConfig().endpoint;
                var msg = {
                    "requestId": uuidv4(),
			"op":"eval",
			"processor":"",
			"args":{"gremlin": query,
				"bindings":{},
				"language":"gremlin-groovy"}}
                requestId++;
		var data = JSON.stringify(msg);

		var ws = new WebSocket(serverUrl);
		ws.onopen = function (event){
                    console.log("Web socket opened");
			ws.send(data,{ mask: true});	
		};
		ws.onerror = function (err){
			console.log('Connection error using websocket');
			console.log(err);			
		};
		ws.onmessage = function (event){
			var response = JSON.parse(event.data);
			var data = response.result.data;			
			console.log(data);                        
                        callback(data);			
		};	
                console.log("Seding query to: "+serverUrl);
//                return $http.post(url, {gremlin: query}).then(function (xhr) {
//                    $log.log("Raw query response", xhr);
//                    return GremlinQueryParser.parseQuery(xhr.data);
//                }, function (xhr) {
//                    $log.log("Error querying data", xhr);
//                });

            }
        };
    }]);
