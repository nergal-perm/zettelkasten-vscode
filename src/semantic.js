"use strict";

const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const util = require("util");

const encoding = "utf8";

module.exports.replaceIncludes = function (input, hostFileName, settings) {
    const readFile = function(fileName) {
        try {
            return fs.readFileSync(fileName, encoding);
        } catch (ex) {
            return util.format(settings.blockLocatorFileReadFailureMessageFormat, fileName);
        } //exception
    }; //readFile
    const invalidRegexMessage = util.format(settings.blockLocatorInvalidRegexMessageFormat, settings.blockLocatorRegex);
    let result = input;
    const replaceOne = function (regex) {
        const match = regex.exec(result);
        if (!match) return false; 
        if (match.length != 2) { result = invalidRegexMessage; return false; }
        const blockfileName = path.join(
            path.dirname(hostFileName),
            match[1]);
        result = result.replace(match[0], readFile(blockfileName));
        return true;
    }; //replaceOne
    try {
        const regex = new RegExp(settings.blockLocatorRegex,"g");
        do { } while (replaceOne(regex));
        return result;
    } catch (ex) {
        return input;
    } //exception
}; //replaceIncludes