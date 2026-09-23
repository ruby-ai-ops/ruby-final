const path = require("path");

// Reference RubyUI's postcss config from parent directory (no duplication)
module.exports = require(path.resolve(__dirname, "../postcss.config.js"));
