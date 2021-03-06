var	mongodb = require('mongodb'),
	sys = require('util');

var	host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var	port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : mongodb.Connection.DEFAULT_PORT;

var mongo_uri = (function(){
	if(process.env.MONGOHQ_URL){
		
		return 'mongodb://cdr_admin:phoenixITTKaplan@staff.mongohq.com:10050/app3126337'//process.env.MONGOHQ_URL;
	} else {
		return "mongodb://"+host+":"+port+"/cdr";
	}
}())



exports.open = function(callback){
	var self = this;
	mongodb.connect(mongo_uri, {auto_reconnect: true}, function(err, db){
		console.log("uri: "+mongo_uri);
		if(err){
			console.log("DB Connection error");
			console.log(err);
		} else {
			var str = "Connected to Mongo @ "+mongo_uri;
			console.log(str);
			callback(err,db);
		}
	});
};
