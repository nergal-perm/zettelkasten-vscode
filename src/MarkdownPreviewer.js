"use strict";

const vscode = require("vscode");
const path = require("path");
const util = require("util");
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

const lazy = { markdownIt: (function () { 
    const extension = vscode.extensions.getExtension("Microsoft.vscode-markdown");
    if (!extension) return;
    const extensionPath = path.join(extension.extensionPath, "node_modules");
    let md = require(path.join(extensionPath, "markdown-it"))();
    md.use(require("markdown-it-sub"))
        .use(require("markdown-it-sup"))
        .use(require("markdown-it-container"), "tags")
        .use(require("markdown-it-footnote"))
        .use(require("markdown-it-katex"));
    return md;
})()};

const transcodeText = function (text, fileName) {
    text = semantic.replaceIncludes(text, fileName, settings);
    const result = lazy.markdownIt.render(text);
    let style = "";
    return util.format('<!DOCTYPE html><html><head><title>%s</title><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head>' + 
        '<body>%s</body></html>', fileName, result);
};

const previewOne = function (previewSourceTextEditor) {
    if (!previewSourceTextEditor)
        vscode.window.showErrorMessage("Open Markdown file (.md)");
    const text = previewSourceTextEditor.document.getText();
    return transcodeText(text, previewSourceTextEditor.document.fileName);
} //previewOne

const previewUri = vscode.Uri.parse(util.format("%s://authority/%s", previewAuthority, previewAuthority));

const TextDocumentContentProvider = (function () {
    function TextDocumentContentProvider() {
        this.changeSourceHandler = new vscode.EventEmitter();
    }
    TextDocumentContentProvider.prototype.provideTextDocumentContent = function (uri) {
        if (this.currentSourceTextEditor)
            return previewOne(this.currentSourceTextEditor);
    };
    Object.defineProperty(TextDocumentContentProvider.prototype, "onDidChange", {
        get: function () { return this.changeSourceHandler.event; }, enumerable: true, configurable: true
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