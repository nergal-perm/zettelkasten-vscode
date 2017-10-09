'use strict';

const vscode = require('vscode');
const path = require('path');
const config = vscode.workspace.getConfiguration("zettel");

// timestamp pattern taken here: https://stackoverflow.com/a/15967451
const LINK_PATTERN = new RegExp("\(" + config.get('linkPrefix') + ":\\d{13}\)","g");

class ZettelkastenLinkProvider {
    constructor() {
        this.document = undefined;
    }
    
    provideDocumentLinks(document) {
        this.document = document;
        let results = [];
        for (const match of this.matchAll(LINK_PATTERN, document.getText())) {
            const link = match[0];
            const linkStart = document.positionAt(match.index);
            const linkEnd = document.positionAt(match.index + link.length);
            results.push(new vscode.DocumentLink(new vscode.Range(linkStart, linkEnd)));
        }
        return results;
    };

    resolveDocumentLink(link) {
        return new Promise(resolve => {
            resolve(this.normalizeLink(link));
        });
    };

    matchAll(pattern, text){
        const out = [];
        pattern.lastIndex = 0;
        let match = null;
        while ((match = pattern.exec(text))) {
            out.push(match);
        }
        return out;
    }

    async normalizeLink(link) {
        const SEARCH_PATTERN = "**/" + this.getFileId(link) + "-*." + config.get("fileExtension") + ".md";
        const NEW_FILE_NAME = this.getFileId(link) + "-New note." + config.get("fileExtension") + ".md";
        return await vscode.workspace.findFiles(SEARCH_PATTERN, "**/node_modules/**", 1).then(result => {
            if (result.length > 0 ) {
                link.target = result[0];
            } else {
                link.target = `command:_markdown.openDocumentLink?${encodeURIComponent(JSON.stringify({ path: path.join(vscode.workspace.rootPath, NEW_FILE_NAME) }))}`;
            }
            return link;
        });
    }
    
    getFileId(link) {
        return this.document.getText(link.range).replace(config.get("linkPrefix"), "").slice(1);
    }
}

const ZtkLinkProvider = new ZettelkastenLinkProvider();
exports.getLinkProvider = function() {
    return vscode.languages.registerDocumentLinkProvider(
        ['markdown', { 
            language: 'markdown', 
            pattern: '**∕*.' + config.get('fileExtension') + '.md'}],
        ZtkLinkProvider
    )
};