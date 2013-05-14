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
});