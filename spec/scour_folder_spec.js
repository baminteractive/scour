var scour = require('../main.js').scour
	, fs = require('fs')
	, events = require('events')
	, path = require('path')
	, findit = require('findit');

describe("scour folder",function(){
	var ev;

	beforeEach(function(){
		spyOn(findit,'find').andCallFake(function(folderPath){
			ev = new events.EventEmitter();
			return ev;
		});
	});

	it("should emit an event when a .cshtml file is processed",function(){
		var result
			, done;

		var eventCallback = function(file){
			result = file;
			done = true;
		};

		runs(function(){
			done = false;

			// Spy exists and always return true because no files are being called
			spyOn(fs,'exists').andCallFake(function(folderPath,callback){
				callback(true);
			});

			// Return a known path to trigger a branch of code
			spyOn(path,'extname').andCallFake(function(file){
				return '.cshtml';
			})

			// Stub out the findAndReplace method and have it trigger our callback
			spyOn(scour,'findAndReplace').andCallFake(function(file,pattern,replace,display,callback){
				callback("","foo bar");
			});

			// Set a listener for our event that should be called, supplying our callback
			scour.on("file",eventCallback);

			// Call the method to get the logic rolling
			scour.scourFolder("/","");

			//Tell findit to emit an event to trigger our logic 
			ev.emit("file","foo bar");
		});

		waitsFor(function(){
			return done;
		},"Should have fired event by now",2000);

		runs(function(){
			expect(result).toBe("foo bar");
		})
	});

	it("should emit an event when a .js file is processed",function(){
		var result
			, done;

		var eventCallback = function(file){
			result = file;
			done = true;
		};

		runs(function(){
			done = false;

			// Spy exists and always return true because no files are being called
			spyOn(fs,'exists').andCallFake(function(folderPath,callback){
				callback(true);
			});

			// Return a known path to trigger a branch of code
			spyOn(path,'extname').andCallFake(function(file){
				return '.js';
			})

			// Stub out the findAndReplace method and have it trigger our callback
			spyOn(scour,'findAndReplace').andCallFake(function(file,pattern,replace,display,callback){
				callback("","foo bar");
			});

			// Set a listener for our event that should be called, supplying our callback
			scour.on("file",eventCallback);

			// Call the method to get the logic rolling
			scour.scourFolder("/","test");

			//Tell findit to emit an event to trigger our logic 
			ev.emit("file","foo bar");
		});

		waitsFor(function(){
			return done;
		},"Should have fired event by now",2000);

		runs(function(){
			expect(result).toBe("foo bar");
		});
	});

	it("should throw if file does not exist",function(){
		// Spy exists and always return true because no files are being called
			spyOn(fs,'exists').andCallFake(function(folderPath,callback){
				callback(false);
			});

			var test = function(){
				scour.scourFolder("/","");
			};

			expect(test).toThrow();
	});

	it("should emit an event with an empty result if nothing was changed during the replace",function(){
		var result
			, done;

		var eventCallback = function(file){
			result = file;
			done = true;
		};

		runs(function(){
			done = false;

			// Spy exists and always return true because no files are being called
			spyOn(fs,'exists').andCallFake(function(folderPath,callback){
				callback(true);
			});

			// Return a known path to trigger a branch of code
			spyOn(path,'extname').andCallFake(function(file){
				return '.js';
			})

			// Stub out the findAndReplace method and have it trigger our callback
			spyOn(scour,'findAndReplace').andCallFake(function(file,pattern,replace,display,callback){
				callback("","");
			});

			// Set a listener for our event that should be called, supplying our callback
			scour.on("file",eventCallback);

			// Call the method to get the logic rolling
			scour.scourFolder("/","test");

			//Tell findit to emit an event to trigger our logic 
			ev.emit("file","foo bar");
		});

		waitsFor(function(){
			return done;
		},"Should have fired event by now",2000);

		runs(function(){
			expect(result).toBe("");
		});
	});

	it("should emit an event when all files have been processed from the folder",function(){
		var result
			, done;

		var eventCallback = function(){
			done = true;
		};

		runs(function(){
			done = false;

			// Spy exists and always return true because no files are being called
			spyOn(fs,'exists').andCallFake(function(folderPath,callback){
				callback(true);
			});

			// Set a listener for our event that should be called, supplying our callback
			scour.on("end",eventCallback);

			// Call the method to get the logic rolling
			scour.scourFolder("/","test");

			//Tell findit to emit an event to trigger our logic 
			ev.emit("end");
		});

		waitsFor(function(){
			return done;
		},"Should have fired event by now",2000);

		runs(function(){
			expect(done).toBe(true);
		});
	});

});