var http = require("http");
var url = require("url");
var mysql = require('mysql');

var pool = mysql.createPool({
  	host     : 'localhost',
  	user     : 'ecm-server',
  	password : 'mypass',
  	database : 'bgtracking'
});

var server = http.createServer(function (req, res) {
  	
    console.log(req.url)
  	var parsedUrl = url.parse(req.url, true);
  	var responseString = "";
  	
  	// post user information upon registration
	// post user location
	if (parsedUrl.pathname === "/postlocation") {
		
		req.on('data', function (data){
	  		responseString += data;
	  	});
	  	
	  	req.on('end', function(){
	  		
	  		var responseObject = JSON.parse(responseString);
	  		console.log("'postlocation' request recieved.");
	  		//var dateToday = new Date(responseObject.timestamp);
	  		
	  		pool.getConnection(function(err, connection){
        		
        		if (err){
                    console.log("'postlocation' SQL connection error.");
                            res.writeHead(503, { 'Content-Type': 'application/json', 
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Headers' : 'Content-Type'
                            });
                            res.end(JSON.stringify({"response" : "'postlocation' SQL connection error"}));
            		throw err;
        		}else{
        			//include uuid for smartphones
            		connection.query("INSERT INTO location VALUES ('firefox-fg'," + responseObject.latitude + 
            						 "," + responseObject.longitude + "," + responseObject.accuracy + "," + 
            						 responseObject.timestamp + ")", function(err, rows){
                		if (err) {
                    		console.log("'postlocation' SQL query error.");
                            res.writeHead(500, { 'Content-Type': 'application/json', 
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Headers' : 'Content-Type'
                            });
                            res.end(JSON.stringify({"response" : "'postlocation' SQL query error"}));

                            throw err;
                		}else{
                    		console.log("'postlocation' SQL query finished.");
                    		res.writeHead(201, { 'Content-Type': 'application/json', 
	    						'Access-Control-Allow-Origin': '*',
	    						'Access-Control-Allow-Headers' : 'Content-Type'
	    					});
	    					res.end(JSON.stringify({"response" : "'postlocation' success"}));
                		}
            		})
            		
            		connection.release(console.log("'postlocation' connection released!"));
        		};
    		});
	    });
	//api not found
    }else{
		res.writeHead(404, { 'Content-Type': 'application/json', 
	    	'Access-Control-Allow-Origin': '*',
	    	'Access-Control-Allow-Headers' : 'Content-Type'
	    });
	    
	    res.end(JSON.stringify({"response" : "URL not found"}));

	}
});

server.listen(8000);
console.log("Server is running.");
