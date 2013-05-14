var scour = require('../main').scour
	, fs = require('fs');

describe("find and replace",function(){
	it("should read in the file contents and replace any occurances of the pattern",function(){
		var resultingData;

		spyOn(fs,'readFile').andCallFake(function(filename,options,callback){
			callback(null,"foo bar");
		});

		spyOn(fs,'writeFile').andCallFake(function(file,data,callback){
			resultingData = data;
		})

		scour.findAndReplace("/",new RegExp("foo"),"");

		expect(fs.readFile).toHaveBeenCalled();
		expect(fs.writeFile).toHaveBeenCalled();

		expect(resultingData).toBe(" bar");
	});

	it("should fire a callback when it is finished",function(){
		var result, done;

		var mockCallback = function(err,file){
			result = file;
			done = true;
		};

		runs(function(){
			done = false;

			spyOn(fs,'readFile').andCallFake(function(filename,options,callback){
				callback(null,"foo bar");
			});

			spyOn(fs,'writeFile').andCallFake(function(file,data,callback){
				mockCallback("",data);
			});

			scour.findAndReplace("/",new RegExp("foo"),"foo","foo",mockCallback);
		});

		waitsFor(function() {
      return done;
    }, "Should have returned a file by now", 2000);

		runs(function() {
      expect(result).toBeGreaterThan(" bar");
    });
	});

	it("should fire the callback with an empty result, no error, and match as false if there is nothing to replace",function(){
		var result, done;

		var mockCallback = function(err,file,match){
			result = match;
			done = true;
		};

		runs(function(){
			done = false;

			spyOn(fs,'readFile').andCallFake(function(filename,options,callback){
				callback(null,"foo bar");
			});

			scour.findAndReplace("/foo.txt",new RegExp("baz"),"foo","foo",mockCallback);
		});

		waitsFor(function() {
      return done;
    }, "Should have returned a file by now", 2000);

		runs(function() {
      expect(result).toBe(false);
    });
	});

	it("should throw an exception if there was an error reading the file",function(){
		spyOn(fs,'readFile').andCallFake(function(file,encoding,callback){
			callback("There is an error","");
		});

		var test = function(){
			scour.findAndReplace("/",new RegExp("foo"),"");
		};

		expect(test).toThrow();
	});

	it("should throw an exception if there was an error writing to the file",function(){
		spyOn(fs,'readFile').andCallFake(function(file,encoding,callback){
			callback(null,"foo bar");
		});

		spyOn(fs,'writeFile').andCallFake(function(file,data,callback){
			callback("There was an error writing to the file");
		});

		var test = function(){
			scour.findAndReplace("/",new RegExp("foo"),"");
		}

		expect(test).toThrow();
	});

	it("should call the callback when it is finished writing to the file",function(){
		// var result, done;

		// var mockCallback = function(err,file){
		// 	result = file;
		// 	done = true;
		// }

		// runs(function(){
		// 	spyOn(fs,'readFile').andCallFake(function(file,encoding,callback){
		// 		callback(null,"foo bar");
		// 	});

		// 	spyOn(fs,'writeFile').andCallFake(function(file,data,callback){
		// 		mockCallback
		// 	});


		// });
		
	})
});