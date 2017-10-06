let ZtkLinkProvider = require('./documentLinkProvider');
let vscode = require('vscode');

function activate(context) {
    let linkProvider = vscode.languages.registerDocumentLinkProvider(
        ['markdown', { language: 'markdown', pattern: '**∕*.ztk.md'}],
        ZtkLinkProvider
    );
    context.subscriptions.push(linkProvider);

    let timestampCommand = vscode.commands.registerCommand('extension.newZettelLink', function () {
		let editor = vscode.window.activeTextEditor;
		if (editor) {
			// Get the selected text
			let selection = editor.selection;
			selectedText = editor.document.getText(selection);
		};

        let edits = [
			vscode.TextEdit.insert(vscode.window.activeTextEditor.selection.active, '(z:' + Date.now() +')')
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