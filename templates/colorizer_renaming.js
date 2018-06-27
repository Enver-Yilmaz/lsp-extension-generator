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

fs.readFile('./templates/colorizer/package.json', function (err, data) {
    if (err) {
        return console.error(err);
    }
    var index = data.toString()
        .replace(new RegExp("any", "g"), process.argv[2].toLowerCase())
        .replace(new RegExp("\.ext\"", "g"), process.argv[3] + "\"");

    fs.writeFile('./colorizer/package.json', index, function (err) {
        if (err)
            return console.error(err);
        console.log("File package.json for colorizer updated");
    });
});

fs.readFile('./templates/colorizer/syntaxes/any.tmLanguage.json', function (err, data) {
    if (err) {
        return console.error(err);
    }
    var index = data.toString()
        .replace(new RegExp("any", "g"), process.argv[2].toLowerCase())
        .replace(new RegExp("\.ext", "g"),process.argv[3]);

    fs.writeFile('./colorizer/syntaxes/'+ process.argv[2].toLowerCase() +'.tmLanguage.json', index, function (err) {
        if (err)
            return console.error(err);
        console.log("File tmLanguage for colorizer updated");
    });
});