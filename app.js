var fs = require('fs')
	, _ = require('lodash')
	, path = require('path')
	, argv = require('optimist')
		.usage("Usage: $0 --dir [project directory] --siteCode [omniture site code] \n\n Cleans out data-clicktags, tracking pixels, and site codes")
		.demand(['dir'])
		.argv;

var start = function(){
	console.log("Started: "+argv.dir);
	fs.exists(argv.dir, function(exists){ 
		console.log(exists ? "Found directory" : "Directory not found!!!!");
		if(!exists) process.exit(404);

		processProjectDirectory(argv.dir);
	});
};

var processProjectDirectory = function(folderPath){
		//This sets up the file finder
	var finder = require('findit').find(folderPath);

	//This listens for files found
	finder.on('file', function (file) {
		// Check if file is cshtml
		if(path.extname(file) === '.cshtml'){
			var clickTagPattern = /( ?data-clicktag=['"].+?['"])( |>)/g;
			findAndReplace(file,clickTagPattern,"$2","click tag");

			var trackingPixelPattern = /<img.*((width|height)=['"]0['"] ?){2}.*\/>/g;
			findAndReplace(file,trackingPixelPattern,"","tracking pixel");
		}

		if((path.extname(file) === '.js' || path.extname(file) === '.xml') && argv.siteCode){
			var pattern = RegExp(argv.siteCode);
			findAndReplace(file,pattern,"","site code");
		}
	});
}

function findAndReplace(file,pattern,replace,display){
	display = display || "item";

	fs.readFile(file,'utf8',function(err,text){ 
		if(err) throw err;

		if(text.match(pattern) != null && text.match(pattern) != undefined){
			console.log("Found " + display + " in " + file);

			var cleanedText = text.replace(pattern,replace);

			fs.writeFile(file,cleanedText,function(err){
				if(err) throw err;

				console.log("Saved " + file);
			});
		}
	});
}


start();