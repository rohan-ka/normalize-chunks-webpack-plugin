const { resolve } = require('path');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const mkdirp = require('mkdirp');


class NormalizeChunksPlugin {
  constructor(options) {
    const defaultOptions = {
      filename: 'normalizeChunks.json',
      path: resolve(process.cwd(), 'build'),
      entrypointsFilename: 'entrypoints.json',
    };

    this.options = Object.assign(defaultOptions, options);

    this.writeFile = promisify(fs.writeFile);
  }

  createAssetMap(assetsByChunkName) {
    const addChunkToLookup = (lookup, chunk) => {
      const [name, hash, ...rest] = chunk.split('.'); // eslint-disable-line no-unused-vars
      lookup[`${name}.${rest.join('.')}`] = chunk; // eslint-disable-line no-param-reassign
      return lookup;
    };

    const buildLookup = (assetLookup, chunks) => {
      let entry = {};
      if (Array.isArray(chunks)) {
        entry = chunks.reduce(addChunkToLookup, {});
      } else {
        entry = addChunkToLookup({}, chunks);
      }
      return Object.assign({}, assetLookup, entry);
    };

    return Object.keys(assetsByChunkName)
      .map((key) => assetsByChunkName[key])
      .reduce(buildLookup, {});
  }

  apply(compiler) {
    if (compiler.hooks && compiler.hooks.emit) {
      compiler.hooks.emit.tapAsync(
        'NormalizeChunksPlugin',
        this.run.bind(this),
      );
    } else {
      compiler.plugin('emit', this.run.bind(this));
    }
  }

  run(compilation, callback) {
    const { assetsByChunkName, entrypoints } = compilation.getStats().toJson();

    const assetMap = NormalizeChunksPlugin.createAssetMap(assetsByChunkName);

    const assetJson = JSON.stringify(assetMap);
    const entrypointsJson = JSON.stringify(entrypoints);

    const emitFiles = () => {
      // eslint-disable-next-line no-param-reassign
      compilation.assets[this.options.filename] = {
        source: () => assetJson,
        size: () => assetJson.length,
      };

      // eslint-disable-next-line no-param-reassign
      compilation.assets[this.options.entrypointsFilename] = {
        source: () => entrypointsJson,
        size: () => entrypointsJson.length,
      };
    };

    mkdirp(this.options.path)
      .then(() => this.writeFile(path.join(this.options.path, this.options.filename), assetJson, { mode: 0o755 }))
      .then(() => this.writeFile(`${this.options.path}/${this.options.entrypointsFilename}`, entrypointsJson, { mode: 0o755 }))
      .then(emitFiles)
      .then(callback);
  }
}

module.exports = NormalizeChunksPlugin;
