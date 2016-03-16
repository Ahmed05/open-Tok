var sessionId,token = null;
 var session= null;
var API_SECRET ='5dd0e518687ab329f83e3ea978bf3677dad9d905';
var API_KEY = '45502132';
var fs = require("fs");	
var OpenTok = require('opentok'),
    opentok = new OpenTok(API_KEY, API_SECRET);
	
var express = require('express');
var app = express();

/*var allowCrossDomain = function(req, res, next) {
   res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
};

app.use(function() {
    app.use(allowCrossDomain);
});*/




var http = require('http');
var fs = require('fs');
var jsonfile = require('jsonfile')

	function initializeSession()
	{	
			// If we didn't find a session, generate one and enter it
			opentok.createSession({mediaMode:'routed', archiveMode:'always'}, function(err, session) {
				if (err) return console.log(err);			
				//console.log("first time creating session",session);
				
				enterSession(session.sessionId);
				sessionId = session.sessionId;
				
				
				//Writing in file
				jsonfile.writeFile('session.json', {'session':sessionId}, function (err) {
				  if (err) return console.log(err);
				  
				});
				console.log("first time creating session uper",sessionId);
				return sessionId;
			})	
				
	}
	



	// creating token
	function enterSession(v) {			
		token = opentok.generateToken(v);			
		return token;
	}

 // read session data file
 var sess = null;
 function readSessionFile()
 {
	fs.readFile('session.json', 'utf8', function (err, data) {
		 if (err) throw err;
		  obj = JSON.parse(data);
		  console.log("OBJ=",obj.session);
		  sess = obj.session;
		  return sess;
		});
 }		
	
	
// Start Archive

var archiveId;


function startArchive ()
{
	readSessionFile();
	console.log("llllllll=",sessionId);
	opentok.startArchive(sessionId, { name: 'Important Presentation' }, function(err, archive) {
	  if (err) {
		return console.log("start=",err);
	  } else {
		// The id property is useful to save off into a database
		console.log("new archive:" + sessionId);
		archiveId = archive.id;
		return sessionId;
	  }
	});
}

//Stop Archive
function stopArchive()
{
	readSessionFile();
	opentok.stopArchive(archiveId, function(err, archive) {
	  if (err) return console.log("stop=",err);

	  console.log("Stopped archive:" + archive.id);  
	  return archive.id;
	});	
}
	
//startArchive();
//stopArchive();

app.get('/GenerateToken', function (req, res) {
   /* First read existing users.
   fs.readFile( __dirname + "/" + "token.json", 'utf8', function (err, data) {
       data = JSON.parse( data );      
       console.log( data );
       res.end( JSON.stringify(data));
   });*/
   readSessionFile();
  
   res.end(enterSession(sess));
})


// generate session api

app.get('/GenerateSession', function (req, res) {
	
	initializeSession(); // create session first.
	
   // First read existing users.
  /* fs.readFile( __dirname + "/" + "session.json", 'utf8', function (err, data) {
       data = JSON.parse( data );      
       console.log( data );
       res.end( JSON.stringify(data));
   });*/
   
  
   
	console.log("aa rha", sessionId);
	res.end(sessionId);
	
});


// Start archive 

app.get('/startArchive', function (req, res) {
	
    res.end(startArchive());
});

// Stop archive 

app.get('/stopArchive', function (req, res) {
	
    res.end(stopArchive());  
});

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)

})