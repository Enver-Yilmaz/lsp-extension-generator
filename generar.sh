#!/bin/bash


rm -rf extension/ colorizer/

### FOR LANGUAGE COLORIZER ###

mkdir -p colorizer/syntaxes
mkdir -p colorizer/.vscode
cp templates/colorizer/launch.json colorizer/.vscode
cp templates/colorizer/language-configuration.json colorizer/


### FOR LANGUAGE RECOGNITION ###

# For language logic generation

CLASSPATH=$PWD/JARs/stringtemplate4.jar:$PWD/JARs/antlr4.jar:$PWD/JARs/antlr4-runtime.jar:$PWD/JARs/antlr3-runtime.jar:$PWD/JARs/treelayout.jar
mkdir -p extension/node_service/antlr
cp $1 extension/node_service/antlr
filename=$(basename "$1")
`exec java -cp $CLASSPATH org.antlr.v4.Tool -Dlanguage=JavaScript extension/node_service/antlr/$filename`
mv "${filename%.*}"* extension/node_service/antlr
cp templates/grammar_logic.js .


# For server part generation

mkdir -p extension/server/src


# For client generation

mkdir -p extension/client/src


# For .vscode folder

mkdir -p extension/.vscode
cp templates/launch.json extension/.vscode 


# User prompting about the extension to be recognized

#condition=true
#while [[ condition ]];
#do
echo Introduce the extension you want to recognize like .extension \(.ext by default\).
read extension
if [[ -z "$extension" ]];
then
extension=".ext"
#elif [[ "$extension" -ne \..* ]];
#then
#echo $extension
#echo The extension has to start with \'\.\'
#condition=true
#else
#condition=false
#echo Menuda mierda
fi
#done



# Naming and parameters inside classes.

if [ ! -d "node_modules" ];
then
  npm install
fi
node templates/first_renaming.js "${filename%.*}"
node grammar_logic.js "${filename%.*}" $extension

### Install dependencies and compile classes ###

### Compile client, server and node_service ###

cd extension
npm install
npm run compile

cd ..
rm grammar_logic.js

{
node extension/node_service/index.js &
} &> /dev/null