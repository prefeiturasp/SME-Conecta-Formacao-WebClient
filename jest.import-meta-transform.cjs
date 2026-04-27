'use strict';

/**
 * Custom Jest transformer: replaces `import.meta.env` with `process.env`
 * so that Vite source files (which use import.meta.env) can be loaded
 * in Jest's CommonJS context.  Then delegates to ts-jest for TypeScript
 * compilation.
 */
const { TsJestTransformer } = require('ts-jest');

const PREPROCESS_VERSION = 'v1';

let _transformer = null;

function getTransformer(transformerConfig) {
  if (!_transformer) {
    _transformer = new TsJestTransformer(transformerConfig ?? {});
  }
  return _transformer;
}

function preprocessSource(source) {
  return source.replace(/\bimport\.meta\.env\b/g, 'process.env');
}

module.exports = {
  process(sourceText, sourcePath, options) {
    return getTransformer(options.transformerConfig).process(
      preprocessSource(sourceText),
      sourcePath,
      options,
    );
  },

  processAsync(sourceText, sourcePath, options) {
    return getTransformer(options.transformerConfig).processAsync(
      preprocessSource(sourceText),
      sourcePath,
      options,
    );
  },

  getCacheKey(sourceText, sourcePath, options) {
    return (
      getTransformer(options.transformerConfig).getCacheKey(
        preprocessSource(sourceText),
        sourcePath,
        options,
      ) + PREPROCESS_VERSION
    );
  },

  getCacheKeyAsync(sourceText, sourcePath, options) {
    return getTransformer(options.transformerConfig)
      .getCacheKeyAsync(preprocessSource(sourceText), sourcePath, options)
      .then((key) => key + PREPROCESS_VERSION);
  },
};
