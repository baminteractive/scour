# Scour

Scour will remove data-clicktags, tracking pixels, and site codes from all the files in a folder.

## Usage

```
node app.js --dir [project directory] --siteCode [[omniture site code]]
```

Scour uses regular exporessions to process each file in the project folder and replace those elments with appropriate empty elements.