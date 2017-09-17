const { resolve } = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');


class NormalizeChunksPlugin {
  constructor(options) {
    const defaultOptions = {
      filename: 'normalizeChunks.json',
      path: resolve(process.cwd(), 'build'),
    };

    this.options = Object.assign(defaultOptions, options);
  }

  static createAssetMap(assetsByChunkName) {
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
    compiler.plugin('emit', (compilation, cb) => {
      const { assetsByChunkName } = compilation.getStats().toJson();

      const assetMap = NormalizeChunksPlugin.createAssetMap(assetsByChunkName);
      const assetJson = JSON.stringify(assetMap);

      const emitFile = () => {
        compilation.assets[this.options.filename] = { // eslint-disable-line no-param-reassign
          source: () => assetJson,
          size: () => assetJson.length,
        };
      };

      this.createBuildDirectory()
        .then(() => this.writeToFile(assetJson))
        .then(emitFile).then(cb);
    });
  }

  createBuildDirectory() {
    return new Promise((res, rej) => {
      mkdirp(this.options.path, (err) => (err ? rej(err) : res()));
    });
  }

  writeToFile(content) {
    return new Promise((res) => {
      const file = fs.createWriteStream(this.filename(), { mode: 0o755 });
      file.write(content, 'utf-8', res);
    });
  }

  filename() {
    const { filename, path } = this.options;
    return `${path}/${filename}`;
  }
}

module.exports = NormalizeChunksPlugin;
