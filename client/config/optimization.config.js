var path = require('path');
var defaultConfig = require('@ionic/app-scripts/config/optimization.config.js');

module.exports = function () {
	let envFile = './src/environments/environment.ts';
	if (process.env.IONIC_ENV == 'prod') {
		envFile = './src/environments/environment.prod.ts';
	}

	const alias = {
		"@app/env" : path.resolve(envFile)
	};
	defaultConfig.dev.resolve.alias = alias;
	defaultConfig.prod.resolve.alias = alias;

	return defaultConfig;
};