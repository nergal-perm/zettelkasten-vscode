"use strict";

const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const util = require("util");

const encoding = "utf8";
const config = vscode.workspace.getConfiguration("zettel");

function getFileId(link) {
    return link.replace(config.get("linkPrefix"), "").slice(1);
}

module.exports.replaceIncludes = async function (input, hostFileName, settings) {
    const readFile = function(fileName) {
        try {
            return fs.readFileSync(fileName, encoding);
        } catch (ex) {
            return util.format(settings.blockLocatorFileReadFailureMessageFormat, fileName);
        } //exception
    }; //readFile
    const invalidRegexMessage = util.format(settings.blockLocatorInvalidRegexMessageFormat, settings.blockLocatorRegex);
    let result = input;
    const replaceOne = async function (regex) {
        const match = regex.exec(result);
        if (!match) return false; 
        if (match.length != 2) { result = invalidRegexMessage; return false; }
        const SEARCH_PATTERN = "**/" + getFileId(match[1]) + "-*." + config.get("fileExtension") + ".md";
        const blockfileName = await vscode.workspace.findFiles(SEARCH_PATTERN, "**/node_modules/**", 1).then(foundFiles => {
            if (foundFiles.length > 0 ) {
                return foundFiles[0].fsPath;
            } else { 
                return undefined; 
            } 
        });
        result = result.replace(match[0], readFile(blockfileName));
        return true;
    }; //replaceOne
    try {
        const regex = new RegExp(settings.blockLocatorRegex,"g");
        do {
         } while (await replaceOne(regex));
        return result;
    } catch (ex) {
        return input;
    } //exception
}; //replaceIncludes