const { resolve } = require('path');
const fs = require('fs');


class NormalizeChunksPlugin {
  constructor(options) {
    const defaultOptions = {
      filename: 'normalizeChunks.json',
      path: resolve(process.cwd(), 'build/'),
    };

    this.options = { ...defaultOptions, ...options };
  }

  static createAssetMap(assetsByChunkName) {
    const addChunkToLookup = (lookup = {}, chunk) => {
      const [name, hash, extension] = chunk.split('.'); // eslint-disable-line no-unused-vars

      return { ...lookup, [`${name}.${extension}`]: chunk };
    };

    const buildLookup = (assetLookup, chunks) => {
      let entry = {};
      if (Array.isArray(chunks)) {
        entry = chunks.reduce(addChunkToLookup);
      } else {
        entry = addChunkToLookup({}, chunks);
      }
      return { ...assetLookup, ...entry };
    };

    return Object.keys(assetsByChunkName)
      .map(key => assetsByChunkName[key])
      .reduce(buildLookup, {});
  }

  apply(compiler) {
    compiler.plugin('emit', (compilation, cb) => {
      const { assetsByChunkName } = compilation.getStats().toJson();

      const assetMap = NormalizeChunksPlugin.createAssetMap(assetsByChunkName);
      const assetJson = JSON.stringify(assetMap, null, 2);

      this.writeToFile(assetJson).then(() => {
        compilation.assets[this.options.filename] = { // eslint-disable-line no-param-reassign
          source() {
            return assetJson;
          },
          size() {
            return assetJson.length;
          },
        };
      }).then(cb);
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
