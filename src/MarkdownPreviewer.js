"use strict";

const vscode = require("vscode");
const path = require("path");
const util = require("util");

const Infomaps = require('./Infomaps');
const semantic = require("./semantic");

const previewAuthority = "zettelkasten-markdown-preview";

const settings = (function(){
    const infomapSection = vscode.workspace.getConfiguration("zettel.infomap");
    return {
        blockLocatorRegex: infomapSection["blockLocatorRegex"],
        blockLocatorInvalidRegexMessageFormat: infomapSection["blockLocatorInvalidRegexMessageFormat"],
        blockLocatorFileReadFailureMessageFormat: infomapSection["blockLocatorFileReadFailureMessageFormat"],
    };
}());

const markdownIt = (function () { 
    const extension = vscode.extensions.getExtension("Microsoft.vscode-markdown");
    if (!extension) return;
    const extensionPath = path.join(extension.extensionPath, "node_modules");
    let md = require(path.join(extensionPath, "markdown-it"))({
        html: true,
        breaks: true,
        linkify: true,
        typographer: true
    });
    md.use(require("markdown-it-sub"))
        .use(require("markdown-it-sup"))
        .use(require("markdown-it-container"), "tags")
        .use(require("markdown-it-footnote"))
        .use(require("markdown-it-katex"));
    return md;
})();

const transcodeText = async function (previewSourceTextEditor) {
    if (!previewSourceTextEditor)
    vscode.window.showErrorMessage("Open Markdown file (.md)");
    let text = previewSourceTextEditor.document.getText();

    // source text manipulations
    //  - find and transform all the infomaps regions (no nesting and title finding yet)
    text = Infomaps.createInfomaps(text);
    //  - replace all the includes
    text = await semantic.replaceIncludes(text, previewSourceTextEditor.document.fileName, settings)
    
    const result = markdownIt.render(text);
    let style = getStyles();
    return util.format('<!DOCTYPE html><html><head><title>%s</title>' + style +
        '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head>' + 
        '<body>%s</body></html>', previewSourceTextEditor.document.fileName,  result);
};

const getStyles = function() {
    const myExtension = vscode.extensions.getExtension("nergal-perm.zettelkasten");
    const myStyles = path.join(myExtension.extensionPath, "resources","mystyles.css");
    const katexStyles = path.join(myExtension.extensionPath, "resources", "katex.min.css");
    const mdExtension = vscode.extensions.getExtension("Microsoft.vscode-markdown");
    const markdownStyles = path.join(mdExtension.extensionPath, "media", "markdown.css");
    return util.format('<link href="' + myStyles + '" rel="stylesheet">' + 
    '<link href="' + katexStyles + '" rel="stylesheet">' + 
    '<link href="' + markdownStyles + '" rel="stylesheet">');
}

const previewUri = vscode.Uri.parse(util.format("%s://authority/%s", previewAuthority, previewAuthority));

const TextDocumentContentProvider = (function () {
    function TextDocumentContentProvider() {
        this.changeSourceHandler = new vscode.EventEmitter();
    }
    TextDocumentContentProvider.prototype.provideTextDocumentContent = function (uri) {
        if (this.currentSourceTextEditor) {
            return transcodeText(this.currentSourceTextEditor);
        }
    };
    Object.defineProperty(TextDocumentContentProvider.prototype, "onDidChange", {
        get: function () { 
            return this.changeSourceHandler.event; 
        }, enumerable: true, configurable: true
    });
    TextDocumentContentProvider.prototype.update = function (uri) {
        this.changeSourceHandler.fire(uri);
    };
    return TextDocumentContentProvider;
}());
const provider = new TextDocumentContentProvider();

const previewCommand = function () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    if (editor.document.languageId != "markdown")
        vscode.window.showWarningMessage("Zettelkasten Extension: Not a Markdown source");
    const fileName = editor.document.fileName;
    if (!fileName) fileName = "unsaved";
    provider.currentSourceTextEditor = editor;
    return vscode.commands.executeCommand(
        "vscode.previewHtml", previewUri, vscode.ViewColumn.Two,
        util.format("Preview '%s'", path.basename(fileName)));
};

const registration = vscode.workspace.registerTextDocumentContentProvider(previewAuthority, provider);

module.exports = {
    previewCommand: previewCommand
}