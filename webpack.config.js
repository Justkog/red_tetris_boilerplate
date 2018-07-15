var path = require('path');

module.exports = {
	entry: './src/client/index.js',

	devServer: {
		disableHostCheck: true,
	},

	output: {
		path: path.join(__dirname, 'build'),
		filename: 'bundle.js',
	},

	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel',
				query:{
					presets: ["es2015", "react", "stage-0"]
				}
			},
			{ test: /\.css$/, loaders: ["style", "css"] },
		]
	},

	watchOptions: {
		aggregateTimeout: 300,
		poll: 1000
	}
};
