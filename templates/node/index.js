/**
 * Summary. Instance for express package.
 *
 * Description. This variable represents the Express package which will allow us to create an easy
 * web server which will hold the language processor.
 *
 * @author Sergio
 * 
 */
const express = require('express');

/**
 * Summary. Instance for body-parser package.
 *
 * Description. This variable represents the BodyParser package which will intercept any request received
 * by the server and will analyse if the content-type is correct.
 *
 * @author Sergio
 * 
 */
const bodyParser = require("body-parser");

/**
 * Summary. Instance for antlr4 package.
 *
 * Description. This variable represents the ANTLR4 package which will allow us to use several operations
 * related with parsers, lexers, visitors and listener used for grammar validation.
 *
 * @author Sergio
 *
 */
const antlr = require('antlr4/index');

/**
 * Summary. Instance for the listeners file.
 *
 * Description. The listeners file contain several listeners which will be used for collecting messages
 * for the detected errors and also for the features information.
 *
 * @author Sergio
 *
 */
const listeners = require('./listeners');

/**
 * Summary. Instance for DotLexer class.
 *
 * Description. This variable represents the ANTLR4 generated Lexer which will hold several operations
 * to perform a lexical analysis over the grammar and also to validate a text. It will also contain
 * elements as the tokens identified on the grammar.
 *
 * @author Sergio
 *
 */
const DOTLexer = require('./antlr/DOTLexer').DOTLexer;

/**
 * Summary. Instance for DotParser class.
 *
 * Description. This variable represents the ANTLR4 generated Parser which will hold several operations
 * to perform a syntactical analysis over the grammar and also to validate a text. It will also contain
 * elements as the rules identified on the grammar.
 *
 * @author Sergio
 *
 */
const DOTParser = require('./antlr/DOTParser').DOTParser;

/**
 * Summary. Instance for ParseTreeWalker class.
 *
 * Description. This variable represents a ParseTreeWalker which will traverse the tree generated by the
 * grammar to check the validity of the text sent by the user.
 *
 * @author Sergio
 *
 */
const ParseTreeWalker = require('antlr4/tree/Tree').ParseTreeWalker;

/**
 * Summary. Port used for deploying the language processor.
 *
 * Description. This variable will hold the value of the port where the language processor server
 * will be deployed.
 *
 * @author Sergio
 *
 */
const port = 3000;

/**
 * Summary. Instance of the express package.
 *
 * Description. This variable represents Express which will allow us to create a simple web server
 * to receive requests and send responses.
 *
 * @author Sergio
 *
 */
var app = express();

app.use(bodyParser.text());

/**
 * ############   MAIN METHOD   ############
 */

app.post("/", (req, res) => {

  let body = req.body;
  console.log(body);

  var inputStream = new antlr.InputStream(body, "UTF-8");
  var lexer = new DOTLexer(inputStream);
  var commonTokenStream = new antlr.CommonTokenStream(lexer);
  var parser = new DOTParser(commonTokenStream);
  // the listener gathers the names for the hover information
  var listener = new listeners.DOTLanguageListener();

  var errorListener = new listeners.DOTErrorListener();
  var lexerErrorListener = new listeners.DOTLexerErrorListener();

  lexer.removeErrorListeners();
  lexer.addErrorListener(lexerErrorListener);
  parser.removeErrorListeners();
  parser.addErrorListener(errorListener);

  var graph = parser.graph();

  ParseTreeWalker.DEFAULT.walk(listener, graph);

  var json = {
    errors: [],
    names: []
  };

  json.errors = json.errors
    .concat(lexerErrorListener.messages)
    .concat(errorListener.messages);
  console.log(json.errors);

  var response = JSON.stringify(json);
  res.writeHead(200, {
    "Content-Type": "application/json"
  })
  res.end(response);

});


/**
 * Summary. Function to set the server listening.
 *
 * Description. This variable stores the value of the function which will start the funcionality of the server (listen for requests).
 *
 * @author Sergio
 *
 */
var server = app.listen(port, function () {

  var host = server.address().address;
  var port = server.address().port;

});

console.log('Listening at localhost:' + port);