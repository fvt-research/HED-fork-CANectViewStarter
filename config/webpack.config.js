var path = require('path');
var defaultConfig = require('@ionic/app-scripts/config/webpack.config.js');

module.exports = function () {
	const alias = {
		"@app/env" : path.resolve('./src/environments/environment.ts')
	};
	defaultConfig.dev.resolve.alias = alias;
	defaultConfig.prod.resolve.alias = alias;

	return defaultConfig;
};