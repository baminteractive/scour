var fs = require('fs')
		, _ = require('lodash')
		, path = require('path')
		, events = require('events')
		, util = require('util');

function Scour(){

	events.EventEmitter.call(this);

	this.scourFolder = function(folderPath, siteCode){
		var self = this
			, finder = require('findit').find(folderPath);

		fs.exists(folderPath, function(exists){ 
			if(!exists) throw "Folder does not exist";

			//This listens for files found
			finder.on('file', function (file) {
				// Check if file is cshtml
				if(path.extname(file) === '.cshtml'){
					var clickTagPattern = /( ?data-clicktag=['"].+?['"])( |>)/g;
					self.findAndReplace(file,clickTagPattern,"$2","click tag",function(err,file){ 
						self.emit("file",file);
					});

					var trackingPixelPattern = /<img.*((width|height)=['"]0['"] ?){2}.*\/>/g;
					self.findAndReplace(file,trackingPixelPattern,"","tracking pixel",function(err,changedfile){ self.emit("file",changedfile); });
				}

				if((path.extname(file) === '.js' || path.extname(file) === '.xml') && siteCode.length > 0){
					var pattern = RegExp(siteCode);
					self.findAndReplace(file,pattern,"","site code",function(err,changedfile){ self.emit("file",changedfile); });
				}
			});

			finder.on('end',function(){
				self.emit('end');
			})
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

					callback(err,file);
				});
			}else{
				callback(err,"",false);
			}
		});
	}
}

util.inherits(Scour,events.EventEmitter);

exports.scour = new Scour();