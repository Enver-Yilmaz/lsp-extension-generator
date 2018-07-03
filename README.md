# LSP-extension-generator

This project is the result of the final degree project of its creator. The main goal of the project is to take advantage of the Language Server Protocol to create generic extensions to allow the user to use the editor they prefer (if the editor offers an LSP SDK) for programming in any language they want.

The program requires the user to introduce an ANTLR4 grammar and a file extension to identify the files which will be tested against the grammar. The extension will allow the editor to show syntactical and lexical errors and also bring some coloring for the file.

## Installation

LSP extension generator requires [Node.js](https://nodejs.org/) and [Typescript](https://www.typescriptlang.org/) to run. They can be installed with the following commands.

```sh
$ sudo apt-get install nodejs
$ npm install -g typescript
```

After installing Node.js, download the project and install the dependencies.

```sh
$ cd lsp-extension-generator
$ npm install
```

Then we can run the program with the following command

```sh
$ ./generar.sh <<grammar_location>>
```
Where <grammar_location> refers to where the grammar to be recognized is stored.

When the execution finishes, there will be two new folders in the current directory. These two folders contain the extensions which will provide the language recognition by the IDE used. One will be used for the language coloring and the other one to show the errors identified by the grammar logic.

These two folders have to be moved to the folder where extensions are installed. By default they would be on the *home* folder of the user in a directory called *.vscode*. It can also be found from the IDE, in File > Preferences > Settings.

Once they are in the correct location, the IDE should be restarted for them to start working. When the user opens a file with the chosen file extension, the editor will start the checking task.

## Versions

| Feature | Version | Date |
|--|--|--|
| VSCode support | 1.0 | June 2018 |
| IntelliJ support | 1.1 | September 2018 |
| Eclipse support | 1.2 | December 2018 |
| LSP all features & GUI | 2.0 | 1st semester 2019 |