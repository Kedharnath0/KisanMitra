const ts = require("typescript");
const path = require("path");

const configPath = ts.findConfigFile("./", ts.sys.fileExists, "tsconfig.json");
const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
const parsedCommandLine = ts.parseJsonConfigFileContent(
  configFile.config,
  ts.sys,
  path.dirname(configPath)
);

console.log("Analyzing", parsedCommandLine.fileNames.length, "TypeScript files...");
const program = ts.createProgram({
  rootNames: parsedCommandLine.fileNames,
  options: { ...parsedCommandLine.options, noEmit: true }
});

const allDiagnostics = ts.getPreEmitDiagnostics(program);

console.log("--- RESULTS ---");
console.log("Total diagnostics:", allDiagnostics.length);
allDiagnostics.forEach((diagnostic) => {
  if (diagnostic.file) {
    const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
    console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
  } else {
    console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
  }
});
if (allDiagnostics.length === 0) {
  console.log("SUCCESS: 0 TypeScript errors found!");
}
