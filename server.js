var io = require('socket.io').listen(80); // initiate socket.io server

var sessionId,token = null;
 var session= null;
var API_SECRET ='5dd0e518687ab329f83e3ea978bf3677dad9d905';
var API_KEY = '45502132';
	
var OpenTok = require('opentok'),
    opentok = new OpenTok(API_KEY, API_SECRET);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' }); // Send data to client

  // wait for the event raised by the client
  socket.on('my other event', function (data) {  
    console.log(data);
  });
});


opentok.createSession({mediaMode:'routed', archiveMode:'always'}, function(err, session) {
				if (err) return console.log(err);			
				//console.log("first time creating session",session);
				
				enterSession(session.sessionId);
				sessionId = session.sessionId;
				
				
				
				//console.log("first time creating session uper",sessionId);
				return sessionId;
			})


		// creating token
	function enterSession(v) {			
		token = opentok.generateToken(v);	
		//console.log("first time creating token uper",token);			
		return token;
	}
	
function createArchiving(sessionId)
{
	console.log("llllllll=",sessionId);
	opentok.startArchive(sessionId, { name: 'Important Presentation' }, function(err, archive) {
	  if (err) {
		return console.log("start=",err);
	  } else {
		// The id property is useful to save off into a database
		console.log("new archive:" + archive.id);
		archiveId = archive.id;
		return archiveId;
	  }
	});
}	

		

// Passing session to the client side
io.sockets.on('connection', function (socket) {
	
  socket.emit('session', {'sessionId':sessionId }); // Send data to client

  // wait for the event raised by the client
  socket.on('my other event', function (data) {  
    console.log(data);
  });
});



// Passing token to the client side
io.sockets.on('connection', function (socket) {
	
  //enterSession(sessionId);
  socket.emit('token', {'Token':token }); // Send data to client

  // wait for the event raised by the client
  socket.on('my other event', function (data) {  
    console.log(data);
  });
});


// Passing archive id to the client side
io.sockets.on('archive', function (socket) {	
  createArchiving(sessionId);
  console.log("archiving=",sessionId);
  socket.emit('archive', {'Archive':archiveId }); // Send data to client

  // wait for the event raised by the client
  socket.on('my other event', function (data) {  
    console.log(data);
  });
});



