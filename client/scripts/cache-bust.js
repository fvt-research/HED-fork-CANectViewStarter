#!/usr/bin/env node

const md5File = require('md5-file'),
    fs = require('fs');

const buildFolder = 'www/';
const assetsFolder = buildFolder + 'build/';

const htmlFile = 'index.html';
const jsFiles = [
    'main', 'vendor', 'polyfills'
];
const cssFiles = [
    'main'
];
let replacements = [];

const errHandler = (error) => {
    if (error) {
        console.log(`ERROR: ${error}`);
    }
};

const renameFile = (input, output) => {
    if (fs.existsSync(assetsFolder + input)) {
        console.log(`Renaming ${input} to ${output}`);
        fs.rename(assetsFolder + input, assetsFolder + output, errHandler);
        replacements.push({from: input, to: output});
    }
};

const replaceInFile = (file, regex, replacement) => {
    let fileContents = fs.readFileSync(file, 'utf-8');
    fs.writeFileSync(file, fileContents.replace(regex, replacement), 'utf8', errHandler);
};

jsFiles.forEach((file) => {
    let filePath = `${assetsFolder + file}.js`;
    if (fs.existsSync(filePath)) {
        let hash = md5File.sync(filePath);
        renameFile(`${file}.js`, `${file}.${hash}.js`);
    }
});

cssFiles.forEach((file) => {
    let filePath = `${assetsFolder + file}.css`;
    if (fs.existsSync(filePath)) {
        let hash = md5File.sync(filePath);
        renameFile(`${file}.css`, `${file}.${hash}.css`);
    }
});

console.log(`Updating ${htmlFile} with revisions`);
replacements.forEach((replacementObject) => {
    replaceInFile(buildFolder + htmlFile, replacementObject.from, replacementObject.to);
});
