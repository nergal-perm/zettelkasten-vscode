"use strict";

const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const util = require("util");
const stringReplaceAsync = require("string-replace-async");

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
    const replaceLink = async function (match, g1) {
        const SEARCH_PATTERN = "**/" + getFileId(g1) + "-*." + config.get("fileExtension") + ".md";
        const replacement = await vscode.workspace.findFiles(SEARCH_PATTERN, "**/node_modules/**", 1).then(foundFiles => {
            if (foundFiles.length > 0 ) {
                return readFile(foundFiles[0].fsPath);
            } else {
                return util.format("File %s not found", foundFiles[0].fsPath); 
            } 
        });
        return "\n\n" +  replacement + "\n\n";
    };
    const invalidRegexMessage = util.format(settings.blockLocatorInvalidRegexMessageFormat, settings.blockLocatorRegex);
    try {
        const regex = new RegExp(settings.blockLocatorRegex,"g");
        let processedString = "";
        await stringReplaceAsync.seq(input, regex, replaceLink).then(result => {
            processedString = result;
        });
        return processedString;
    } catch (ex) {
        return input;
    } //exception
}; //replaceIncludes