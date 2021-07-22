"use strict";

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('path'),
    resolve = _require.resolve;

var fs = require('fs');

var mkdirp = require('mkdirp');

var NormalizeChunksPlugin = /*#__PURE__*/function () {
  function NormalizeChunksPlugin(options) {
    _classCallCheck(this, NormalizeChunksPlugin);

    console.log('here in constructor');
    var defaultOptions = {
      filename: 'normalizeChunks.json',
      path: resolve(process.cwd(), 'build')
    };
    this.options = Object.assign(defaultOptions, options);
  }

  _createClass(NormalizeChunksPlugin, [{
    key: "apply",
    value: // eslint-disable-next-line class-methods-use-this
    function apply(compiler) {
      compiler.hooks.emit.tapAsync('NormalizeChunksPlugin', function (compilation, callback) {
        var _compilation$getStats = compilation.getStats().toJson(),
            assetsByChunkName = _compilation$getStats.assetsByChunkName,
            entrypoints = _compilation$getStats.entrypoints;

        console.log(entrypoints);
        var assetMap = NormalizeChunksPlugin.createAssetMap(assetsByChunkName);
        console.log(assetMap); // Manipulate the build using the plugin API provided by webpack
        // compilation.addModule(/* ... */);

        callback();
      }); // compiler.plugin('emit', (compilation, cb) => {
      //   const { assetsByChunkName } = compilation.getStats().toJson();
      //   const assetMap = NormalizeChunksPlugin.createAssetMap(assetsByChunkName);
      //   const assetJson = JSON.stringify(assetMap);
      //   const emitFile = () => {
      //     compilation.assets[this.options.filename] = { // eslint-disable-line no-param-reassign
      //       source: () => assetJson,
      //       size: () => assetJson.length,
      //     };
      //   };
      //   this.createBuildDirectory()
      //     .then(() => this.writeToFile(assetJson))
      //     .then(emitFile).then(cb);
      // });
    }
  }, {
    key: "createBuildDirectory",
    value: function createBuildDirectory() {
      var _this = this;

      return new Promise(function (res, rej) {
        mkdirp(_this.options.path, function (err) {
          return err ? rej(err) : res();
        });
      });
    }
  }, {
    key: "writeToFile",
    value: function writeToFile(content) {
      var _this2 = this;

      return new Promise(function (res) {
        var file = fs.createWriteStream(_this2.filename(), {
          mode: 493
        });
        file.write(content, 'utf-8', res);
      });
    }
  }, {
    key: "filename",
    value: function filename() {
      var _this$options = this.options,
          filename = _this$options.filename,
          path = _this$options.path;
      return "".concat(path, "/").concat(filename);
    }
  }], [{
    key: "createAssetMap",
    value: function createAssetMap(assetsByChunkName) {
      var addChunkToLookup = function addChunkToLookup(lookup, chunk) {
        var _chunk$split = chunk.split('.'),
            _chunk$split2 = _toArray(_chunk$split),
            name = _chunk$split2[0],
            hash = _chunk$split2[1],
            rest = _chunk$split2.slice(2); // eslint-disable-line no-unused-vars


        lookup["".concat(name, ".").concat(rest.join('.'))] = chunk; // eslint-disable-line no-param-reassign

        return lookup;
      };

      var buildLookup = function buildLookup(assetLookup, chunks) {
        var entry = {};

        if (Array.isArray(chunks)) {
          entry = chunks.reduce(addChunkToLookup, {});
        } else {
          entry = addChunkToLookup({}, chunks);
        }

        return Object.assign({}, assetLookup, entry);
      };

      return Object.keys(assetsByChunkName).map(function (key) {
        return assetsByChunkName[key];
      }).reduce(buildLookup, {});
    }
  }]);

  return NormalizeChunksPlugin;
}();

module.exports = NormalizeChunksPlugin;