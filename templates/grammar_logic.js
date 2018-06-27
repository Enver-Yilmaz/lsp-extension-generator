/**
 * Summary. Instance for fs package.
 *
 * Description. This variable represents the FileSystem package which will allow us to manage folders,
 * files and so.
 *
 * @author Sergio
 * 
 */
const fs = require("fs");

/**
 * Summary. Instance for find-free-port package.
 *
 * Description. This variable represents the Find-Free-Port package which will look for an open port
 * to be used by our language processor server.
 *
 * @author Sergio
 * 
 */
const fp = require("find-free-port");

/**
 * Summary. Instance for mkdirp package.
 *
 * Description. This variable represents the Make Directory Package package which will allow us create
 * new directories along all the folders in the system.
 *
 * @author Sergio
 * 
 */
const mkdirp = require('mkdirp');

/**
 * Summary. Instance for os package.
 *
 * Description. This variable represents the OperativeSystem package which will check which OS is executing,
 * the script and will provide with features like the default home folder for each OS.
 *
 * @author Sergio
 * 
 */
const os = require('os');

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
 * Summary. Instance of the ScalaLexer class.
 *
 * Description. This variable represents an instance of the ScalaLexer class which contains all the tokens
 * identified in the given grammar and also operations to check lexical errors on a given text.
 *
 * @author Sergio
 * 
 */
const ScalaLexer = require('./extension/node_service/antlr/ScalaLexer').ScalaLexer;

/**
 * Description. This variable represents an instance of the ScalaLexer class which contains all the rules
 * identified in the given grammar and also operations to check syntactical errors on a given text.
 *
 * @author Sergio
 * 
 */
const ScalaParser = require('./extension/node_service/antlr/ScalaParser').ScalaParser;

/**
 * Description. This variable represents the name for the file containing the ANTLR grammar.
 *
 * @author Sergio
 * 
 */
var filename = "GRAMMAR";

/**
 * Description. This variable represents the name for the file extension introduced by the user.
 *
 * @author Sergio
 * 
 * @type text
 */
var extension = "'extension'";

/**
 * Description. This variable represents the path for the extension folder.
 *
 * @author Sergio
 * 
 */
var extensionPath = 'extension/';

/**
 * Description. This variable represents the path for the node_service folder.
 *
 * @author Sergio
 * 
 */
var nodePath = extensionPath + 'node_service/';

/**
 * Description. This variable represents the path for the server folder.
 *
 * @author Sergio
 * 
 */
var serverPath = extensionPath + 'server/';

/**
 * Description. This variable represents the path for the client folder.
 *
 * @author Sergio
 * 
 */
var clientPath = extensionPath + 'client/';

/**
 * Description. This variable will contain all the rules identified on the grammar.
 *
 * @author Sergio
 * 
 */
var rules = [];

/**
 * Description. Regular expression to identify just the literals for a given grammar.
 *
 * @author Sergio
 * 
 */
var alpha = new RegExp("[a-zA-Z0-9]+");

/**
 * Description. JSON object to hold several properties.
 *
 * @author Sergio
 * 
 */
var json = {
    filename: [],
    extension: [],
    mainElement: [],
    port: 3000,
};

// Looking for free port
fp(3000, function (err, freePort) {
    json.port = 3000;

    filename = process.argv[2];
    var array = process.argv[3].split(',');
    var inputStream = new antlr.InputStream('');
    var lexer = new ScalaLexer(inputStream);
    var commonTokenStream = new antlr.CommonTokenStream(lexer);
    var parser = new ScalaParser(commonTokenStream);
    extension = '';
    for (value of array) {
        extension += "'" + value.trim().slice(1) + "',";
    }

    console.log("Terminals identified on given grammar:");
    for (rule of parser.literalNames) {
        rule = rule.slice(1, -1);
        if (alpha.test(rule) && !rules.includes(rule)){
            rules.push(rule);
            console.log("> " + rule);
        }
    }

    /*
     * Server classes generation
     */

    // Asynchronous read server
    fs.readFile('templates/server/server.ts', function (err, data) {
        if (err) {
            return console.error(err);
        }
        var index = data.toString()
            .replace(new RegExp("3000", "g"), json.port)
            .replace(new RegExp("Dot", "g"), filename.charAt(0).toUpperCase() + filename.slice(1))
            .replace(new RegExp("dot", "g"), filename.toLowerCase());

        fs.writeFile(serverPath + 'src/server.ts', index, function (err) {
            if (err)
                return console.error(err);
            console.log("File server.ts saved");
        });
    });

    // Asynchronous read package.json
    fs.readFile('templates/server/package.json', function (err, data) {
        if (err) {
            return console.error(err);
        }
        var index = data.toString()
            .replace(new RegExp("Dot", "g"), filename.charAt(0).toUpperCase() + filename.slice(1))
            .replace(new RegExp("dot", "g"), filename.toLowerCase())
            .replace(new RegExp("DOT", "g"), filename.toUpperCase());

        fs.writeFile(serverPath + 'package.json', index, function (err) {
            if (err)
                return console.error(err);
            console.log("File package.json for server saved");
        });
    });

    // Asynchronous read tsconfig.json
    fs.readFile('templates/server/tsconfig.json', function (err, data) {
        if (err) {
            return console.error(err);
        }
        var index = data.toString();

        fs.writeFile(serverPath + 'tsconfig.json', index, function (err) {
            if (err)
                return console.error(err);
            console.log("File tsconfig.json for server saved");
        });
    });


    /*
     * Node classes (grammar logic) generation
     */

    // Asynchronous read index
    fs.readFile('templates/node/index.js', function (err, data) {
        if (err) {
            return console.error(err);
        }
        var index = data.toString()
            .replace(new RegExp("DOT", "g"), filename)
            .replace(new RegExp("graph", "g"), parser.ruleNames[0])
            .replace(new RegExp("3000"), json.port);

        fs.writeFile(nodePath + 'index.js', index, function (err) {
            if (err)
                return console.error(err);
            console.log("File index.js for node_service saved");
        });
    });

    // Asynchronous read listeners
    fs.readFile('templates/node/listeners.js', function (err, data) {
        if (err) {
            return console.error(err);
        }
        var index = data.toString()
            .replace(new RegExp("DOT", "g"), filename)

        fs.writeFile(nodePath + 'listeners.js', index, function (err) {
            if (err)
                return console.error(err);
            console.log("File listeners.js for node_service saved");
        });
    });

    // Asynchronous read package.json
    fs.readFile('templates/node/package.json', function (err, data) {
        if (err) {
            return console.error(err);
        }
        var index = data.toString()
            .replace(new RegExp("Dot", "g"), filename.charAt(0).toUpperCase() + filename.slice(1))
            .replace(new RegExp("dot", "g"), filename.toLowerCase())
            .replace(new RegExp("DOT", "g"), filename.toUpperCase());

        fs.writeFile(nodePath + 'package.json', index, function (err) {
            if (err)
                return console.error(err);
            console.log("File package.json for node_service saved");
        });
    });



    /*
     * Client classes generation
     */

    // Asynchronous read client
    fs.readFile('templates/client/extension.ts', function (err, data) {
        if (err) {
            return console.error(err);
        }
        var index = data.toString()
            .replace(new RegExp("dot", "g"), filename.toLowerCase())
            .replace(new RegExp("DOT", "g"), filename)
            .replace(new RegExp("languageIdentifierForGrammar", "g"), filename.toLowerCase())
            .replace(new RegExp("extensionForLanguage", "g"), "*." + extension.slice(1,-2));

        fs.writeFile(clientPath + 'src/extension.ts', index, function (err) {
            if (err)
                return console.error(err);
            console.log("File extension.ts for client saved");
        });
    });

    // Asynchronous read package.json
    fs.readFile('templates/client/package.json', function (err, data) {
        if (err) {
            return console.error(err);
        }
        var index = data.toString()
            .replace(new RegExp("Dot", "g"), filename.charAt(0).toUpperCase() + filename.slice(1))
            .replace(new RegExp("DOT", "g"), filename.toUpperCase())
            .replace(new RegExp(":dot", "g"), ":" + filename.toLowerCase())
            .replace(new RegExp("dot", "g"), filename.toLowerCase());

        fs.writeFile(clientPath + 'package.json', index, function (err) {
            if (err)
                return console.error(err);
            console.log("File package.json for client saved");
        });
    });

    // Asynchronous read tsconfig.json
    fs.readFile('templates/client/tsconfig.json', function (err, data) {
        if (err) {
            return console.error(err);
        }
        var index = data.toString();

        fs.writeFile(clientPath + 'tsconfig.json', index, function (err) {
            if (err)
                return console.error(err);
            console.log("File tsconfig.json for client saved");
        });
    });


    /**
     * General purpose
     */

    // Asynchronous read package.json
    fs.readFile('templates/package.json', function (err, data) {
        if (err) {
            return console.error(err);
        }
        var index = data.toString()
            .replace(new RegExp("Dot", "g"), filename.charAt(0).toUpperCase() + filename.slice(1))
            .replace(new RegExp(":dot", "g"), ":" + filename.toLowerCase())
            .replace(new RegExp("dot", "g"), filename.toLowerCase())
            .replace(new RegExp("DOT", "g"), filename.toUpperCase());

        var jsonText = JSON.parse(index.toString());

        var languages = [];
        languages.push({
            id: filename.toLowerCase().toString(),
            extensions: []
        });
        for (str of array) {
            languages[0].extensions.push(str.toString());
        }
        jsonText.contributes["languages"] = languages;

        fs.writeFile(extensionPath + 'package.json', JSON.stringify(jsonText), function (err) {
            if (err) {
                return console.error(err);
            }
            console.log("File package.json for whole extension saved");
        });
    });


    /**
     * FOR LANGUAGE COLORIZER
     */

    fs.readFile('templates/colorizer/package.json', function (err, data) {
        if (err) {
            return console.error(err);
        }
        var index = data.toString()
            .replace(new RegExp("any", "g"), process.argv[2].toLowerCase())
            .replace(new RegExp("\.ext\"", "g"), process.argv[3] + "\"");

        fs.writeFile('colorizer/package.json', index, function (err) {
            if (err)
                return console.error(err);
            console.log("File package.json for colorizer updated");
        });
    });

    fs.readFile('templates/colorizer/syntaxes/any.tmLanguage.json', function (err, data) {
        if (err) {
            return console.error(err);
        }
        let stringRules = "";
        for (rule of rules) {
            stringRules += rule;
            if (rule !== rules[rules.length - 1])
                stringRules += "|";
        }
        var index = data.toString()
            .replace(new RegExp("any", "g"), process.argv[2].toLowerCase())
            .replace(new RegExp("\.ext", "g"), process.argv[3])
            .replace(new RegExp("keywordsGoHere"), stringRules);

        fs.writeFile('colorizer/syntaxes/' + process.argv[2].toLowerCase() + '.tmLanguage.json', index, function (err) {
            if (err)
                return console.error(err);
            console.log("File tmLanguage for colorizer updated");
        });
    });

    let homedir = process.platform === 'win32' ? process.env.APPDATA : os.homedir + "/.config" ;

    fs.readFile(homedir + '/Code/User/settings.json', function (err, data) {
        if (err) {
            return console.error(err);
        }
        var index = data.toString();

        fs.writeFile(homedir + '/Code/User/settings.json', index + '{"window.zoomLevel": 0,"files.associations": {"*.ext": "cmm"}}', function (err) {
            if (err)
                return console.error(err);
            console.log("File settings.json for language recognition updated");
        });
    });
});