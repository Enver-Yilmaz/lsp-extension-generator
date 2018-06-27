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

fs.readFile('./grammar_logic.js', function (err, data) {
    if (err) {
        return console.error(err);
    }
    var index = data.toString()
        .replace(new RegExp("Scala", "g"), process.argv[2]);

    fs.writeFile('./grammar_logic.js', index, function (err) {
        if (err)
            return console.error(err);
        console.log("File grammar_logic.js updated");
    });
});