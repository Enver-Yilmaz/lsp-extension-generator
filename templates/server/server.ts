'use strict';

import {
	IPCMessageReader,
	IPCMessageWriter,
	createConnection,
	IConnection,
	TextDocumentSyncKind,
	TextDocuments,
	TextDocument,
	Diagnostic,
	DiagnosticSeverity,
	InitializeParams,
	InitializeResult,
	TextDocumentPositionParams,
	CompletionItem,
	CompletionItemKind,
	Hover,
	Files
} from 'vscode-languageserver';

import * as fs from 'fs';
import * as path from 'path';
import {
	debug
} from 'util';

/**
 * Description. Create a connection for the server. The connection uses Node's IPC as a transport
 * 
 * @author Sergio
 * 
 */
let connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));

// Listen on the connection
connection.listen();

/**
 * Description. Create a simple text document manager. The text document manager supports
 * full document sync only
 * 
 * @author Sergio
 * 
 */
let documents: TextDocuments = new TextDocuments();
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

/**
 * Description. After the server has started the client sends an initialize request.
 * The server receives in the passed params the rootPath of the workspace plus the client capabilities.
 * 
 * @author Sergio
 * 
 */
let workspaceRoot: string;


/**
 * Summary. Interface for server settings.
 * 
 * Description. The settings interface describe the server relevant settings part.
 * 
 * @author Sergio
 * 
 * @property The object representing the settings for that LanguageServer.
 */
interface Settings {
	dotLanguageServer: DotSettings;
}

/**
 * Summary. Interface for DotSettings.
 * 
 * Description. These are the example settings we defined in the client's package.json file
 * 
 * @author Sergio
 * 
 * @property Maximum number of problems accepted simultaneously by the editor.
 */
interface DotSettings {
	maxNumberOfProblems: number;
}



/**
 * Description. Holds the maxNumberOfProblems setting
 * 
 * @author Sergio
 * 
 */
let maxNumberOfProblems: number;



/**
 * #####################   COMMENTS ARE USED FOR COLORS AND SHAPES AUTOCOMPLETION	#####################	
 */



// hold a list of colors and shapes for the completion provider
//let colors: Array<string>;
//let shapes: Array<string>;

connection.onInitialize((params): InitializeResult => {
	workspaceRoot = params.rootPath;
	//	colors = new Array<string>();
	//	shapes = new Array<string>();

	return {
		capabilities: {
			// Tell the client that the server works in FULL text document sync mode
			textDocumentSync: documents.syncKind,
			// Tell the client that the server support code complete
			/*completionProvider: {
				resolveProvider: false,
				"triggerCharacters": ['=']
			},*/
			hoverProvider: false
		}
	}
});



// The settings have changed. Is send on server activation
// as well.
connection.onDidChangeConfiguration((change) => {
	let settings = < Settings > change.settings;
	maxNumberOfProblems = settings.dotLanguageServer.maxNumberOfProblems || 100;
	// Revalidate any open text documents
	documents.all().forEach(validateDotDocument);
})

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent((change) => {
	validateDotDocument(change.document);
});

/**
 * Hold the object for the request npm package
 * 
 * @author Sergio
 * 
 */
var request = require('request');

/**
 * Description. Array for the names contained on the diagnostics.
 * 
 * @author Sergio
 * 
 */
let names: Array < any > ;

/**
 * Summary. Sends the document to the language processor.
 *
 * Description. This method establishes a connection via HTTP to a given port where the language processor
 * will be deployed. It will send a request containing the text of the document opened by the user in order
 * to validate its content.
 * The language processor will return a diagnostic for that content and this method will push it back to
 * the client.
 *
 * @author Sergio
 * 
 * @access public
 * 
 */
function validateDotDocument(textDocument: TextDocument): void {

	let diagnostics: Diagnostic[] = [];

	request.post({
		url: 'http://localhost:3000',
		body: textDocument.getText(),
		headers: {
			'Content-Type': 'text/plain'
		}
	}, function optionalCallback(err, httpResponse, body) {
		//request.post({ url: 'http://localhost:3000', body: textDocument.getText(), headers: { 'Content-Type': 'text/html; charset=utf-8' } }, function optionalCallback(err, httpResponse, body) {
		let messages = JSON.parse(body).errors;
		names = JSON.parse(body).names;

		let lines = textDocument.getText().split(/\r?\n/g);
		let problems = 0;

		for (var i = 0; i < messages.length && problems < maxNumberOfProblems; i++) {
			problems++;

			if (messages[i].length == 0 && lines[i] !== undefined)
				messages[i].length = lines[i].length - messages[i].character;

			diagnostics.push({
				severity: DiagnosticSeverity.Error,
				range: {
					start: {
						line: messages[i].line,
						character: messages[i].character
					},
					end: {
						line: messages[i].line,
						character: messages[i].character + messages[i].length
					}
				},
				message: messages[i].message,
				source: 'ex'
			});
		}
		// Send the computed diagnostics to VSCode.
		connection.sendDiagnostics({
			uri: textDocument.uri,
			diagnostics
		});
	});
}



/**
 * #####################   HOVER	#####################	



connection.onHover(({ textDocument, position }): Hover => {
	for (var i = 0; i < names.length; i++) {
		if (names[i].line == position.line
			&& (names[i].start <= position.character && names[i].end >= position.character)) {
			// we return an answer only if we find something
			// otherwise no hover information is given
			return {
				contents: names[i].text
			};
		}
	}
});



 * #####################   END HOVER	#####################	
 */



/**
 * #####################   COMMON	#####################	
 */



 /**
 * Summary. Loads a document given its URI.
 *
 * Description. This method receives a string containing the URI for the document that will be observed.
 * It will create an instance of this document to manage its content. 
 *
 * @author Sergio
 * 
 * @access public
 * 
 * @constructs
 * 
 */
function fromUri(document: {
	uri: string;
}) {
	return Files.uriToFilePath(document.uri);
}



/**
 * #####################   USED FOR AUTOCOMPLETION	#####################	


connection.onCompletion((textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
	let text = documents.get(textDocumentPosition.textDocument.uri).getText();
	let lines = text.split(/\r?\n/g);
	let position = textDocumentPosition.position;

	if (colors.length == 0)
		colors = loadColors();

	if (shapes.length == 0)
		shapes = loadShapes();

	let start = 0;

	for (var i = position.character; i >= 0; i--) {
		if (lines[position.line][i] == '=') {
			start = i;
			i = 0;
		}
	}

	if (start >= 5
		&& lines[position.line].substr(start - 5, 5) == "color") {
		let results = new Array<CompletionItem>();
		for (var a = 0; a < colors.length; a++) {
			results.push({
				label: colors[a],
				kind: CompletionItemKind.Color,
				data: 'color-' + a
			})
		}

		return results;
	}

	if (start >= 5
		&& lines[position.line].substr(start - 5, 5) == "shape") {
		let results = new Array<CompletionItem>();
		for (var a = 0; a < shapes.length; a++) {
			results.push({
				label: shapes[a],
				kind: CompletionItemKind.Text,
				data: 'shape-' + a
			})
		}

		return results;
	}
});

connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
	if (item.data.startsWith('color-')) {
		item.detail = 'X11 Color';
		item.documentation = 'http://www.graphviz.org/doc/info/colors.html';
	}

	if (item.data.startsWith('shape-')) {
		item.detail = 'Shape';
		item.documentation = 'http://www.graphviz.org/doc/info/shapes.html';
	}

	return item;
});

 
function loadColors(): Array<string> {
	let colorsFile = fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'colors')).toString();
	let colors = colorsFile.split(/\r?\n/g);

	return colors;
}

function loadShapes(): Array<string> {
	let shapesFile = fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'shapes')).toString();
	let shapes = shapesFile.split(/\r?\n/g);

	return shapes;
}



 * #####################   END AUTOCOMPLETION	#####################	
 */