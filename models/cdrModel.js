var	mongo = require('./mongoConnection'),
	Cursor = require('mongodb').Cursor;

var states = {
	AL: "Alabama", 
	AK: "Alaska", 
	AZ: "Arizona", 
	AR: "Arkansas", 
	CA: "California", 
	CO: "Colorado", 
	CT: "Connecticut", 
	DE: "Delaware", 
	DC: "District Of Columbia", 
	FL: "Florida", 
	GA: "Georgia", 
	HI: "Hawaii", 
	ID: "Idaho", 
	IL: "Illinois", 
	IN: "Indiana", 
	IA: "Iowa", 
	KS: "Kansas", 
	KY: "Kentucky", 
	LA: "Louisiana", 
	ME: "Maine", 
	MD: "Maryland", 
	MA: "Massachusetts", 
	MI: "Michigan", 
	MN: "Minnesota", 
	MS: "Mississippi", 
	MO: "Missouri", 
	MT: "Montana",
	NE: "Nebraska",
	NV: "Nevada",
	NH: "New Hampshire",
	NJ: "New Jersey",
	NM: "New Mexico",
	NY: "New York",
	NC: "North Carolina",
	ND: "North Dakota",
	OH: "Ohio", 
	OK: "Oklahoma", 
	OR: "Oregon", 
	PA: "Pennsylvania", 
	RI: "Rhode Island", 
	SC: "South Carolina", 
	SD: "South Dakota",
	TN: "Tennessee", 
	TX: "Texas", 
	UT: "Utah", 
	VT: "Vermont", 
	VA: "Virginia", 
	WA: "Washington", 
	WV: "West Virginia", 
	WI: "Wisconsin", 
	WY: "Wyoming"
};


mongo.open(function(err,db){
	console.log("open");
	db.collection('sheet1',function(err,collection){
		exports.getState = function(st, callback){
			st = st.toUpperCase();
			collection.find({ST_CD: st}).sort({DRATE_1: -1}).toArray(callback);
		};
	});

	db.collection('states', function(err,collection){
		exports.getStates = function(callback){
			collection.find({}, function(err,cursor){
				var obj = {};
				cursor.each(function(err,item){
					if(item != null){
						obj[item._id] = item.value.ST_DESC;
					}
					if(cursor.state == Cursor.CLOSED){
						callback(err,obj);
					}
				})
			});
		};
	});

	db.collection('state_averages', function(err, collection){
		exports.getStateAverages = function(cb){
			var callbackSent = false;
			collection.find({}).sort({"value.DRATE_1": 1}, function(err,cursor){
				var obj = {};
				cursor.each(function(err, item){
					if(item != null){
						obj[item._id] = {DRATE_1: item.value.DRATE_1, DRATE_2: item.value.DRATE_2, DRATE_3: item.value.DRATE_3};
					}
					if(!callbackSent && cursor.state == Cursor.CLOSED){
						cb(err,obj);
						callbackSent = true;
					}
				});
			});
		};

	});

	db.collection('zip_averages', function(err,collection){
		exports.getZipAverages = function(cb){
			var callbackSent = false;
			collection.find({},{},function(err,cursor){
				var obj = {};
				cursor.each(function(err,item){
					if(item != null){
						//console.log(item._id);
						obj[item._id] = {DRATE_1: item.value.DRATE_1, DRATE_2: item.value.DRATE_2, DRATE_3: item.value.DRATE_3};
						//console.log("obj["+item._id+"] = " + obj[item._id]);
					}
					//TODO verify this is the right way to know when it is the last item
					if(!callbackSent && cursor.state == Cursor.CLOSED){
						console.log("CALL");
						cb(err,obj); 
						callbackSent = true;
					}
				});
			});
		};
	});
});
