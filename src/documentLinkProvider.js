'use strict';

const vscode = require('vscode');
const path = require('path');

// timestamp pattern taken here: https://stackoverflow.com/a/15967451
const LINK_PATTERN = /\(z:\d{13}\)/g;

let thisDocument = undefined;

function matchAll(pattern, text){
	const out = [];
	pattern.lastIndex = 0;
	let match = null;
	while ((match = pattern.exec(text))) {
		out.push(match);
	}
	return out;
}

async function normalizeLink(link) {
    const SEARCH_PATTERN = "**/" + thisDocument.getText(link.range).slice(3,-1) + "-*.ztk.md";
    const NEW_FILE_NAME = thisDocument.getText(link.range).slice(3,-1) + "-New note.ztk.md";
    return await vscode.workspace.findFiles(SEARCH_PATTERN, "**/node_modules/**", 1).then(result => {
        if (result.length > 0 ) {
            link.target = result[0];
        } else {
            link.target = `command:_markdown.openDocumentLink?${encodeURIComponent(JSON.stringify({ path: path.join(vscode.workspace.rootPath, NEW_FILE_NAME) }))}`;
        }
        return link;
    });
}

function provideDocumentLinks(document, token) {
    thisDocument = document;
    let results = [];
    for (const match of matchAll(LINK_PATTERN, document.getText())) {
        const link = match[0];
        const linkStart = document.positionAt(match.index);
        const linkEnd = document.positionAt(match.index + link.length);
        results.push(new vscode.DocumentLink(new vscode.Range(linkStart, linkEnd)));
    }
    return results;
}

function resolveDocumentLink(link, token) {
    return new Promise(resolve => {
        resolve(normalizeLink(link));
    });
}

exports.provideDocumentLinks = provideDocumentLinks;
exports.resolveDocumentLink = resolveDocumentLink;