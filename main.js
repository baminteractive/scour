var fs = require('fs')
		, _ = require('lodash')
		, path = require('path');

function Scour(){

	this.scourFolder = function(folderPath, siteCode){

		fs.exists(folderPath, function(exists){ 
			if(!exists) throw { message:"Folder does not exist" };

			processProjectDirectory(folderPath,siteCode);
		});
	}

	this.processProjectDirectory = function(folderPath,siteCode){
			//This sets up the file finder
		var finder = require('findit').find(folderPath);

		//This listens for files found
		finder.on('file', function (file) {
			// Check if file is cshtml
			if(path.extname(file) === '.cshtml'){
				var clickTagPattern = /( ?data-clicktag=['"].+?['"])( |>)/g;
				findAndReplace(file,clickTagPattern,"$2","click tag");

				var trackingPixelPattern = /<img.*((width|height)=['"]0['"] ?){2}.*\/>/g;
				findAndReplace(file,trackingPixelPattern,"","tracking pixel",function(){});
			}

			if((path.extname(file) === '.js' || path.extname(file) === '.xml') && siteCode.length > 0){
				var pattern = RegExp(siteCode);
				findAndReplace(file,pattern,"","site code",function(){});
			}
		});
	}

	this.findAndReplace = function(file,pattern,replace,display,callback){
		display = display || "item";

		fs.readFile(file,'utf8',function(err,text){ 
			if(err) throw err;

			if(text.match(pattern) != null && text.match(pattern) != undefined){
				var cleanedText = text.replace(pattern,replace);

				fs.writeFile(file,cleanedText,function(err){
					if(err) throw err;

					console.log("Saved " + file);
					callback(err,file);
				});
			}
		});
	}
}

exports.scour = new Scour();