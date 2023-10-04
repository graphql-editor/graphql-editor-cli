import ts from 'typescript';

const formatHost: ts.FormatDiagnosticsHost = {
  getCanonicalFileName: (path) => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine,
};

export const typescriptServer = ({
  searchPath,
  afterCreate,
  onCreate,
}: {
  searchPath: string;
  onCreate?: Function;
  afterCreate?: Function;
}) => {
  const configPath = ts.findConfigFile(
    searchPath,
    ts.sys.fileExists,
    'tsconfig.json',
  );
  if (!configPath) {
    throw new Error("Could not find a valid 'tsconfig.json'.");
  }
  const createProgram = ts.createSemanticDiagnosticsBuilderProgram;
  const host = ts.createWatchCompilerHost(
    configPath,
    {},
    ts.sys,
    createProgram,
    reportDiagnostic,
    reportWatchStatusChanged,
  );

  // You can technically override any given hook on the host, though you probably
  // don't need to.
  // Note that we're assuming `origCreateProgram` and `origPostProgramCreate`
  // doesn't use `this` at all.
  const origCreateProgram = host.createProgram;
  host.createProgram = (
    rootNames: ReadonlyArray<string> | undefined,
    options,
    host,
    oldProgram,
  ) => {
    const result = origCreateProgram(rootNames, options, host, oldProgram);
    onCreate?.();
    return result;
  };
  const origPostProgramCreate = host.afterProgramCreate;

  host.afterProgramCreate = (program) => {
    const result = origPostProgramCreate!(program);
    afterCreate?.();
    return result;
  };
  return ts.createWatchProgram(host);
};

function reportDiagnostic(diagnostic: ts.Diagnostic) {
  console.error(
    'Error',
    diagnostic.code,
    ':',
    ts.flattenDiagnosticMessageText(
      diagnostic.messageText,
      formatHost.getNewLine(),
    ),
  );
}

/**
 * Prints a diagnostic every time the watch status changes.
 * This is mainly for messages like "Starting compilation" or "Compilation completed".
 */
function reportWatchStatusChanged(diagnostic: ts.Diagnostic) {
  console.info(ts.formatDiagnostic(diagnostic, formatHost));
}
