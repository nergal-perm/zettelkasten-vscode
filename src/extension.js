"use strict";

let ZtkLinkProvider = require("./documentLinkProvider");
let MarkdownPreviewer = require ("./MarkdownPreviewer");
let vscode = require("vscode");

function activate(context) {
    let config = vscode.workspace.getConfiguration("zettel");

    let linkProvider = ZtkLinkProvider.getLinkProvider();
    context.subscriptions.push(linkProvider);

    let timestampCommand = vscode.commands.registerCommand("extension.newZettelLink", function () {
        let edits = [
			vscode.TextEdit.insert(vscode.window.activeTextEditor.selection.active, "(" + config.get("linkPrefix") + ":" + Date.now() +")")
		];
			
		// Insert the text
        let uri = vscode.window.activeTextEditor.document.uri;
        let edit = new vscode.WorkspaceEdit();
        edit.set(uri, edits);
        vscode.workspace.applyEdit(edit);        
    });
    context.subscriptions.push(timestampCommand);

    context.subscriptions.push(vscode.commands.registerCommand("extension.showPreviewNewTab", function () {
        MarkdownPreviewer.previewCommand();
    }));

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;