let ZtkLinkProvider = require('./documentLinkProvider');
let vscode = require('vscode');

function activate(context) {
    let config = vscode.workspace.getConfiguration("zettel");

    let linkProvider = ZtkLinkProvider.getLinkProvider();
    context.subscriptions.push(linkProvider);

    let timestampCommand = vscode.commands.registerCommand('extension.newZettelLink', function () {
        let edits = [
			vscode.TextEdit.insert(vscode.window.activeTextEditor.selection.active, '(' + config.get('linkPrefix') + ":" + Date.now() +')')
		];
			
		// Insert the text
        let uri = vscode.window.activeTextEditor.document.uri;
        let edit = new vscode.WorkspaceEdit();
        edit.set(uri, edits);
        vscode.workspace.applyEdit(edit);        
    });
    context.subscriptions.push(timestampCommand);

    return {
        extendMarkdownIt(md) {
            return md.use(require('markdown-it-sub'))
                .use(require('markdown-it-sup'))
                .use(require('markdown-it-container'), "tags")
                .use(require('markdown-it-footnote'))
                .use(require('markdown-it-katex'));
        }
    }
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;