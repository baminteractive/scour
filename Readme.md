# Scour

Scour will remove data-clicktags, tracking pixels, and site codes from all the files in a folder.

## Installation

Scour is installed with `npm` the node package manager.

`npm install scour`

## Usage

```javascript

var scour = require('scour').scour;

scour.on('file',function(file){
	if(file !== "") console.log("Saved " + file);
});

scour.on('end',function(){
	console.log("Done scouring");
});

scour.scourFolder("/foo/bar","sitecode");

```