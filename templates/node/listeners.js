/**
 * Summary. Instance for DotListener class.
 *
 * Description. This variable represents the ANTLR4 generated Listener which will hold several operations
 * to perform a traverse over the whole ASTTree in order to validate a text. It will also contain
 * elements as the traversed nodes during its execution.
 *
 * @author Sergio
 *
 */
const DOTListener = require('./antlr/DOTListener').DOTListener;

/* Language listener, used for Hover feature */

/**
 * Summary. Constructor for the class DotLanguageListener
 *
 * Description. This method is the constructor for LanguageListener class, it initializes the names array.
 * This class is useful for the hover functionality which is not provided by default.
 *
 * @author Sergio
 * 
 * @access public
 * 
 * @constructs
 * 
 */
function DOTLanguageListener() {
    this.names = [];
}

DOTLanguageListener.prototype = Object.create(DOTListener.prototype);
DOTLanguageListener.prototype.constructor = DOTLanguageListener;
/**
 * Summary. Function exitId definition.
 *
 * Description. This variable stores the value for the function exitId which is needed for this listener to work properly
 *
 * @author Sergio
 * 
 * @access public
 *
 */
DOTLanguageListener.prototype.exitId = function (context) {
    let name = "";

    if (context.getTypedRuleContext.name == "Node_idContext")
        name = "(Node) ";

    if (context.getTypedRuleContext.name == "SubgraphContext")
        name = "(Subgraph) ";

    if (context.getTypedRuleContext.name == "GraphContext")
        name = "(Graph) ";


    if (name) {
        this.names.push(new Name(name, context));
    }
}

/* Lexer error listener */

/**
 * Summary. Constructor for the class DotLexerErrorListener
 *
 * Description. This method is the constructor for LanguageListener class, it initializes the names array.
 * This class is used to collect the lexer error messages.
 *
 * @author Sergio
 * 
 * @access public
 * 
 * @constructs
 * 
 */
function DOTLexerErrorListener() {
    this.messages = [];
}

DOTLexerErrorListener.prototype = Object.create(DOTListener.prototype);
DOTLexerErrorListener.prototype.constructor = DOTLexerErrorListener;
/**
 * Summary. Function syntaxError definition.
 *
 * Description. This variable stores the value for the function syntaxError which is needed for the listener to work properly
 *
 * @author Sergio
 * 
 * @access public
 *
 */
DOTLexerErrorListener.prototype.syntaxError = function (recognizer, offendingSymbol, line, column, msg, e) {
    let message = new Message(msg, line, column);

    if (offendingSymbol != 0) {
        message.symbol = recognizer.getTokenErrorDisplay(offendingSymbol);
    }

    this.messages.push(message);
}


/**
 * #############    THIRD METHOD PARSER ERRORS    #############
 */

/* Parser error listener */

/**
 * Summary. Constructor for the class DotErrorListener
 *
 * Description. This method is the constructor for ErrorListener class, it initializes the names array.
 * This class is used to collect the parser error messages.
 *
 * @author Sergio
 * 
 * @access public
 * 
 * @constructs
 *
 */
function DOTErrorListener() {
    this.messages = [];
}

DOTErrorListener.prototype = Object.create(DOTListener.prototype);
DOTErrorListener.prototype.constructor = DOTErrorListener;
/**
 * Summary. Function syntaxError definition.
 *
 * Description. This variable stores the value for the function syntaxError which is needed for this listener to work properly
 *
 * @author Sergio
 * 
 * @access public
 *
 */
DOTErrorListener.prototype.syntaxError = function (recognizer, offendingSymbol, line, column, msg, e) {
    let message = new Message(msg, line, column);

    if (offendingSymbol != null) {
        message.symbol = offendingSymbol.text;
        message.length = offendingSymbol.stop - offendingSymbol.start + 1;
    }
    this.messages.push(message);
}

/**
 * Summary. Plain object to represent error messages.
 * 
 * Description. This class will be used as a plain object to incluide the lexer/parser errors detected
 * by the ANTLR classes on the data received. It will show a descriptive message, the line where the error
 * appeared, the position representing the column number where the error appeared, the symbol representation
 * for the error and also the length of the error (startPos - endPos).
 *
 * @author Sergio
 * 
 * @access protected
 *
 * @property {text} message Text describing the error detected.
 * @property {number} line Line number.
 * @property {number} character Position of the first character.
 * @property {text} symbol Name of the symbol.
 * @property {number} length Length of the error.
 *
 */
class Message {

    /**
     * Summary. Constructor for the class Name
     *
     * Description. This method is the constructor for Name class, it initializes the values for the class
     * according to the received parameters.
     *
     * @author Sergio
     * 
     * @access private
     * 
     * @constructs
     * 
     * @param {text} msg The text used for the message.
     * @param {number} line The line number where the error appeared.
     * @param {number} charPos The character position where the error appears. 
     *
     */
    constructor(msg, line, charPos) {
        this.message = msg;
        this.line = line - 1;
        this.character = charPos;
        this.symbol = "";
        this.length = 0;
    }

}

/**
 * Summary. Plain object to represent features messages.
 * 
 * Description. This class will be used as a plain object to incluide the feature message requested
 * by the user, p.e. hover information. It will show a descriptive name, the line where the
 * request started at and also the starting and ending position for request.
 * 
 * @author Sergio
 * 
 * @access protected
 *
 * @property {text} text Text describing the feature requested.
 * @property {number} line Description.
 * @property {number} start Description.
 * @property {number} end Description.
 *
 */
class Name {

    /**
     * Summary. Constructor for the class Name
     *
     * Description. This method is the constructor for Name class, it initializes the values for the class
     * according to the received parameters.
     *
     * @author Sergio
     * 
     * @access private
     * 
     * @constructs
     * 
     * @memberof Name
     * 
     * @param {text} text The text representing the request.
     * @param {any} context Current context to detect the rest of the elements. 
     *
     * @return {Name} An instance of the class.
     */
    constructor(text, context) {
        this.text = text + context.getText();
        this.line = context.stop.line;
        this.start = context.start.column;
        this.end = context.end.column + context.getText().length;
    }

}

exports.DOTErrorListener = DOTErrorListener;
exports.DOTLexerErrorListener = DOTLexerErrorListener;
exports.DOTLanguageListener = DOTLanguageListener;